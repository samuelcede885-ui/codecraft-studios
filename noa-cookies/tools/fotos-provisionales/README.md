# Fotos y logo provisionales

Herramientas con las que se obtienen las imágenes de una marca a partir de las
capturas de su menú público, mientras no entregue sus archivos originales. Se
conservan para dejar constancia de la procedencia y para preparar la vista
previa de una marca nueva; **no hacen falta para ejecutar ni compilar el sitio**.

| Archivo | Qué hace |
| --- | --- |
| `pipeline.py` | Recorta cada producto de la captura, lo amplía ×4 con Real-ESRGAN, le quita el fondo (rembg) y exporta WebP con transparencia en 160, 480, 800 y 1200 px, las migas del hero, el grano de papel y el manifiesto `images.json` |
| `logo.py` | Recorta un logo de un solo color (p. ej. de la foto de perfil), lo amplía y lo traza como vector |
| `noa.json`, `pookies.json` | La receta de cada marca: cajas de recorte, orden de productos y texturas de las migas |

Dependencias: `pip install numpy opencv-python-headless ncnn "rembg[cpu]" pillow`
y los modelos `realesrgan-x4plus` (release `realesrgan-ncnn-vulkan` de Real-ESRGAN).

## Preparar una marca nueva

1. Guarda sus capturas en `<trabajo>/src/` y los modelos en `<trabajo>/models/`.
2. Copia `pookies.json` como `<marca>.json` y ajusta las cajas de recorte.
   `python3 pipeline.py <marca>.json recortes --root <trabajo>` las deja en
   `<trabajo>/work/` para comprobarlas en segundos.
3. Ejecuta los pasos, en orden:

   ```bash
   python3 pipeline.py <marca>.json upscale --root <trabajo>
   python3 pipeline.py <marca>.json matte   --root <trabajo>
   python3 pipeline.py <marca>.json export  --root <trabajo> \
     --out ../../brands/<marca>/public/img --manifest ../../brands/<marca>/images.json
   ```

Las capturas de iPhone vienen en Display P3; `pipeline.py` las convierte a sRGB
para que los colores no salgan apagados. Al medir los colores de una marca en
una captura hay que hacer la misma conversión.

## Cuando lleguen las fotos originales

No hace falta este proceso. Para cada producto:

1. Exporta la foto con fondo transparente en WebP a 160, 480, 800 y 1200 px de
   ancho, con el nombre `<id>-<ancho>.webp`, dentro de `img/products/` de la
   carpeta pública de la marca (`public/` para NOA, `brands/<marca>/public/`).
2. Actualiza su ancho y alto originales (`w`, `h`) en el `images.json` de la marca.
3. Pon `provisionalPhotos: false` en su `site.js`.
