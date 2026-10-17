# Fary Labs — web del estudio

Escaparate digital de Fary Labs: hero con laptop protagonista, secuencia de scroll con la laptop fija y proyectos que cambian en su pantalla, servicios, portafolio, proceso y contacto.

Visión del proyecto: [`docs/fary-labs-brief.md`](docs/fary-labs-brief.md). Referencias visuales en `docs/references/`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis (scroll suave sincronizado con GSAP; desactivado con `prefers-reduced-motion`).

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (incluye typecheck)
npm run typecheck
```

## Estructura

| Ruta | Qué contiene |
|---|---|
| `src/data/storySteps.ts` | Los cinco pasos de la secuencia (etapa, título, metadata, mensaje, etiquetas, pantalla) |
| `src/data/services.ts` | Web, App y Agent Craft (qué incluye cada uno) y los pasos del proceso |
| `src/data/projects.ts` | Proyecto principal (Gramercy) y "Más proyectos" (conceptos) |
| `src/data/screens.ts` | Identificadores de las pantallas |
| `src/config/site.ts` | Navegación y datos de contacto (Instagram, WhatsApp, correo) |
| `src/components/Intro.tsx` | Intro de marca (≤ 2,7 s, una vez por sesión, botón "Saltar intro") |
| `src/components/Header.tsx`, `MobileMenu.tsx` | Header fijo que se compacta con blur y menú móvil a pantalla completa |
| `src/components/ScrollStory/` | Hero + secuencia fijada: una sola laptop, una línea de tiempo GSAP con scrub |
| `src/components/screens/Screens.tsx` | Pantallas de la laptop: Gramercy en HTML, panel de métricas, asistente IA y estudio |
| `src/components/Services.tsx` | Servicios en acordeón accesible con vista previa |
| `src/components/Portfolio.tsx`, `Process.tsx`, `StoryCTA.tsx`, `FinalCTA.tsx` | Resto de secciones; el cierre negro sustituye al footer |
| `src/styles/*.css` | Estilos por bloque (base, intro, header, laptop, story, screens, sections, form) |

## Comportamiento

- **Intro:** fondo negro, el símbolo se dibuja, aparecen "Fary" y "labs" y la página entra. Solo una vez por sesión (`sessionStorage`); se omite con `prefers-reduced-motion`.
- **Escritorio:** título a la izquierda, laptop centrada, metadata y mensaje a la derecha. Cada gesto de rueda avanza un paso.
- **Móvil y tablet (< 1024 px):** título, laptop, metadata y mensaje en columna; la laptop no se mueve.
- **`prefers-reduced-motion`:** la escena sigue fijada pero los pasos cambian sin animación.

## Pendiente

- **Datos de contacto:** rellenar `email`, `whatsapp` e `instagram` en `src/config/site.ts`. Mientras estén vacíos, los canales del cierre aparecen como "próximamente" y el formulario valida pero avisa de que el envío no está configurado. Con correo, abre el cliente de correo con la solicitud. Para un envío real conviene conectar un servicio de formularios o una API.
- **Pantallas:** la laptop y el portafolio muestran el concepto de e-commerce Gramercy (inicio, producto, carrito y pago), marcado como "concepto". Los proyectos de "Más proyectos" también son conceptos de Fary Labs, no trabajos de clientes. Las pantallas de Pago Móvil y Binance no se usan porque contienen datos personales. La foto del producto es de Birkenstock: confirmar derechos antes de publicar la web.
