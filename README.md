# Fary Labs — web del estudio

Escaparate digital de Fary Labs: hero con laptop protagonista, secuencia de scroll con la laptop fija y proyectos que cambian en su pantalla, servicios, portafolio, proceso y contacto.

Visión del proyecto: [`docs/fary-labs-brief.md`](docs/fary-labs-brief.md). Referencias visuales en `docs/references/`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis (scroll suave en escritorio, sincronizado con GSAP; desactivado en táctil y con `prefers-reduced-motion`).

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (incluye typecheck)
npm run typecheck
```

## Estructura

| Archivo | Qué contiene |
|---|---|
| `src/data/content.ts` | Textos de la secuencia, servicios, portafolio y proceso |
| `src/config/site.ts` | Navegación y datos de contacto (correo, WhatsApp) |
| `src/components/ShowcaseStory.tsx` | Hero + secuencia fija con GSAP (laptop inmóvil, pantallas y textos sincronizados) |
| `src/components/screens/Screens.tsx` | Las cinco pantallas de la laptop: tienda Gramercy reconstruida en HTML (zueco recortado en `public/projects/gramercy-shoe.webp`) + panel de métricas |
| `src/components/Laptop.tsx` | Laptop en CSS |
| `src/components/Sections.tsx` | Servicios, Portafolio y Proceso |
| `src/components/Contact.tsx` | CTA final y formulario |
| `src/app/globals.css` | Tokens, laptop, escena, pantallas y secciones |

## Comportamiento

- **Escritorio:** texto a la izquierda, laptop centrada, mensaje a la derecha.
- **Móvil y tablet (< 1024 px):** laptop centrada; información arriba y abajo en vertical.
- **`prefers-reduced-motion`:** sin fijado ni animaciones; los cinco pasos se muestran uno tras otro.

## Pendiente

- **Datos de contacto:** rellenar `email` y `whatsapp` en `src/config/site.ts`. Mientras estén vacíos, el formulario valida pero avisa de que el envío no está configurado. Con correo, abre el cliente de correo con la solicitud. Para un envío real conviene conectar un servicio de formularios o una API.
- **Logotipo:** `LogoMark` en `src/components/Logo.tsx` es una recreación del brand board. Sustituir por el SVG original.
- **Pantallas:** la laptop y el portafolio muestran el concepto de e-commerce Gramercy (inicio, producto, carrito y pago), marcado como "concepto". Las pantallas de Pago Móvil y Binance no se usan porque contienen datos personales. La foto del producto es de Birkenstock: confirmar derechos antes de publicar la web.
