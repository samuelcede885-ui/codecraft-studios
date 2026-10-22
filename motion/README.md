# Fary Labs — Motion

Reels verticales construidos con código: React + TypeScript + Remotion.
1080 × 1920, 30 fps, 9:16 (Instagram Reels y TikTok).

```bash
cd motion
npm install
npm run dev            # Remotion Studio
npm run render:demo    # out/demo.mp4
npm run still:demo     # out/demo.png (frame 150)
```

Si el entorno no puede descargar Chrome Headless Shell, indicar uno local con
`REMOTION_BROWSER=/ruta/al/headless_shell`.

## Estructura

```
src/
  Root.tsx                 composiciones registradas
  theme/fary.ts            paleta, zona segura, tipografías, stagger
  theme/fonts.ts           Lato e Inter locales (public/fonts, OFL)
  lib/iso.ts               proyección isométrica 2:1 (coordenadas en tiles)
  lib/motion.ts            curvas, entradas de UI y transición activo/inactivo
  data/city.ts             la ciudad: edificios = sistemas, calles, farolas, rutas de datos
  data/reels.ts            duración, textos y audio de cada pieza
  components/
    IsometricWorld.tsx     lienzo del mundo + WorldLayer (capas con nombre)
    IsometricCamera.tsx    cámara (x, y, scale) + useCameraPath para movimientos continuos
    City.tsx               la ciudad por capas, con estados por sistema
    Building.tsx           edificio con estado active / inactive (ventanas, pantalla, glow)
    Road.tsx · StreetLight.tsx · Tree.tsx · DigitalPerson.tsx
    DataFlow.tsx           línea de datos SVG (strokeDashoffset, nodos y paquetes)
    FloatingLabel.tsx      etiqueta dentro del mundo
    KineticTitle.tsx       título de 2–4 líneas, palabra a palabra
    HighlightWord.tsx      palabra clave: barra → crece → revela el texto
    PhoneMockup.tsx        teléfono gráfico que recibe una interfaz React (390 × 844)
    SafeArea.tsx           zona segura de la app (con guías opcionales)
    AudioLayer.tsx         voz, música y efectos (archivos propios o con licencia)
  screens/                 interfaces para los teléfonos (BookingScreen…)
  compositions/            Demo, PhonePreview; los reels irán en Reel01, Reel02…
```

## Reglas

- Todas las animaciones dependen del frame (`useCurrentFrame`, `spring`, `interpolate`). Nada de
  `setTimeout`, `Date.now` ni animaciones CSS en tiempo real: el render es determinista.
- Entradas de UI: opacity 0 → 1, translateY 30 → 0, scale .96 → 1, con 3–6 frames de stagger.
- El verde (#19FF72) solo para lo activo: sistemas encendidos, datos, automatización, CTAs y la
  palabra clave. El resto vive en negros, grises y la luz cálida (#D7A65A).
- Texto importante siempre dentro de `SafeArea` (arriba 250, derecha 180, abajo 440 px).
- Sin música ni assets sin licencia.
