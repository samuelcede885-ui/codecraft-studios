# Fary Labs — Motion

Reels verticales construidos con código: React + TypeScript + Remotion.
1080 × 1920, 30 fps, 9:16 (Instagram Reels y TikTok). Dirección completa en `brief/MASTER_BRIEF.md`.

```bash
cd motion
npm install
npm run dev              # Remotion Studio
npm run render:reel01    # out/reel01.mp4 (28 s)
npm run qa               # frames de revisión del brief (§22) en out/qa/
node scripts/qa.mjs Reel01 0,330,780 --guides   # con las guías de zona segura
```

Si el entorno no puede descargar Chrome Headless Shell: `REMOTION_BROWSER=/ruta/al/headless_shell`.

## Piezas

| Composición | Qué es |
|---|---|
| `Reel01` | "Tu negocio no debería depender de ti" — 8 escenas, 840 frames, sin audio |
| `Demo` | Base de 6 s: el agente IA se enciende y envía datos |

## Estructura

```
src/
  theme/fary.ts            paleta del brief, tonos del mundo, zona segura, tipografías
  theme/fonts.ts           Lato e Inter locales (public/fonts, OFL)
  assets/brand.ts          logo oficial: se importa de la web (src/components/brandPaths.ts)
  lib/iso.ts               proyección isométrica 2:1, arcos de datos entre azoteas
  lib/motion.ts            curvas, entradas/salidas de UI, activo/inactivo
  data/city.ts             la ciudad: sistemas (web, app, ai, datos), oficina, relleno determinista, rutas
  data/reels.ts            guion de cada reel: escenas, textos, palabra clave, marcas de locución
  components/              mundo (IsometricWorld, IsometricCamera, City, Building, OfficeRoom, Road,
                           StreetLight, Tree, DigitalPerson, DataFlow, FloatingLabel) e interfaz
                           (KineticTitle, HighlightWord, Chip, ClockBadge, NotificationBubble,
                           StatusCard, SystemNode, PhoneMockup, BrowserMockup, Dashboard, Cursor,
                           CTAEndCard, FaryLogo, Icon, SafeArea, AudioLayer)
  screens/                 interfaces para los mockups (WebsiteFlow…)
  compositions/            Reel01…/ (ReelWorld + scenes/), Demo/
```

## Reglas

- Un solo mundo y una sola cámara por reel (`useCameraPath`): sin cortes.
- Animaciones solo por frame (`useCurrentFrame`, `spring`, `interpolate`): nada de `setTimeout`,
  `setInterval`, `Date.now` ni CSS en tiempo real. El mismo frame siempre da la misma imagen.
- Entradas de UI: opacity 0 → 1, translateY 30 → 0, scale .96 → 1, stagger 3–6 frames; salidas más breves.
- Una palabra protagonista por escena. Resaltado cálido para el problema, verde para el sistema.
- El verde solo como señal: actividad, datos, conexiones, progreso, CTA y palabra clave.
- Texto importante dentro de la zona segura (arriba 250, derecha 180, abajo 440 px).
- Sin cifras, clientes ni resultados inventados. Sin música ni efectos sin licencia: `AudioLayer`
  y las marcas de locución (`reel01.voiceover`) quedan listas para archivos propios.
- Las referencias del kit se estudian por su lenguaje; no se copian ni se suben al repositorio.
