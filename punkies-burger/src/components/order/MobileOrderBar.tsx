import { useCart } from '../../state/cart';
import { useUI } from '../../state/ui';
import { usePresence } from '../../hooks/usePresence';
import { BagIcon } from '../ui/Icons';
import { subtotalText } from './CartDrawer';

/** Barra fija en móvil con el pedido en curso (la mayoría del tráfico llega desde Instagram). */
export function MobileOrderBar() {
  const { summary } = useCart();
  const { openCart, cartOpen, productId, menuOpen } = useUI();
  const visible = summary.itemCount > 0 && !cartOpen && !productId && !menuOpen;
  const { mounted, shown } = usePresence(visible, 300);
  if (!mounted) return null;
  return (
    <div data-shown={shown} className="order-bar fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 lg:hidden">
      <button
        type="button"
        onClick={() => openCart()}
        className="flex min-h-16 w-full items-center justify-between gap-3 rounded-[18px] border-2 border-tinta bg-rojo px-4 text-crema"
      >
        <span className="flex items-center gap-3">
          <span className="relative">
            <BagIcon />
            <span className="absolute -right-2.5 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-crema px-1 font-mono text-[11px] font-bold text-tinta">{summary.itemCount}</span>
          </span>
          <span className="text-[17px] font-extrabold">Ver pedido</span>
        </span>
        <span className="font-mono text-[15px] font-bold">{subtotalText(summary)}</span>
      </button>
    </div>
  );
}
