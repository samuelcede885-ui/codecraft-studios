// Service worker: deja la app abrir sin conexión, carga más rápido y muestra los avisos push.
// Sube CACHE (v2, v3…) cada vez que publiques cambios para que los teléfonos tomen la versión nueva.
const CACHE = "burgershack-panel-v1";
const SHELL = [
  "./",
  "./index.html",
  "./firebase-config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./img/big-smash.webp",
  "./img/doble-smash.webp",
  "./img/holy-cheese-bacon.webp",
  "./img/cheese-burger.webp",
  "./img/cheese-burger-doble.webp",
  "./img/chicken-sandwich.webp",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

const networkFirst = (req, key) =>
  fetch(req)
    .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key || req, copy)); } return res; })
    .catch(() => caches.match(key || req));

const cacheFirst = (req) =>
  caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  }));

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // La página y sus scripts: primero la red (siempre la última versión); sin internet, la copia guardada.
  if (req.mode === "navigate") return e.respondWith(networkFirst(req, "./index.html"));
  if (url.origin === location.origin) {
    if (/\.(js|webmanifest|json)$/.test(url.pathname)) return e.respondWith(networkFirst(req));
    return e.respondWith(cacheFirst(req));
  }
  // Librerías con versión fija (Firebase, QR) y fuentes: la copia guardada.
  if (url.host === "www.gstatic.com" || url.host.includes("fonts.g") || url.host === "cdn.jsdelivr.net") return e.respondWith(cacheFirst(req));
});

// Aviso push de pedido nuevo (lo envía la función onOrderCreated del servidor).
self.addEventListener("push", (e) => {
  let payload = {};
  try { payload = e.data ? e.data.json() : {}; } catch { payload = { notification: { title: "Nuevo pedido", body: e.data?.text() || "" } }; }
  const n = payload.notification || {};
  const d = payload.data || {};
  const title = n.title || d.title || "Nuevo pedido";
  e.waitUntil(self.registration.showNotification(title, {
    body: n.body || d.body || "Abre el panel para verlo",
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: n.tag || "pedido-" + (d.orderId || Date.now()),
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 80, 200, 80, 200],
    data: { orderId: d.orderId || "" },
  }));
});

// Al tocar una notificación de pedido, abre (o enfoca) el panel.
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const win = list[0];
      if (win) { win.focus(); return win.navigate ? win.navigate("./#panel") : null; }
      return self.clients.openWindow("./#panel");
    })
  );
});
