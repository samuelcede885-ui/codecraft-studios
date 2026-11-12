/**
 * Catálogo de NOA Cookies.
 *
 * Fuente: el menú publicado por la marca en Instagram (historias destacadas
 * "Menú": Cookies y Especiales). Nombres, descripciones y precios están
 * copiados de ahí; no hay productos inventados.
 *
 * Para añadir un producto:
 *  1. Copia sus fotos a public/img/products/<id>-480.webp, -800.webp y -1200.webp.
 *  2. Añade su entrada en src/data/images.json (ancho, alto y anchos disponibles).
 *  3. Añade aquí un objeto con la misma forma que los de abajo.
 *
 * Campos de disponibilidad:
 *  - available: false  → se muestra como "Agotado" y no se puede añadir.
 *  - stock: número     → tope de unidades que se pueden pedir (null = sin tope conocido).
 *  - maxPerOrder       → tope por pedido aunque haya stock.
 */
import images from './images.json' with { type: 'json' }
import { buildProducts, heroOrder } from './normalize.js'

/**
 * Grupos del catálogo.
 *  - priceNote: precio común que se anuncia junto al título (null si varía).
 *  - grid: columnas en pantallas grandes (5 o 4).
 *  - disc: color del disco tras la foto. Como en las historias destacadas de
 *    NOA, naranja y azul se alternan.
 */
export const categories = [
  { id: 'cookies', name: 'Cookies', priceNote: 4, grid: 5, disc: 'var(--accent)' },
  { id: 'especiales', name: 'Especiales', priceNote: null, grid: 4, disc: 'var(--primary)' },
]

const raw = [
  {
    id: 'signature',
    category: 'cookies',
    name: 'Signature',
    description: 'Deliciosa galleta de chispas de chocolate con nueces.',
    price: 4,
    info: { fromMenu: ['Chispas de chocolate', 'Nueces'] },
    hero: { theme: 'navy', wide: ['Signature'], narrow: ['Signature'], crumbs: ['golden', 'choco'] },
  },
  {
    id: 'choco-lovers',
    category: 'cookies',
    name: 'Choco Lovers',
    description: 'Exquisita galleta de chocolate con relleno de chocolate.',
    price: 4,
    info: { fromMenu: ['Galleta de chocolate', 'Relleno de chocolate'] },
    hero: { theme: 'orange', wide: ['Choco', 'Lovers'], narrow: ['Choco', 'Lovers'], crumbs: ['dark', 'choco'] },
  },
  {
    id: 'velvet',
    category: 'cookies',
    name: 'Velvet',
    description: 'Crujiente galleta con delicioso relleno de queso crema.',
    price: 4,
    info: { fromMenu: ['Relleno de queso crema'] },
    hero: { theme: 'butter', wide: ['Velvet'], narrow: ['Velvet'], crumbs: ['red', 'cream'] },
  },
  {
    id: 'nutella-bomb',
    category: 'cookies',
    name: 'Nutella Bomb',
    description: 'Nuestra tradicional Signature rellena de Nutella.',
    price: 4,
    info: { fromMenu: ['Base Signature: chispas de chocolate y nueces', 'Relleno de Nutella'] },
    hero: { theme: 'choco', wide: ['Nutella', 'Bomb'], narrow: ['Nutella', 'Bomb'], crumbs: ['golden', 'choco'] },
  },
  {
    id: 'mani-fica',
    category: 'cookies',
    name: 'Maní-fica',
    description: 'Cookie de chocolate rellena de mantequilla de maní.',
    price: 4,
    info: { fromMenu: ['Cookie de chocolate', 'Relleno de mantequilla de maní'] },
    hero: { theme: 'dough', wide: ['Maní-', 'fica'], narrow: ['Maní-', 'fica'], crumbs: ['dark', 'peanut'] },
  },
  {
    id: 'noa-roll',
    category: 'especiales',
    name: 'NOA Roll',
    description: 'Delicioso cinnaroll. Le puedes agregar un topping.',
    price: 3,
    options: {
      label: 'Topping',
      choices: [
        { id: 'solo', name: 'Sin topping' },
        { id: 'frosting', name: 'Frosting' },
        { id: 'nutella', name: 'Nutella' },
        { id: 'dulce-de-leche', name: 'Dulce de leche' },
      ],
    },
    info: { fromMenu: ['Cinnaroll', 'Topping opcional: frosting, Nutella o dulce de leche'] },
  },
  {
    id: 'pastelito',
    category: 'especiales',
    name: 'Pastelito',
    description: 'Deliciosos pastelitos rellenos. Elige el tuyo.',
    price: 2.5,
    options: {
      label: 'Relleno',
      choices: [
        { id: 'jamon', name: 'Jamón' },
        { id: 'queso-crema', name: 'Queso crema' },
        { id: 'jamon-y-queso', name: 'Jamón y queso' },
      ],
    },
    info: { fromMenu: ['Rellenos: jamón, queso crema o jamón y queso'] },
  },
  {
    id: 'cookie-sandwich',
    category: 'especiales',
    name: 'Cookie Sandwich',
    description: 'Sándwich de galleta con chispas de chocolate relleno de helado de la temporada.',
    price: 3.5,
    options: {
      label: 'Versión',
      choices: [
        { id: 'signature', name: 'Signature' },
        { id: 'nutella', name: 'Nutella' },
      ],
    },
    info: { fromMenu: ['Galleta con chispas de chocolate', 'Helado de la temporada', 'Versiones: Nutella o Signature'] },
  },
  {
    id: 'cookie-cake',
    category: 'especiales',
    name: 'Cookie Cake',
    description: 'Nuestra torta de cookie, en dos versiones épicas. Entre 10 y 12 porciones.',
    price: 35,
    note: 'Sólo bajo pedido',
    maxPerOrder: 4,
    options: {
      label: 'Versión',
      choices: [
        { id: 'helado', name: 'Helado' },
        { id: 'brownies', name: 'Brownies' },
      ],
    },
    info: { fromMenu: ['Versiones: helado o brownies', 'Entre 10 y 12 porciones', 'Sólo bajo pedido'] },
  },
]

export const products = buildProducts(raw, images, 'NOA Cookies')

export const productsById = Object.fromEntries(products.map((p) => [p.id, p]))

/** Cookies que rotan en el hero, en este orden. */
export const heroProducts = heroOrder(products)

/**
 * Producto destacado de la sección editorial.
 * `monthly`: sabor del mes vigente. NOA lo cambia cada mes y el menú no dice
 * cuál toca, así que queda en `null` hasta que la marca lo confirme. Cuando se
 * rellene (con el id de un producto del catálogo), la sección lo mostrará.
 */
export const featured = {
  productId: 'cookie-cake',
  headline: 'Lo que tu próxima celebración necesita',
  monthly: null, // p. ej. { productId: 'caramel-mani', until: '2026-11-30' }
  /** Texto con el que la marca explica su sabor del mes. `null` si no tiene ese concepto. */
  monthlyCopy:
    'Todos los meses tenemos un sabor especial que está disponible únicamente durante ese mes. ¡No te pierdas el chance de probarlo!',
}
