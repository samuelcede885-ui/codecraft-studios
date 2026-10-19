# Rafa's · La Mentirosa

Landing estática (HTML + CSS + JS, sin dependencias). El estilo sigue `DESIGN.md` (dorado sobre óxido, tipografía de póster, controles en píldora, sin sombras). Abre `index.html` o sirve la carpeta:

```
npx http-server rafas
```

- `assets/la-mentirosa.webp`: la hamburguesa recortada del banner original.
- En `main.js`, `CONFIG.orderUrl` y `CONFIG.newsletterUrl` están vacíos. Mientras lo estén, la página avisa que los pedidos en línea y las suscripciones "abren pronto".
- Giro 360°: `assets/360/` tiene 96 fotogramas recortados del video de producto (fondo quitado, mismo encuadre). El último fotograma es el ángulo del banner. Se listan en `CONFIG.spinFrames`; si lo vacías, se usa el giro 3D de la foto única.
- Los textos de ingredientes y del "por qué" son propuestas editables; confírmalos con la receta real.
