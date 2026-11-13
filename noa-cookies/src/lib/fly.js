import { gsap, prefersReducedMotion } from './motion.js'

/** Destino visible del carrito (barra inferior en móvil, botón superior en escritorio). */
function cartTarget() {
  return [...document.querySelectorAll('[data-cart-target]')].find((el) => el.offsetParent !== null || el.getClientRects().length)
}

function pulse(el) {
  if (!el) return
  gsap.fromTo(el, { scale: 1 }, { scale: 1.07, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true, clearProps: 'scale' })
}

/**
 * Confirmación visual de "añadido": una copia de la foto viaja desde el punto
 * de la acción hasta el carrito. Solo transform y opacity; con movimiento
 * reducido no hay vuelo, solo el contador actualizado.
 */
export function flyToCart(sourceEl, imageSrc) {
  if (!sourceEl || !imageSrc || prefersReducedMotion()) return
  // Un frame de espera: la barra inferior puede acabar de montarse.
  requestAnimationFrame(() => {
    const target = cartTarget()
    if (!target) return
    const from = sourceEl.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    if (!from.width || !to.width) return
    const size = Math.min(Math.max(from.width, 56), 140)
    const el = document.createElement('img')
    el.src = imageSrc
    el.alt = ''
    el.className = 'fly-cookie'
    Object.assign(el.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${from.left + from.width / 2 - size / 2}px`,
      top: `${from.top + from.height / 2 - size / 2}px`,
    })
    document.body.appendChild(el)
    const dx = to.left + to.width / 2 - (from.left + from.width / 2)
    const dy = to.top + to.height / 2 - (from.top + from.height / 2)
    gsap
      .timeline({
        onComplete: () => {
          el.remove()
          pulse(target)
        },
      })
      .fromTo(el, { scale: 0.9 }, { scale: 1, duration: 0.12, ease: 'power2.out' })
      .to(el, { x: dx, duration: 0.62, ease: 'power1.in' }, 0.08)
      .to(el, { y: dy, duration: 0.62, ease: dy < 0 ? 'power2.out' : 'power3.in' }, 0.08)
      .to(el, { scale: 0.18, rotation: dx < 0 ? -140 : 140, duration: 0.62, ease: 'power2.in' }, 0.08)
      .to(el, { autoAlpha: 0, duration: 0.14 }, 0.56)
  })
}
