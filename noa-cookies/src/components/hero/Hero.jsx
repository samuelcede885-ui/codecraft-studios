import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import site from '../../config/site.js'
import { heroOrder } from '../../data/normalize.js'
import { heroThemes } from '../../data/themes.js'
import { EASE, ScrollTrigger, gsap, isLowPower, prefersReducedMotion, useGSAP } from '../../lib/motion.js'
import { useFitText, useInView, useLatest, useMediaQuery } from '../../lib/hooks.js'
import { asset, mod, productSrc } from '../../lib/format.js'
import { flyToCart } from '../../lib/fly.js'
import { cart, useProductQty } from '../../store/cart.js'
import { maxQty } from '../../store/cartLogic.js'
import { ui } from '../../store/ui.js'
import { useCatalog } from '../../services/catalog.js'
import { Icon } from '../ui/Icon.jsx'
import { Price } from '../ui/Price.jsx'
import { ProductImage } from '../ui/ProductImage.jsx'

/**
 * Migas alrededor de la cookie. x/y = centro en % del cuadro de la cookie,
 * size = % del cuadro, fam = índice dentro de `hero.crumbs` del producto.
 * Las de `front` van desenfocadas (profundidad de campo) y por delante.
 */
const CRUMBS_WIDE = [
  { x: -30, y: 20, size: 15, rot: -18, layer: 'back', fam: 0, v: 1 },
  { x: 122, y: 16, size: 11, rot: 32, layer: 'back', fam: 1, v: 1 },
  { x: -16, y: 86, size: 10, rot: 12, layer: 'back', fam: 1, v: 2 },
  { x: 130, y: 72, size: 16, rot: -30, layer: 'back', fam: 0, v: 2 },
  { x: 20, y: -12, size: 8, rot: 48, layer: 'back', fam: 1, v: 3 },
  { x: 98, y: -9, size: 9, rot: -8, layer: 'back', fam: 0, v: 3 },
  { x: -56, y: 62, size: 26, rot: 22, layer: 'front', fam: 0, v: 1, blur: true },
  { x: 154, y: 38, size: 21, rot: -38, layer: 'front', fam: 1, v: 2, blur: true },
  { x: 110, y: 108, size: 12, rot: 8, layer: 'front', fam: 1, v: 1 },
]
const CRUMBS_NARROW = [
  { x: 2, y: 4, size: 14, rot: -18, layer: 'back', fam: 0, v: 1 },
  { x: 99, y: 6, size: 11, rot: 32, layer: 'back', fam: 1, v: 1 },
  { x: 0, y: 90, size: 11, rot: 12, layer: 'back', fam: 1, v: 2 },
  { x: 102, y: 80, size: 14, rot: -30, layer: 'back', fam: 0, v: 2 },
  { x: -9, y: 48, size: 21, rot: 22, layer: 'front', fam: 0, v: 1, blur: true },
  { x: 110, y: 40, size: 18, rot: -38, layer: 'front', fam: 1, v: 2, blur: true },
]

const HIT_SELECTOR = 'button, a, input, select, textarea, [data-no-drag]'

function crumbStyle(c, i) {
  return {
    left: `${c.x}%`,
    top: `${c.y}%`,
    width: `${c.size}%`,
    '--rot': `${c.rot}deg`,
    '--dur': `${6 + (i % 4) * 1.3}s`,
    '--delay': `${-(i * 0.9)}s`,
  }
}

/**
 * Cuánto le sobra de ancho a una foto apaisada (0–100). Las fotos casi cuadradas
 * dan 0 y no se tocan; a las apaisadas se las sube y agranda para que llenen la
 * escena igual que una cookie redonda.
 */
function wideFit(image) {
  if (!image?.w || !image?.h) return 0
  return Math.round(Math.max(0, 1 - image.h / image.w - 0.13) * 100)
}

