import { cart, useLineQty, useProductQty } from '../../store/cart.js'
import { lineId, maxQty } from '../../store/cartLogic.js'
import { ui } from '../../store/ui.js'
import { flyToCart } from '../../lib/fly.js'
import { productSrc } from '../../lib/format.js'
import { Icon } from '../ui/Icon.jsx'

/**
 * Un toque añade. Con unidades en el pedido, el "+" se convierte en un
 * contador para ajustar la cantidad sin salir del catálogo.
 */
export function AddControl({ product, optionId = null, flyFrom, size = 'md', label = null }) {
  const qty = useLineQty(product.id, optionId)
  const productQty = useProductQty(product.id)
  const max = maxQty(product)
  const soldOut = max === 0
  const atLimit = productQty >= max
  const option = product.options?.choices.find((c) => c.id === optionId)
  const what = option ? `${product.name}, ${option.name}` : product.name

  const add = () => {
    const result = cart.add(product, optionId)
    if (!result.ok) {
      ui.announce(result.reason === 'agotado' ? `${product.name} está agotado.` : `Llegaste al máximo de ${product.name} por pedido.`)
      return
    }
    ui.announce(`${what}: ${qty + 1} en tu pedido.`)
    if (qty === 0) flyToCart(flyFrom?.current, productSrc(product, 160))
  }
  const less = () => {
    cart.setQty(lineId(product.id, optionId), qty - 1, product)
    ui.announce(qty - 1 > 0 ? `${what}: ${qty - 1} en tu pedido.` : `${what} quitado de tu pedido.`)
  }

  if (soldOut) {
    return <span className="add-soldout">Agotado</span>
  }

  if (qty === 0 && label) {
    return (
      <button type="button" className="btn btn--orange add-labeled pm-interactive" onClick={add} disabled={atLimit} data-testid={`add-${product.id}`}>
        {label}
        <Icon name="plus" size={20} strokeWidth={2.6} />
      </button>
    )
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        className={`add-btn add-btn--${size} pm-interactive`}
        onClick={add}
        disabled={atLimit}
        aria-label={`Añadir ${what} al pedido`}
        data-testid={`add-${product.id}`}
      >
        <Icon name="plus" size={22} strokeWidth={2.6} />
      </button>
    )
  }

  return (
    <div className={`stepper stepper--${size} pm-pop`} role="group" aria-label={`Cantidad de ${what}`}>
      <button type="button" className="stepper-btn" onClick={less} aria-label={qty === 1 ? `Quitar ${what}` : `Una menos de ${what}`}>
        <Icon name={qty === 1 ? 'trash' : 'minus'} size={18} strokeWidth={2.4} />
      </button>
      <span className="stepper-qty" aria-live="off" data-testid={`qty-${product.id}`}>
        {qty}
      </span>
      <button type="button" className="stepper-btn" onClick={add} disabled={atLimit} aria-label={`Una más de ${what}`}>
        <Icon name="plus" size={18} strokeWidth={2.6} />
      </button>
    </div>
  )
}
