# Rafa's · La Mentirosa

Landing estática (HTML + CSS + JS, sin dependencias). Abre `index.html` o sirve la carpeta:

```
npx http-server rafas
```

- `assets/la-mentirosa.webp`: la hamburguesa recortada del banner original.
- En `main.js`, `CONFIG.orderUrl` y `CONFIG.newsletterUrl` están vacíos. Mientras lo estén, la página avisa que los pedidos en línea y las suscripciones "abren pronto".
- Giro 360°: con una sola foto la hamburguesa se gira en 3D apilando la imagen en profundidad. Para un 360 real, toma 24–36 fotos en un plato giratorio, súbelas a `assets/360/` y lista sus rutas en `CONFIG.spinFrames`.
- Los textos de ingredientes y del "por qué" son propuestas editables; confírmalos con la receta real.
