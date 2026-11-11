/**
 * Sistema de movimiento (GSAP + ScrollTrigger + Lenis).
 * Un solo lenguaje: salidas cortas, entradas con inercia (power3/power4/expo),
 * sin rebotes elásticos. Con "reducir movimiento" todo pasa a cambios de
 * estado inmediatos y el scroll suave no se activa.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
gsap.defaults({ ease: 'power3.out', duration: 0.85 })

export { gsap, ScrollTrigger, useGSAP }

export const EASE = { out: 'power3.out', outStrong: 'power4.out', expo: 'expo.out', in: 'power3.in', inOut: 'power3.inOut' }

const query = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null)
const reducedQuery = query('(prefers-reduced-motion: reduce)')
const coarseQuery = query('(pointer: coarse)')

export const prefersReducedMotion = () => Boolean(reducedQuery?.matches)
export const isCoarsePointer = () => Boolean(coarseQuery?.matches)

/** Equipos modestos: menos capas flotantes y transiciones más cortas. */
export function isLowPower() {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 8
  const memory = navigator.deviceMemory ?? 8
  return cores <= 2 || memory <= 2 || (cores <= 4 && memory <= 4)
}

let lenis = null
let locks = 0

/**
 * Scroll con inercia solo en escritorio: en táctil manda el scroll nativo y la
 * librería ni siquiera se descarga. Devuelve una función para desmontarlo.
 */
export function initSmoothScroll() {
  // En la versión de demostración (incrustada en un marco) manda el scroll nativo.
  if (import.meta.env.VITE_DEMO || prefersReducedMotion() || isCoarsePointer()) return () => {}
  let cancelled = false
  let raf = null
  import('lenis').then(({ default: Lenis }) => {
    if (cancelled || lenis) return
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    if (locks > 0) lenis.stop()
  })
  return () => {
    cancelled = true
    if (raf) gsap.ticker.remove(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(selector) {
  const el = document.querySelector(selector)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.1 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

/** Bloquea el scroll de la página mientras hay un panel abierto. */
export function lockScroll(lock) {
  locks = Math.max(0, locks + (lock ? 1 : -1))
  const active = locks > 0
  document.documentElement.classList.toggle('is-locked', active)
  if (lenis) active ? lenis.stop() : lenis.start()
}
