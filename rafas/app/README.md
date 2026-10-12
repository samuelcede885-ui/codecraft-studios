# Rafa's — Tienda + Panel del dueño

Un solo archivo (`index.html`) con dos caras:

- **Tienda** (`index.html`): menú, carrito y checkout con datos de entrega, zona, método de pago y foto del comprobante. Después de pagar, el cliente ve el estado de su pedido en vivo.
- **Panel del dueño** (`index.html#panel`): lo que usa el local.

## Qué trae el panel

| Sección | Para qué sirve |
|---|---|
| **Pedidos** | Lista en vivo con filtros por estado, búsqueda y resumen del día (ventas, pedidos, por verificar, en camino). |
| **Detalle del pedido** | Foto del comprobante (se amplía al tocarla), botones *Pago correcto* / *Rechazar*, datos del cliente, dirección con mapa, productos, total en REF y Bs, repartidor e historial. |
| **Cocina** | Tarjetas grandes con lo que hay que preparar y cronómetro; se pone en rojo si pasa la meta de minutos. |
| **Delivery** | Pedidos listos para despachar, asignación de repartidor, pedidos en la calle y estado de cada repartidor. |
| **Alertas** (campana o Más › Alertas) | Al abrir el panel aparece “Activar notificaciones” (el navegador exige un toque). Desde ahí cada pedido y cada comprobante suena, vibra y muestra un aviso arriba; puede repetir el sonido cada 15 s hasta que se abra el pedido, mantener la pantalla encendida y, en la app instalada, mandar el aviso del sistema aunque estés en otra app. |
| **Etiquetas** | Etiqueta para el paquete (58 u 80 mm) con número de pedido, cliente, teléfono, dirección, referencia, productos, total, si se cobra o ya está pagado y un QR que abre la dirección en Google Maps. Se pueden imprimir una o todas las listas. |
| **Métricas** | Pestaña propia con rangos Hoy, Ayer, 7 días, 30 días y Todo: ventas, pedidos, ticket promedio y clientes (nuevos y que repiten) comparados con el periodo anterior; tiempo en cocina, de entrega y total; cancelaciones y pagos rechazados; ventas por hora o por día; productos (y cuáles no se vendieron), métodos de pago, zonas, días de la semana y repartidores. Exporta la tabla para Excel. |
| **Inventario** | Stock por producto con botones −/+/+10, “Sin límite” para lo que no se cuenta, aviso de poco stock (umbral configurable), pausar un producto y cambiar precios. Cada pedido descuenta el stock, cada cancelación lo devuelve, y en 0 la tienda lo muestra “Agotado” y no deja comprarlo. |
| **Clientes** | Quién compra más, cuántos pedidos lleva y acceso directo a WhatsApp. |
| **Automático** | Aceptar solos los pedidos en efectivo (van directo a cocina aunque el panel esté cerrado), abrir y cerrar la tienda por horario, e imprimir la etiqueta sola al marcar listo. |
| **Ajustes** | Abrir/cerrar el local, tasa del día, meta de cocina, ancho de etiqueta, zonas con su costo, repartidores y datos de pago que ve el cliente. |

Desde el pedido también se manda un **WhatsApp al cliente** con el mensaje según el estado, y al **repartidor** con la dirección y el link del mapa.

## Instalar la app en el teléfono

El panel es una app instalable (PWA): `manifest.webmanifest`, `sw.js` e `icons/`.

1. La carpeta `rafas/` tiene que estar en un sitio con `https://` (las apps instalables no funcionan desde un archivo local).
2. Abre `https://<tu-sitio>/app/#panel` en el teléfono del local.
3. **Android (Chrome):** Más › Ajustes › *Instalar app*, o el menú ⋮ › *Instalar app*.
   **iPhone (Safari):** Compartir › *Agregar a inicio*.
4. Queda el ícono “Rafa's” en la pantalla de inicio; abre directo en el panel, a pantalla completa y sin barra del navegador.

Cada vez que publiques cambios, sube el número de `CACHE` en `sw.js` (`rafas-panel-v2`, `v3`…) para que los teléfonos descarguen la versión nueva.

## Cómo se conecta hoy

`Backend` (dentro del `<script>`) guarda en `localStorage` y sincroniza entre pestañas: abre la tienda en una pestaña y `#panel` en otra para probarlo. Arranca vacía: no trae pedidos ni cifras de ejemplo.

## Para dárselo al dueño (producción)

1. **Servidor**: cambiar los métodos de `Backend` (`addOrder`, `updateOrder`, `setReceipt`, `onOrders`, `onSettings`…) por Firebase Firestore o Supabase. La interfaz no cambia.
2. **Comprobantes**: guardarlos en Firebase Storage / Supabase Storage en vez de dentro del pedido.
3. **Acceso**: el panel debe ir detrás de un login (solo el dueño y su personal).
4. **App instalable**: agregar `manifest.json` y un service worker para instalarla como app (PWA) en el teléfono o tablet del local. Si la quieren en Play Store, se empaqueta con Capacitor.
5. **Notificaciones push**: Firebase Cloud Messaging, para que suene aunque la app esté cerrada.
6. **Impresora térmica**: el botón *Imprimir* ya usa el diálogo del sistema (sirve con impresoras USB/Wi-Fi). Para Bluetooth en Android, la app RawBT recibe la etiqueta directo.
