const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions, logger } = require("firebase-functions/v2");
const { defineString } = require("firebase-functions/params");
const admin = require("firebase-admin");
const https = require("node:https");
const crypto = require("node:crypto");
const { buildOrder, restoreStock, parseBcvRate, OrderError } = require("./lib/order");

admin.initializeApp();
const db = admin.firestore();
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

// Código que el dueño escribe la primera vez para quedar como dueño del local.
// Firebase lo pide al hacer `firebase deploy`.
const SETUP_CODE = defineString("SETUP_CODE", { description: "Código secreto para crear la cuenta del dueño (elige uno y guárdalo)" });

const ROLES = ["admin", "caja", "cocina", "delivery"];
const storeRef = (sid) => db.collection("stores").doc(sid);
const validSid = (sid) => typeof sid === "string" && /^[a-z0-9_-]{2,40}$/.test(sid);

async function staffRole(sid, uid) {
  if (!uid) return null;
  const s = await storeRef(sid).collection("staff").doc(uid).get();
  return s.exists ? s.data().role : null;
}
async function requireRole(req, roles) {
  const sid = req.data?.storeId;
  if (!validSid(sid)) throw new HttpsError("invalid-argument", "Local no válido.");
  if (!req.auth) throw new HttpsError("unauthenticated", "Inicia sesión.");
  const role = await staffRole(sid, req.auth.uid);
  if (!role || !roles.includes(role)) throw new HttpsError("permission-denied", "Tu usuario no tiene permiso para esto.");
  return { sid, role };
}

/* ---------- Crear pedido (lo llama la tienda) ---------- */
exports.createOrder = onCall({ enforceAppCheck: false }, async (req) => {
  const sid = req.data?.storeId;
  if (!validSid(sid)) throw new HttpsError("invalid-argument", "Local no válido.");
  if (!req.auth) throw new HttpsError("unauthenticated", "Recarga la página e intenta de nuevo.");
  const uid = req.auth.uid;
  const draft = req.data?.order || {};
  const orders = storeRef(sid).collection("orders");

  // Freno contra abusos: máximo 5 pedidos por cliente cada 10 minutos.
  const recent = await orders.where("customerUid", "==", uid).where("createdAt", ">", Date.now() - 10 * 60000).get();
  if (recent.size >= 5) throw new HttpsError("resource-exhausted", "Hiciste varios pedidos seguidos. Espera unos minutos.");

  // Comprobante: debe estar en la carpeta del propio cliente y existir.
  const receiptPath = typeof req.data?.receiptPath === "string" ? req.data.receiptPath : "";
  if (receiptPath) {
    if (!receiptPath.startsWith(`stores/${sid}/uploads/${uid}/`) || receiptPath.includes("..")) throw new HttpsError("permission-denied", "Comprobante no válido.");
    const [exists] = await admin.storage().bucket(process.env.RECEIPTS_BUCKET || undefined).file(receiptPath).exists();
    if (!exists) throw new HttpsError("failed-precondition", "No recibimos el comprobante. Súbelo otra vez.");
  }

  const ref = orders.doc();
  const cfgRef = storeRef(sid).collection("config").doc("public");
  const catRef = storeRef(sid).collection("config").doc("catalog");
  try {
    const code = await db.runTransaction(async (tx) => {
      const [cfg, cat] = await Promise.all([tx.get(cfgRef), tx.get(catRef)]);
      const { order, stock, stockApplied, needsReceipt } = buildOrder(draft, cfg.data() || {}, cat.data(), new Date());
      if (needsReceipt && !receiptPath) throw new OrderError("invalid-argument", "Falta el capture del comprobante.");
      tx.set(ref, { ...order, customerUid: uid, receiptPath: needsReceipt ? receiptPath : null, hasReceipt: needsReceipt });
      if (stockApplied) tx.set(cfgRef, { stock }, { merge: true });
      return order.code;
    });
    return { id: ref.id, code };
  } catch (e) {
    if (e instanceof OrderError) throw new HttpsError(e.code, e.message);
    logger.error("createOrder", e);
    throw new HttpsError("internal", "No pudimos registrar el pedido. Intenta otra vez.");
  }
});

/* ---------- Al cancelar, devolver el stock ---------- */
exports.onOrderUpdated = onDocumentUpdated("stores/{sid}/orders/{oid}", async (event) => {
  const before = event.data.before.data(), after = event.data.after.data();
  if (!before || !after) return;
  if (before.status === "cancelado" || after.status !== "cancelado" || !after.stockApplied) return;
  const cfgRef = storeRef(event.params.sid).collection("config").doc("public");
  await db.runTransaction(async (tx) => {
    const cfg = await tx.get(cfgRef);
    tx.set(cfgRef, { stock: restoreStock(cfg.data()?.stock, after.items) }, { merge: true });
    tx.update(event.data.after.ref, { stockApplied: false });
  });
});

