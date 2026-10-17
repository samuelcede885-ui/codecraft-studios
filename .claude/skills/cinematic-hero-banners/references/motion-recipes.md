# Motion recipes — profesional, rápido y accesible

## Timing orientativo (ajustar al contenido)

- Headline reveal: 650–1100 ms, ease out smooth.
- Product reveal: 900–1400 ms, retraso 100–250 ms respecto al primer texto.
- Supporting copy: 500–750 ms.
- CTA reveal: 450–650 ms tras la llegada del producto.
- Hover: 180–320 ms; press: 90–180 ms.
- Ambient float: 4–9 s alternando dirección; amplitud 6–16 px en desktop y menor en móvil.
- Cursor parallax: desplazar 4–18 px, con smoothing; desactivar en táctil y reduced motion.

## Coreografía recomendada

1. `t=0`: fondo aparece de inmediato (evitar pantalla vacía).
2. `t=0.12`: wordmark/overline entra.
3. `t=0.24`: título gigante aparece con reveal lineal de líneas.
4. `t=0.38`: producto entra delante de las letras; ajustar escala y sombra.
5. `t=0.62`: descripción y CTA; el banner ya es utilizable.
6. `t=1.5+`: ambient loop mínimo; no repetir la entrada.

## CSS básico fallback

```css
.hero__product { transform: translate3d(0, 0, 0); animation: hero-float 6s ease-in-out infinite alternate; }
@keyframes hero-float { from { transform: translate3d(0, -6px, 0); } to { transform: translate3d(0, 8px, 0); } }
@media (prefers-reduced-motion: reduce) {
  .hero__product { animation: none; transform: none; }
  .hero *, .hero *::before, .hero *::after { scroll-behavior: auto; }
}
```

## React + Motion: criterios de implementación

- Comprobar si el proyecto ya tiene `motion`/`framer-motion`; usar la API correspondiente a su versión.
- Usar variantes `hidden`/`show` para orquestar texto y producto, evitando delays que oculten información crítica innecesariamente.
- Usar `useReducedMotion()` para desactivar loops y transformaciones extensas.
- `useScroll()` y `useTransform()` solo si el scroll effect es necesario. Limitar el rango del parallax; no ligar transformaciones a cálculos de layout.
- Si el render es SSR, evitar lecturas de `window` durante render; limpiar listeners/RAF en unmount.
- Para pointer parallax, preferir pointer fine; usar listener pasivo donde corresponda y actualizar con RAF, no setState a 60 fps en toda la página.

## GSAP: criterios de implementación

- Usar `gsap.context()` o scope equivalente y cleanup para componentes React.
- Crear una timeline principal legible con labels (`intro`, `subject`, `cta`).
- `ScrollTrigger` solamente para transiciones específicas; limpiar triggers al desmontar.
- No añadir GSAP y Motion para efectos equivalentes sin justificación.

## Three.js / R3F

- No convertir una foto en falso 3D. Proponer parallax 2.5D si no hay un modelo real.
- Reservar WebGL para objetos interactivos, iluminación/materiales complejos o modelos GLB/GLTF optimizados.
- Proveer poster/fallback cuando WebGL no esté disponible, y limitar pixel ratio en móvil.
- Evitar que canvas capture pointer del CTA y evitar recursos enormes.

## QA de motion

- No hay flashing, scroll-jacking invasivo ni animación que impida lectura.
- Contraste y CTA disponibles con JS lento o reduced motion.
- Layout estable antes de animar.
- Performance razonable en móvil; revisar LCP, CLS, INP y CPU throttling si herramientas disponibles.
- El contenido principal conserva sentido sin animación.
