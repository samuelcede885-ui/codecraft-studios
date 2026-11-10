/**
 * Catálogo vigente = datos empaquetados + disponibilidad en vivo (si hay backend).
 *
 * El catálogo base viaja en el bundle, así que la página se puede usar desde el
 * primer instante. Cuando existe `availabilityEndpoint`, se consulta en segundo
 * plano y se superpone el stock real; si falla, se avisa y se puede reintentar.
 */
import { useSyncExternalStore } from 'react'
import site from '../config/site.js'
import { products as baseProducts } from '../data/catalog.js'

const listeners = new Set()
const build = (overlay) => {
  const products = baseProducts.map((p) => (overlay[p.id] ? { ...p, ...overlay[p.id] } : p))
  return { products, byId: Object.fromEntries(products.map((p) => [p.id, p])) }
}

let state = {
  ...build({}),
  /** 'static' sin backend · 'loading' · 'live' · 'error' */
  status: site.ordering.api.availabilityEndpoint ? 'loading' : 'static',
}

function set(patch) {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn())
}

/** Normaliza la respuesta del backend: solo se aceptan `available` y `stock`. */
export function parseAvailability(data) {
  const overlay = {}
  if (!data || typeof data !== 'object') return overlay
  for (const [id, value] of Object.entries(data)) {
    if (!value || typeof value !== 'object') continue
    const entry = {}
    if (typeof value.available === 'boolean') entry.available = value.available
    if (value.stock === null || (Number.isInteger(value.stock) && value.stock >= 0)) entry.stock = value.stock
    if (Object.keys(entry).length) overlay[id] = entry
  }
  return overlay
}

export async function refreshAvailability() {
  const endpoint = site.ordering.api.availabilityEndpoint
  if (!endpoint) return
  set({ status: 'loading' })
  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    set({ ...build(parseAvailability(await response.json())), status: 'live' })
  } catch {
    set({ status: 'error' })
  }
}

const catalogStore = {
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  get: () => state,
}

export const getCatalog = () => state
export const useCatalog = () => useSyncExternalStore(catalogStore.subscribe, catalogStore.get, catalogStore.get)
