# Fotos provisionales

Scripts con los que se obtuvieron las imágenes de `public/img/` a partir de las
capturas del menú público de @noacookies. Se conservan para dejar constancia de
la procedencia; **no hacen falta para ejecutar ni compilar el sitio**.

| Script | Qué hace |
| --- | --- |
| `upscale.py` | Recorta cada producto de la captura y lo amplía ×4 con Real-ESRGAN (ncnn, CPU) |
| `matte.py` | Quita el fondo crema (rembg, modelo isnet-general-use) y limpia el halo del borde |
| `export.py` | Exporta WebP con transparencia en 160, 480, 800 y 1200 px, genera las migas del hero, los iconos del sitio y el grano de papel, y escribe `src/data/images.json` |

Dependencias: `pip install numpy opencv-python-headless ncnn "rembg[cpu]" pillow`
y los modelos `realesrgan-x4plus` (release `realesrgan-ncnn-vulkan` de Real-ESRGAN).

## Cuando lleguen las fotos originales

No hace falta este proceso. Para cada producto:

1. Exporta la foto con fondo transparente en WebP a 160, 480, 800 y 1200 px de
   ancho, con el nombre `<id>-<ancho>.webp`, dentro de `public/img/products/`.
2. Actualiza su ancho y alto originales (`w`, `h`) en `src/data/images.json`.
3. Pon `provisionalPhotos: false` en `src/config/site.js`.
