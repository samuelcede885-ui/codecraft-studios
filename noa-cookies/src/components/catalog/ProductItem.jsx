import { useRef, useState } from 'react'
import { defaultOptionId, maxQty } from '../../store/cartLogic.js'
import { ui } from '../../store/ui.js'
import { Icon } from '../ui/Icon.jsx'
import { Price } from '../ui/Price.jsx'
import { ProductImage } from '../ui/ProductImage.jsx'
import { AddControl } from './AddControl.jsx'
import { OptionChips } from './OptionChips.jsx'

/**
 * Producto del catálogo: foto sobre un disco de color, etiqueta con el nombre,
 * una línea de descripción (si la marca la da) y el "+".
 */
export function ProductItem({ product, disc, sizes }) {
  const [optionId, setOptionId] = useState(defaultOptionId(product))
  const visualRef = useRef(null)
  const soldOut = maxQty(product) === 0
  // Las piezas alargadas (pastelito, torta) se asoman del disco; las redondas caben dentro.
  const wide = product.image.w / product.image.h > 1.3

  return (
    <article
      className={product.description ? 'item' : 'item item--bare'}
      data-reveal-item
      data-soldout={soldOut || undefined}
      data-testid={`item-${product.id}`}
    >
      <div className="item-visual" ref={visualRef} data-wide={wide || undefined} style={{ '--disc': disc }}>
        <span className="item-disc" />
        <ProductImage product={product} sizes={sizes} className="item-img" />
        <button
          type="button"
          className="item-info pm-interactive"
          onClick={() => ui.openInfo(product.id)}
          aria-label={`Ingredientes y alérgenos de ${product.name}`}
        >
          <Icon name="info" size={20} strokeWidth={2.6} />
        </button>
      </div>

      <h4 className="navy-label item-name">{product.name}</h4>
      {product.note && <p className="item-note">{product.note}</p>}
      {product.description && <p className="item-desc">{product.description}</p>}

      {product.options && <OptionChips product={product} value={optionId} onChange={setOptionId} />}

      <div className="item-buy">
        <Price value={product.price} className="item-price" />
        <AddControl product={product} optionId={optionId} flyFrom={visualRef} />
      </div>
    </article>
  )
}
