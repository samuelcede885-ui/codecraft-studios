import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'

export function useMediaQuery(query) {
  const subscribe = useCallback(
    (fn) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', fn)
      return () => mq.removeEventListener('change', fn)
    },
    [query],
  )
  const get = () => window.matchMedia(query).matches
  return useSyncExternalStore(subscribe, get, () => false)
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Guarda siempre la última versión de un callback sin volver a suscribir efectos. */
export function useLatest(value) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

/**
 * Ajusta el cuerpo de un titular para que su línea más larga llene el ancho
 * disponible (y no pase de cierta altura). Los elementos `[data-fit-line]`
 * dentro de cada `[data-fit]` son las líneas a medir.
 */
export function useFitText(containerRef, { widthRatio = 0.94, maxHeightRatio = 0.5, lineHeight = 0.86 } = {}, deps = []) {
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const fit = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width) return
      container.querySelectorAll('[data-fit]').forEach((block) => {
        const lines = block.querySelectorAll('[data-fit-line]')
        if (!lines.length) return
        block.style.fontSize = '100px'
        let widest = 0
        lines.forEach((line) => {
          widest = Math.max(widest, line.offsetWidth)
        })
        if (!widest) return
        const ratioW = Number(block.dataset.fitWidth) || widthRatio
        const ratioH = Number(block.dataset.fitHeight) || maxHeightRatio
        const byWidth = ((width * ratioW) / widest) * 100
        const byHeight = height ? (height * ratioH) / (lines.length * lineHeight) : Infinity
        block.style.fontSize = `${Math.floor(Math.min(byWidth, byHeight))}px`
      })
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    document.fonts?.ready.then(fit)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Ejecuta `fn` cuando el elemento entra o sale de pantalla. */
export function useInView(ref, fn, options) {
  const latest = useLatest(fn)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => latest.current(entry.isIntersecting), options)
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
