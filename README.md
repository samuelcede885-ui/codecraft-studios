# Fary Labs — web del estudio

Escaparate digital de Fary Labs: hero con laptop protagonista, secuencia de scroll con la laptop fija y proyectos que cambian en su pantalla, servicios, portafolio, proceso y contacto.

Visión del proyecto: [`docs/fary-labs-brief.md`](docs/fary-labs-brief.md). Referencias visuales en `docs/references/`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger.

Lenis no se incluye: el scroll nativo mantiene el control y la accesibilidad; se puede añadir más adelante si se quiere más inercia.

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
| `src/components/screens/Screens.tsx` | Las cinco pantallas conceptuales que se ven dentro de la laptop |
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
- **Proyectos:** Greenade, Simply Milk, Syntha-6 y Depthfield son conceptos de referencia dibujados en HTML/SVG, marcados como "concepto". Sustituir por capturas reales cuando se confirme la autoría.
