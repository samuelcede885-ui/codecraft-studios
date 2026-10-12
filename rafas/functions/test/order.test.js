const test = require("node:test");
const assert = require("node:assert");
const { buildOrder, restoreStock, parseBcvRate, isOpen } = require("../lib/order");

const catalog = {
  products: [
    { id: "a", name: "Bacon Cloud", price: 11.99, options: ["acomp"] },
    { id: "b", name: "Trufalina", price: 10.99, options: [] },
  ],
  options: { acomp: { title: "¿Papas o aros?", choices: ["Papas", "Aros"] } },
  payMethods: [{ id: "pagomovil", proof: true }, { id: "efectivo", proof: false }, { id: "zelle", proof: true }],
};
const config = { open: true, zones: [{ id: "z1", name: "Centro", fee: 1.5 }], stock: { a: 3 }, rate: 40 };
const draft = (over = {}) => ({
  customer: { name: "Ana Pérez", phone: "0414 123 4567" },
  delivery: { type: "delivery", zoneId: "z1", address: "Calle 1, casa 2", reference: "" },
  payment: { method: "efectivo", ref: "" },
  items: [{ id: "a", qty: 2, choices: ["Papas"] }],
  ...over,
});
const noon = new Date("2026-10-12T16:00:00Z"); // 12:00 en Caracas

test("calcula montos con precios del servidor, no del cliente", () => {
  const { order } = buildOrder(draft({ items: [{ id: "a", qty: 2, choices: ["Papas"], price: 0.01 }] }), config, catalog, noon);
  assert.equal(order.subtotal, 23.98);
  assert.equal(order.fee, 1.5);
  assert.equal(order.total, 25.48);
  assert.equal(order.items[0].price, 11.99);
});

test("usa el precio que cambió el dueño", () => {
  const { order } = buildOrder(draft(), { ...config, prices: { a: 10 } }, catalog, noon);
  assert.equal(order.subtotal, 20);
});

test("descuenta stock y bloquea si no alcanza", () => {
  const r = buildOrder(draft(), config, catalog, noon);
  assert.equal(r.stock.a, 1);
  assert.equal(r.stockApplied, true);
  assert.throws(() => buildOrder(draft({ items: [{ id: "a", qty: 4, choices: ["Papas"] }] }), config, catalog, noon), /Solo quedan 3/);
  assert.throws(() => buildOrder(draft(), { ...config, stock: { a: 0 } }, catalog, noon), /se agotó/);
});

test("productos sin límite no tocan el stock", () => {
  const r = buildOrder(draft({ items: [{ id: "b", qty: 5, choices: [] }] }), config, catalog, noon);
  assert.equal(r.stockApplied, false);
});

test("rechaza opciones inventadas y productos pausados", () => {
  assert.throws(() => buildOrder(draft({ items: [{ id: "a", qty: 1, choices: ["Yuca"] }] }), config, catalog, noon), /Opción no válida/);
  assert.throws(() => buildOrder(draft(), { ...config, soldOut: ["a"] }, catalog, noon), /se agotó/);
});

test("IGTF solo en métodos en divisas", () => {
  const cfg = { ...config, igtf: { enabled: true, pct: 3 } };
  assert.equal(buildOrder(draft(), cfg, catalog, noon).order.igtf, 0.76);
  assert.equal(buildOrder(draft({ payment: { method: "pagomovil", ref: "1" } }), cfg, catalog, noon).order.igtf, 0);
});

test("estado inicial según método y modo automático", () => {
  assert.equal(buildOrder(draft(), config, catalog, noon).order.status, "nuevo");
  assert.equal(buildOrder(draft(), { ...config, auto: { acceptCash: true } }, catalog, noon).order.status, "cocina");
  assert.equal(buildOrder(draft({ payment: { method: "pagomovil", ref: "1" } }), config, catalog, noon).order.status, "verificar");
});

test("horario en hora de Caracas, también pasando la medianoche", () => {
  const cfg = { auto: { schedule: true, openAt: "11:00", closeAt: "23:00" } };
  assert.equal(isOpen(cfg, noon), true);
  assert.equal(isOpen(cfg, new Date("2026-10-12T13:00:00Z")), false); // 9:00 Caracas
  const night = { auto: { schedule: true, openAt: "18:00", closeAt: "02:00" } };
  assert.equal(isOpen(night, new Date("2026-10-13T04:30:00Z")), true); // 00:30 Caracas
  assert.throws(() => buildOrder(draft(), { ...config, ...cfg }, catalog, new Date("2026-10-12T13:00:00Z")), /Abrimos a las 11:00/);
});

test("valida datos del cliente y la entrega", () => {
  assert.throws(() => buildOrder(draft({ customer: { name: "A", phone: "04141234567" } }), config, catalog, noon), /nombre/);
  assert.throws(() => buildOrder(draft({ customer: { name: "Ana", phone: "123" } }), config, catalog, noon), /teléfono/);
  assert.throws(() => buildOrder(draft({ delivery: { type: "delivery", zoneId: "zz", address: "Calle 1, casa 2" } }), config, catalog, noon), /zona/);
});

test("restaurar stock al cancelar", () => {
  assert.deepEqual(restoreStock({ a: 1 }, [{ id: "a", qty: 2 }, { id: "b", qty: 1 }]), { a: 3 });
});

test("lee la tasa del HTML del BCV", () => {
  const html = '<div id="dolar" class="col"><div class="row"><span> USD</span><strong> 182,42190000 </strong></div></div>';
  assert.equal(parseBcvRate(html), 182.4219);
  assert.equal(parseBcvRate("<html></html>"), null);
});
