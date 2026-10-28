# Fary Labs — Motion

Reels verticales construidos con código: React + TypeScript + Remotion.
1080 × 1920, 30 fps, 9:16 (Instagram Reels y TikTok). Dirección completa en `brief/MASTER_BRIEF.md`.

```bash
cd motion
npm install
npm run dev              # Remotion Studio
npm run render:reel01    # out/reel01.mp4 (32 s)
npm run render:reel02    # out/reel02.mp4 (63,5 s, 3D con Three.js; ver "Reel 02" abajo)
npm run render:reel03    # out/Fary_Labs_Dos_Negocios.mp4 (45 s, 3D; ver "Reel 03" abajo)
npm run render:webtour   # out/web-tour.mp4 (~105 s); antes, grabar con scripts/record-web-tour.mjs
npm run qa               # frames de revisión del brief (§22) en out/qa/
node scripts/qa.mjs Reel01 0,330,780 --guides   # con las guías de zona segura
```

Si el entorno no puede descargar Chrome Headless Shell: `REMOTION_BROWSER=/ruta/al/headless_shell`.

## Piezas

| Composición | Qué es |
|---|---|
| `Reel01` | "Tu negocio no debería depender de ti" — 9 escenas, 960 frames (32 s), con música y efectos |
| `Reel02` | "Conectando el comercio venezolano" — ciudad 3D (Three.js), 8 escenas, 1905 frames (63,5 s), voz temporal, música y efectos |
| `Reel03` | "Dos negocios, dos formas de trabajar" — dos tiendas idénticas (SIN / CON Fary Labs) en la ciudad 3D del Reel 02, 6 escenas, 1350 frames (45 s), subtítulos |
| `WebTour` | Recorrido por la web de escritorio dentro de un monitor, con el título de cada sección; sin audio. La grabación (`public/tour/`, no versionada) sale de `scripts/record-web-tour.mjs` |
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
  compositions/            Reel01…/ (ReelWorld + scenes/), Reel02/, WebTour/, Demo/
```

## Reel 02 — "Conectando el comercio venezolano"

Visión en desarrollo de Fary Labs (no una plataforma ya operativa): de vender respondiendo mensajes
a mano a un ecosistema de tiendas digitales, gestión centralizada, automatización e IA.
Ciudad 3D real (Three.js / React Three Fiber dentro de `@remotion/three`), una sola cámara continua
y las interfaces en DOM ancladas a la ciudad (se proyectan puntos 3D con la misma cámara).

```
src/compositions/Reel02/
  timeline.ts        escenas (frames), locución (segundo de entrada de cada frase) y titulares
  drivers.ts         curvas de la historia por frame (encendido, congelado, línea azul, modo red…)
  camera.ts          claves de cámara (Catmull-Rom + easing) y `project()` para anclar interfaces
  Scene3D.tsx        lienzo 3D: cámara, luces, sombras suaves, reflejos, niebla, bloom y viñeta
  city/layout.ts     modelo de la ciudad con semilla fija: manzanas, edificios, comercios, faroles,
                     árboles, autos, rutas por las calles, arcos y pines por tipo de comercio
  city/materials.ts  paleta del reel y fachadas con ventanas procedurales (shader)
  city/City.tsx      suelo, edificios instanciados, comercios, faroles con halo, árboles, tráfico
  city/HeroShop.tsx  comercio protagonista: interior, comerciante, letrero y planos de gestión
  city/Connections.tsx  rutas luminosas que se dibujan, pulsos, arcos y nodos en las puertas
  ui/                titulares, mensajes, tienda (teléfono + web), panel, automatización + IA,
                     comunidad y cierre; `kit.tsx` con tokens, iconos y curvas
  audio.ts           pistas de public/audio/reel02/
