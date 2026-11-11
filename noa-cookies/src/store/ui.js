/** Estado de interfaz compartido: qué panel está abierto y avisos para lectores de pantalla. */
import { useSyncExternalStore } from 'react'

const listeners = new Set()
let state = { cartOpen: false, cartView: 'pedido', infoProductId: null, announcement: '', toast: null }

function set(patch) {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn())
}

export const ui = {
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  get: () => state,
  openCart: (view = 'pedido') => set({ cartOpen: true, cartView: view, infoProductId: null }),
  closeCart: () => set({ cartOpen: false }),
  setCartView: (cartView) => set({ cartView }),
  openInfo: (infoProductId) => set({ infoProductId }),
  closeInfo: () => set({ infoProductId: null }),
  /** Aviso visible que se cierra solo. */
  toast(message) {
    set({ toast: { id: Date.now(), message } })
    ui.announce(message)
  },
  clearToast: () => set({ toast: null }),
  /** Mensaje breve para la región aria-live (se repite aunque el texto sea igual). */
  announce(message) {
    set({ announcement: '' })
    requestAnimationFrame(() => set({ announcement: message }))
  },
}

export const useUi = (pick) => {
  const get = () => pick(state)
  return useSyncExternalStore(ui.subscribe, get, get)
}
