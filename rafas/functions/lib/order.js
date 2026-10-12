// Lógica pura del pedido: valida lo que manda el cliente y calcula los montos
// con los precios, el stock y las reglas guardados por el dueño. No confía en
// ningún número que venga del teléfono del cliente.

const MAX_QTY = 20;
const DEFAULT_IGTF_METHODS = ["efectivo", "zelle", "binance"];

class OrderError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const round2 = (n) => Math.round(n * 100) / 100;
const str = (v, max) => String(v ?? "").trim().slice(0, max);
const digits = (v) => String(v ?? "").replace(/\D/g, "");

// Hora actual de Caracas en minutos desde la medianoche.
function caracasMinutes(now) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Caracas", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour").value);
  const m = Number(parts.find((p) => p.type === "minute").value);
  return h * 60 + m;
}

function isOpen(config, now) {
  if (config.open === false) return false;
  const a = config.auto || {};
  if (!a.schedule) return true;
  const toMin = (t) => { const [h, m] = String(t || "0:0").split(":").map(Number); return (h || 0) * 60 + (m || 0); };
  const cur = caracasMinutes(now), o = toMin(a.openAt), c = toMin(a.closeAt);
  return o <= c ? cur >= o && cur < c : cur >= o || cur < c;
}

function codeFor(t) {
  return "#" + (Math.floor(t / 1000) % 1679616).toString(36).toUpperCase().padStart(4, "0");
}

/**
 * @param {object} draft   lo que manda el cliente
 * @param {object} config  stores/{id}/config/public
 * @param {object} catalog stores/{id}/config/catalog
 * @param {Date}   now
 * @returns {{order: object, stock: object, stockApplied: boolean, needsReceipt: boolean}}
 */
