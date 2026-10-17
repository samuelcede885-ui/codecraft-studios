# Fary Labs — web

Landing cinematográfica para Fary Labs: una única laptop fija en el centro cuya pantalla cambia
de proyecto mientras el usuario hace scroll, con textos que entran a ambos lados.

Next.js (App Router) · React · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # producción
npm run typecheck
```

## Estructura

```
app/
  layout.tsx        fuente, metadatos
  page.tsx          Header + Showcase + sección final
  globals.css       layout del escenario, laptop, tipografía, botones
  screens.css       estilos de las pantallas demo (en unidades cqw)
components/
  Showcase.tsx      sección fija (pin) y línea de tiempo GSAP con scrub
  Laptop.tsx        carcasa única de la laptop (CSS)
  screens/          pantallas demo de cada proyecto + ScreenLayer
  Header.tsx        navegación (salta a cada escena de la línea de tiempo)
  FinalCTA.tsx      sección negra final con CTA
  SmoothScroll.tsx  Lenis sincronizado con el ticker de GSAP
  Logo.tsx          logo provisional / logo original
data/
  scenes.ts         textos, iconos, colores y transición de cada escena
  site.ts           logo, correo de contacto, menú
lib/scroll.ts       store compartido (Lenis, saltos a escenas, sección activa)
```

## Editar contenido

- **Textos, servicios, colores y orden de proyectos:** `data/scenes.ts`. Cada escena define
  `title`, `description`, `features`, `accent` (tinte del fondo y reflejo bajo la laptop) y
  `transition` (`rise`, `wipe`, `fade` o `mask`).
- **Capturas reales:** guarda la imagen en `public/projects/` y añade `image: "/projects/…"`
  a la escena (ver `public/projects/README.md`). Sustituye a la pantalla demo.
- **Logo:** guarda el archivo en `public/brand/` y pon su ruta en `site.logoSrc`
  (y `site.logoSrcOnDark` para la sección negra) en `data/site.ts`.
- **Contacto:** `site.contactEmail` en `data/site.ts`; los botones finales abren un correo.
- **Ritmo del scroll:** constantes `HERO_HOLD`, `STEP`, `HOLD`, `TAIL` y la longitud del pin
  (`window.innerHeight * 5.4` en escritorio, `4.4` en móvil) en `components/Showcase.tsx`.

## Comportamiento

- La laptop se monta una sola vez; solo cambia el contenido de `.laptop-screen`, que recorta
  todo al borde exacto de la pantalla.
- Escritorio: laptop centrada, textos a izquierda y derecha. Móvil (< 1024 px): título arriba,
  laptop en el centro, servicios debajo, sin movimiento interno de elementos.
- `prefers-reduced-motion`: sin Lenis y solo fundidos de opacidad, sin desplazamientos.

## Pendiente

Los proyectos GREENADE, SIMPLY MILK, SYNTHA-6 y DEPTHFIELD se muestran como **demo** (etiqueta
visible) hasta confirmar que forman parte del portafolio. Faltan el logo original, las capturas
originales y el correo de contacto real.
