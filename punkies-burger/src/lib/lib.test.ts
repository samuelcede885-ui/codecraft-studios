import { describe, expect, it } from 'vitest';
import { cartReducer, emptyCart, lineKey, sanitize, summarize, MAX_QTY } from './cart';
import { getOpenStatus, formatHour } from './hours';
import { isValidPhone, validateCheckout, type CheckoutForm } from './validation';
import { buildOrderMessage } from './order';
import { site } from '../config/site';

const add = (productId: string, choiceId: string | null, qty = 1) =>
  ({ type: 'add', productId, choiceId, qty }) as const;

describe('carrito', () => {
  it('agrega, acumula y separa por opción', () => {
    let s = cartReducer(emptyCart, add('la-clasica', 'individual'));
    s = cartReducer(s, add('la-clasica', 'individual', 2));
    s = cartReducer(s, add('la-clasica', 'combo'));
    expect(s.lines).toHaveLength(2);
    expect(s.lines.find((l) => l.key === lineKey('la-clasica', 'individual'))?.qty).toBe(3);
  });

  it('rechaza productos inexistentes, terminados u opciones inválidas', () => {
    expect(cartReducer(emptyCart, add('no-existe', null)).lines).toHaveLength(0);
    expect(cartReducer(emptyCart, add('especial-septiembre', null)).lines).toHaveLength(0);
    expect(cartReducer(emptyCart, add('la-clasica', null)).lines).toHaveLength(0);
    expect(cartReducer(emptyCart, add('cheeseburger', 'triple')).lines).toHaveLength(0);
  });

  it('modifica cantidades con límites y elimina en cero', () => {
    let s = cartReducer(emptyCart, add('papas-sazonadas', null));
    s = cartReducer(s, { type: 'setQty', key: 'papas-sazonadas', qty: 99 });
    expect(s.lines[0].qty).toBe(MAX_QTY);
    s = cartReducer(s, { type: 'setQty', key: 'papas-sazonadas', qty: 0 });
    expect(s.lines).toHaveLength(0);
  });

  it('limpia datos guardados corruptos', () => {
    const raw = { lines: [{ productId: 'la-clasica', choiceId: 'combo', qty: '2' }, { productId: 'x', qty: 1 }, null] };
    expect(sanitize(raw).lines).toEqual([{ key: 'la-clasica::combo', productId: 'la-clasica', choiceId: 'combo', qty: 2 }]);
    expect(sanitize('basura')).toEqual(emptyCart);
  });

  it('no inventa subtotal cuando faltan precios', () => {
    const s = cartReducer(emptyCart, add('papas-sazonadas', null, 2));
    const sum = summarize(s);
    expect(sum.itemCount).toBe(2);
    expect(sum.subtotalComplete).toBe(false);
    expect(sum.knownSubtotal).toBe(0);
  });
});

describe('horario (hora de Caracas)', () => {
  const at = (iso: string) => getOpenStatus(new Date(iso), site.hours, site.timeZone);
  it('lunes 13:00 VET abierto hasta las 9 p. m.', () => {
    expect(at('2026-11-09T17:00:00Z')).toEqual({ open: true, label: 'Abierto ahora · hasta las 9 p. m.' });
  });
  it('viernes 22:30 VET sigue abierto (cierra 11 p. m.)', () => {
    expect(at('2026-11-14T02:30:00Z').open).toBe(true);
  });
  it('miércoles 21:30 VET cerrado, abre mañana', () => {
    expect(at('2026-11-12T01:30:00Z').label).toBe('Cerrado · abre mañana a las 12 p. m.');
  });
  it('martes 10:00 VET cerrado, abre hoy', () => {
    expect(at('2026-11-10T14:00:00Z').label).toBe('Cerrado · abre hoy a las 12 p. m.');
  });
  it('formatea horas', () => {
    expect(formatHour('23:00')).toBe('11 p. m.');
    expect(formatHour('12:30')).toBe('12:30 p. m.');
  });
});

describe('validación del checkout', () => {
  const base: CheckoutForm = { mode: 'retiro', name: 'Ana', phone: '0414 123 4567', address: '', reference: '', notes: '' };
  it('acepta teléfonos venezolanos e internacionales', () => {
    for (const p of ['0414-123-4567', '04121234567', '+58 424 1234567', '0212 555 1234', '4141234567', '+1 305 555 0101'])
      expect(isValidPhone(p), p).toBe(true);
    for (const p of ['123', '0414 123', '+58 999 1234567', '0814 123 4567']) expect(isValidPhone(p), p).toBe(false);
  });
  it('pide dirección solo para delivery', () => {
    expect(validateCheckout(base)).toEqual({});
    expect(validateCheckout({ ...base, mode: 'delivery' }).address).toBeTruthy();
  });
});

describe('mensaje del pedido', () => {
  it('lista productos, marca precios por confirmar e incluye datos del cliente', () => {
    let s = cartReducer(emptyCart, add('la-clasica', 'combo', 2));
    s = cartReducer(s, add('papas-sazonadas', null));
    const msg = buildOrderMessage(summarize(s), {
      mode: 'delivery', name: 'Ana', phone: '0414 123 4567', address: 'Av. Principal, Edif. Sol, apto 3', reference: 'Frente a la plaza', notes: 'Sin cebolla',
    });
    expect(msg).toContain('• 2 × La Clásica (En combo) — precio por confirmar');
    expect(msg).toContain('Subtotal: por confirmar');
    expect(msg).toContain('Entrega: Delivery');
    expect(msg).toContain('Dirección: Av. Principal, Edif. Sol, apto 3');
    expect(msg).toContain('Observaciones: Sin cebolla');
    expect(msg).not.toMatch(/\$\d/);
  });
});

describe('enlace de WhatsApp', () => {
  it('no existe mientras no haya número oficial configurado', async () => {
    const { whatsappUrl, site: cfg } = await import('../config/site');
    expect(cfg.ordering.whatsappNumber).toBeNull();
    expect(whatsappUrl('hola')).toBeNull();
  });
  it('arma wa.me con el mensaje codificado cuando se configura', async () => {
    const { whatsappUrl, site: cfg } = await import('../config/site');
    const ordering = cfg.ordering as { whatsappNumber: string | null };
    ordering.whatsappNumber = '+58 414-000-0000';
    try {
      expect(whatsappUrl('Pedido: 1 × La Clásica')).toBe('https://wa.me/584140000000?text=Pedido%3A%201%20%C3%97%20La%20Cl%C3%A1sica');
    } finally {
      ordering.whatsappNumber = null;
    }
  });
});