function buildOrder(draft, config, catalog, now = new Date()) {
  if (!catalog || !Array.isArray(catalog.products) || !catalog.products.length) {
    throw new OrderError("failed-precondition", "La tienda todavía no está configurada. El dueño debe entrar al panel una vez.");
  }
  config = config || {};
  if (!isOpen(config, now)) {
    const a = config.auto || {};
    throw new OrderError("failed-precondition", a.schedule && config.open !== false ? `Estamos cerrados. Abrimos a las ${a.openAt}.` : "El local está cerrado ahora.");
  }

  // Cliente
  const name = str(draft?.customer?.name, 80);
  const phone = str(draft?.customer?.phone, 30);
  if (name.length < 3) throw new OrderError("invalid-argument", "Falta tu nombre.");
  if (digits(phone).length < 10) throw new OrderError("invalid-argument", "Falta un teléfono válido.");

  // Productos
  const items = Array.isArray(draft?.items) ? draft.items : [];
  if (!items.length || items.length > 30) throw new OrderError("invalid-argument", "El carrito está vacío.");
  const products = Object.fromEntries(catalog.products.map((p) => [p.id, p]));
  const options = catalog.options || {};
  const prices = config.prices || {};
  const soldOut = new Set(config.soldOut || []);
  const stock = { ...(config.stock || {}) };
  const want = {};
  const lines = items.map((it) => {
    const p = products[it?.id];
    if (!p) throw new OrderError("invalid-argument", "Uno de los productos ya no existe. Actualiza la página.");
    const qty = Number(it.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new OrderError("invalid-argument", `Cantidad no válida para ${p.name}.`);
    if (soldOut.has(p.id)) throw new OrderError("failed-precondition", `${p.name} se agotó.`);
    const keys = p.options || [];
    const choices = Array.isArray(it.choices) ? it.choices.map((c) => str(c, 40)) : [];
    if (choices.length !== keys.length) throw new OrderError("invalid-argument", `Elige las opciones de ${p.name}.`);
    keys.forEach((k, i) => {
      const allowed = options[k]?.choices || [];
      if (!allowed.includes(choices[i])) throw new OrderError("invalid-argument", `Opción no válida para ${p.name}.`);
    });
    const override = prices[p.id];
    const price = override != null && override !== "" ? Number(override) : Number(p.price);
    if (!(price >= 0)) throw new OrderError("failed-precondition", `${p.name} no tiene precio.`);
    want[p.id] = (want[p.id] || 0) + qty;
    return { id: p.id, name: p.name, price: round2(price), qty, choices };
  });

  // Stock
  let stockApplied = false;
  for (const [id, q] of Object.entries(want)) {
    if (stock[id] == null || stock[id] === "") continue;
    const have = Math.max(0, Number(stock[id]) || 0);
    if (have < q) throw new OrderError("failed-precondition", have ? `Solo quedan ${have} de ${products[id].name}. Ajusta tu carrito.` : `${products[id].name} se agotó.`);
    stock[id] = have - q;
    stockApplied = true;
  }

  // Entrega
  let delivery;
  if (draft?.delivery?.type === "delivery") {
    const zone = (config.zones || []).find((z) => z.id === draft.delivery.zoneId);
    if (!zone) throw new OrderError("invalid-argument", "Elige tu zona de delivery.");
    const address = str(draft.delivery.address, 200);
    if (address.length < 6) throw new OrderError("invalid-argument", "Falta la dirección.");
    delivery = { type: "delivery", zoneId: zone.id, zoneName: zone.name, address, reference: str(draft.delivery.reference, 200), fee: round2(Number(zone.fee) || 0) };
  } else {
    delivery = { type: "pickup", fee: 0 };
  }

  // Pago
  const methods = catalog.payMethods || [];
  const method = methods.find((m) => m.id === draft?.payment?.method);
  if (!method) throw new OrderError("invalid-argument", "Elige un método de pago.");

  const subtotal = round2(lines.reduce((n, l) => n + l.price * l.qty, 0));
  const fee = delivery.fee;
  delete delivery.fee;
  const igtfCfg = config.igtf || {};
  const igtfMethods = igtfCfg.methods || DEFAULT_IGTF_METHODS;
  const igtf = igtfCfg.enabled && igtfMethods.includes(method.id) ? round2((subtotal + fee) * (Number(igtfCfg.pct ?? 3) / 100)) : 0;
  const total = round2(subtotal + fee + igtf);

  const createdAt = now.getTime();
  const auto = config.auto || {};
  const status = method.proof ? "verificar" : auto.acceptCash ? "cocina" : "nuevo";
  const timeline = [{ at: createdAt, type: "created" }];
  if (method.proof) timeline.push({ at: createdAt + 1, type: "receipt" });
  else if (auto.acceptCash) timeline.push({ at: createdAt + 1, type: "status", status: "cocina", auto: true });

  const order = {
    code: codeFor(createdAt),
    createdAt,
    status,
    example: false,
    customer: { name, phone },
    delivery,
    items: lines,
    subtotal,
    fee,
    igtf,
    total,
    rate: Number(config.rate) || 0,
    payment: { method: method.id, ref: method.proof ? str(draft?.payment?.ref, 30) : "", status: method.proof ? "pending" : "cash" },
    hasReceipt: !!method.proof,
    notes: str(draft?.notes, 300),
    driverId: null,
    timeline,
    stockApplied,
  };
  return { order, stock, stockApplied, needsReceipt: !!method.proof };
}

// Devuelve el stock tras sumar de vuelta las unidades de un pedido cancelado.
function restoreStock(stock, items) {
  const next = { ...(stock || {}) };
  for (const i of items || []) {
    if (next[i.id] != null && next[i.id] !== "") next[i.id] = (Number(next[i.id]) || 0) + i.qty;
  }
  return next;
}

// Extrae la tasa oficial del dólar del HTML de bcv.org.ve.
function parseBcvRate(html) {
  const m = /id=["']dolar["'][\s\S]*?<strong>\s*([\d.,]+)\s*<\/strong>/i.exec(html || "");
  if (!m) return null;
  const n = Number(m[1].replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  return n > 0 && n < 1e7 ? Math.round(n * 1e4) / 1e4 : null;
}

module.exports = { buildOrder, restoreStock, parseBcvRate, isOpen, caracasMinutes, codeFor, OrderError, round2 };
