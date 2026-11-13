/**
 * Catálogo de Doradas.
 *
 * Fuente: su menú publicado en la historia destacada "Menú" (seis galletas y
 * tres boxes). Nombres y textos están tomados de ahí, recortados cuando eran
 * largos. El menú no publica precios, así que todos quedan "por confirmar"
 * (`price` sin definir) en lugar de inventarlos.
 *
 * Misma forma que src/data/catalog.js (la marca base).
 */
import images from './images.json' with { type: 'json' }
import { buildProducts, heroOrder } from '../../src/data/normalize.js'

export const categories = [
  // Seis galletas: 3 + 3 en pantallas grandes. Disco dorado, el de su logo.
  { id: 'galletas', name: 'Galletas', priceNote: null, grid: 3, disc: 'var(--accent)' },
  // Tres boxes, sin foto todavía: su nombre ocupa el disco.
  { id: 'boxes', name: 'Boxes', priceNote: null, grid: 3, disc: 'var(--primary)' },
]

/** Escena del hero: color de fondo, titular (una palabra por línea en móvil) y migas. */
const scene = (order, theme, words, crumbs) => ({ order, theme, wide: words, narrow: words, crumbs })

const raw = [
  {
    id: 'classique',
    category: 'galletas',
    name: 'Classique',
    description: 'Nuestra icónica galleta estilo Nueva York de 130 g. Gruesa, crujiente por fuera y suave por dentro.',
    info: { fromMenu: ['Estilo Nueva York (NYC style), 130 g', 'Chunks de chocolate', 'Trozos de nueces tostadas'] },
    hero: scene(1, 'chocolate', ['Classique'], ['golden', 'dark']),
  },
  {
    id: 'la-dore',
    category: 'galletas',
    name: 'La Doré',
    description: 'Más delgada y crujiente, con nuestra exclusiva mantequilla avellanada y notas a caramelo tostado.',
    info: { fromMenu: ['Mantequilla avellanada', 'Topping de chocolate oscuro', 'Caramelo hecho en casa', 'Terminada con sal marina'] },
    hero: scene(2, 'dorado', ['La', 'Doré'], ['caramel', 'dark']),
  },
  {
    id: 'red-velvet',
    category: 'galletas',
    name: 'Red Velvet',
    description: 'Nuestra imponente galleta estilo Nueva York, gruesa y con un centro melcochudo.',
    info: { fromMenu: ['Receta tradicional del Red Velvet: notas suaves de cacao y vainilla', 'Generosa crema de cheesecake'] },
    hero: scene(3, 'crema', ['Red', 'Velvet'], ['red', 'golden']),
  },
  {
    id: 'doble-chocolate',
    category: 'galletas',
    name: 'Doble Chocolate',
    description: 'La galleta para los verdaderos amantes del cacao: un centro tan suave que recuerda a un brownie.',
    info: { fromMenu: ['Masa oscura repleta de trozos de chocolate', 'Estilo Nueva York: bordes crujientes y centro suave'] },
    hero: scene(4, 'arena', ['Doble', 'Chocolate'], ['dark', 'caramel']),
  },
  {
    id: 'carrot-cake',
    category: 'galletas',
    name: 'Carrot Cake',
    description: 'Toda la magia del clásico pastel de zanahoria, transformada en una galleta estilo Nueva York.',
    info: { fromMenu: ['Masa gruesa, extra suave y especiada con canela', 'Topping de crema cheesecake'] },
  },
  {
    id: 'pistacho',
    category: 'galletas',
    name: 'Pistacho',
    description: 'Nuestra icónica masa estilo Nueva York, cargada del inconfundible pistacho y chocolate blanco.',
    info: { fromMenu: ['Crujiente por fuera y suave por dentro', 'Pistacho', 'Trozos generosos de chocolate blanco'] },
    hero: scene(5, 'espresso', ['Pistacho'], ['pistachio', 'golden']),
  },

  {
    id: 'classic-duo',
    category: 'boxes',
    name: 'The Classic Duo',
    description: 'La combinación que nunca falla: 6 galletas Doré y 6 estilo Brownie, ambas tamaño regular.',
    info: { fromMenu: ['Pensada para compartir', '6 galletas Doré', '6 galletas estilo Brownie', 'Tamaño regular'] },
  },
  {
    id: 'doradas-box',
    category: 'boxes',
    name: "The Dorada's Box",
    description: 'Un recorrido por todos nuestros sabores: una galleta de cada especialidad de la casa.',
    info: { fromMenu: ['Incluye: 1 Classique, 1 Pistacho & White Choco, 1 Double Choco, 1 Doré, 1 Carrot Cake y 1 Red Velvet'] },
  },
  {
    id: 'build-your-box',
    category: 'boxes',
    name: 'Build Your Box',
    note: '4-pack',
    description: 'Tú eliges los sabores: arma tu caja con 4 de tus galletas favoritas.',
    info: { fromMenu: ['Caja 100 % personalizada', '4 galletas a elegir', 'Para darte un antojo o regalar algo único'] },
  },
]

export const products = buildProducts(raw, images, 'Doradas')

export const productsById = Object.fromEntries(products.map((p) => [p.id, p]))

/** Galletas que rotan en el hero, en el orden de `hero.order`. */
export const heroProducts = heroOrder(products)

/**
 * Producto destacado: la Classique, "nuestra icónica galleta" según su menú.
 * Doradas no tiene sabor del mes, así que no hay `monthly` ni `monthlyCopy`.
 */
export const featured = {
  productId: 'classique',
  headline: 'Nuestra icónica galleta estilo Nueva York',
  monthly: null,
  monthlyCopy: null,
}
