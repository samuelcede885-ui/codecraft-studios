# Fary Labs — web del estudio

La visión principal del proyecto está en `docs/fary-labs-brief.md`. Léela antes de diseñar o programar.

- Regla clave: en la secuencia de scroll la laptop no cambia de posición; solo cambian el contenido de su pantalla y los textos laterales.
- Los proyectos GREENADE, SIMPLY MILK, SYNTHA-6 y DEPTHFIELD son referencias visuales: no presentarlos como trabajos de Fary Labs hasta confirmar autoría.
- Datos de contacto y WhatsApp aún no definidos: no inventar destinos.
- Skills del proyecto: `.claude/skills/cinematic-hero-banners` y `.claude/skills/service-scroll-experience`.

## Desarrollo

- Next.js 15 + TypeScript + Tailwind 4 + GSAP/ScrollTrigger. `npm run dev`, `npm run build`, `npm run typecheck`.
- Textos en `src/data/content.ts`; contacto en `src/config/site.ts`; secuencia fija en `src/components/ShowcaseStory.tsx`.
