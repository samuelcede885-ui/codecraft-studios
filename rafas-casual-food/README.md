# Rafa's Casual Food — Web App QSR

App de pedidos para **Rafa's Casual Food** ("Un concepto de locos" by @rafacheff). React 18 + Tailwind CSS 3 + Lucide.

Todo el producto vive en un solo componente: [`src/RafasApp.jsx`](src/RafasApp.jsx).

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ listo para deploy estático
```

## Qué incluye

- Header con selector de sede, switch Delivery / Pick-up, tasa BCV editable y carrito con contador animado.
- Hero tipo carrusel: palabra gigante en morado detrás de la burger, flechas y puntos para cambiar de producto.
- Menú con filtros por categoría, tarjetas con precio en USD y Bs.
- Personalizador: tamaño (Simple/Doble/Triple), extras pagos, ingredientes a quitar, combo, notas y cantidad.
- Checkout como ticket de impresora térmica: Pago Móvil, Zelle, Efectivo/Punto, validación y código de barras.
- Pantalla de éxito con tracking simulado y envío del resumen por WhatsApp a la sede.
- Carrito, sede, modalidad, tasa y datos del cliente guardados en `localStorage`.

## Antes de producción

Reemplazar en `src/RafasApp.jsx` los datos de ejemplo:

- `PAYMENT_INFO`: banco, RIF, teléfono de Pago Móvil y correo de Zelle.
- `CITIES[].whatsapp`: número de WhatsApp de cada sede (formato `58414XXXXXXX`).
- Precios, tasa inicial (`214.35`) y tarifa de delivery (`DELIVERY_FEE`, `FREE_DELIVERY_FROM`).
- Fotos de Fajitas, Papas, Tequeños, Milkshake, Refrescos y Brownie (hoy son ilustraciones con emoji).
