// Service worker: deja la app abrir sin conexión y carga más rápido.
// Sube CACHE (v2, v3…) cada vez que publiques cambios para que los teléfonos tomen la versión nueva.
const CACHE = "rafas-panel-v4";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "../img/bacon-cloud.webp",
  "../img/la-mentirosa.webp",
  "../img/la-cabrona.webp",
  "../img/trufalina-chicken.webp",
  "../img/la-antiburger.webp",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // La página: primero la red (para tener siempre la última versión), si no hay internet, la copia guardada.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); return res; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }
  // Imágenes, íconos y fuentes: primero la copia guardada.
  if (url.origin === location.origin || url.host.includes("fonts.g") || url.host.includes("jsdelivr")) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});

// Al tocar una notificación de pedido, abre (o enfoca) el panel.
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const win = list.find((c) => c.url.includes("/app/"));
      if (win) { win.focus(); return win.navigate ? win.navigate("./#panel") : null; }
      return self.clients.openWindow("./#panel");
    })
  );
});
