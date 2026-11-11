# NOA Cookies DESIGN.md

> Sistema de diseño de la tienda web, derivado del manual de marca de NOA Cookies
> y de su menú público. Los valores marcados como *del manual* son exactos; el
> resto son decisiones de este proyecto.

## Lectura de las referencias

**Manual de marca (imagen).** Paleta de cinco colores con HEX; Oswald en
mayúsculas para titulares, nombres de sabor y precios; Poppins para textos;
logo circular naranja con marca azul; regla de aro blanco sobre amarillo;
historias destacadas que alternan círculos azul y naranja; tono cercano y
venezolano; fotografía con el relleno como héroe sobre fondos lisos de marca.

**Menú (dos capturas).** Fondo crema con textura de papel; cada producto es una
foto recortada con su mitad abierta encima; el nombre va en una **etiqueta azul
sólida** con texto blanco; descripción de una o dos líneas; precio suelto sin
símbolo. Dos grupos: Cookies (todas a 4.00) y Especiales.

**Video de referencia.** No se recibió. La dirección de movimiento sigue la
descripción escrita del encargo: producto enorme al centro, titular gigante
detrás, elementos flotantes, fondo que cambia con el producto.

## Visual theme

- Tono: goloso, directo y divertido; premium sin pretensión.
- Principios:
  1. **La cookie siempre es lo más grande de la pantalla.** "Because bigger is
     better", literal.
  2. **Dos recursos heredados y ninguno más:** el círculo (logo, historias
     destacadas) y la etiqueta azul (menú). No hay tarjetas, degradados ni
     adornos ajenos a la marca.
  3. **Un solo momento coreografiado:** el cambio de sabor del hero. Todo lo
     demás se mueve únicamente como respuesta a una acción.
  4. **Comprar nunca está a más de un pulgar:** se añade desde el hero o el
     catálogo, y el pedido es un panel, no otra página.

## Color roles

| Token | Hex | Uso |
| --- | --- | --- |
| `--color-noa-orange` | `#F2B052` *del manual* | Color principal: discos de cookies, botón sobre fondos oscuros, footer |
| `--color-navy` | `#112951` *del manual* | Texto, etiquetas, botón sobre fondos claros, sección destacada |
| `--color-butter` | `#F2BB40` *del manual* | Acento: precio en el hero, franja del sabor del mes |
| `--color-choco` | `#5A3A22` *del manual* | Fondo de una escena del hero |
| `--color-dough` | `#FFF6E8` *del manual* | Fondo del catálogo y de los paneles, texto sobre oscuro |
| `--color-danger` | `#B3261E` | Solo errores de formulario (funcional, no de marca) |

Cada cookie del hero ocupa uno de los cinco colores, elegido por contraste con
la foto:

| Cookie | Fondo | Titular |
| --- | --- | --- |
| Signature | Midnight Navy | NOA Orange |
| Choco Lovers | NOA Orange | Dough |
| Velvet | Butter | Midnight Navy |
| Nutella Bomb | Choco | Butter |
| Maní-fica | Dough | NOA Orange |

Regla de botones: acción principal en **navy sobre fondos claros** y en
**naranja sobre fondos oscuros**.

## Typography

- Display: `"Oswald Variable", "Oswald", "Arial Narrow", sans-serif` — 700,
  mayúsculas, interlineado 0.86–1, tracking −0.012em en tamaños gigantes.
- Texto: `"Poppins", system-ui, sans-serif` — 400 / 500 / 600, en frase normal.

| Rol | Fuente | Tamaño |
| --- | --- | --- |
| Titular del hero | Oswald 700 | Se ajusta por JS al ancho disponible (hasta ~22rem) |
| Título de sección | Oswald 700 | `clamp(2.75rem, 7.4vw, 6.5rem)` |
| Nombre de producto (etiqueta) | Oswald 700 | 1.06–1.75rem |
| Precio | Oswald 700, símbolo y decimales al 58 % | 1.75rem en catálogo |
| Cuerpo | Poppins 400 | 1rem / 1.55 |
| Secundario | Poppins 400 | 0.875rem / 1.4 |

Las mayúsculas se reservan para Oswald, como en el manual. Las etiquetas de
interfaz en Poppins van en frase normal.

## Layout and spacing

