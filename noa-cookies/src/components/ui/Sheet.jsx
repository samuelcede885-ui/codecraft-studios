import { useEffect, useRef } from 'react'
import { lockScroll } from '../../lib/motion.js'

/**
 * Panel modal sobre <dialog>: el navegador se encarga del foco atrapado, de
 * Escape y de devolver el foco al botón que lo abrió. La entrada y la salida
 * son transiciones CSS (transform/opacity); con movimiento reducido son inmediatas.
 */
export function Sheet({ open, onClose, labelledBy, variant = 'side', children }) {
  const ref = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    const panel = panelRef.current
    if (!dialog || !panel) return undefined

    if (open) {
      if (!dialog.open) {
        dialog.showModal()
        lockScroll(true)
      }
      // Doble frame: el estado inicial se pinta antes de transicionar al final.
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => {
          dialog.dataset.state = 'open'
        })
      })
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }

    if (!open && dialog.open) {
      const finish = () => {
        panel.removeEventListener('transitionend', onEnd)
        if (dialog.open) dialog.close()
        lockScroll(false)
      }
      const onEnd = (event) => {
        if (event.target === panel && event.propertyName === 'transform') finish()
      }
      const instant = parseFloat(getComputedStyle(panel).transitionDuration) === 0
      dialog.dataset.state = 'closed'
      if (instant) {
        finish()
        return undefined
      }
      panel.addEventListener('transitionend', onEnd)
      // Red de seguridad si la transición se interrumpe (pestaña en segundo plano).
      const guard = setTimeout(finish, 600)
      return () => {
        clearTimeout(guard)
        panel.removeEventListener('transitionend', onEnd)
      }
    }
    return undefined
  }, [open])

  // Si el componente se desmonta abierto, no dejar la página bloqueada.
  useEffect(
    () => () => {
      if (ref.current?.open) lockScroll(false)
    },
    [],
  )

  return (
    <dialog
      ref={ref}
      className={`sheet sheet--${variant}`}
      data-state="closed"
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      <div ref={panelRef} className="sheet-panel" data-lenis-prevent>
        {children}
      </div>
    </dialog>
  )
}
