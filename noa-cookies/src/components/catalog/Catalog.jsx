import { categories, featured } from '../../data/catalog.js'
import { refreshAvailability, useCatalog } from '../../services/catalog.js'
import { WhatsAppLink } from '../ui/WhatsAppLink.jsx'
import { Price } from '../ui/Price.jsx'
import { ProductItem } from './ProductItem.jsx'

// Ancho real de la foto dentro de su disco (no el de la columna): así cada
// pantalla descarga la versión justa.
const SIZES = {
  cookies: '(max-width: 767px) 38vw, (max-width: 1199px) 26vw, 200px',
  especiales: '(max-width: 767px) 40vw, (max-width: 1199px) 28vw, 280px',
}
/** Como en las historias destacadas de NOA: naranja y azul se alternan. */
const DISC = { cookies: 'noa-orange', especiales: 'navy' }

function MonthlyTile() {
  return (
    <WhatsAppLink className="item item--monthly" data-reveal-item question="¡Hola, NOA! ¿Cuál es el sabor del mes?">
      <div className="item-visual" style={{ '--disc': 'var(--color-butter)' }}>
        <span className="item-disc" />
        <span className="monthly-mark display" aria-hidden="true">
          Sabor
          <br />
          del mes
        </span>
      </div>
      <h4 className="navy-label item-name">Sabor del mes</h4>
      <p className="item-desc">Cambia cada mes y solo está ese mes. Pregunta cuál toca.</p>
      <span className="item-buy">
        <span className="text-link">Preguntar por WhatsApp</span>
      </span>
    </WhatsAppLink>
  )
}

export function Catalog() {
  const { products, status } = useCatalog()

  return (
    <section id="menu" className="shop paper" aria-labelledby="menu-title">
      <div className="wrap">
        <h2 id="menu-title" className="display shop-title" data-reveal>
          Elige tu próximo antojo
        </h2>

        {status === 'error' && (
          <p className="shop-notice" role="status">
            No pudimos actualizar qué hay disponible ahora mismo. Lo que ves es el menú completo.{' '}
            <button type="button" className="text-link" onClick={refreshAvailability}>
              Reintentar
            </button>
          </p>
        )}

        {categories.map((category) => {
          const list = products.filter((p) => p.category === category.id)
          if (!list.length) return null
          return (
            <div className="shop-group" key={category.id} data-reveal-group aria-busy={status === 'loading'}>
              <div className="shop-group-head" data-reveal-item>
                <h3 className="display shop-group-name">{category.name}</h3>
                {category.priceNote !== null && (
                  <p className="navy-label shop-group-price">
                    <Price value={category.priceNote} /> c/u
                  </p>
                )}
              </div>
              <div className={`shop-grid shop-grid--${category.id}`}>
                {list.map((product) => (
                  <ProductItem key={product.id} product={product} disc={DISC[category.id]} sizes={SIZES[category.id]} />
                ))}
                {category.id === 'cookies' && !featured.monthly && <MonthlyTile />}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
