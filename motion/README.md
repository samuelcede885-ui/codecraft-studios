# Fary Labs — Motion

Reels verticales construidos con código: React + TypeScript + Remotion.
1080 × 1920, 30 fps, 9:16 (Instagram Reels y TikTok). Dirección completa en `brief/MASTER_BRIEF.md`.

```bash
cd motion
npm install
npm run dev              # Remotion Studio
npm run render:reel01    # out/reel01.mp4 (32 s)
npm run qa               # frames de revisión del brief (§22) en out/qa/
node scripts/qa.mjs Reel01 0,330,780 --guides   # con las guías de zona segura
```

Si el entorno no puede descargar Chrome Headless Shell: `REMOTION_BROWSER=/ruta/al/headless_shell`.

## Piezas

| Composición | Qué es |
|---|---|
| `Reel01` | "Tu negocio no debería depender de ti" — 9 escenas, 960 frames (32 s), con música y efectos |
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
- Marca según el Manual v1.1: "El contraste es la identidad". Monocromía deliberada (Negro, Carbón,
  Grafito, Marfil, Blanco). Única excepción: la señal (datos, sistemas activos, palabra clave,
  CTA) es un azul eléctrico (#2F7BFF) con brillo suave; la palabra del problema va sobre grafito.
- Voz del manual: clara, cercana y precisa. Beneficios reales, sin jerga ni promesas absolutas.
- Una palabra protagonista por escena.
- Foco de color (`lib/focus.tsx`): lo que la cámara mira se ve con materiales reales
  (`data/materials.ts`: ladrillo, vidrio, piedra, madera, árboles, asfalto, luz cálida); lo que
  está fuera de foco queda en los grises de la marca. El foco se mueve con `useFocusPath`.
- Texto importante dentro de la zona segura (arriba 250, derecha 180, abajo 440 px).
- Sin cifras, clientes ni resultados inventados.

## Audio

Música y efectos **originales**, sintetizados por código (sin muestras ni música de terceros):

```bash
python3 scripts/audio/generate_reel01.py public/audio   # regenera public/audio/
```

- `reel01-music.mp3`: 32 s sincronizados con las escenas (pad oscuro en el problema, se abre con
  Fary, ritmo y arpegio en web/app/automatización, calma, acorde final con el logo).
- `sfx/*.wav`: reloj, notificaciones, transiciones, conexiones, toques, escritura, confirmación,
  checks, golpe del logo y clic del CTA. Sus frames están en `data/reels.ts` → `audio.sfx`.
- Mezcla en torno a −16 LUFS, pico −1.4 dB.
- Voz: no se sintetiza. Las marcas de locución están en `reel01.voiceover`; al grabarla, añadir
  `voiceover: { src: "audio/reel01-voz.mp3" }` en `reel01.audio`.

- Las referencias del kit se estudian por su lenguaje; no se copian ni se suben al repositorio.
