-- =============================================================================
-- SaaS de menús digitales para restaurantes — esquema inicial
-- =============================================================================
-- Modelo:
--   auth.users (Supabase)
--     └── restaurants            (1 dueño -> N restaurantes)
--           ├── restaurant_branding  (1:1, colores y logo)
--           ├── categories           (1:N)
--           │     └── products       (1:N)
--           └── products             (restaurant_id desnormalizado para RLS)
--
-- Seguridad:
--   * Lectura pública (anon) solo de restaurantes publicados y de su contenido
--     activo, para que los comensales vean el menú sin iniciar sesión.
--   * Escritura (INSERT/UPDATE/DELETE) solo para el dueño del restaurante.
-- =============================================================================

create extension if not exists citext;

-- -----------------------------------------------------------------------------
-- Utilidades
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Restaurantes
-- -----------------------------------------------------------------------------
create table public.restaurants (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid()
                  references auth.users (id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 120),
  slug          citext not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description   text,
  address       text,
  phone         text,
  currency      char(3) not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index restaurants_owner_id_idx on public.restaurants (owner_id);

create trigger restaurants_set_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Personalización (colores y logo) — relación 1:1 con restaurants
-- -----------------------------------------------------------------------------
create table public.restaurant_branding (
  restaurant_id     uuid primary key
                      references public.restaurants (id) on delete cascade,
  logo_url          text,
  primary_color     text not null default '#111827'
                      check (primary_color ~* '^#[0-9a-f]{6}$'),
  secondary_color   text not null default '#6B7280'
                      check (secondary_color ~* '^#[0-9a-f]{6}$'),
  accent_color      text not null default '#F59E0B'
                      check (accent_color ~* '^#[0-9a-f]{6}$'),
  background_color  text not null default '#FFFFFF'
                      check (background_color ~* '^#[0-9a-f]{6}$'),
  text_color        text not null default '#111827'
                      check (text_color ~* '^#[0-9a-f]{6}$'),
  font_family       text not null default 'Inter',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger restaurant_branding_set_updated_at
  before update on public.restaurant_branding
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Categorías
-- -----------------------------------------------------------------------------
create table public.categories (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null
                   references public.restaurants (id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 80),
  description    text,
  position       integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- Permite la FK compuesta desde products (garantiza mismo restaurante).
  unique (id, restaurant_id)
);

create index categories_restaurant_position_idx
  on public.categories (restaurant_id, position);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Productos
-- -----------------------------------------------------------------------------
create table public.products (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null
                   references public.restaurants (id) on delete cascade,
  category_id    uuid not null,
  name           text not null check (char_length(name) between 1 and 120),
  description    text,
  price          numeric(10, 2) not null check (price >= 0),
  image_url      text,
  tags           text[] not null default '{}',  -- p. ej. {vegano, picante}
  position       integer not null default 0,
  is_available   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- La categoría debe pertenecer al mismo restaurante que el producto.
  foreign key (category_id, restaurant_id)
    references public.categories (id, restaurant_id) on delete cascade
);

create index products_restaurant_id_idx on public.products (restaurant_id);
create index products_category_position_idx
  on public.products (category_id, position);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Crear la personalización por defecto al crear un restaurante
-- -----------------------------------------------------------------------------
create or replace function public.create_default_branding()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.restaurant_branding (restaurant_id) values (new.id);
  return new;
end;
$$;

create trigger restaurants_create_default_branding
  after insert on public.restaurants
  for each row execute function public.create_default_branding();

-- -----------------------------------------------------------------------------
-- Helpers de autorización (security definer evita recursión de RLS y es
-- más rápido que subconsultas repetidas en cada política)
-- -----------------------------------------------------------------------------
create or replace function public.is_restaurant_owner(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurants r
    where r.id = p_restaurant_id
      and r.owner_id = (select auth.uid())
  );
$$;

create or replace function public.is_restaurant_published(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurants r
    where r.id = p_restaurant_id
      and r.is_published
  );
$$;

revoke all on function public.is_restaurant_owner(uuid) from public;
revoke all on function public.is_restaurant_published(uuid) from public;
grant execute on function public.is_restaurant_owner(uuid) to anon, authenticated;
grant execute on function public.is_restaurant_published(uuid) to anon, authenticated;

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.restaurants         enable row level security;
alter table public.restaurant_branding enable row level security;
alter table public.categories          enable row level security;
alter table public.products            enable row level security;

-- ---------------------------- restaurants ------------------------------------
create policy "Público ve restaurantes publicados"
  on public.restaurants for select
  to anon, authenticated
  using (is_published);

create policy "Dueño ve sus restaurantes"
  on public.restaurants for select
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "Dueño crea restaurantes"
  on public.restaurants for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Dueño edita sus restaurantes"
  on public.restaurants for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));  -- no puede transferirlo

