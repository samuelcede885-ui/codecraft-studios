/**
 * Reglas del pedido, sin dependencias de navegador (se prueban con Vitest).
 * Una línea = un producto con una opción concreta: { id, productId, optionId, qty }.
 */
import { sum } from '../lib/format.js'

export const lineId = (productId, optionId) => (optionId ? `${productId}:${optionId}` : productId)

/** Opción que se añade cuando el cliente no eligió ninguna (la primera del menú). */
export const defaultOptionId = (product) => product.options?.choices[0]?.id ?? null

/** Tope de unidades de un producto en un mismo pedido. */
export function maxQty(product) {
  if (!product || product.available === false) return 0
  const limits = [product.maxPerOrder, product.stock].filter((n) => typeof n === 'number')
  return limits.length ? Math.max(0, Math.min(...limits)) : Infinity
}

/** Unidades del producto ya presentes en el pedido, sumando todas sus opciones. */
export const qtyOfProduct = (lines, productId) =>
  lines.filter((l) => l.productId === productId).reduce((t, l) => t + l.qty, 0)

/**
 * Añade unidades. Devuelve { lines, ok, reason } sin mutar la entrada.
 * reason: 'agotado' | 'limite' cuando no se pudo añadir todo lo pedido.
 */
export function addToLines(lines, product, optionId = defaultOptionId(product), qty = 1) {
  const max = maxQty(product)
  if (max === 0) return { lines, ok: false, reason: 'agotado' }
  const room = max - qtyOfProduct(lines, product.id)
  if (room <= 0) return { lines, ok: false, reason: 'limite', max }
  const add = Math.min(qty, room)
  const id = lineId(product.id, optionId)
  const exists = lines.some((l) => l.id === id)
  const next = exists
    ? lines.map((l) => (l.id === id ? { ...l, qty: l.qty + add } : l))
    : [...lines, { id, productId: product.id, optionId, qty: add }]
  return { lines: next, ok: true, reason: add < qty ? 'limite' : null, max }
}

/** Fija la cantidad de una línea (0 la elimina) respetando el tope del producto. */
export function setLineQty(lines, id, qty, product) {
  const line = lines.find((l) => l.id === id)
  if (!line) return { lines, ok: false, reason: null }
  if (qty <= 0) return { lines: lines.filter((l) => l.id !== id), ok: true, reason: null }
  const others = qtyOfProduct(lines, line.productId) - line.qty
  const allowed = Math.max(0, maxQty(product) - others)
  const final = Math.min(qty, allowed)
  if (final <= 0) return { lines: lines.filter((l) => l.id !== id), ok: true, reason: 'agotado' }
  return {
    lines: lines.map((l) => (l.id === id ? { ...l, qty: final } : l)),
    ok: true,
    reason: final < qty ? 'limite' : null,
  }
}

/**
 * Cruza las líneas con el catálogo vigente.
 * issue: 'descatalogado' | 'agotado' | 'excede' — esas líneas no suman al
 * subtotal y bloquean el envío hasta que el cliente las corrija.
 */
export function summarize(lines, productsById) {
  const perProduct = {}
  const items = lines.map((line) => {
    const product = productsById[line.productId]
    if (!product) return { line, product: null, option: null, unitPrice: 0, total: 0, issue: 'descatalogado' }
    const option = product.options?.choices.find((c) => c.id === line.optionId) ?? null
    perProduct[product.id] = (perProduct[product.id] ?? 0) + line.qty
    let issue = null
    if (product.available === false || maxQty(product) === 0) issue = 'agotado'
    else if (perProduct[product.id] > maxQty(product)) issue = 'excede'
    const unitPrice = product.price
    return { line, product, option, unitPrice, total: issue ? 0 : unitPrice * line.qty, issue }
  })
  const valid = items.filter((i) => !i.issue)
  return {
    items,
    count: lines.reduce((t, l) => t + l.qty, 0),
    subtotal: sum(valid, (i) => i.total),
    hasIssues: items.some((i) => i.issue),
  }
}

/** Descarta lo que no tenga forma de línea (datos viejos o manipulados en localStorage). */
export function sanitizeLines(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (l) =>
        l &&
        typeof l.productId === 'string' &&
        (l.optionId === null || typeof l.optionId === 'string') &&
        Number.isInteger(l.qty) &&
        l.qty > 0 &&
        l.qty < 1000,
    )
    .map((l) => ({ id: lineId(l.productId, l.optionId), productId: l.productId, optionId: l.optionId, qty: l.qty }))
}
