import { useEffect, useState } from 'react'
import { useCatalog } from '../services/catalog.js'
import { WhatsAppLink } from './ui/WhatsAppLink.jsx'
import { ui, useUi } from '../store/ui.js'
import { Icon } from './ui/Icon.jsx'
import { Price } from './ui/Price.jsx'
import { ProductImage } from './ui/ProductImage.jsx'
import { Sheet } from './ui/Sheet.jsx'

/** Panel pequeño con ingredientes y alérgenos, sin salir del catálogo. */
export function InfoSheet() {
  const id = useUi((s) => s.infoProductId)
  const { byId } = useCatalog()
  // Se conserva el último producto para que el contenido no desaparezca mientras el panel se cierra.
  const [shown, setShown] = useState(null)
  useEffect(() => {
    if (id) setShown(id)
  }, [id])
  const product = byId[shown]

  return (
    <Sheet open={Boolean(id)} onClose={ui.closeInfo} labelledBy="info-title" variant="card">
      {product && (
        <div className="info">
          <button type="button" className="sheet-close pm-interactive" onClick={ui.closeInfo} aria-label="Cerrar">
            <Icon name="close" size={20} />
          </button>
          <div className="info-head">
            <ProductImage product={product} sizes="120px" className="info-img" />
            <div>
              <h2 id="info-title" className="navy-label info-name">
                {product.name}
              </h2>
              <p className="info-price">
                <Price value={product.price} />
              </p>
            </div>
          </div>
          <p className="info-desc">{product.description}</p>

          <h3 className="info-sub">Lo que dice el menú</h3>
          <ul className="info-list">
            {product.info.fromMenu.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h3 className="info-sub">Ingredientes y alérgenos</h3>
          {product.info.ingredients || product.info.allergens ? (
            <>
              {product.info.ingredients && <p className="info-text">{product.info.ingredients}</p>}
              {product.info.allergens && (
                <p className="info-text">
                  <strong>Contiene:</strong> {product.info.allergens.join(', ')}.
                </p>
              )}
            </>
          ) : (
            <p className="info-text">
              NOA todavía no ha publicado la lista completa. Si tienes alguna alergia, pregunta antes de pedir.{' '}
              <WhatsAppLink className="text-link" question={`¡Hola, NOA! ¿Qué ingredientes y alérgenos tiene ${product.name}?`}>
                Preguntar por WhatsApp
              </WhatsAppLink>
            </p>
          )}
        </div>
      )}
    </Sheet>
  )
}
