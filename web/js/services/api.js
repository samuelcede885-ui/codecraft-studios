/**
 * Capa de datos.
 *
 * Todas las funciones son PLACEHOLDERS: devuelven datos de ejemplo
 * (mock-data.js) para que la interfaz funcione sin backend. Sustituye el
 * cuerpo de cada una por la llamada real (p. ej. Supabase) manteniendo la
 * misma firma y forma de retorno; el resto de la app no necesita cambios.
 *
 * Las formas de los objetos siguen el esquema SQL en
 * supabase/migrations/20261013000000_menu_saas_schema.sql.
 *
 * @typedef {{ id: string, name: string, slug: string, description?: string, currency: string, is_published: boolean }} Restaurant
 * @typedef {{ restaurant_id: string, logo_url: string|null, primary_color: string, secondary_color: string, accent_color: string, background_color: string, text_color: string, font_family: string }} Branding
 * @typedef {{ id: string, restaurant_id: string, name: string, description?: string, position: number, is_active: boolean }} Category
 * @typedef {{ id: string, restaurant_id: string, category_id: string, name: string, description?: string, price: number, image_url: string|null, tags: string[], position: number, is_available: boolean }} Product
 */

import { mockDb } from './mock-data.js';

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const clone = (v) => structuredClone(v);

// ---------------------------------------------------------------------------
// Restaurante
// ---------------------------------------------------------------------------

/** @returns {Promise<Restaurant>} Restaurante por slug (vista pública). */
export async function getRestaurantBySlug(slug) {
  // TODO: supabase.from('restaurants').select('*').eq('slug', slug).single()
  await delay();
  return clone(mockDb.restaurant);
}

/** @returns {Promise<Restaurant>} Restaurante del dueño autenticado (panel). */
export async function getMyRestaurant() {
  // TODO: supabase.from('restaurants').select('*').eq('owner_id', user.id).single()
  await delay();
  return clone(mockDb.restaurant);
}

/** @returns {Promise<Restaurant>} */
export async function updateRestaurant(restaurantId, changes) {
  // TODO: supabase.from('restaurants').update(changes).eq('id', restaurantId).select().single()
  await delay();
  Object.assign(mockDb.restaurant, changes);
  return clone(mockDb.restaurant);
}

// ---------------------------------------------------------------------------
// Personalización (color principal de la marca, logo...)
// ---------------------------------------------------------------------------

/** @returns {Promise<Branding>} */
export async function getBranding(restaurantId) {
  // TODO: supabase.from('restaurant_branding').select('*').eq('restaurant_id', restaurantId).single()
  await delay();
  return clone(mockDb.branding);
}

/** @returns {Promise<Branding>} */
export async function updateBranding(restaurantId, changes) {
  // TODO: supabase.from('restaurant_branding').update(changes).eq('restaurant_id', restaurantId).select().single()
  await delay();
  Object.assign(mockDb.branding, changes);
  return clone(mockDb.branding);
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------

/** @returns {Promise<Category[]>} */
export async function getCategories(restaurantId) {
  // TODO: supabase.from('categories').select('*').eq('restaurant_id', restaurantId).order('position')
  await delay();
  return clone(mockDb.categories).sort((a, b) => a.position - b.position);
}

/** @returns {Promise<Category>} */
export async function createCategory(restaurantId, data) {
  // TODO: supabase.from('categories').insert({ ...data, restaurant_id: restaurantId }).select().single()
  await delay();
  const category = {
    id: crypto.randomUUID(),
    restaurant_id: restaurantId,
    position: mockDb.categories.length,
    is_active: true,
    ...data,
  };
  mockDb.categories.push(category);
  return clone(category);
}

/** @returns {Promise<void>} */
export async function deleteCategory(categoryId) {
  // TODO: supabase.from('categories').delete().eq('id', categoryId)
  await delay();
  mockDb.categories = mockDb.categories.filter((c) => c.id !== categoryId);
  mockDb.products = mockDb.products.filter((p) => p.category_id !== categoryId);
}

// ---------------------------------------------------------------------------
// Productos (nombre del plato, precio, imagen...)
// ---------------------------------------------------------------------------

/** @returns {Promise<Product[]>} */
export async function getProducts(restaurantId) {
  // TODO: supabase.from('products').select('*').eq('restaurant_id', restaurantId).order('position')
  await delay();
  return clone(mockDb.products).sort((a, b) => a.position - b.position);
}

/** @returns {Promise<Product>} */
export async function createProduct(restaurantId, data) {
  // TODO: supabase.from('products').insert({ ...data, restaurant_id: restaurantId }).select().single()
  await delay();
  const product = {
    id: crypto.randomUUID(),
    restaurant_id: restaurantId,
    tags: [],
    position: mockDb.products.length,
    is_available: true,
    ...data,
  };
  mockDb.products.push(product);
  return clone(product);
}

/** @returns {Promise<Product>} */
export async function updateProduct(productId, changes) {
  // TODO: supabase.from('products').update(changes).eq('id', productId).select().single()
  await delay();
  const product = mockDb.products.find((p) => p.id === productId);
  Object.assign(product, changes);
  return clone(product);
}

/** @returns {Promise<void>} */
export async function deleteProduct(productId) {
  // TODO: supabase.from('products').delete().eq('id', productId)
  await delay();
  mockDb.products = mockDb.products.filter((p) => p.id !== productId);
}

// ---------------------------------------------------------------------------
// Imágenes (logo y fotos de platos)
// ---------------------------------------------------------------------------

/**
 * Sube un archivo y devuelve su URL pública.
 * @param {string} restaurantId
 * @param {File} file
 * @param {'logo'|'products'} folder
 * @returns {Promise<string>}
 */
export async function uploadImage(restaurantId, file, folder) {
  // TODO: const path = `${restaurantId}/${folder}/${crypto.randomUUID()}-${file.name}`;
  //       await supabase.storage.from('restaurant-assets').upload(path, file);
  //       return supabase.storage.from('restaurant-assets').getPublicUrl(path).data.publicUrl;
  await delay();
  return URL.createObjectURL(file); // vista previa local mientras no hay backend
}
