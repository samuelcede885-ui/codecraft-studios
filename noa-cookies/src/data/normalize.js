/**
 * Completa cada producto del catálogo de una marca con sus valores por defecto
 * y los datos de su foto. Lo comparten todas las marcas.
 */
const DEFAULT_MAX_PER_ORDER = 24

/**
 * Productos que rotan en el hero. Salen en el orden del catálogo, salvo que
 * la marca fije otro con `hero.order` (1, 2, 3…).
 */
export const heroOrder = (products) => products.filter((p) => p.hero).sort((a, b) => (a.hero.order ?? 0) - (b.hero.order ?? 0))

export function buildProducts(raw, images, brandName) {
  return raw.map((p) => ({
    available: true,
    price: null, // sin precio publicado: la interfaz dice "Por confirmar"
    stock: null,
    maxPerOrder: DEFAULT_MAX_PER_ORDER,
    options: null,
    note: null,
    hero: null,
    description: null,
    ...p,
    info: { fromMenu: [], ingredients: null, allergens: null, ...p.info },
    image: { ...images[p.id], alt: `${p.name} de ${brandName}` },
  }))
}
