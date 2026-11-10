/**
 * Pedido en curso. Vive fuera de React para que hero, catálogo y carrito lean
 * el mismo estado, y se guarda en localStorage para sobrevivir a una recarga.
 */
import { useSyncExternalStore } from 'react'
import { addToLines, sanitizeLines, setLineQty, lineId, defaultOptionId } from './cartLogic.js'

const KEY = 'noa.pedido.v1'
const listeners = new Set()
let lines = read()

function read() {
  try {
    const stored = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? 'null')
    return sanitizeLines(stored?.lines)
  } catch {
    return [] // almacenamiento bloqueado o dañado: se empieza con el pedido vacío
  }
}

function commit(next) {
  if (next === lines) return
  lines = next
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify({ lines, updatedAt: Date.now() }))
  } catch {
    // Sin almacenamiento (modo privado): el pedido sigue en memoria durante la visita.
  }
  listeners.forEach((fn) => fn())
}

// Otra pestaña cambió el pedido: se adopta para no mostrar dos versiones.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) return
    lines = read()
    listeners.forEach((fn) => fn())
  })
}

export const cart = {
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  getLines: () => lines,
  add(product, optionId = defaultOptionId(product), qty = 1) {
    const result = addToLines(lines, product, optionId, qty)
    commit(result.lines)
    return result
  },
  setQty(id, qty, product) {
    const result = setLineQty(lines, id, qty, product)
    commit(result.lines)
    return result
  },
  remove(id) {
    commit(lines.filter((l) => l.id !== id))
  },
  clear() {
    commit([])
  },
}

export const useCartLines = () => useSyncExternalStore(cart.subscribe, cart.getLines, cart.getLines)

/** Unidades de un producto con una opción concreta. */
export function useLineQty(productId, optionId) {
  const id = lineId(productId, optionId)
  const get = () => lines.find((l) => l.id === id)?.qty ?? 0
  return useSyncExternalStore(cart.subscribe, get, get)
}

/** Unidades de un producto sumando todas sus opciones. */
export function useProductQty(productId) {
  const get = () => lines.reduce((t, l) => (l.productId === productId ? t + l.qty : t), 0)
  return useSyncExternalStore(cart.subscribe, get, get)
}

export function useCartCount() {
  const get = () => lines.reduce((t, l) => t + l.qty, 0)
  return useSyncExternalStore(cart.subscribe, get, get)
}
