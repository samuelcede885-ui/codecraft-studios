# Base de datos (Supabase)

Migración: `migrations/20261013000000_menu_saas_schema.sql`

## Tablas

| Tabla | Relación | Descripción |
|---|---|---|
| `restaurants` | `owner_id → auth.users` (1:N) | Restaurante, `slug` único para la URL pública, `is_published` controla la visibilidad. |
| `restaurant_branding` | 1:1 con `restaurants` | Personalización: `logo_url`, colores (hex `#RRGGBB` validados) y fuente. Se crea automáticamente al crear el restaurante. |
| `categories` | N:1 con `restaurants` | Secciones del menú, ordenadas por `position`. |
| `products` | N:1 con `categories` y `restaurants` | Precio `numeric(10,2) >= 0`. Una FK compuesta `(category_id, restaurant_id)` impide asignar un producto a la categoría de otro restaurante. |

## Seguridad (RLS)

- **Dueño**: `SELECT/INSERT/UPDATE/DELETE` solo sobre filas de sus restaurantes (`public.is_restaurant_owner()`). No puede transferir un restaurante cambiando `owner_id`.
- **Público (anon)**: solo lectura de restaurantes publicados, sus categorías activas y productos disponibles, y su branding.
- **Storage**: bucket público `restaurant-assets`; solo el dueño puede subir/editar/borrar en `<restaurant_id>/...`.

## Aplicar

```bash
supabase db push        # o pegar el SQL en el SQL Editor del dashboard
```