function Title({ lines, narrow, color, scene, drop }) {
  // Ancho: palabras en una sola fila (la cookie queda entre ellas).
  // Estrecho: una palabra por línea.
  const rows = narrow ? lines.map((w) => [w]) : [lines]
  return (
    <div
      className="hero-title"
      data-scene={scene}
      data-part="title"
      data-fit
      data-fit-width={narrow ? 0.94 : 0.95}
      data-fit-height={narrow ? 0.34 : 0.56}
      data-drop={drop ? '' : undefined}
      style={drop ? { color, '--title-drop': `${drop}%` } : { color }}
    >
      {rows.map((words, r) => (
        <span className="hero-title-mask" key={r}>
          <span className="hero-title-row" data-fit-line>
            {words.map((word, w) => (
              <span className="hero-title-word" key={w}>
                {[...word].map((ch, c) => (
                  <span className="hero-title-char" data-part="char" key={c}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </span>
      ))}
    </div>
  )
}

function Crumbs({ product, layout, layer, scene }) {
  const families = product.hero.crumbs
  return (
    <div className="hero-crumbs" data-scene={scene} data-part="group">
      {layout.map((c, i) =>
        c.layer === layer ? (
          <span className="hero-crumb" data-part="crumb" style={crumbStyle(c, i)} key={i}>
            <img
              src={asset(`img/crumbs/${families[c.fam % families.length]}-${c.v}${c.blur ? '-blur' : ''}.webp`)}
              alt=""
              width={c.blur ? 160 : 256}
              height={c.blur ? 160 : 256}
              decoding="async"
              draggable={false}
            />
          </span>
        ) : null,
      )}
    </div>
  )
}

export function Hero() {
  const { byId, products } = useCatalog()
  const slides = useMemo(() => heroOrder(products), [products])
  const total = slides.length

  const [index, setIndex] = useState(0)
  const [warm, setWarm] = useState(false) // el resto de escenas se monta tras el primer pintado
  const [justAdded, setJustAdded] = useState(false)
  const narrow = useMediaQuery('(max-width: 859px)')

  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const bgRef = useRef(null)
  const wipeRef = useRef(null)
  const dragRef = useRef(null)
  const indexRef = useRef(0)
  const tlRef = useRef(null)
  const pending = useRef(null) // transición solicitada antes de que su escena exista
  const lowPower = useMemo(() => isLowPower(), [])

  const product = byId[slides[index].id]
  const theme = heroThemes[product.hero.theme]
  const inCart = useProductQty(product.id)
  const soldOut = maxQty(product) === 0
  const atLimit = !soldOut && inCart >= maxQty(product)

  const layout = useMemo(() => {
    const base = narrow ? CRUMBS_NARROW : CRUMBS_WIDE
    return lowPower ? base.filter((c) => !c.blur) : base
  }, [narrow, lowPower])

  useFitText(stageRef, {}, [narrow, warm, total])

  // Colores de interfaz de la escena activa (cabecera, panel, botón).
  useLayoutEffect(() => {
    const root = document.documentElement
    const vars = {
      '--h-bg': theme.bg,
      '--h-fg': theme.fg,
      '--h-label-bg': theme.labelBg,
      '--h-label-fg': theme.labelFg,
      '--h-cta-bg': theme.ctaBg,
      '--h-cta-fg': theme.ctaFg,
      '--h-sticker-bg': theme.stickerBg,
      '--h-sticker-fg': theme.stickerFg,
    }
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
    // Color propio para la marca de la cabecera, solo si la escena lo define.
    if (theme.logo) root.style.setProperty('--h-logo', theme.logo)
    else root.style.removeProperty('--h-logo')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.bg)
  }, [theme])

  // El resto de escenas (fotos y migas) se montan con la página ya cargada y el
  // navegador libre: no compiten con la primera foto ni con el arranque.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 400))
    const cancel = window.cancelIdleCallback ?? clearTimeout
    let id = 0
    const start = () => {
      id = idle(() => setWarm(true), { timeout: 2000 })
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      cancel(id)
    }
  }, [])

  const parts = useCallback((i) => {
    const root = rootRef.current
    const pick = (part) => [...root.querySelectorAll(`[data-scene="${i}"][data-part="${part}"]`)]
    const inside = (part) => [...root.querySelectorAll(`[data-scene="${i}"] [data-part="${part}"]`)]
    return { title: pick('title'), cookie: pick('cookie'), groups: pick('group'), chars: inside('char'), crumbs: inside('crumb') }
  }, [])

  // Al cruzar el punto de quiebre los titulares se vuelven a montar: se muestra el activo.
  useLayoutEffect(() => {
    if (rootRef.current) gsap.set(parts(indexRef.current).title, { autoAlpha: 1 })
  }, [narrow, parts])

  const { contextSafe } = useGSAP(
    () => {
      const first = parts(0)
      const themeNow = heroThemes[slides[0].hero.theme]
      bgRef.current.style.backgroundColor = themeNow.bg
      gsap.set([first.title, first.cookie, first.groups], { autoAlpha: 1 })
      if (prefersReducedMotion()) return

      // Entrada: la cookie ya es visible en el primer fotograma (no retrasa la compra).
      // Se guarda para que un cambio de sabor inmediato la dé por terminada.
      tlRef.current = gsap
        .timeline({ defaults: { ease: EASE.expo } })
        .from(first.cookie, { scale: 0.84, rotation: 12, yPercent: 5, duration: 1.25 }, 0)
        .from(first.chars, { yPercent: 108, duration: 1, ease: EASE.outStrong, stagger: 0.035 }, 0.08)
        .from(first.crumbs, { scale: 0, autoAlpha: 0, duration: 0.9, stagger: 0.04 }, 0.25)
        .from('.hero-sticker', { scale: 0, rotation: -24, duration: 0.8 }, 0.45)

      const mm = gsap.matchMedia()
      // Capas que responden al puntero: profundidad apenas perceptible.
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const root = rootRef.current
        const layers = gsap.utils.toArray('[data-depth]', root).map((layer) => ({
          depth: Number(layer.dataset.depth),
          xTo: gsap.quickTo(layer, 'x', { duration: 0.9, ease: 'power3.out' }),
          yTo: gsap.quickTo(layer, 'y', { duration: 0.9, ease: 'power3.out' }),
        }))
        const move = (event) => {
          const rect = root.getBoundingClientRect()
          const x = event.clientX - rect.left - rect.width / 2
          const y = event.clientY - rect.top - rect.height / 2
          layers.forEach(({ depth, xTo, yTo }) => {
            xTo(x * depth)
            yTo(y * depth)
          })
        }
        const leave = () => layers.forEach(({ xTo, yTo }) => (xTo(0), yTo(0)))
        root.addEventListener('pointermove', move)
        root.addEventListener('pointerleave', leave)
        return () => {
          root.removeEventListener('pointermove', move)
          root.removeEventListener('pointerleave', leave)
        }
      })
      // Relevo hacia el catálogo: la escena sale más despacio que el scroll.
      mm.add('(min-width: 860px)', () => {
        gsap.to(stageRef.current, {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
        })
      })
    },
    { scope: rootRef },
  )

  const transition = contextSafe((from, to, dir) => {
    const out = parts(from)
    const inn = parts(to)
    const next = heroThemes[slides[to].hero.theme]
    const bg = bgRef.current
    const wipe = wipeRef.current

    tlRef.current?.progress(1) // si había una transición en curso, se da por terminada
    if (prefersReducedMotion()) {
      gsap.set([out.title, out.cookie, out.groups], { autoAlpha: 0 })
      gsap.set([inn.title, inn.cookie, inn.groups], { autoAlpha: 1 })
      bg.style.backgroundColor = next.bg
      return
    }

    const k = lowPower ? 0.82 : 1
    const charOrder = dir > 0 ? 'start' : 'end'
    wipe.style.backgroundColor = next.bg
    const tl = gsap.timeline()
    tlRef.current = tl

    // 1. La cookie anterior rueda hacia fuera y su titular sube.
    tl.to(out.chars, { yPercent: -108, duration: 0.5 * k, ease: EASE.in, stagger: { each: 0.016, from: charOrder } }, 0)
      .to(out.cookie, { xPercent: -62 * dir, rotation: -70 * dir, scale: 0.5, autoAlpha: 0, duration: 0.62 * k, ease: EASE.in }, 0)
      .to(out.crumbs, { scale: 0, autoAlpha: 0, duration: 0.4 * k, ease: 'power2.in', stagger: 0.012 }, 0)
      .set([out.title, out.groups], { autoAlpha: 0 }, 0.64 * k)
      // 2. El color nuevo crece desde el centro de la escena.
      .fromTo(wipe, { scale: 0 }, { scale: 1, duration: 0.95 * k, ease: EASE.inOut }, 0.06)
      .add(() => {
        bg.style.backgroundColor = next.bg
        gsap.set(wipe, { scale: 0 })
      }, 0.06 + 0.95 * k)
      // 3. La nueva entra rodando en el mismo sentido y se asienta con inercia.
      .set([inn.title, inn.groups], { autoAlpha: 1 }, 0.3 * k)
      .fromTo(
        inn.cookie,
        { xPercent: 62 * dir, rotation: 70 * dir, scale: 0.5, autoAlpha: 0 },
        { xPercent: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 1.05 * k, ease: EASE.expo },
        0.3 * k,
      )
      .fromTo(
        inn.chars,
        { yPercent: 108 },
        { yPercent: 0, duration: 0.9 * k, ease: EASE.outStrong, stagger: { each: 0.026, from: charOrder } },
        0.42 * k,
      )
      .fromTo(
        inn.crumbs,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.8 * k, ease: EASE.expo, stagger: 0.03 },
        0.55 * k,
      )
  })

  const go = useCallback(
    (to, dir) => {
      const from = indexRef.current
      const target = mod(to, total)
      if (target === from) return
      const direction = dir ?? (target > from ? 1 : -1)
      indexRef.current = target
      setIndex(target) // el panel y el botón apuntan al nuevo sabor de inmediato
      setJustAdded(false)
      if (warm) transition(from, target, direction)
      else {
        // Su escena aún no está montada: se monta ya y la transición corre después.
        pending.current = { from, to: target, dir: direction }
        setWarm(true)
      }
    },
    [total, warm, transition],
  )
  const goRef = useLatest(go)

  // Transición que quedó pendiente de que se montara su escena.
  useLayoutEffect(() => {
    if (!warm || !pending.current) return
    const { from, to, dir } = pending.current
    pending.current = null
    transition(from, to, dir)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warm])

  // Pausa las animaciones en bucle cuando el hero no se ve.
  useInView(rootRef, (visible) => rootRef.current?.classList.toggle('is-paused', !visible), { threshold: 0.05 })

  // Arrastre horizontal (dedo o ratón) para cambiar de sabor.
  useEffect(() => {
    const stage = stageRef.current
    const cookie = dragRef.current
    if (!stage || !cookie) return undefined
    const reduced = prefersReducedMotion()
    const setX = gsap.quickSetter(cookie, 'x', 'px')
    const setRot = gsap.quickSetter(cookie, 'rotation', 'deg')
    let drag = null

    const down = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      if (event.target.closest(HIT_SELECTOR)) return
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, t: performance.now(), dx: 0, active: false }
    }
    const move = (event) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      if (!drag.active) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        if (Math.abs(dy) > Math.abs(dx)) {
          drag = null // intención vertical: se deja el scroll a la página
          return
        }
        drag.active = true
        stage.setPointerCapture?.(event.pointerId)
        stage.classList.add('is-dragging')
        gsap.killTweensOf(cookie)
      }
      drag.dx = dx
      if (!reduced) {
        setX(dx * 0.42)
        setRot(dx * 0.03)
      }
    }
    const up = () => {
      if (!drag) return
      const { dx, active, t } = drag
      drag = null
      stage.classList.remove('is-dragging')
      if (!active) return
      const speed = Math.abs(dx) / Math.max(performance.now() - t, 1)
      const far = Math.abs(dx) > Math.min(120, stage.clientWidth * 0.18) || (speed > 0.5 && Math.abs(dx) > 28)
      gsap.to(cookie, { x: 0, rotation: 0, duration: 0.7, ease: EASE.out })
      if (far) goRef.current(indexRef.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
    }
    stage.addEventListener('pointerdown', down)
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerup', up)
    stage.addEventListener('pointercancel', up)
    return () => {
      stage.removeEventListener('pointerdown', down)
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerup', up)
      stage.removeEventListener('pointercancel', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!justAdded) return undefined
    const id = setTimeout(() => setJustAdded(false), 1500)
    return () => clearTimeout(id)
  }, [justAdded])

  // Tras montar las escenas restantes, las medidas de ScrollTrigger pueden cambiar.
  useEffect(() => {
    if (warm) ScrollTrigger.refresh()
  }, [warm])

  const onKeyDown = (event) => {
    if (event.target.closest('input, textarea, select')) return
    if (event.key === 'ArrowRight') go(indexRef.current + 1, 1)
    if (event.key === 'ArrowLeft') go(indexRef.current - 1, -1)
  }

  const add = () => {
    const result = cart.add(product)
    if (!result.ok) {
      ui.announce(result.reason === 'agotado' ? `${product.name} está agotada.` : `Llegaste al máximo de ${product.name} por pedido.`)
      return
    }
    setJustAdded(true)
    ui.announce(`${product.name} añadida a tu pedido.`)
    const img = rootRef.current.querySelector(`[data-scene="${indexRef.current}"][data-part="cookie"] img`)
    flyToCart(img, productSrc(product, 160))
  }

  let ctaLabel = 'Añadir al pedido'
  if (soldOut) ctaLabel = 'Agotada por hoy'
  else if (atLimit) ctaLabel = 'Máximo por pedido'
  else if (justAdded) ctaLabel = 'Añadida al pedido'

  const visible = warm ? slides.map((_, i) => i) : [0]
  // Debe coincidir con HERO_SIZES de build/noa-html.js: la foto que trae el HTML
  // y esta tienen que resolver al mismo archivo para salir de caché.
  const cookieSizes = '(max-width: 859px) 80vw, 44vw'

  return (
    <section
      ref={rootRef}
      className="hero"
      aria-roledescription="carrusel"
      aria-label={`Cookies de ${site.shortName}`}
      onKeyDown={onKeyDown}
    >
      <h1 className="sr-only">{site.heading}</h1>
      <div ref={bgRef} className="hero-bg" />
      <div ref={wipeRef} className="hero-wipe" />
      <div className="hero-grain" />

      <div ref={stageRef} className="hero-stage">
        <div className="hero-layers" aria-hidden="true">
          <div className="hero-layer" data-depth="-0.012">
            {visible.map((i) => (
              <Title
                key={`${slides[i].id}-${narrow}`}
                scene={i}
                narrow={narrow}
                lines={narrow ? slides[i].hero.narrow : slides[i].hero.wide}
                color={heroThemes[slides[i].hero.theme].title}
                drop={wideFit(slides[i].image)}
              />
            ))}
          </div>

          <div className="hero-layer" data-depth="0.018">
            <div className="hero-slot">
              {visible.map((i) => (
                <Crumbs key={slides[i].id} product={slides[i]} layout={layout} layer="back" scene={i} />
              ))}
            </div>
          </div>

          <div className="hero-layer" data-depth="0.032">
            <div className="hero-slot">
              <div ref={dragRef} className="hero-cookie-drag">
                {visible.map((i) => (
                  <div
                    className="hero-cookie"
                    data-scene={i}
                    data-part="cookie"
                    data-wide={wideFit(slides[i].image) ? '' : undefined}
                    style={wideFit(slides[i].image) ? { '--wide': wideFit(slides[i].image) } : undefined}
                    key={slides[i].id}
                  >
                    <span className="hero-cookie-shadow" />
                    <div className="hero-cookie-float">
                      <ProductImage
                        product={slides[i]}
                        sizes={cookieSizes}
                        eager
                        priority={i === 0 ? 'high' : 'low'}
                        alt=""
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="hero-sticker">
                <Price value={product.price} />
              </div>
            </div>
          </div>

          <div className="hero-layer" data-depth="0.055">
            <div className="hero-slot">
              {visible.map((i) => (
                <Crumbs key={slides[i].id} product={slides[i]} layout={layout} layer="front" scene={i} />
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="hero-panel">
        <div className="hero-info" aria-live="polite" aria-atomic="true">
          <h2 className="navy-label hero-name">{product.name}</h2>
          <p className="hero-desc">{product.description ?? site.tagline}</p>
          <p className="sr-only">Precio: <Price value={product.price} /></p>
        </div>

        <div className="hero-rail" role="group" aria-label="Elegir sabor">
          <button type="button" className="hero-arrow hero-arrow--prev" onClick={() => go(index - 1, -1)} aria-label="Sabor anterior">
            <Icon name="left" />
          </button>
          {slides.map((p, i) => (
            <button
              type="button"
              key={p.id}
              className="hero-thumb"
              aria-label={p.name}
              aria-current={i === index ? 'true' : undefined}
              title={p.name}
              onClick={() => go(i)}
            >
              <img src={productSrc(p, 160)} alt="" width="96" height="96" decoding="async" draggable={false} />
            </button>
          ))}
          <button type="button" className="hero-arrow hero-arrow--next" onClick={() => go(index + 1, 1)} aria-label="Sabor siguiente">
            <Icon name="right" />
          </button>
        </div>

        <div className="hero-buy">
          <button
            type="button"
            className="btn-cta"
            onClick={add}
            disabled={soldOut || atLimit}
            data-state={justAdded ? 'added' : 'idle'}
            data-testid="hero-add"
          >
            <span>{ctaLabel}</span>
            <span className="btn-cta-icon">
              <Icon name={justAdded ? 'check' : 'plus'} size={20} strokeWidth={2.6} />
            </span>
          </button>
          {inCart > 0 && (
            <button type="button" className="hero-incart" onClick={() => ui.openCart()}>
              {inCart} en tu pedido. Ver pedido
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
