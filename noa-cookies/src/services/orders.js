/**
 * Envío del pedido.
 *
 * La marca recibe los pedidos por WhatsApp, así que el proveedor por defecto
 * arma el mensaje y abre el chat: el pedido queda hecho cuando el cliente lo
 * envía y la marca responde. La web nunca muestra un "pedido confirmado" propio.
 *
 * Con un backend (config.ordering.provider = 'api') el pedido se registra por
 * POST y la confirmación muestra el número que devuelva el servidor.
 */
import site from '../config/site.js'
import { formatPrice } from '../lib/format.js'

/** Estructura que recibe el backend o se convierte en mensaje de WhatsApp. */
export function buildOrder({ summary, customer, fulfillment, paymentMethodId }) {
  const delivery = fulfillment.type === 'delivery'
  const fee = delivery ? site.fulfillment.delivery.fee : 0
  const payment = site.payment.methods.find((m) => m.id === paymentMethodId) ?? null
  return {
    createdAt: new Date().toISOString(),
    currency: site.currency.code,
    items: summary.items
      .filter((i) => !i.issue)
      .map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        option: i.option ? { id: i.option.id, label: i.product.options.label, name: i.option.name } : null,
        qty: i.line.qty,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
    subtotal: summary.subtotal,
    fulfillment: { type: fulfillment.type, address: delivery ? fulfillment.address.trim() : null },
    deliveryFee: fee, // null = se cotiza por zona
    total: fee === null ? null : Math.round((summary.subtotal + fee) * 100) / 100,
    customer: { name: customer.name.trim(), phone: customer.phone.trim() },
    payment: payment ? { id: payment.id, label: payment.label } : null,
  }
}

/** Mensaje que el cliente envía por WhatsApp. */
export function orderToText(order) {
  const lines = order.items.map((i) => {
    const option = i.option ? ` (${i.option.label.toLowerCase()}: ${i.option.name})` : ''
    return `• ${i.qty} × ${i.name}${option} — ${formatPrice(i.total)}`
  })
  const out = [`¡Hola, ${site.shortName}! 🍪 Quiero hacer este pedido:`, '', ...lines, '', `Subtotal: ${formatPrice(order.subtotal)}`]

  if (order.fulfillment.type === 'delivery') {
    out.push(`Entrega: delivery a ${order.fulfillment.address}`)
    out.push(order.deliveryFee === null ? 'Costo de delivery: por confirmar' : `Costo de delivery: ${formatPrice(order.deliveryFee)}`)
  } else {
    out.push('Entrega: pick-up')
  }
  if (order.total !== null && order.total !== order.subtotal) out.push(`Total: ${formatPrice(order.total)}`)
  out.push(`Pago: ${order.payment ? order.payment.label : 'por coordinar'}`)
  out.push('', `Nombre: ${order.customer.name}`, `Teléfono: ${order.customer.phone}`)
  return out.join('\n')
}

/**
 * Destino en WhatsApp.
 * Con número configurado el mensaje llega ya escrito (`prefilled: true`).
 * Sin número solo se puede abrir el enlace público de la marca, y el cliente pega
 * el pedido que la web le copia al portapapeles.
 */
export function whatsappTarget(text) {
  const { number, shortLink } = site.ordering.whatsapp
  const digits = (number ?? '').replace(/\D/g, '')
  if (digits) return { url: `https://wa.me/${digits}?text=${encodeURIComponent(text)}`, prefilled: true }
  return { url: shortLink, prefilled: false }
}

/** Enlace para escribirle a la marca una pregunta puntual (sabor del mes, alérgenos…). */
export function whatsappAskUrl(question) {
  return whatsappTarget(question).url
}

export const usesApi = () => site.ordering.provider === 'api' && Boolean(site.ordering.api.ordersEndpoint)

/**
 * Registra el pedido en el backend. Lanza un Error si el servidor no lo
 * confirma: la interfaz muestra el fallo y deja reintentar, sin dar el pedido
 * por hecho.
 */
export async function sendOrderToApi(order, { signal } = {}) {
  const response = await fetch(site.ordering.api.ordersEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
    signal,
  })
  if (!response.ok) throw new Error(`El servidor respondió ${response.status}`)
  const data = await response.json()
  if (!data?.orderNumber) throw new Error('El servidor no devolvió un número de pedido')
  return { orderNumber: String(data.orderNumber) }
}

/** Validación del formulario. Devuelve { campo: mensaje } solo con los campos que fallan. */
export function validateCheckout({ name, phone, type, address, paymentMethodId }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Escribe tu nombre.'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) errors.phone = 'Escribe un teléfono válido, con código de área.'
  if (type === 'delivery' && address.trim().length < 8) errors.address = 'Escribe la dirección de entrega con una referencia.'
  if (site.payment.methods.length > 0 && !paymentMethodId) errors.payment = 'Elige cómo vas a pagar.'
  return errors
}
