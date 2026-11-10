import site from '../config/site.js'

const round2 = (n) => Math.round(n * 100) / 100

/** "$4.00" — siempre dos decimales para que los totales se lean igual. */
export function formatPrice(value) {
  return `${site.currency.symbol}${round2(value).toFixed(2)}`
}

/** Partes del precio para componerlo tipográficamente (símbolo y decimales pequeños). */
export function priceParts(value) {
  const [whole, cents] = round2(value).toFixed(2).split('.')
  return { symbol: site.currency.symbol, whole, cents }
}

export const sum = (list, pick) => round2(list.reduce((t, item) => t + pick(item), 0))

/** Ruta a un archivo de /public que funciona en cualquier subcarpeta de despliegue. */
export function asset(path) {
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './'
  return `${base}${path.replace(/^\//, '')}`
}

export function productSrcSet(product) {
  return product.image.widths
    .map((w) => `${asset(`img/products/${product.id}-${w}.webp`)} ${w}w`)
    .join(', ')
}

export function productSrc(product, width = 800) {
  const widths = product.image.widths
  const w = widths.includes(width) ? width : widths[widths.length - 1]
  return asset(`img/products/${product.id}-${w}.webp`)
}

export const mod = (n, m) => ((n % m) + m) % m
