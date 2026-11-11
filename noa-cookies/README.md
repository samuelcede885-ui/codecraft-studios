# NOA Cookies — tienda web

E-commerce de una sola página para NOA Cookies (Valle Arriba, Caracas): un hero
interactivo con las cinco cookies, catálogo de compra directa, sección destacada
y un pedido que se arma en la web y se envía por WhatsApp.

> **Estado: propuesta de diseño.** Sitio no oficial, pendiente de aprobación de la
> marca. Mientras `site.preview` sea `true`, el footer lo dice y la página lleva
> `noindex` para que los buscadores no la tomen por la web de NOA.

## Ponerlo en marcha

```bash
npm install
npm run dev        # desarrollo, http://localhost:5173
npm run build      # genera dist/ (HTML, CSS, JS e imágenes estáticos)
npm run preview    # sirve dist/ en http://localhost:4173
npm test           # 30 pruebas unitarias (carrito, pedido, validación)
npm run test:e2e   # 67 comprobaciones del flujo de compra en escritorio y móvil
                   # (requiere Playwright y `npm run preview` activo)
```

Requiere Node 20 o superior. `dist/` es estático y usa rutas relativas: se puede
subir tal cual a cualquier hosting (Netlify, Vercel, GitHub Pages, un bucket).

## Qué se edita y dónde

| Quiero… | Archivo |
| --- | --- |
| Cambiar un precio, nombre o descripción | `src/data/catalog.js` |
| Marcar un producto como agotado | `available: false` en su entrada de `src/data/catalog.js` |
| Limitar unidades (stock o tope por pedido) | `stock` / `maxPerOrder` en `src/data/catalog.js` |
| Añadir un producto | Fotos en `public/img/products/`, entrada en `src/data/images.json` y en `src/data/catalog.js` |
| Publicar el sabor del mes | `featured.monthly` en `src/data/catalog.js` |
| Poner el número de WhatsApp, costo de delivery, métodos de pago, horarios, dirección | `src/config/site.js` |
| Cambiar el color o el titular de una cookie en el hero | `hero` del producto en `src/data/catalog.js` y `src/data/themes.js` |
| Quitar el aviso de propuesta y permitir indexación | `preview: false` en `src/config/site.js` |

Todo lo que en `src/config/site.js` está en `null`, `''` o `[]` es un dato que la
marca aún no confirmó: la interfaz lo omite o lo muestra como "por confirmar".

## Cómo funciona la compra

1. **Añadir.** Un toque en "+" (catálogo) o en "Añadir al pedido" (hero). El "+"
   se convierte en contador y el pedido se actualiza al instante.
2. **Revisar.** El pedido se abre como panel lateral (escritorio) u hoja inferior
   (móvil), sin cambiar de página. Ahí se ajustan cantidades.
3. **Datos y envío.** Nombre, teléfono, pick-up o delivery (dirección solo si es
   delivery). Sin registro.

El pedido se guarda en `localStorage`, así que sobrevive a una recarga.

### Qué es real hoy y qué necesita integración

| Función | Hoy | Para completarla |
| --- | --- | --- |
| Catálogo y precios | Reales, copiados del menú de NOA en Instagram | — |
| Envío del pedido | Se arma el mensaje y se abre WhatsApp. La web **no** da el pedido por confirmado: lo confirma NOA en el chat | Poner el número en `ordering.whatsapp.number`. Sin él solo se puede abrir el enlace público `wa.link/mtx8ts` y el cliente pega el pedido (la web se lo copia) |
| Pago | Se coordina por WhatsApp. No hay cobro en la web | Definir `payment.methods`, o integrar una pasarela en `src/services/orders.js` |
| Costo de delivery | "Por confirmar": no se inventa un total | `fulfillment.delivery.fee` (monto fijo) o cálculo por zona en el backend |
| Disponibilidad y stock | Manual, en `catalog.js` | `ordering.api.availabilityEndpoint`: la web lo consulta al cargar y superpone `{ available, stock }` |
| Registro de pedidos y número de pedido | No existe | `ordering.provider = 'api'` y `ordering.api.ordersEndpoint`: la web hace `POST` y muestra el `orderNumber` que devuelva el servidor |
| Ingredientes y alérgenos | Solo lo que dice el menú, con aviso de que la lista oficial está pendiente | `info.ingredients` e `info.allergens` de cada producto |

Contrato del backend (cuando exista):