- Contenedor: `min(100% − 2 × gutter, 1320px)`; gutter `clamp(16px, 4vw, 48px)`.
- Hero: 100svh, rejilla de tres filas (cabecera, escena, panel de compra). La
  escena usa unidades de contenedor para que la cookie crezca sin tapar el botón.
- Catálogo: 2 columnas en móvil, 3 en tablet, 5 (cookies) y 4 (especiales) desde
  1200px: una sola fila, como un mostrador.
- Puntos de quiebre: 768px, 860px (composición de escritorio del hero), 1200px.
- El catálogo sube 28px sobre el hero con esquinas redondeadas: avisa que hay
  más contenido sin texto ni flecha.

## Components and states

- **Botón principal:** píldora, 56–68px de alto, Oswald 700. Al pulsar se hunde
  un 2,5 %. En el hero confirma con "Añadida al pedido" y el icono gira.
- **"+" del catálogo:** círculo de 48px. Con unidades en el pedido se convierte
  en contador (− cantidad +) en el mismo sitio.
- **Variantes:** píldoras con semántica de radios (topping, relleno, versión).
- **Producto:** foto sobre disco (naranja en cookies, azul en especiales),
  etiqueta azul, descripción, precio y "+". Sin tarjeta ni sombra de caja. Las
  piezas alargadas se asoman del disco. Con cursor, la foto crece y gira 5°.
- **Agotado:** foto en gris, "Agotado" en lugar del "+", y aviso en el pedido si
  se agota después de añadirlo.
- **Pedido:** `<dialog>` modal. Panel lateral de 460px en escritorio, hoja
  inferior al 92 % en móvil. Pie fijo con totales y acción.
- **Formulario:** campos de 54px con texto de 16px (iOS no hace zoom),
  autocompletado nativo, error bajo el campo y foco al primero que falla.
- **Cabecera:** marca (una cookie mordida, dibujo propio que no es el logotipo
  de NOA, más el nombre en Oswald 700), "Menú" y eslogan. La marca toma el
  color del texto de cada escena. El acceso al pedido es fijo: píldora crema
  con borde azul, legible sobre los cinco fondos.

## Elevation and motion

- Sombras: solo la de contacto de las fotos (`drop-shadow` suave) y la del
  acceso flotante al pedido. Nada más se eleva.
- Tokens de microinteracción: `--pm-fast 130ms`, `--pm-normal 240ms`,
  `--pm-slow 380ms`, salida `cubic-bezier(.22, 1, .36, 1)`.
- GSAP: `power3.out`, `power4.out`, `expo.out`; sin rebotes ni elásticos.
- Cambio de sabor (≈1,4 s): la cookie sale rodando (0,6 s, `power3.in`), el
  color nuevo crece desde el centro (0,95 s, `power3.inOut`), la siguiente entra
  rodando en el mismo sentido y se asienta (`expo.out`), el titular sube letra a
  letra. La interfaz cambia de color cuando el fondo nuevo llega a los bordes.
- Scroll: una aparición por bloque (30px, 0,95 s, una sola vez); el hero sale
  más despacio que la página; la foto destacada gira con el scroll.
- Movimiento reducido: todo lo anterior pasa a cambios de estado inmediatos.

## Accessibility and don'ts

- Foco: anillo de 3px cuyo color cambia por sección para contrastar con el fondo.
- Contraste: texto azul sobre crema 13,4:1, sobre naranja 7,6:1 y sobre
  amarillo 8,2:1; crema sobre chocolate 9,5:1. El titular gigante es decorativo
  (crema sobre naranja no llega al mínimo de texto): el nombre se repite en la
  etiqueta azul y es lo que leen los lectores de pantalla.
- Objetivos táctiles de 44px o más en los controles de compra.
- Las apariciones usan `opacity`, no `visibility`: el contenido sigue disponible
  para lectores de pantalla y teclado antes de aparecer.
- Procedencia de imágenes: recortes del menú público de @noacookies, ampliados y
  sin fondo; provisionales hasta contar con los originales.
- Evitar: colores fuera de la paleta, emojis en lugar de fotos, tarjetas con
  sombra, degradados decorativos, mayúsculas en Poppins, animaciones que no
  respondan a una acción (salvo el cambio de sabor), y cualquier paso que
  obligue a salir de la página para comprar.
