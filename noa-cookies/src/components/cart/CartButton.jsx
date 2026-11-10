import { useEffect } from 'react'
import { useCartCount, useCartLines } from '../../store/cart.js'
import { summarize } from '../../store/cartLogic.js'
import { ui, useUi } from '../../store/ui.js'
import { useCatalog } from '../../services/catalog.js'
import { formatPrice } from '../../lib/format.js'
import { Icon } from '../ui/Icon.jsx'

/**
 * Acceso al pedido, siempre visible.
 * Escritorio: píldora fija arriba a la derecha.
 * Móvil: icono arriba y, con productos, una barra inferior al alcance del pulgar.
 */
export function CartButton() {
  const count = useCartCount()
  const lines = useCartLines()
  const { byId } = useCatalog()
  const cartOpen = useUi((s) => s.cartOpen)
  const { subtotal } = summarize(lines, byId)
  const label = count === 0 ? 'Tu pedido, vacío' : `Tu pedido: ${count} ${count === 1 ? 'producto' : 'productos'}, ${formatPrice(subtotal)}`
  const showBar = count > 0 && !cartOpen

  // El hero reserva sitio para la barra inferior y así nunca tapa su botón.
  useEffect(() => {
    document.documentElement.classList.toggle('has-cartbar', showBar)
    return () => document.documentElement.classList.remove('has-cartbar')
  }, [showBar])

  return (
    <>
      <button type="button" className="cart-fab pm-interactive" onClick={() => ui.openCart()} aria-label={label} data-cart-target data-testid="cart-button">
        <Icon name="bag" size={22} />
        <span className="cart-fab-text">Tu pedido</span>
        {count > 0 && (
          <>
            <span className="cart-fab-count pm-pop" key={count}>
              {count}
            </span>
            <span className="cart-fab-total">{formatPrice(subtotal)}</span>
          </>
        )}
      </button>

      {showBar && (
        <button type="button" className="cart-bar pm-enter" onClick={() => ui.openCart()} aria-label={label} data-cart-target data-testid="cart-bar">
          <span className="cart-bar-count">{count}</span>
          <span className="cart-bar-text">Ver pedido</span>
          <span className="cart-bar-total">{formatPrice(subtotal)}</span>
        </button>
      )}
    </>
  )
}