```
GET  availabilityEndpoint → { "signature": { "available": true, "stock": 12 }, … }
POST ordersEndpoint       ← pedido (items, subtotal, entrega, cliente, pago)
                          → { "orderNumber": "A-1042" }
```

## Datos pendientes de NOA

- Número de WhatsApp para pedidos (hoy solo se conoce el enlace corto de la bio).
- Moneda: el menú muestra los precios sin símbolo (`4.00`); se asumió dólares (`$`).
- Si el topping del NOA Roll tiene costo adicional.
- Métodos de pago, costo o zonas de delivery, horarios y dirección exacta.
- Sabor del mes vigente.
- Lista oficial de ingredientes y alérgenos.
- Fotografías originales y logotipo en vector.

## Fotos: provisionales

No había archivos originales, así que las fotos salen de las capturas del menú
público de @noacookies: se recortaron, se ampliaron ×4 con Real-ESRGAN y se les
quitó el fondo (scripts en `tools/fotos-provisionales/`). Son los productos
reales de la marca, pero su nitidez es reconstruida. Para sustituirlas basta
reemplazar los archivos de `public/img/` con el mismo nombre y actualizar ancho
y alto en `src/data/images.json`.

## Sin logotipo

El sitio no usa el logo de NOA Cookies. La cabecera y el footer muestran el
nombre de la marca en texto, y el icono del sitio es una cookie sobre azul.
Cuando la marca entregue su logotipo en vector, se añade en
`src/components/Header.jsx` y `src/components/Footer.jsx`.

Las migas flotantes del hero también se generan a partir de esas fotos (textura
de cada cookie y de su relleno), para que correspondan al producto real.

## Estructura

```
index.html               Plantilla (el plugin completa <head> y la foto inicial)
build/noa-html.js        JSON-LD del menú, foto inicial en el HTML, noindex en preview
src/config/site.js       Datos del negocio y de la operación
src/data/                Catálogo, tamaños de imagen y escenas de color del hero
src/services/            Disponibilidad (catalog.js) y envío del pedido (orders.js)
src/store/               Pedido (cart.js + reglas puras en cartLogic.js) e interfaz (ui.js)
src/lib/motion.js        GSAP, ScrollTrigger y Lenis: un solo sistema de movimiento
src/components/          hero/, catalog/, cart/, ui/ y secciones
src/styles/              Tokens de marca y estilos por pieza
tests/                   unit/ (Vitest) y e2e/ (Playwright)
DESIGN.md                Sistema de diseño: color, tipografía, componentes, movimiento
```

## Movimiento, accesibilidad y rendimiento

- **Un momento coreografiado:** el cambio de sabor del hero (la cookie sale
  rodando, el color nuevo crece desde el centro, entra la siguiente). El resto
  del movimiento responde a acciones: añadir, abrir, cerrar.
- Solo se animan `transform` y `opacity`. Las animaciones en bucle se pausan
  fuera de pantalla y hay menos capas en equipos modestos.
- Con **"reducir movimiento"** del sistema: cambios inmediatos, sin scroll suave,
  sin vuelo al carrito y sin bucles.
- El botón de compra funciona desde el primer fotograma: ninguna animación lo
  retrasa.
- Teclado: flechas ← → cambian de sabor, Tab recorre todo, Escape cierra paneles
  y el foco vuelve al botón que los abrió.
- La primera foto del hero viaja dentro del HTML y se pinta sin esperar al
  JavaScript; el resto de escenas se carga después. Lo que está bajo el pliegue
  se renderiza en segundo plano para que el botón de compra responda antes.
- Lighthouse (build de producción, medido en local): escritorio 99 de
  rendimiento; móvil 93 con la simulación por defecto y 87 aplicando de verdad
  4G lenta y CPU ×4 (foto principal a los 2,3 s, CLS 0). Accesibilidad 100 y
  buenas prácticas 100. SEO marca 66 solo por el `noindex` de la propuesta.
- Compatibilidad: iOS/Safari 16.2+, Chrome y Edge 111+, Firefox 113+.

## Skills usadas en la construcción

`frontend-design` (dirección de arte), `image-to-code` (lectura del manual y del
menú), `awesome-design-md` (plantilla de `DESIGN.md`),
`cinematic-gsap-lenis-motion-system` y `gsap-scrolltrigger-storytelling`
(movimiento), `base44-premium-motion` (tokens `--pm-*` de microinteracciones y
lista de QA) y `playwright-cli` (prueba de humo en navegador real).