create policy "Dueño elimina sus restaurantes"
  on public.restaurants for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- ------------------------- restaurant_branding -------------------------------
-- El INSERT lo hace el trigger create_default_branding; no hay política de
-- INSERT/DELETE para clientes (la fila vive y muere con el restaurante).
create policy "Público ve branding de restaurantes publicados"
  on public.restaurant_branding for select
  to anon, authenticated
  using (public.is_restaurant_published(restaurant_id));

create policy "Dueño ve su branding"
  on public.restaurant_branding for select
  to authenticated
  using (public.is_restaurant_owner(restaurant_id));

create policy "Dueño edita su branding"
  on public.restaurant_branding for update
  to authenticated
  using (public.is_restaurant_owner(restaurant_id))
  with check (public.is_restaurant_owner(restaurant_id));

-- ------------------------------ categories -----------------------------------
create policy "Público ve categorías activas publicadas"
  on public.categories for select
  to anon, authenticated
  using (is_active and public.is_restaurant_published(restaurant_id));

create policy "Dueño ve sus categorías"
  on public.categories for select
  to authenticated
  using (public.is_restaurant_owner(restaurant_id));

create policy "Dueño crea categorías"
  on public.categories for insert
  to authenticated
  with check (public.is_restaurant_owner(restaurant_id));

create policy "Dueño edita sus categorías"
  on public.categories for update
  to authenticated
  using (public.is_restaurant_owner(restaurant_id))
  with check (public.is_restaurant_owner(restaurant_id));

create policy "Dueño elimina sus categorías"
  on public.categories for delete
  to authenticated
  using (public.is_restaurant_owner(restaurant_id));

-- ------------------------------- products ------------------------------------
create policy "Público ve productos disponibles publicados"
  on public.products for select
  to anon, authenticated
  using (
    is_available
    and public.is_restaurant_published(restaurant_id)
    and exists (
      select 1 from public.categories c
      where c.id = category_id and c.is_active
    )
  );

create policy "Dueño ve sus productos"
  on public.products for select
  to authenticated
  using (public.is_restaurant_owner(restaurant_id));

create policy "Dueño crea productos"
  on public.products for insert
  to authenticated
  with check (public.is_restaurant_owner(restaurant_id));

create policy "Dueño edita sus productos"
  on public.products for update
  to authenticated
  using (public.is_restaurant_owner(restaurant_id))
  with check (public.is_restaurant_owner(restaurant_id));

create policy "Dueño elimina sus productos"
  on public.products for delete
  to authenticated
  using (public.is_restaurant_owner(restaurant_id));

-- =============================================================================
-- Storage: bucket para logos e imágenes de productos
-- Convención de rutas: <restaurant_id>/logo.png, <restaurant_id>/products/<id>.jpg
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('restaurant-assets', 'restaurant-assets', true)
on conflict (id) do nothing;

-- Comprueba que la primera carpeta de la ruta sea un restaurant_id del usuario.
-- El CASE evita un error de casteo cuando la carpeta no es un UUID válido.
create or replace function public.owns_storage_path(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (storage.foldername(p_name))[1]
         ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then public.is_restaurant_owner(((storage.foldername(p_name))[1])::uuid)
    else false
  end;
$$;

revoke all on function public.owns_storage_path(text) from public;
grant execute on function public.owns_storage_path(text) to authenticated;

create policy "Dueño sube archivos de su restaurante"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'restaurant-assets'
    and public.owns_storage_path(name)
  );

create policy "Dueño actualiza archivos de su restaurante"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'restaurant-assets'
    and public.owns_storage_path(name)
  )
  with check (
    bucket_id = 'restaurant-assets'
    and public.owns_storage_path(name)
  );

create policy "Dueño elimina archivos de su restaurante"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'restaurant-assets'
    and public.owns_storage_path(name)
  );
