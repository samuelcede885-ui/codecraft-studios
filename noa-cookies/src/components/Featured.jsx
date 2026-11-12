import { useRef, useState } from 'react'
import site from '../config/site.js'
import { featured } from '../data/catalog.js'
import { useCatalog } from '../services/catalog.js'
import { WhatsAppLink } from './ui/WhatsAppLink.jsx'
import { defaultOptionId } from '../store/cartLogic.js'
import { useFitText, useMediaQuery } from '../lib/hooks.js'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion.js'
import { Price } from './ui/Price.jsx'
import { ProductImage } from './ui/ProductImage.jsx'
import { AddControl } from './catalog/AddControl.jsx'
import { OptionChips } from './catalog/OptionChips.jsx'

/**
 * Sección editorial. Muestra el sabor del mes cuando la marca lo confirme
 * (`featured.monthly`); mientras tanto destaca un producto real del menú y, si
 * la marca tiene sabor del mes (`featured.monthlyCopy`), lo explica con sus
 * palabras sin inventar cuál es.
 */
export function Featured() {
  const { byId } = useCatalog()
  const monthly = featured.monthly ? byId[featured.monthly.productId] : null
  const product = monthly ?? byId[featured.productId]
  const [optionId, setOptionId] = useState(product ? defaultOptionId(product) : null)
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const visualRef = useRef(null)

  const narrow = useMediaQuery('(max-width: 859px)')

  // 0.9: deja margen al deslizamiento lateral del titular al hacer scroll.
  useFitText(stageRef, { widthRatio: 0.9, maxHeightRatio: 10 }, [product?.id, narrow])

  useGSAP(
    () => {
      if (prefersReducedMotion() || !product) return
      // Una sola pieza se mueve con el scroll: la foto gira y el titular se desliza.
      const scrollTrigger = { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.1 }
      gsap.fromTo('.featured-img', { rotation: -9, yPercent: 10 }, { rotation: 5, yPercent: -8, ease: 'none', scrollTrigger })
      gsap.fromTo('.featured-title', { xPercent: 4 }, { xPercent: -4, ease: 'none', scrollTrigger })
    },
    { scope: rootRef, dependencies: [product?.id] },
  )

  if (!product) return null
  const words = product.name.split(' ')
  const rows = narrow ? words.map((w) => [w]) : [words] // móvil: una palabra por línea

  return (
    <section ref={rootRef} className="featured" aria-labelledby="featured-title">
      <div className="wrap">
        <p className="featured-kicker" data-reveal>
          {monthly ? 'Sabor del mes. Solo este mes.' : featured.headline}
        </p>
      </div>

      <div ref={stageRef} className="featured-stage">
        <h2 id="featured-title" className="featured-title" data-fit aria-label={product.name}>
          {rows.map((row) => (
            <span className="featured-title-row" data-fit-line aria-hidden="true" key={row.join('-')}>
              {row.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </span>
          ))}
        </h2>
        <div className="featured-visual" ref={visualRef}>
          <ProductImage product={product} sizes="(max-width: 859px) 92vw, 60vw" className="featured-img" />
        </div>
      </div>

      <div className="wrap featured-body" data-reveal-group>
        <div className="featured-copy" data-reveal-item>
          {product.note && <p className="navy-label featured-note">{product.note}</p>}
          <p className="featured-desc">{product.description ?? site.tagline}</p>
        </div>
        <div className="featured-buy" data-reveal-item>
          {product.options && <OptionChips product={product} value={optionId} onChange={setOptionId} tone="dark" />}
          <div className="featured-buy-row">
            <Price value={product.price} className="featured-price" />
            <AddControl product={product} optionId={optionId} flyFrom={visualRef} size="lg" label="Añadir al pedido" />
          </div>
        </div>
      </div>

      {!monthly && featured.monthlyCopy && (
        <aside className="monthly" aria-labelledby="monthly-title">
          <div className="wrap monthly-inner" data-reveal-group>
            <h2 id="monthly-title" className="navy-label monthly-title" data-reveal-item>
              Sabor del mes
            </h2>
            <p className="monthly-copy" data-reveal-item>
              {featured.monthlyCopy}
            </p>
            <WhatsAppLink className="btn pm-interactive monthly-cta" data-reveal-item question={`¡Hola, ${site.shortName}! ¿Cuál es el sabor del mes?`}>
              Preguntar cuál es el de este mes
            </WhatsAppLink>
          </div>
        </aside>
      )}
    </section>
  )
}
