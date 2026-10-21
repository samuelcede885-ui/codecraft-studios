# Fary Labs — web del estudio

La visión principal del proyecto está en `docs/fary-labs-brief.md`. Léela antes de diseñar o programar.

- Regla clave: en el hero la laptop no cambia de posición; solo cambian el video de su pantalla y los textos laterales, sincronizados con el tiempo real del video (nunca con el scroll ni con temporizadores propios).
- Las pantallas de la laptop y del portafolio son el concepto de e-commerce Gramercy (reconstruido en HTML en `src/components/screens/Screens.tsx`, animado como la app original), etiquetado como concepto. No publicar pantallas con datos personales de pago (cédula, teléfono, ID de Binance).
- Datos de contacto y WhatsApp aún no definidos: no inventar destinos.
- Marca: seguir `docs/brand/fary-labs-manual-de-marca-v1.1.pdf`. Logo solo desde `src/components/brandPaths.ts` (firma vectorizada del manual; no redibujar, deformar ni añadir efectos o contornos). Firma completa ≥ 180 px de ancho; si no cabe, isotipo (≥ 24 px). Paleta Negro #090A0B, Carbón #141517, Grafito #303134, Marfil #F5F5F3, Blanco. Titulares Lato (pesos altos), texto Inter. Voz clara, cercana y precisa; sin promesas absolutas.
- Skills del proyecto: `.claude/skills/cinematic-hero-banners` y `.claude/skills/service-scroll-experience`.

## Desarrollo

- Next.js 15 + TypeScript + Tailwind 4 + GSAP/ScrollTrigger. `npm run dev`, `npm run build`, `npm run typecheck`.
- Textos en `src/data/` (heroStages, services, projects); contacto en `src/config/site.ts`; hero automático en `src/components/Hero/` (tiempos en `src/data/heroStages.ts`; si cambian, regrabar con `scripts/record-reels.mjs`); catálogo en `src/components/Catalog/`; estilos en `src/styles/`.
