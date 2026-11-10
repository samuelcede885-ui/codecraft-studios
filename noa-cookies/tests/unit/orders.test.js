import { afterEach, describe, expect, it } from 'vitest'
import site from '../../src/config/site.js'
import { products, productsById } from '../../src/data/catalog.js'
import { parseAvailability } from '../../src/services/catalog.js'
import { buildOrder, orderToText, validateCheckout, whatsappTarget } from '../../src/services/orders.js'
import { addToLines, summarize } from '../../src/store/cartLogic.js'
import { formatPrice } from '../../src/lib/format.js'

const original = structuredClone({ whatsapp: site.ordering.whatsapp, fee: site.fulfillment.delivery.fee, methods: site.payment.methods })
afterEach(() => {
  site.ordering.whatsapp = structuredClone(original.whatsapp)
  site.fulfillment.delivery.fee = original.fee
  site.payment.methods = structuredClone(original.methods)
})

function sampleSummary() {
  let { lines } = addToLines([], productsById.signature, null, 2)
  ;({ lines } = addToLines(lines, productsById['noa-roll'], 'nutella'))
  return summarize(lines, productsById)
}
const customer = { name: '  Ana Pérez ', phone: '0412 555 0000' }

describe('catálogo', () => {
  it('contiene los nueve productos del menú con sus precios', () => {
    expect(products.map((p) => [p.id, p.price])).toEqual([
      ['signature', 4],
      ['choco-lovers', 4],
      ['velvet', 4],
      ['nutella-bomb', 4],
      ['mani-fica', 4],
      ['noa-roll', 3],
      ['pastelito', 2.5],
      ['cookie-sandwich', 3.5],
      ['cookie-cake', 35],
    ])
  })

  it('cada producto tiene foto registrada con sus tamaños', () => {
    for (const p of products) {
      expect(p.image.widths.length, p.id).toBeGreaterThan(0)
      expect(p.image.w, p.id).toBeGreaterThan(0)
    }
  })
})

describe('pedido', () => {
  it('pick-up: el total es el subtotal', () => {
    const order = buildOrder({ summary: sampleSummary(), customer, fulfillment: { type: 'pickup', address: '' }, paymentMethodId: '' })
    expect(order).toMatchObject({ subtotal: 11, deliveryFee: 0, total: 11, customer: { name: 'Ana Pérez' } })
    expect(order.items).toHaveLength(2)
  })

  it('delivery sin tarifa definida: no inventa un total', () => {
    const order = buildOrder({ summary: sampleSummary(), customer, fulfillment: { type: 'delivery', address: 'Calle 1, casa 2' }, paymentMethodId: '' })
    expect(order.deliveryFee).toBeNull()
    expect(order.total).toBeNull()
    const text = orderToText(order)
    expect(text).toContain('Costo de delivery: por confirmar')
    expect(text).not.toContain('Total:')
  })

  it('delivery con tarifa fija: la suma al total', () => {
    site.fulfillment.delivery.fee = 2.5
    const order = buildOrder({ summary: sampleSummary(), customer, fulfillment: { type: 'delivery', address: 'Calle 1, casa 2' }, paymentMethodId: '' })
    expect(order.total).toBe(13.5)
    expect(orderToText(order)).toContain(`Total: ${formatPrice(13.5)}`)
  })

  it('el mensaje lista productos, variantes, entrega y datos', () => {
    const order = buildOrder({ summary: sampleSummary(), customer, fulfillment: { type: 'pickup', address: '' }, paymentMethodId: '' })
    const text = orderToText(order)
    expect(text).toContain('2 × Signature')
    expect(text).toContain('1 × NOA Roll (topping: Nutella)')
    expect(text).toContain(`Subtotal: ${formatPrice(11)}`)
    expect(text).toContain('Entrega: pick-up')
    expect(text).toContain('Pago: por coordinar')
    expect(text).toContain('Nombre: Ana Pérez')
  })

  it('excluye del pedido las líneas con problemas', () => {
    const { lines } = addToLines([], productsById.velvet, null, 1)
    const summary = summarize(lines, { ...productsById, velvet: { ...productsById.velvet, available: false } })
    const order = buildOrder({ summary, customer, fulfillment: { type: 'pickup', address: '' }, paymentMethodId: '' })
    expect(order.items).toEqual([])
  })
})

describe('WhatsApp', () => {
  it('sin número configurado usa el enlace público y avisa que no va prellenado', () => {
    site.ordering.whatsapp.number = ''
    expect(whatsappTarget('hola')).toEqual({ url: site.ordering.whatsapp.shortLink, prefilled: false })
  })

  it('con número arma el enlace con el pedido codificado', () => {
    site.ordering.whatsapp.number = '+58 412-555 00 00'
    const target = whatsappTarget('Hola, NOA: 2 × Signature')
    expect(target.prefilled).toBe(true)
    expect(target.url).toBe('https://wa.me/584125550000?text=Hola%2C%20NOA%3A%202%20%C3%97%20Signature')
  })
})

describe('validación del formulario', () => {
  const ok = { name: 'Ana', phone: '0412 555 0000', type: 'pickup', address: '', paymentMethodId: '' }

  it('acepta los datos mínimos para pick-up', () => {
    expect(validateCheckout(ok)).toEqual({})
  })

  it('pide nombre y teléfono válidos', () => {
    expect(Object.keys(validateCheckout({ ...ok, name: ' ', phone: '123' }))).toEqual(['name', 'phone'])
  })

  it('solo pide dirección si es delivery', () => {
    expect(validateCheckout({ ...ok, type: 'delivery' })).toHaveProperty('address')
    expect(validateCheckout({ ...ok, type: 'delivery', address: 'Av. Principal, edif. Sol, apto 4' })).toEqual({})
  })

  it('pide método de pago solo cuando hay métodos configurados', () => {
    expect(validateCheckout(ok)).not.toHaveProperty('payment')
    site.payment.methods = [{ id: 'pago-movil', label: 'Pago Móvil' }]
    expect(validateCheckout(ok)).toHaveProperty('payment')
    expect(validateCheckout({ ...ok, paymentMethodId: 'pago-movil' })).toEqual({})
  })
})

describe('disponibilidad desde el backend', () => {
  it('acepta solo available y stock con tipos válidos', () => {
    expect(
      parseAvailability({
        signature: { available: false, stock: 0, price: 0.01 },
        velvet: { stock: 3 },
        raro: { stock: -2, available: 'sí' },
        nulo: null,
      }),
    ).toEqual({ signature: { available: false, stock: 0 }, velvet: { stock: 3 } })
    expect(parseAvailability(null)).toEqual({})
  })
})
