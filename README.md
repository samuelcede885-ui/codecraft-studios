# Fary Labs — web del estudio

Escaparate digital de Fary Labs: hero con laptop protagonista, secuencia de scroll con la laptop fija y proyectos que cambian en su pantalla, servicios, portafolio, proceso y contacto.

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
| `src/data/heroStages.ts` | Etapas del hero con sus segundos en el video (única fuente de tiempos) |
| `src/data/projects.ts` | Catálogo: slug, categoría, miniatura, videos, galería y ficha de cada proyecto |
| `src/data/services.ts` | Web, App y Agent Craft y los pasos del proceso |
| `src/data/screens.ts` | Identificadores de las pantallas HTML |
| `src/components/brandPaths.ts`, `Logo.tsx` | Firma e isotipo oficiales vectorizados del manual (no redibujar) |
| `src/config/site.ts` | Navegación y datos de contacto (Instagram, WhatsApp, correo) |
| `src/components/Intro.tsx` | Intro de marca (≤ 2,7 s, una vez por sesión, botón "Saltar intro") |
| `src/components/Header.tsx`, `MobileMenu.tsx` | Header fijo que se compacta con blur y menú móvil a pantalla completa |
| `src/components/hero/` | Hero automático (HeroExperience, HeroLaptop, HeroStage, HeroProgress): la laptop reproduce el video y los textos siguen su `currentTime` |
| `src/components/portfolio/` | Destacado, catálogo con filtros, fichas con preview (hover / lightbox) y "¿Qué quieres construir?" |
| `src/app/proyectos/[slug]/`, `src/components/projects/` | Case study de cada proyecto (hero, reto, capítulos, resultado, antes/después) |
| `src/components/quote/` | Cotización en 4 pasos con proyecto de referencia (`?proyecto=<slug>#cotizacion`) |
| `src/components/showreel/` | Showreel "Inspírame" a pantalla completa |
| `src/lib/analytics.ts` | Eventos de medición (`track()`): emite `fary:analytics` y usa `dataLayer` si existe; sin plataformas integradas |
| `src/components/reel/`, `src/app/grabar/`, `scripts/record-reels.mjs` | Bobinas: navegación simulada por las pantallas HTML, grabada a video fotograma a fotograma |
| `src/components/covers/`, `scripts/record-covers.mjs` | Portadas del catálogo (mensaje, identidad y pantalla real de cada concepto), capturadas a `thumb.webp` |
| `src/components/screens/Screens.tsx` | Pantallas HTML: Gramercy, panel de métricas, asistente IA y estudio |
| `src/components/services/`, `process/`, `FinalCTA.tsx` | Servicios (acordeón), proceso (línea de tiempo) y cierre negro con el formulario |
| `public/projects/<slug>/` | Miniatura, póster, previews y recorridos en MP4/WebM, galería |
| `src/styles/*.css` | Estilos por bloque |

## Comportamiento

- **Intro:** fondo negro, el símbolo, "Fary" y "labs"; una vez por sesión (`sessionStorage`).
- **Hero:** al terminar la intro, la laptop reproduce el recorrido de Gramercy (sin sonido, en bucle, sin controles) y los textos de los lados cambian según el tiempo real del video. No depende del scroll; fuera de la vista se pausa y al volver continúa. Un botón discreto permite pausarlo. Si el video no carga, la laptop muestra la misma navegación en HTML.
- **Catálogo:** con ratón, la miniatura se cambia por un preview al pasar por encima (uno solo a la vez); en táctil, solo miniatura y play. Cada proyecto abre `/proyectos/<slug>`.
- **"Quiero una página como esta":** lleva al formulario con el proyecto como referencia.
- **Móvil:** título, laptop e información en columna; en horizontal, texto y laptop lado a lado.

## Volver a grabar los videos

```bash
npm run dev
node scripts/record-reels.mjs            # todas las bobinas, o: node scripts/record-reels.mjs gramercy
node scripts/record-covers.mjs           # portadas del catálogo
```

Requiere Playwright y ffmpeg. Si se cambian los tiempos en `src/data/heroStages.ts`, hay que regrabar `gramercy`.

## Pendiente

- **Datos de contacto:** rellenar `email`, `whatsapp` e `instagram` en `src/config/site.ts`. El formulario envía por correo o, si solo hay WhatsApp, por WhatsApp. Mientras estén vacíos, los canales del cierre no se publican (en desarrollo se ven como "próximamente") y el formulario valida pero avisa de que el envío no está configurado. Con correo, abre el cliente de correo con la solicitud. Para un envío real conviene conectar un servicio de formularios o una API.
- **Pantallas:** la laptop y el portafolio muestran el concepto de e-commerce Gramercy (inicio, producto, carrito y pago), marcado como "concepto". Los proyectos de "Más proyectos" también son conceptos de Fary Labs, no trabajos de clientes. Las pantallas de Pago Móvil y Binance no se usan porque contienen datos personales. La foto del producto es de Birkenstock: confirmar derechos antes de publicar la web.
- **Presupuestos del formulario:** los rangos y las fechas son orientativos (`src/components/quote/QuoteWizard.tsx`); confirmar.
- **Dominio:** rellenar `url` en `src/config/site.ts` para activar URL canónicas, imágenes de Open Graph y el sitemap.
- **Medición:** los eventos (`src/lib/analytics.ts`) ya se emiten; falta conectar la herramienta que se elija escuchando `fary:analytics` o con un `dataLayer`.
