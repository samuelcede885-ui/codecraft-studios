# Fary Labs — web del estudio

La visión principal del proyecto está en `docs/fary-labs-brief.md`. Léela antes de diseñar o programar.

- Regla clave: en la secuencia de scroll la laptop no cambia de posición; solo cambian el contenido de su pantalla y los textos laterales.
- Las pantallas de la laptop y del portafolio son el concepto de e-commerce Gramercy (reconstruido en HTML en `src/components/screens/Screens.tsx`, animado como la app original), etiquetado como concepto. No publicar pantallas con datos personales de pago (cédula, teléfono, ID de Binance).
- Datos de contacto y WhatsApp aún no definidos: no inventar destinos.
- Skills del proyecto: `.claude/skills/cinematic-hero-banners` y `.claude/skills/service-scroll-experience`.

## Desarrollo

- Next.js 15 + TypeScript + Tailwind 4 + GSAP/ScrollTrigger. `npm run dev`, `npm run build`, `npm run typecheck`.
- Textos en `src/data/` (storySteps, services, projects); contacto en `src/config/site.ts`; secuencia fija en `src/components/ScrollStory/`; estilos en `src/styles/`.
