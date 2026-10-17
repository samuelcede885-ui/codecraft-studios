# Biblioteca de dirección visual derivada de las referencias del usuario

Son patrones generales, **no plantillas para clonar marcas o diseños**.

| Arquetipo | Composición | Movimiento recomendado | Ideal para |
|---|---|---|---|
| Botanical Impact | Verde saturado, objeto orgánico gigante centrado, tipo XXL debajo o detrás, microcopy lateral | Entrada con rotación ligera, capas de hojas y tipografía reveal | Bebidas, naturaleza, cosmética |
| Soft Product Monument | Botella/packshot hero en centro, tipografía blanca recortada detrás, luz difusa y sombras suaves | Botella levita 8–16 px, sombras ligadas a posición, fondo con desplazamiento lento | DTC, bebidas, packaging |
| Dark Cinematic Editorial | Fotografía dramática, halo/disco luminoso, protagonista central, mega lettering inferior | Reveal con máscara, parallax diferencial, desplazamiento narrativo | Agencias, cine, portfolios |
| Playful Dessert Stage | Fondo sólido cálido o rojo, producto con frutas/elementos recortados, forma orgánica en base | Ingredientes aparecen en stagger, flotación de fragmentos, CTA microelastic | Gastronomía, retail |
| Architecture Overscale | Título negro gigantesco detrás de render arquitectónico, blanco crema, tarjetas secundarias | Edificio entra con perspectiva suave y scroll zoom ligero | Inmobiliaria, arquitectura |
| Landscape Portal | Marco redondeado blanco, tipografía de marca monumental, paisaje cinematográfico | Reveal por clip-path, drift de paisaje, scroll unveil | Estudio, branding, turismo |
| Travel Storyboard | Asimetría modular, fotografía destination, formulario y tarjetas horizontales | Entradas con offset, pequeñas imágenes en hover, transición de carrusel | Viajes, experiencias |
| Monochrome Product Stage | Escenario monocromo azul, producto 3D central y wordmark XL con capas | Rotación limitada del producto, colorways, indicadores interactivos | Muebles, moda, tecnología |
| Experimental Typographic Grid | Retícula editorial visible, composición modular, palabra cortada en mega escala | Letras reveladas por líneas y desplazamiento por bloques | Estudios creativos |

## Sistema rápido de composición

1. Definir `heroHeight`: generalmente min-height 85–100svh en desktop, altura flexible en mobile.
2. Crear 3–5 capas con roles: `background`, `displayType`, `subject`, `editorialCopy`, `navigation/CTA`.
3. Fijar safe zones: 5–7vw laterales desktop; 20–24px móvil, ajustado a marca.
4. Tipografía hero: rango aproximado de 64–180 px en desktop, 44–80 px en mobile, según número de caracteres.
5. Reservar regiones de lectura con contraste suficiente. Productos sobre letras pueden ocupar parte del wordmark, nunca el único H1 inteligible.
6. En móvil, permitir crop nuevo o alternate asset y mover el producto al centro, con CTA legible y accesible.
7. Limitar a 1–2 técnicas hero de alto impacto. No mezclar todos los arquetipos en una sola página.

## Guion de propuesta para cada banner

- **Concepto**: una frase emocional.
- **Pieza hero**: qué objeto transmite el producto.
- **Jerarquía**: título, subtítulo y CTA.
- **Planos**: fondo / letras / objeto / elementos ambientales / interfaz.
- **Movimiento**: entrada, idle, hover, scroll, reduced motion.
- **Responsive**: cambios intencionales de encuadre y ritmo.
- **Prueba visual**: captura desktop y mobile con inspección de contraste y clipping.
