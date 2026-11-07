# Punkie's Burger — web oficial

Web de pedidos de **Punkie's Burger**, smash burgers en Chacao, Caracas.
Traduce a la web la identidad que la marca ya usa en Instagram (sin rediseñarla) e incluye menú, ficha de producto, carrito y checkout funcionales.

> Antes de publicar, revisa **[PENDIENTES.md](./PENDIENTES.md)**: precios, WhatsApp oficial, horario y coordenadas no estaban en el material y no se inventaron.
> Abre el sitio con `?revision` para verlos marcados en pantalla.

## Comandos

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # verifica tipos y genera dist/ (sitio estático)
npm run preview    # sirve dist/ en http://localhost:4173
npm test           # pruebas unitarias (carrito, horario, validación, mensaje, especiales)
npm run e2e        # prueba de punta a punta con Playwright (requiere `npm run preview` corriendo)
npm run fotos      # regenera las fotos web desde /fotos
node scripts/generar-og.mjs   # regenera og-image.jpg y apple-touch-icon.png
```

## Stack

React 19, TypeScript, Vite y Tailwind CSS v4. GSAP ScrollTrigger se carga bajo demanda, solo en escritorio y solo si el usuario no pidió reducir el movimiento.
Fuentes servidas desde el propio sitio: Inter Variable (Display) y JetBrains Mono.

- **Sin Framer Motion**: las animaciones de diálogos, carrito, avisos y barra móvil son CSS con un hook de 30 líneas (`usePresence`). Así el JS principal bajó de 136 KB a 103 KB gzip, porque la mayoría de las visitas llegan desde Instagram por datos móviles.
- **Sin smooth-scroll (Lenis)**: el brief pide evitar el "scroll artificialmente lento".

## Estructura

```
src/
  config/site.ts         ← datos del local y canal de pedidos (WhatsApp, delivery, horario, mapa)
  data/menu.ts           ← carta editable (precios null = por confirmar)
  data/photos.ts         ← registro de fotos con texto alternativo y procedencia
  lib/                   ← lógica pura y probada: carrito, horario, validación, mensaje de pedido
  state/                 ← contexto del carrito (persistido en localStorage) y de la UI
  components/
    brand/               ← firma y tres estrellas (SVG calcado), sello, patrón, ticket
    layout/              ← header fijo con menú móvil y footer
    sections/            ← hero, cinta, menú, experiencia, especiales, universo, ubicación
    order/               ← ficha de producto, carrito y checkout, barra móvil, avisos
  styles/index.css       ← tokens de marca (@theme), tokens de movimiento --pm-*, utilidades
fotos/                   ← fotos maestras recortadas del material del cliente
public/img/              ← versiones web generadas (WebP responsive)
DESIGN.md                ← sistema de diseño (colores, tipografía, componentes, movimiento)
PENDIENTES.md            ← datos que faltan confirmar con Punkie's
```

## Editar la carta

En `src/data/menu.ts` cada producto es un bloque. Para poner precio:

```ts
price: 8.5,                                   // producto sin opciones
options: { label: 'Tamaño', choices: [
  { id: 'simple', label: 'Simple', price: 7 },
  { id: 'doble',  label: 'Doble',  price: 9.5 },
]},
```

- `status: 'terminado'` saca un producto del pedido. Si es un especial, pasa al archivo.
- `photos: []` muestra la tarjeta con el patrón de la marca, sin foto falsa.

## Flujo de pedido

1. Tarjeta "+" o ficha de producto (opciones y cantidad).
2. Carrito: cambiar cantidades, quitar productos, ver subtotal. Si faltan precios dice "Por confirmar" y no calcula un total falso.
3. Tus datos: delivery o retiro en el local, nombre, teléfono (validado para Venezuela o con prefijo internacional), dirección si es delivery, observaciones.
4. Confirmar: resumen tipo ticket.
   - Con `whatsappNumber` configurado: botón "Enviar por WhatsApp" con el mensaje ya armado.
   - Sin configurar: aviso claro de que el pedido **no se envió**, botón "Copiar pedido" y enlace a Instagram.

## Verificación hecha

- `npm test`: 17 pruebas unitarias y de componentes.
- `npm run e2e`: 24 comprobaciones en Chromium, con estos resultados:
  - Carga sin errores.
  - Sin desbordamiento horizontal a 1440, 1280, 1024, 768, 390 y 360 px.
  - Añadir sin opciones y con opciones; cantidad; Escape y foco devuelto.
  - Carrito: subtotal honesto, cambiar cantidad, quitar.
  - Validación accesible; checkout completo; no existe enlace a WhatsApp sin número.
  - El texto copiado es el pedido real; persistencia al recargar.
  - Modo `?revision`; primer Tab en "Saltar al menú".
  - Menú móvil; barra "Ver pedido"; ficha como hoja inferior; objetivos táctiles ≥ 40 px.
  - Reduced motion.
- No se probó en Safari/iOS ni en dispositivos físicos, ni se midió rendimiento en hardware de gama baja.
