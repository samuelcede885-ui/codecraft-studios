# Fary Labs — web del estudio

La visión principal del proyecto está en `docs/fary-labs-brief.md`. Léela antes de diseñar o programar.

- Regla clave: en la secuencia de scroll la laptop no cambia de posición; solo cambian el contenido de su pantalla y los textos laterales.
- Las pantallas de la laptop y del portafolio son el concepto de e-commerce Gramercy (reconstruido en HTML en `src/components/screens/Screens.tsx`, animado como la app original), etiquetado como concepto. No publicar pantallas con datos personales de pago (cédula, teléfono, ID de Binance).
- Datos de contacto y WhatsApp aún no definidos: no inventar destinos.
- Marca: seguir `docs/brand/fary-labs-manual-de-marca-v1.1.pdf`. Logo solo desde `src/components/brandPaths.ts` (firma vectorizada del manual; no redibujar, deformar ni añadir efectos o contornos). Firma completa ≥ 180 px de ancho; si no cabe, isotipo (≥ 24 px). Paleta Negro #090A0B, Carbón #141517, Grafito #303134, Marfil #F5F5F3, Blanco. Titulares Lato (pesos altos), texto Inter. Voz clara, cercana y precisa; sin promesas absolutas.
- Skills del proyecto: `.claude/skills/cinematic-hero-banners`, `service-scroll-experience`, `emil-kowalski-design` (movimiento e interacción), `impeccable-design` (auditoría y pulido) y `taste` (dirección de arte; `node .claude/skills/taste/scripts/inspect.mjs <url>` con `CHROME_PATH`). Si una regla de skill choca con el manual de marca o con un pedido explícito del cliente, manda el cliente/manual.

## Desarrollo

- Next.js 15 + TypeScript + Tailwind 4 + GSAP/ScrollTrigger. `npm run dev`, `npm run build`, `npm run typecheck`.
- Textos en `src/data/` (storySteps, services, projects, process, faq, contact, testimonials, metrics); contacto y dominio en `src/config/site.ts` (variables `NEXT_PUBLIC_…`); secuencia fija en `src/components/ScrollStory/`; estilos en `src/styles/`.
- Testimonios y métricas: solo datos reales con permiso; mientras estén vacíos, sus secciones no se publican.
