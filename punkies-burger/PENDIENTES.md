# Pendientes antes del lanzamiento

La web funciona completa, pero varios datos **no estaban en el material entregado** y no se inventaron.
Para verlos marcados en la página, abre el sitio con **`?revision`** al final de la URL
(ej. `http://localhost:5173/?revision`): cada dato pendiente aparece con un borde amarillo y una etiqueta.

## 1. Canal de pedidos (lo más importante)

| Dato | Dónde se configura | Qué pasa mientras falte |
| --- | --- | --- |
| Número oficial de WhatsApp para pedidos | `src/config/site.ts` → `ordering.whatsappNumber` (ej. `'58414XXXXXXX'`) | El checkout **no envía nada**. Muestra "Tu pedido todavía no se ha enviado", permite copiar el pedido y abrir Instagram. |
| Enlace oficial de delivery ("link en el perfil", IG 30 abr 2026) | `src/config/site.ts` → `ordering.deliveryUrl` | Los botones "Pedir delivery" llevan al menú con delivery preseleccionado. |

Con el número configurado, el último paso muestra "Enviar por WhatsApp" con el mensaje ya armado: productos, cantidades, subtotal y datos del cliente.
El pedido solo se considera enviado cuando el cliente presiona "Enviar" en WhatsApp, y la web lo dice así.
No hay pasarela de pago: no se configuró ninguna porque no existe un dato oficial.

## 2. Menú — `src/data/menu.ts`

Cada producto tiene una lista `pendiente`. Resumen:

| Producto | Fuente | Falta |
| --- | --- | --- |
| La Clásica | Instagram, 28 jul 2026 (ingredientes y "individual o en combo") | Precio individual, precio del combo, qué incluye el combo |
| La Punkie's | Manual de marca (maqueta web) | Precio, ingredientes completos, **foto propia** (hoy usa una foto de pan brioche) |
| Cheeseburger | Manual de marca (maqueta web) | Precio simple y doble; confirmar que la foto usada corresponde |
| Papas sazonadas | Manual de marca (maqueta web) | Precio, tamaños |
| Papitas con helado | Instagram, 10 may 2026 | Precio, **foto**, sabor del helado |
| Bebidas | — | Lista completa (la categoría se muestra con aviso de "todavía no está cargada") |

- Precios en USD: escribir el número (ej. `price: 8.5`) y la web calcula subtotales sola.
- Las descripciones de La Punkie's, Cheeseburger y Papas sazonadas vienen de la maqueta del manual: confirmar que son exactas.

## 3. Especiales

- No hay ningún especial activo confirmado, así que la sección muestra el estado vacío con el enlace a Instagram.
- "Especial de septiembre" (IG 9 sep 2026, "aprovecha que le queda poco") aparece como **archivo, terminado y sin botón de pedido**. Falta su nombre y confirmar que ya terminó.
- Para activar un especial: agregar un producto con `category: 'especiales'` y `status: 'disponible'`. Aparece con "Ver especial" y "Añadir al pedido".

## 4. Local — `src/config/site.ts`

- **Horario** de referencia: lunes a miércoles de 12 p. m. a 9 p. m. y jueves a domingo de 12 p. m. a 11 p. m. Al confirmarlo, poner `hoursConfirmed: true`. El indicador "Abierto ahora" se calcula con este horario y la hora de Caracas.
- **Dirección**: Av. Mohedano, calle José Félix Ribas, Chacao. Confirmar número o referencia y poner `address.confirmed: true`.
- **Mapa**: hoy busca "Punkie's Burger, Av. Mohedano, Chacao, Caracas" en Google Maps (sin coordenadas inventadas). Verificar que el pin cae en el local; si no, pegar las coordenadas reales en `map.coordinates`.

## 5. Marca y fotos

- **Logo**: la firma y las tres estrellas se calcaron a vector desde el manual y la bolsa de delivery (`src/components/brand/marks.ts`, `public/brand/`). Si existe el archivo vectorial oficial (SVG/AI/PDF), reemplazarlo.
- **Fotos**: salen de capturas de Instagram (1170 px) y de fotogramas de los collages (hasta 1000 px). Con los originales en alta resolución, reemplazar los archivos de `/fotos` (mismo nombre) y correr `npm run fotos`.
- El sello "J-505513141" que aparece en algunas fotos no se publicó. Si quieren mostrar el RIF en el pie, confirmar el dato.

## 6. Dominio y SEO

- `src/config/site.ts` → `siteUrl` e `index.html`: con el dominio definitivo, agregar `<link rel="canonical">`, `og:url`, URLs absolutas en `og:image` y un `sitemap.xml`.
- Los datos estructurados (`schema.org/Restaurant` en `index.html`) usan la dirección y el horario de referencia: actualizarlos si cambian.
