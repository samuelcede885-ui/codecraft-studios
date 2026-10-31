# Fary Labs — web del estudio

La visión principal del proyecto está en `docs/fary-labs-brief.md`. Léela antes de diseñar o programar.

- Regla clave: en el hero la laptop no cambia de posición; solo cambian el video de su pantalla y los textos laterales, sincronizados con el tiempo real del video (nunca con el scroll ni con temporizadores propios).
- La laptop del hero muestra Bunzo Burgers, concepto ficticio de restaurante (demo: repo `samuelcede885-ui/bunzo-demo`; video grabado con `scripts/record-hero-bunzo.mjs`), etiquetado como concepto. Gramercy (concepto de e-commerce, reconstruido en HTML en `src/components/screens/Screens.tsx`) sigue en el portafolio, filtros Web y E-commerce, sin destacar. El proyecto destacado del portafolio es G-Talent (`projectType: "client"`, trabajo real, sin `publicUrl` por ahora); sus videos y capturas vienen de la landing entregada. La web del GABA (`gaba`, filtro "Webs personales") también es trabajo real, con `publicUrl`; sin nombres de las autoras en el portafolio. Fariseos League (`fariseos-league`, filtro "Aplicaciones") es trabajo real, con `publicUrl`; sus medios salen de una grabación de pantalla de la app (sin la pantalla de comparación con DT famosos). No publicar pantallas con datos personales de pago (cédula, teléfono, ID de Binance).
- Datos de contacto y WhatsApp aún no definidos: no inventar destinos.
- Planes y precios en `src/data/plans.ts` (fuente: propuesta "CODE CRAFT STUDIO", sección 6, en Drive). Se muestran como "Desde $X"; cambiar precios solo con una fuente actualizada. Sin plazos de entrega ni promesas absolutas.
- Cada proyecto lleva `projectType` ("client" o "concept"); los conceptos muestran siempre "Concepto de diseño de Fary Labs. No es un trabajo de cliente." y nunca se presentan como clientes. Tecnologías y antes/después solo con información y assets verificados.
- Marca: seguir `docs/brand/fary-labs-manual-de-marca-v1.1.pdf`. Logo solo desde `src/components/brandPaths.ts` (firma vectorizada del manual; no redibujar, deformar ni añadir efectos o contornos). Firma completa ≥ 180 px de ancho; si no cabe, isotipo (≥ 24 px). Paleta Negro #090A0B, Carbón #141517, Grafito #303134, Marfil #F5F5F3, Blanco. Titulares Lato (pesos altos), texto Inter. Voz clara, cercana y precisa; sin promesas absolutas.
- Skills del proyecto: `.claude/skills/cinematic-hero-banners` y `.claude/skills/service-scroll-experience`.

## Desarrollo

- Next.js 15 + TypeScript + Tailwind 4 + GSAP/ScrollTrigger. `npm run dev`, `npm run build`, `npm run typecheck`.
- Datos en `src/data/` (projects, services, process, heroStages); contacto y dominio en `src/config/site.ts`; medición en `src/lib/analytics.ts` (`track()`, sin plataformas integradas).
- Componentes por área en `src/components/`:
  - `hero/` — HeroExperience (sincronía con el video), HeroLaptop, HeroStage, HeroPlayback (pausa) y heroStarter (script en línea que arranca el video al terminar la intro sin esperar a React). La laptop usa `bunzo/hero.webm|mp4` (960 px, 15 fps; a `HERO_SPEED` = 2 se ve a 30 fps). Tiempos y velocidad en `src/data/heroStages.ts`; si cambian, regrabar Bunzo con `scripts/record-hero-bunzo.mjs` y la bobina de Gramercy con `scripts/record-reels.mjs`.
  - `portfolio/` — FeaturedProject, ProjectGrid, ProjectCard, ProjectPreviewVideo, ProjectPreviewDialog, ProjectFilters, ProjectCategories ("¿Qué quieres construir?").
  - `projects/` — CaseStudy, CaseStudyHero, CaseStudySection, ProjectGallery, ProjectVideo, BeforeAfterComparison (solo con imágenes reales).
  - `showreel/` — InspirationTrigger, InspirationShowreel. `quote/` — QuoteWizard, QuoteStep, ProjectReference.
  - `services/ServicesAccordion`, `plans/PricingPlans` (sección "Planes"; "Elegir este plan" pasa el plan al formulario), `process/ProcessTimeline`, `covers/` (portadas, se capturan con `scripts/record-covers.mjs`), `reel/` y `screens/` (pantallas HTML de los conceptos).
  - Cursor contextual en `ContextCursor.tsx` (se desactiva con `site.contextCursor`).
- Estilos en `src/styles/`.
