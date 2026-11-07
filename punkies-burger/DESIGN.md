# Punkie's Burger DESIGN.md

> Sistema de diseño de la web oficial de Punkie's Burger (smash burgers, Chacao, Caracas).
> No es una marca nueva: traduce a la web la identidad que Punkie's ya usa en Instagram, empaque y local.
> Fuentes: manual de marca v1.0, collages editoriales y fotos del Instagram @punkiesburger.
> **Verificado** = medido en el material entregado. **Elegido** = decisión de implementación.

## Tema visual

- Tono: hamburguesería de barrio, cálida, irreverente y honesta. "Pocas cosas. Perfectas."
- Metáfora de layout: **mesa de collage**. La página es la plancha oscura (tinta); encima se apoyan papeles crema, fotos impresas con marco, stickers y tickets.
- Principios:
  1. La firma manuscrita es sagrada: siempre como imagen (SVG calcado), nunca reescrita con una tipografía.
  2. La foto real manda: cálida, cerca, guantes negros, papel con estrellas. Nada de stock ni IA.
  3. Titulares enormes de pocas palabras. El resto, callado.
  4. Sin degradados ni sombras difusas: bordes de 2 px en tinta, radios generosos y píldoras.
  5. Ningún dato inventado: lo pendiente se ve como pendiente.

## Colores

| Token | Hex | Uso | Origen |
| --- | --- | --- | --- |
| `--color-rojo` | `#8F2924` | Firma, CTA principal, stickers | Brief (manual: `#8B2A22`; píxel del logo: `#8B2921`) |
| `--color-rojo-hondo` | `#76201C` | Hover/presionado del CTA rojo | Elegido |
| `--color-crema` | `#F3EFC3` | Paneles, header, marcos de foto, texto sobre oscuro | Verificado (píxel exacto del manual) |
| `--color-tinta` | `#1A0C09` | Fondo de página, texto sobre crema, bordes | Brief / manual `#1A0C08` |
| `--color-burdeos` | `#391510` | Panel de Especiales, fondos de foto en carga | Brief / manual `#3A1512` |
| `--color-dorado` | `#C97812` | Reservado para detalles cálidos | Brief / manual `#C8740E` |
| `--color-amarillo` | `#ECE52A` | Foco de teclado, números de paso, aviso de pendiente | Brief / manual `#E5E02D` (solo promos y eventos) |

Proporción de uso aproximada (manual): crema 40 · rojo 30 · tinta 18 · burdeos 7 · dorado 3 · amarillo 2.

Contraste medido (WCAG): crema sobre tinta 16.3:1 · tinta sobre crema 16.3:1 · crema sobre rojo 7.1:1 · crema sobre burdeos 13.9:1. **Rojo sobre tinta 2.3:1: no usar para texto.**

## Tipografía

| Rol | Familia | Detalle |
| --- | --- | --- |
| Firma | SVG calcado de la firma manuscrita | `src/components/brand/marks.ts` |
| Titulares | Inter Variable (corte Display por `opsz` automático), 900 | `letter-spacing: -0.045em`, `line-height: .86`, clase `font-black-display` |
| Texto | Inter Variable 400–600 | 15–19 px, `line-height` 1.4–1.5, líneas < 50 caracteres |
| Ticket / datos | JetBrains Mono Variable 700, mayúsculas | `letter-spacing: .08em`, clase `label-mono`. Solo para direcciones, horarios, etiquetas de foto y pedidos |

El manual especifica "Inter Display Black" para titulares; el brief sugiere Archivo Black "o equivalente". Se usa Inter Display por fidelidad al manual. Las fuentes se sirven desde el propio sitio (Fontsource), sin Google Fonts.

Escala de titulares: hero `clamp(3.6rem, 14.2vw, 9.4rem)` · sección `clamp(3.2rem, 10vw, 8.2rem)` · categoría `clamp(2rem, 4.6vw, 3.4rem)` · producto 2–2.2 rem.

## Layout y espaciado

- Contenedor: `max-width: 1440px`; paneles crema con margen lateral de 12 px (móvil) / 20 px.
- Rejilla: 12 columnas en escritorio (hero 7/5, menú 8/4, experiencia 5/7, ubicación 5/7). Collage "Universo" en 4 columnas × 5 filas (2 columnas en móvil, `grid-auto-flow: dense`).
- Radios: panel 28 px · tarjeta 18–20 px · foto interna 12–13 px · foto impresa 2–4 px · píldoras 9999 px.
- Breakpoints Tailwind: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.
- Alineación: todo a la izquierda; nada centrado salvo sellos y stickers.

## Componentes y estados

- **Botones**: píldoras de 44–56 px de alto. Rojo (acción principal), crema, línea (borde 2 px `currentColor`), tinta. Hover: sube 2 px. Presionado: `scale(.97)`.
- **Tarjeta de producto**: crema, borde 2 px tinta, foto 4:3.3 con *crossfade* a la segunda foto en hover. El precio va en mono y "Precio por confirmar" si es `null`. El "+" rojo añade al pedido, o abre la ficha si hay opciones.
- **Ficha de producto**: diálogo de 2 columnas en escritorio y hoja inferior en móvil, con barra fija de cantidad + añadir.
- **Carrito**: panel derecho de 3 pasos (Pedido → Tus datos → Confirmar). Resumen estilo ticket con borde punteado.
- **Formularios**: etiqueta visible arriba, borde 2 px, error en rojo bajo el campo, con `aria-invalid` y `aria-describedby`. Al enviar con errores, el foco va al primer campo inválido.
- **Foto impresa** (`print`): marco crema de 6–11 px y rotación de −6° a 3°.
- **Etiqueta de foto**: `label-mono` sobre crema, esquina de la foto.
- **Sello**: círculo crema + aro tinta + firma roja (como el avatar de Instagram).
- **Patrón**: firma repetida y girada −9° (papel de envolver, cajón de luz).
- **Cinta**: franja crema girada −2.2° con "PUNKIE'S · SMASH" en rojo.

## Elevación y movimiento

- Sombras: ninguna. La profundidad viene de la superposición y la rotación.
- Tokens `--pm-*` (skill base44-premium-motion): rápido 130 ms · normal 240 ms · lento 380 ms · `cubic-bezier(.22,1,.36,1)`.
- Un solo momento orquestado: la entrada del hero (palabras que "se aplastan" y fotos que caen sobre la mesa).
- Scroll: aparición progresiva solo en fotografías. Parallax suave y barra de progreso con GSAP ScrollTrigger solo en escritorio, cargado bajo demanda. Sin smooth-scroll artificial (Lenis descartado: el brief pide evitar el "scroll artificialmente lento").
- Overlays: transiciones CSS de 220–340 ms con salida controlada (`usePresence`).
- `prefers-reduced-motion`: sin animaciones de entrada, cinta detenida, sin parallax y transiciones instantáneas.

## Accesibilidad y prohibiciones

- Foco visible: 3 px amarillo sobre oscuro, rojo sobre crema (`--focus`).
- Objetivos táctiles ≥ 44 px (verificado con Playwright a 390 y 360 px).
- Diálogos: `role="dialog"`, `aria-modal`, foco atrapado, cierre con Escape, foco devuelto y resto de la página en `inert`.
- Procedencia de imágenes: todas del cliente (ver `fotos/README.md`).
- **Prohibido**: degradados, sombras difusas, azul, verde, violeta, fotos de stock, hamburguesas generadas con IA, reescribir la firma con una fuente, inventar precios, promociones, testimonios o cifras.
