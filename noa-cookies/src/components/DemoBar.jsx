import { useLayoutEffect, useRef } from 'react'
import site from '../config/site.js'

/**
 * Aviso fijo del modo demostración: deja claro, en cualquier punto de la
 * página, que esto es una propuesta y no la tienda real. Publica su altura en
 * `--demo-h` para que la cabecera, el hero y el botón del pedido le hagan sitio.
 */
export function DemoBar() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    const root = document.documentElement
    const sync = () => root.style.setProperty('--demo-h', `${el.offsetHeight}px`)
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--demo-h')
    }
  }, [])
  return (
    <aside className="demo-bar" aria-label="Aviso sobre este sitio">
      <p ref={ref} className="demo-bar-text">
        Propuesta de diseño. No es la tienda oficial de {site.name}.
      </p>
    </aside>
  )
}
