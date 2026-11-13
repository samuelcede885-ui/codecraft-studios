import { describe, expect, it } from 'vitest'
import { addToLines, defaultOptionId, lineId, maxQty, sanitizeLines, setLineQty, summarize } from '../../src/store/cartLogic.js'

const cookie = { id: 'signature', name: 'Signature', price: 4, available: true, stock: null, maxPerOrder: 24, options: null }
const roll = {
  id: 'noa-roll',
  name: 'NOA Roll',
  price: 3,
  available: true,
  stock: null,
  maxPerOrder: 24,
  options: { label: 'Topping', choices: [{ id: 'solo', name: 'Sin topping' }, { id: 'nutella', name: 'Nutella' }] },
}
const byId = { signature: cookie, 'noa-roll': roll }

describe('añadir al pedido', () => {
  it('crea la línea con un toque y acumula unidades', () => {
    let { lines } = addToLines([], cookie)
    ;({ lines } = addToLines(lines, cookie))
    expect(lines).toEqual([{ id: 'signature', productId: 'signature', optionId: null, qty: 2 }])
  })

  it('usa la primera opción del menú si no se elige ninguna', () => {
    expect(defaultOptionId(roll)).toBe('solo')
    const { lines } = addToLines([], roll)
    expect(lines[0].id).toBe(lineId('noa-roll', 'solo'))
  })

  it('separa en líneas distintas las variantes del mismo producto', () => {
    let { lines } = addToLines([], roll, 'solo')
    ;({ lines } = addToLines(lines, roll, 'nutella', 2))
    expect(lines.map((l) => [l.optionId, l.qty])).toEqual([['solo', 1], ['nutella', 2]])
  })

  it('no muta el arreglo original', () => {
    const start = Object.freeze([])
    expect(() => addToLines(start, cookie)).not.toThrow()
  })
})

describe('disponibilidad y topes', () => {
  it('no deja añadir un producto agotado', () => {
    const result = addToLines([], { ...cookie, available: false })
    expect(result).toMatchObject({ ok: false, reason: 'agotado', lines: [] })
  })

  it('respeta el stock aunque el tope por pedido sea mayor', () => {
    const scarce = { ...cookie, stock: 2 }
    expect(maxQty(scarce)).toBe(2)
    let result = addToLines([], scarce, null, 5)
    expect(result.lines[0].qty).toBe(2)
    expect(result.reason).toBe('limite')
    result = addToLines(result.lines, scarce)
    expect(result).toMatchObject({ ok: false, reason: 'limite' })
  })

  it('el tope cuenta todas las variantes del producto', () => {
    const scarce = { ...roll, stock: 3 }
    let { lines } = addToLines([], scarce, 'solo', 2)
    ;({ lines } = addToLines(lines, scarce, 'nutella', 5))
    expect(lines.reduce((t, l) => t + l.qty, 0)).toBe(3)
  })

  it('stock 0 equivale a agotado', () => {
    expect(maxQty({ ...cookie, stock: 0 })).toBe(0)
  })
})

describe('cambiar cantidades', () => {
  it('cantidad 0 elimina la línea', () => {
    const { lines } = addToLines([], cookie)
    expect(setLineQty(lines, 'signature', 0, cookie).lines).toEqual([])
  })

  it('no supera el tope del producto', () => {
    const scarce = { ...cookie, stock: 3 }
    const { lines } = addToLines([], scarce)
    const result = setLineQty(lines, 'signature', 10, scarce)
    expect(result.lines[0].qty).toBe(3)
    expect(result.reason).toBe('limite')
  })
})

describe('resumen', () => {
  it('calcula subtotal y unidades', () => {
    let { lines } = addToLines([], cookie, null, 2)
    ;({ lines } = addToLines(lines, roll, 'nutella'))
    const summary = summarize(lines, byId)
    expect(summary).toMatchObject({ count: 3, subtotal: 11, hasIssues: false })
    expect(summary.items[1].option.name).toBe('Nutella')
  })

  it('no cobra lo que se agotó después de añadirlo y lo señala', () => {
    const { lines } = addToLines([], cookie, null, 2)
    const summary = summarize(lines, { signature: { ...cookie, available: false } })
    expect(summary).toMatchObject({ subtotal: 0, hasIssues: true })
    expect(summary.items[0].issue).toBe('agotado')
  })

  it('señala las líneas que superan el stock actual', () => {
    const { lines } = addToLines([], cookie, null, 5)
    const summary = summarize(lines, { signature: { ...cookie, stock: 2 } })
    expect(summary.items[0].issue).toBe('excede')
  })

  it('señala productos que ya no están en el catálogo', () => {
    const summary = summarize([{ id: 'viejo', productId: 'viejo', optionId: null, qty: 1 }], byId)
    expect(summary.items[0].issue).toBe('descatalogado')
  })

  it('evita errores de coma flotante en los totales', () => {
    const pastelito = { ...cookie, id: 'pastelito', price: 2.5 }
    const sandwich = { ...cookie, id: 'sandwich', price: 3.5 }
    let { lines } = addToLines([], pastelito, null, 3)
    ;({ lines } = addToLines(lines, sandwich, null, 3))
    expect(summarize(lines, { pastelito, sandwich }).subtotal).toBe(18)
  })
})

describe('datos guardados', () => {
  it('descarta lo que no tiene forma de línea', () => {
    const dirty = [
      { productId: 'signature', optionId: null, qty: 2 },
      { productId: 'x', optionId: null, qty: -1 },
      { productId: 5, optionId: null, qty: 1 },
      { productId: 'y', optionId: null, qty: 1.5 },
      null,
      'texto',
    ]
    expect(sanitizeLines(dirty)).toEqual([{ id: 'signature', productId: 'signature', optionId: null, qty: 2 }])
    expect(sanitizeLines('no es un arreglo')).toEqual([])
  })
})

describe('precios sin publicar', () => {
  it('deja la línea y el subtotal por confirmar sin inventar una cifra', () => {
    const p = { id: 'box', name: 'Box', price: null, available: true, stock: null, maxPerOrder: 24 }
    const q = { id: 'cookie', name: 'Cookie', price: 4, available: true, stock: null, maxPerOrder: 24 }
    const s = summarize([{ id: 'box', productId: 'box', optionId: null, qty: 2 }, { id: 'cookie', productId: 'cookie', optionId: null, qty: 1 }], { box: p, cookie: q })
    expect(s.items[0].total).toBeNull()
    expect(s.items[1].total).toBe(4)
    expect(s.subtotal).toBeNull()
    expect(s.count).toBe(3)
  })
})
