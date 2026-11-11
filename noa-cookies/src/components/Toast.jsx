import { useEffect, useRef } from 'react'
import { ui, useUi } from '../store/ui.js'

/**
 * Aviso breve que se cierra solo. Usa la API Popover para quedar por encima de
 * los paneles modales; donde no existe, se muestra como un elemento fijo normal.
 * El texto también llega a los lectores de pantalla por la región aria-live.
 */
export function Toast() {
  const toast = useUi((s) => s.toast)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!toast || !el) return undefined
    try {
      el.showPopover?.()
    } catch {
      // Ya estaba abierto o el navegador no lo admite: se ve igual como elemento fijo.
    }
    const id = setTimeout(ui.clearToast, 3600)
    return () => {
      clearTimeout(id)
      try {
        el.hidePopover?.()
      } catch {
        // Nada que cerrar.
      }
    }
  }, [toast])
  return (
    <p ref={ref} className="toast" popover="manual" hidden={!toast} aria-hidden="true">
      {toast?.message}
    </p>
  )
}