/* ---------- Aviso push al equipo cuando entra un pedido ---------- */
exports.onOrderCreated = onDocumentCreated("stores/{sid}/orders/{oid}", async (event) => {
  const o = event.data?.data();
  if (!o) return;
  const staff = await storeRef(event.params.sid).collection("staff").get();
  const owners = staff.docs.filter((d) => (d.data().tokens || []).length);
  const tokens = owners.flatMap((d) => d.data().tokens);
  if (!tokens.length) return;
  const where = o.delivery?.type === "delivery" ? o.delivery.zoneName : "Retiro";
  const title = o.hasReceipt ? `Nuevo pedido ${o.code} con comprobante` : `Nuevo pedido ${o.code}`;
  const body = `${o.customer?.name} · ${o.total} · ${where}`;
  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    data: { orderId: event.params.oid, title, body },
    webpush: {
      headers: { Urgency: "high", TTL: "3600" },
      notification: { title, body, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", tag: "pedido-" + event.params.oid, renotify: true, requireInteraction: true },
      fcmOptions: { link: "/#panel" },
    },
  });
  // Limpia los teléfonos que ya no existen.
  const dead = new Set();
  res.responses.forEach((r, i) => { if (!r.success && /registration-token-not-registered|invalid-argument/.test(r.error?.code || "")) dead.add(tokens[i]); });
  if (dead.size) {
    await Promise.all(owners.map((d) => {
      const keep = (d.data().tokens || []).filter((t) => !dead.has(t));
      return keep.length !== d.data().tokens.length ? d.ref.update({ tokens: keep }) : null;
    }));
  }
});

/* ---------- Tasa BCV automática ---------- */
function fetchBcv() {
  return new Promise((resolve, reject) => {
    // bcv.org.ve suele publicar su certificado sin la cadena intermedia completa;
    // solo leemos un número público, así que se acepta en esta única llamada.
    const req = https.get("https://www.bcv.org.ve/", { rejectUnauthorized: false, timeout: 20000, headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let html = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (html += c));
      res.on("end", () => resolve(html));
    });
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
  });
}
async function updateRates(onlySid) {
  const rate = parseBcvRate(await fetchBcv());
  if (!rate) throw new Error("No se encontró la tasa en bcv.org.ve");
  const snap = await db.collectionGroup("config").where("autoRate", "==", true).get();
  const targets = snap.docs.filter((d) => d.id === "public" && (!onlySid || d.ref.parent.parent.id === onlySid));
  await Promise.all(targets.map((d) => d.ref.set({ rate, rateUpdatedAt: Date.now(), rateSource: "BCV" }, { merge: true })));
  return rate;
}
exports.bcvRateDaily = onSchedule({ schedule: "0 7,13,17 * * *", timeZone: "America/Caracas" }, async () => {
  const rate = await updateRates();
  logger.info("Tasa BCV actualizada", rate);
});
exports.refreshRate = onCall(async (req) => {
  const { sid } = await requireRole(req, ["owner", "admin"]);
  await storeRef(sid).collection("config").doc("public").set({ autoRate: true }, { merge: true });
  try { return { rate: await updateRates(sid) }; }
  catch (e) { logger.warn("refreshRate", e); throw new HttpsError("unavailable", "No pudimos leer la tasa del BCV ahora. Intenta más tarde o escríbela a mano."); }
});

/* ---------- Dueño y equipo ---------- */
exports.claimOwner = onCall(async (req) => {
  const sid = req.data?.storeId;
  if (!validSid(sid)) throw new HttpsError("invalid-argument", "Local no válido.");
  if (!req.auth || req.auth.token.firebase?.sign_in_provider !== "password") throw new HttpsError("unauthenticated", "Crea tu cuenta con correo y contraseña.");
  const expected = SETUP_CODE.value();
  const given = String(req.data?.setupCode || "");
  const ok = expected && given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) throw new HttpsError("permission-denied", "El código de configuración no es correcto.");
  const staffCol = storeRef(sid).collection("staff");
  return db.runTransaction(async (tx) => {
    const owners = await tx.get(staffCol.where("role", "==", "owner").limit(1));
    if (!owners.empty && owners.docs[0].id !== req.auth.uid) throw new HttpsError("already-exists", "Este local ya tiene dueño. Pídele que te agregue al equipo.");
    tx.set(staffCol.doc(req.auth.uid), { role: "owner", email: req.auth.token.email || "", name: "Dueño", createdAt: Date.now(), tokens: [] }, { merge: true });
    return { role: "owner" };
  });
});

exports.addStaff = onCall(async (req) => {
  const { sid, role: myRole } = await requireRole(req, ["owner", "admin"]);
  const email = String(req.data?.email || "").trim().toLowerCase();
  const password = String(req.data?.password || "");
  const name = String(req.data?.name || "").trim().slice(0, 60) || email;
  const role = req.data?.role;
  if (!ROLES.includes(role)) throw new HttpsError("invalid-argument", "Rol no válido.");
  if (role === "admin" && myRole !== "owner") throw new HttpsError("permission-denied", "Solo el dueño puede crear administradores.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new HttpsError("invalid-argument", "Correo no válido.");
  let user;
  try { user = await admin.auth().getUserByEmail(email); }
  catch {
    if (password.length < 6) throw new HttpsError("invalid-argument", "La contraseña debe tener al menos 6 caracteres.");
    user = await admin.auth().createUser({ email, password, displayName: name });
  }
  const existing = await staffRole(sid, user.uid);
  if (existing === "owner") throw new HttpsError("failed-precondition", "Ese usuario es el dueño.");
  await storeRef(sid).collection("staff").doc(user.uid).set({ role, email, name, createdAt: Date.now(), tokens: [] }, { merge: true });
  return { uid: user.uid };
});

exports.removeStaff = onCall(async (req) => {
  const { sid, role: myRole } = await requireRole(req, ["owner", "admin"]);
  const uid = String(req.data?.uid || "");
  const target = await staffRole(sid, uid);
  if (!target) return { ok: true };
  if (target === "owner") throw new HttpsError("failed-precondition", "No se puede quitar al dueño.");
  if (target === "admin" && myRole !== "owner") throw new HttpsError("permission-denied", "Solo el dueño puede quitar administradores.");
  await storeRef(sid).collection("staff").doc(uid).delete();
  return { ok: true };
});
