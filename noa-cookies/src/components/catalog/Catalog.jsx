import site from '../../config/site.js'
import { categories, featured } from '../../data/catalog.js'
import { refreshAvailability, useCatalog } from '../../services/catalog.js'
import { WhatsAppLink } from '../ui/WhatsAppLink.jsx'
import { Price } from '../ui/Price.jsx'
import { ProductItem } from './ProductItem.jsx'

// Ancho real de la foto dentro de su disco (no el de la columna), según las
// columnas del grupo: así cada pantalla descarga la versión justa.
const SIZES = {
  5: '(max-width: 767px) 38vw, (max-width: 1199px) 26vw, 200px',
  4: '(max-width: 767px) 40vw, (max-width: 1199px) 28vw, 280px',
  3: '(max-width: 767px) 40vw, (max-width: 1199px) 28vw, 340px',
}

/** Ficha que invita a preguntar por el sabor del mes (solo en marcas que lo tienen). */
function MonthlyTile() {
  return (
    <WhatsAppLink className="item item--monthly" data-reveal-item question={`¡Hola, ${site.shortName}! ¿Cuál es el sabor del mes?`}>
      <div className="item-visual" style={{ '--disc': 'var(--accent-2)' }}>
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
  const monthlyTile = Boolean(featured.monthlyCopy) && !featured.monthly

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

        {categories.map((category, index) => {
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
              <div className={`shop-grid shop-grid--${category.grid}`}>
                {list.map((product) => (
                  <ProductItem key={product.id} product={product} disc={category.disc} sizes={SIZES[category.grid]} />
                ))}
                {index === 0 && monthlyTile && <MonthlyTile />}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
