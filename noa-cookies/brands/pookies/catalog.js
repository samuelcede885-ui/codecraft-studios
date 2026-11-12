/**
 * Catálogo de Pookies.
 *
 * Fuente: sus dos menús publicados (el principal, con 12 sabores, y "Nuevos
 * sabores", con 5). Nombres y precios están copiados de ahí. El menú no da
 * descripciones, ingredientes ni variantes, así que no se añaden.
 *
 * Misma forma que src/data/catalog.js (la marca base).
 */
import images from './images.json' with { type: 'json' }
import { buildProducts, heroOrder } from '../../src/data/normalize.js'

export const categories = [
  // 12 sabores: 4 columnas en pantallas grandes. Disco rosa, el de su logo.
  { id: 'cookies', name: 'Cookies', priceNote: null, grid: 4, disc: 'var(--accent)' },
  // 5 sabores: una fila de 5. Disco azul, el de su historia destacada "menu".
  { id: 'nuevos', name: 'Nuevos sabores', priceNote: null, grid: 5, disc: 'var(--pk-blue)' },
]

/** Escena del hero: color de fondo, titular (una palabra por línea en móvil) y migas. */
const scene = (order, theme, words, crumbs) => ({ order, theme, wide: words, narrow: words, crumbs })

const raw = [
  { id: 'red-velvet', category: 'cookies', name: 'Red Velvet', price: 5.5, hero: scene(2, 'blue', ['Red', 'Velvet'], ['red', 'cream']) },
  { id: 'plain-vainilla', category: 'cookies', name: 'Plain Vainilla', price: 4 },
  { id: 'plain-chocolate', category: 'cookies', name: 'Plain Chocolate', price: 4 },
  { id: 'cookies-n-cream', category: 'cookies', name: 'Cookies N Cream', price: 4.75 },
  { id: 'brookie', category: 'cookies', name: 'Brookie', price: 4.5 },
  { id: 'pooktachio', category: 'cookies', name: 'Pooktachio', price: 5.5, hero: scene(1, 'red', ['Pooktachio'], ['golden', 'pcream']) },
  { id: 'choco-nucita', category: 'cookies', name: 'Choco Nucita', price: 5.5 },
  { id: 'choco-ferrero', category: 'cookies', name: 'Choco Ferrero', price: 5.5, hero: scene(4, 'yellow', ['Choco', 'Ferrero'], ['dark', 'choco']) },
  { id: 'og-chocolate-chip', category: 'cookies', name: 'OG Chocolate Chip', price: 4.75 },
  { id: 'ny-ferrero', category: 'cookies', name: 'NY Ferrero', price: 5.5 },
  { id: 'double-choconut', category: 'cookies', name: 'Double Choconut', price: 4.5 },
  { id: 'nucita', category: 'cookies', name: 'Nucita', price: 5.5 },

  { id: 'cricri', category: 'nuevos', name: 'Cricri', price: 5.5, hero: scene(3, 'pink', ['Cricri'], ['golden', 'choco']) },
  { id: 'coconut', category: 'nuevos', name: 'Coconut', price: 4.5 },
  { id: 'cocosette', category: 'nuevos', name: 'Cocosette', price: 4.75 },
  { id: 'pistachio-dubai', category: 'nuevos', name: 'Pistachio Dubai', price: 5.5, hero: scene(5, 'green', ['Pistachio', 'Dubai'], ['dark', 'pistachio']) },
  { id: 'kinderella', category: 'nuevos', name: 'Kinderella', price: 5.5 },
]

export const products = buildProducts(raw, images, 'Pookies')

export const productsById = Object.fromEntries(products.map((p) => [p.id, p]))

/** Cookies que rotan en el hero, en el orden de `hero.order`. */
export const heroProducts = heroOrder(products)

/**
 * Producto destacado: uno de los "Nuevos sabores" de su menú.
 * Pookies no tiene sabor del mes, así que no hay `monthly` ni `monthlyCopy`.
 */
export const featured = {
  productId: 'kinderella',
  headline: 'Nuevos sabores',
  monthly: null,
  monthlyCopy: null,
}
