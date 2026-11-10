import { useUi } from '../store/ui.js'

/** Avisos breves para lectores de pantalla (producto añadido, cantidades…). */
export function LiveRegion() {
  const message = useUi((s) => s.announcement)
  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  )
}
