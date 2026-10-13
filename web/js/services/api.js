/**
 * Capa de datos sobre Supabase.
 *
 * Las formas de los objetos siguen el esquema SQL en
 * supabase/migrations/20261013000000_menu_saas_schema.sql. La autorización
 * la imponen las políticas RLS: el público solo lee menús publicados y cada
 * dueño solo puede modificar sus propios datos.
 *
 * @typedef {{ id: string, owner_id: string, name: string, slug: string, description?: string, currency: string, is_published: boolean }} Restaurant
 * @typedef {{ restaurant_id: string, logo_url: string|null, primary_color: string, secondary_color: string, accent_color: string, background_color: string, text_color: string, font_family: string }} Branding
 * @typedef {{ id: string, restaurant_id: string, name: string, description?: string, position: number, is_active: boolean }} Category
 * @typedef {{ id: string, restaurant_id: string, category_id: string, name: string, description?: string, price: number, image_url: string|null, tags: string[], position: number, is_available: boolean }} Product
 */

import { supabase, unwrap, unwrapAffected } from './supabase.js';
import { getCurrentUser } from './auth.js';
import { ASSETS_BUCKET } from '../config.js';

/** Postgres devuelve numeric como string; la UI trabaja con number. */
const toProduct = (row) => ({ ...row, price: Number(row.price) });

/** Siguiente `position` libre para añadir al final de una lista. */
async function nextPosition(table, restaurantId) {
  const rows = unwrap(await supabase
    .from(table)
    .select('position')
    .eq('restaurant_id', restaurantId)
    .order('position', { ascending: false })
    .limit(1));
  return rows.length ? rows[0].position + 1 : 0;
}

// ---------------------------------------------------------------------------
// Restaurante
// ---------------------------------------------------------------------------

/** @returns {Promise<Restaurant>} Restaurante por slug (vista pública). */
export async function getRestaurantBySlug(slug) {
  const restaurant = unwrap(await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .maybeSingle());
  if (!restaurant) throw new Error(`Restaurante no encontrado: ${slug}`);
  return restaurant;
}

/**
 * Restaurante del dueño autenticado (panel). Si tiene varios, el más antiguo.
 * @returns {Promise<Restaurant|null>} null si aún no ha creado ninguno.
 */
export async function getMyRestaurant() {
  const user = await getCurrentUser();
  if (!user) throw new Error('No hay sesión iniciada');
  return unwrap(await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at')
    .limit(1)
    .maybeSingle());
}

/**
 * Crea un restaurante para el usuario actual (owner_id lo pone la BD con
 * auth.uid()). Un trigger crea su fila de personalización por defecto.
 * @returns {Promise<Restaurant>}
 */
export async function createRestaurant(data) {
  return unwrap(await supabase.from('restaurants').insert(data).select().single());
}

/** @returns {Promise<Restaurant>} */
export async function updateRestaurant(restaurantId, changes) {
  return unwrap(await supabase
    .from('restaurants')
    .update(changes)
    .eq('id', restaurantId)
    .select()
    .single());
}

// ---------------------------------------------------------------------------
// Personalización (color principal de la marca, logo...)
// ---------------------------------------------------------------------------

/** @returns {Promise<Branding>} */
export async function getBranding(restaurantId) {
  return unwrap(await supabase
    .from('restaurant_branding')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .single());
}

/** @returns {Promise<Branding>} */
export async function updateBranding(restaurantId, changes) {
  return unwrap(await supabase
    .from('restaurant_branding')
    .update(changes)
    .eq('restaurant_id', restaurantId)
    .select()
    .single());
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------

/** @returns {Promise<Category[]>} */
export async function getCategories(restaurantId) {
  return unwrap(await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('position'));
}

/** @returns {Promise<Category>} */
export async function createCategory(restaurantId, data) {
  const position = await nextPosition('categories', restaurantId);
  return unwrap(await supabase
    .from('categories')
    .insert({ position, ...data, restaurant_id: restaurantId })
    .select()
    .single());
}

/**
 * Borra la categoría; sus productos se eliminan en cascada (FK).
 * RLS no da error al filtrar un DELETE, así que se comprueba que se borró una fila.
 */
export async function deleteCategory(categoryId) {
  unwrapAffected(await supabase.from('categories').delete().eq('id', categoryId).select('id'));
}

// ---------------------------------------------------------------------------
// Productos (nombre del plato, precio, imagen...)
// ---------------------------------------------------------------------------

/** @returns {Promise<Product[]>} */
export async function getProducts(restaurantId) {
  const rows = unwrap(await supabase
    .from('products')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('position'));
  return rows.map(toProduct);
}

/** @returns {Promise<Product>} */
export async function createProduct(restaurantId, data) {
  const position = await nextPosition('products', restaurantId);
  const row = unwrap(await supabase
    .from('products')
    .insert({ position, ...data, restaurant_id: restaurantId })
    .select()
    .single());
  return toProduct(row);
}

/** @returns {Promise<Product>} */
export async function updateProduct(productId, changes) {
  const row = unwrap(await supabase
    .from('products')
    .update(changes)
    .eq('id', productId)
    .select()
    .single());
  return toProduct(row);
}

export async function deleteProduct(productId) {
  unwrapAffected(await supabase.from('products').delete().eq('id', productId).select('id'));
}

// ---------------------------------------------------------------------------
// Imágenes (logo y fotos de platos)
// ---------------------------------------------------------------------------

/**
 * Sube un archivo a `<restaurantId>/<folder>/<uuid>.<ext>` (ruta que exigen
 * las políticas de Storage) y devuelve su URL pública.
 * @param {string} restaurantId
 * @param {File} file
 * @param {'logo'|'products'} folder
 * @returns {Promise<string>}
 */
export async function uploadImage(restaurantId, file, folder) {
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'bin';
  const path = `${restaurantId}/${folder}/${crypto.randomUUID()}.${ext}`;
  const bucket = supabase.storage.from(ASSETS_BUCKET);
  unwrap(await bucket.upload(path, file, { contentType: file.type, cacheControl: '31536000' }));
  return bucket.getPublicUrl(path).data.publicUrl;
}
