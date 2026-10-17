# Fary Labs — web del estudio

Escaparate digital de Fary Labs: intro → hero → historia con la laptop fija → servicios → declaración de marca → proyectos (con casos de estudio) → proceso → testimonios → FAQ → contacto → cierre.

> Branch `fary-labs-experience-v2`: variante experimental para comparar con la versión actual (`add-cinematic-hero-banners-skill`).

Visión del proyecto: [`docs/fary-labs-brief.md`](docs/fary-labs-brief.md). Identidad: [`docs/brand/fary-labs-manual-de-marca-v1.1.pdf`](docs/brand/fary-labs-manual-de-marca-v1.1.pdf). Referencias visuales en `docs/references/`.

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
| `src/data/storySteps.ts` | Los cinco pasos de la historia (etapa, título, metadata, mensaje, pantalla) |
| `src/data/services.ts` | Web, App y Agent Craft: descripción, capacidades y vista previa |
| `src/data/projects.ts` | Proyectos (conceptos) y su caso de estudio: ficha, problema, solución y resultado |
| `src/data/process.ts`, `faq.ts`, `contact.ts` | Pasos del proceso, preguntas frecuentes, opciones del formulario |
| `src/data/testimonials.ts`, `metrics.ts` | Vacíos a propósito: solo datos reales. Sin datos, las secciones no se publican |
| `src/config/site.ts` | Navegación, dominio y contacto (también por variables `NEXT_PUBLIC_…`) |
| `src/components/brandPaths.ts`, `Logo.tsx` | Firma e isotipo oficiales vectorizados del manual (no redibujar) |
| `src/components/Intro.tsx` | Intro de marca (≤ 2,7 s, una vez por sesión, "Saltar intro") |
| `src/components/Header.tsx`, `MobileMenu.tsx` | Header con dos estados (firma → isotipo) y menú a pantalla completa |
| `src/components/ScrollStory/` | Hero + historia fijada: una sola laptop, una línea de tiempo GSAP, progreso 01–05 y cierre "Ideas claras." |
| `src/components/screens/Screens.tsx` | Pantallas en HTML: Gramercy, panel de métricas, asistente IA y estudio |
| `src/components/Services/` | Acordeón editorial (uno abierto a la vez) |
| `src/components/Portfolio/` | Proyectos grandes con revelado clip-path y caso de estudio en diálogo |
| `src/components/Process.tsx`, `Testimonials.tsx`, `Metrics.tsx`, `FAQ.tsx`, `Contact.tsx`, `FinalCTA.tsx`, `Footer.tsx` | Resto de secciones |
| `src/components/WhatsAppFloat.tsx`, `Cursor.tsx` | WhatsApp flotante (solo con número configurado) y cursor discreto de escritorio |
| `src/app/robots.ts`, `sitemap.ts`, `public/og.png` | SEO: robots, sitemap y Open Graph (absolutos cuando hay dominio) |
| `src/styles/*.css` | Estilos por bloque |

## Variables de entorno (opcionales)

| Variable | Efecto |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical, Open Graph con imagen absoluta y sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | El formulario abre el correo con la solicitud; canal Email activo |
| `NEXT_PUBLIC_WHATSAPP` | Botón flotante, opción del formulario y canal WhatsApp |
| `NEXT_PUBLIC_INSTAGRAM` | Canal Instagram |

## Comportamiento

- **Logo:** firma completa a 180 px arriba (escritorio y móvil); al hacer scroll, solo el isotipo con el header más bajo.
- **Intro:** fondo negro, las piezas del símbolo avanzan en la dirección de la flecha, aparecen "Fary" y "labs" y la página entra. Solo una vez por sesión (`sessionStorage`); se omite con `prefers-reduced-motion`.
- **Escritorio:** título a la izquierda, laptop centrada, metadata y mensaje a la derecha. Cada gesto de rueda avanza un paso.
- **Móvil y tablet (< 1024 px):** título, laptop, metadata y mensaje en columna; la laptop no se mueve. En horizontal con poca altura, texto y laptop lado a lado.
- **`prefers-reduced-motion`:** sin scrub, parallax ni cursor; los pasos cambian con un fundido simple y todo el contenido es visible.

## Pendiente

- **Datos de contacto:** definir las variables de entorno de arriba (o rellenar `src/config/site.ts`). Mientras estén vacíos, los canales del cierre aparecen como "próximamente" y el formulario valida pero avisa de que el envío no está configurado. Con correo, abre el cliente de correo con la solicitud. Para un envío real conviene conectar un servicio de formularios o una API.
- **Pantallas:** la laptop y el portafolio muestran el concepto de e-commerce Gramercy (inicio, producto, carrito y pago), marcado como "concepto". Los proyectos de "Más proyectos" también son conceptos de Fary Labs, no trabajos de clientes. Las pantallas de Pago Móvil y Binance no se usan porque contienen datos personales. La foto del producto es de Birkenstock: confirmar derechos antes de publicar la web.
- **Contenido por confirmar:** respuestas de la FAQ (`src/data/faq.ts`), rangos de presupuesto (`src/data/contact.ts`), testimonios reales con permiso y métricas reales.