```

| Escena | Segundos | Qué pasa |
|---|---|---|
| 1 Ciudad | 0–7,2 | Sobrevuelo nocturno; los comercios se encienden; llegan mensajes; la cámara pasa bajo el toldo |
| 2 Problema | 7,2–14,6 | Interior: el comerciante, mensajes que se acumulan y pedidos pendientes; todo se congela |
| 3 Visión | 14,6–20,4 | Línea azul desde la puerta que recorre la ciudad y conecta comercios ("Conectado") |
| 4 Compra | 20,4–29,8 | Teléfono y web nacen del letrero: descubre → catálogo → producto → carrito → pago → confirmación |
| 5 Gestión | 29,8–36,2 | El pedido entra al edificio; pedidos, inventario, ventas, reportes y tienda web se actualizan |
| 6 Automatización | 36,2–44,4 | Flujo cliente → tienda → pedido → panel → notificación; asistente IA con datos del comercio |
| 7 Comunidad | 44,4–54 | Gran plano: la red crece; tipos de comercio y lo que pasa entre ellos (sin cifras) |
| 8 Cierre | 54–63,5 | La ciudad se hunde en negro, quedan las líneas; firma, lema, llamada a la acción e isotipo |

Exportar (sin GPU, WebGL por software; ~3 s por frame con 4 núcleos):

```bash
export REMOTION_BROWSER=/ruta/al/chrome-headless-shell   # si no puede descargarse
export REMOTION_GL=swangle                               # sin GPU (con GPU: angle o omitir)
npm run render:reel02
REMOTION_GL=swangle node scripts/qa.mjs Reel02 150,300,700,1000,1450,1700   # frames de revisión
```

Audio (`public/audio/reel02/`):

```bash
# Voz TEMPORAL (Kokoro, local). Para la definitiva: grabar el mismo guion y reemplazar reel02-voz.mp3
# respetando los segundos de entrada de timeline.ts → voice.
pip install kokoro-onnx soundfile
python3 scripts/audio/generate_reel02_voice.py <carpeta con kokoro-v1.0.onnx y voices-v1.0.bin> public/audio/reel02
# Música y efectos originales (síntesis propia); la música se agacha bajo la voz.
python3 scripts/audio/generate_reel02.py public/audio/reel02
```

Paleta de esta pieza (pedida para el reel, cercana a la marca): fondo #080A0F, superficies #171C26,
azul eléctrico #2563EB y cian #38DDF5 como luz secundaria. Titulares Lato, interfaz Inter.
Comercio, productos, precios y datos del panel son de ejemplo y se rotulan como interfaz conceptual.

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


## Reel 03 — "Dos negocios, dos formas de trabajar"

Ejemplo ilustrativo con negocios ficticios: dos tiendas con la misma arquitectura, los mismos
productos y la misma calle. La izquierda (SIN Fary Labs, luz cálida) lo hace todo a mano; la
derecha (CON Fary Labs, luz azul) vende desde su tienda web y gestiona todo en una app.
Reutiliza la ciudad, los materiales y el kit de interfaz del Reel 02.

```
src/lib/camera3d.ts                 cámara por claves + `project()` (compartible entre reels 3D)
src/compositions/Reel03/
  timeline.ts        escenas, locución (segundo de entrada) y subtítulos (máx. dos líneas)
  drivers.ts         curvas por frame (línea divisoria, actividad manual, corte, red, fundido)
  camera.ts          recorrido continuo: aérea → pantalla dividida → tienda digital → corte →
                     plano general → elevación final
  Scene3D.tsx        ciudad del Reel 02 + corredor despejado frente a las tiendas + DOF + bloom
  city/TwinShops.tsx las dos tiendas (misma geometría; cambian luz, herramientas y gestos) y la
                     línea de luz que las divide; los pisos superiores se levantan en el corte
  city/Network.tsx   rutas y arcos que salen de la tienda digital en el cierre
  ui/                Overlays (etiquetas SIN/CON, subtítulos, mensajes grandes, aviso de ejemplo),
                     Manual (mensajes, hojas de cálculo, libreta, notas), Digital (teléfono del
                     cliente, tienda web, cadena Cliente → Panel, app administrativa + IA integrable),
                     EndCard (firma, "Digitaliza tu negocio.", pregunta final, isotipo)
subtitles/Fary_Labs_Dos_Negocios.srt   subtítulos para subir aparte a TikTok / Reels si se prefiere
```

| Escena | Segundos | Voz |
|---|---|---|
| 1 Presentación | 0–6,2 | "Dos negocios. Mismos productos. Mismas oportunidades." |
| 2 El problema | 6,2–15,2 | "Pero hay una diferencia. Uno responde cada mensaje…" (pantalla dividida) |
| 3 La transformación | 15,2–24,3 | "El otro tiene Fary Labs. Sus clientes pueden comprar… Sus pedidos llegan a un solo lugar." |
| 4 La administración | 24,3–29,2 | "Y puede gestionar inventario, ventas y gastos desde una aplicación." (corte arquitectónico) |
| 5 La diferencia | 29,2–36,9 | "¿La diferencia? Uno depende… El otro tiene herramientas para crecer." |
| 6 Cierre | 36,9–45 | "Fary Labs. Digitaliza tu negocio. ¿Cuál de los dos quieres tener?" |

La escena 3 (compra y flujo del pedido) va antes que la administración para seguir el orden del
guion de voz. Audio: `generate_reel03_voice.py` (voz temporal, Kokoro) y `generate_reel03.py`
(música y efectos originales), igual que en el Reel 02. Exportar: `REMOTION_GL=swangle npm run render:reel03`.