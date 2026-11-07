import { ORDER_MODE_LABEL } from '../config/site';
import type { CartSummary } from './cart';
import { formatUSD, priceLabel } from './format';
import type { CheckoutForm } from './validation';

/** Texto del pedido para WhatsApp (o para copiar). Solo datos reales del carrito y del formulario. */
export function buildOrderMessage(summary: CartSummary, form: CheckoutForm) {
  const lines = summary.lines.map((l) => {
    const name = l.choiceLabel ? `${l.product.name} (${l.choiceLabel})` : l.product.name;
    const total = l.lineTotal === null ? 'precio por confirmar' : formatUSD(l.lineTotal);
    return `• ${l.qty} × ${name} — ${total}`;
  });

  let subtotal: string;
  if (summary.subtotalComplete) subtotal = formatUSD(summary.knownSubtotal);
  else if (summary.knownSubtotal > 0)
    subtotal = `${priceLabel(summary.knownSubtotal)} + ${summary.pendingPriceLines} producto(s) por confirmar`;
  else subtotal = 'por confirmar';

  const out = [
    "¡Hola, Punkie's! Quiero hacer este pedido:",
    '',
    ...lines,
    '',
    `Subtotal: ${subtotal}`,
    `Entrega: ${ORDER_MODE_LABEL[form.mode]}`,
    '',
    `Nombre: ${form.name.trim()}`,
    `Teléfono: ${form.phone.trim()}`,
  ];
  if (form.mode === 'delivery') {
    out.push(`Dirección: ${form.address.trim()}`);
    if (form.reference.trim()) out.push(`Referencia: ${form.reference.trim()}`);
  }
  if (form.notes.trim()) out.push(`Observaciones: ${form.notes.trim()}`);
  return out.join('\n');
}
