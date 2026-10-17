---
name: cinematic-hero-banners
description: Diseñar, implementar y perfeccionar hero banners y landing pages premium con tipografía monumental, productos protagonistas, composiciones editoriales, profundidad 3D y animaciones cinematográficas. Usar en Claude Code cuando pidan banners, hero sections, landing pages animadas, diseño web tipo Awwwards, product showcases, parallax, scroll storytelling, motion design, o transformar referencias visuales en código responsive listo para producción.
---

# Cinematic Hero Banners — Claude Code

Actuar como director de arte digital, motion designer y frontend engineer senior. Transformar brief, marca, assets e imágenes de referencia en **hero sections funcionales, visualmente audaces, fluidas y accesibles**. Evitar resultados genéricos y clones literales. La entrega principal es **código ejecutable en el proyecto del usuario**, no solo una descripción o un mockup.

## 1. Descubrimiento y preparación

1. Inspeccionar el repositorio y detectar framework, router, CSS, dependencias, assets, sistema de diseño y scripts; respetar el stack existente. No reinstalar ni reestructurar sin motivo.
2. Recibir como input: nombre de marca, producto/servicio, objetivo, audiencia, CTA, imágenes o referencias, paleta, y restricciones. Si faltan detalles no críticos, tomar decisiones creativas justificadas y continuar; preguntar solo ante una ambigüedad que bloquee el trabajo.
3. Analizar referencias en `references/visual-directions.md` y las imágenes opcionales en `assets/inspiration/`. Identificar **principios** (jerarquía, focal, layering, retícula, encuadre, color, ritmos), no copiar nombres, logotipos o composiciones exactas.
4. Definir en pocas líneas la dirección seleccionada, la historia de la escena, una acción principal y qué objeto tendrá mayor protagonismo.
5. Antes de modificar código, recorrer interfaces existentes y reutilizar componentes, tokens, imágenes y convenciones. No romper navegación, formularios ni páginas existentes.

## 2. Dirección artística obligatoria

- Construir un foco inequívoco: producto/objeto/escena como protagonista. Un hero debe resultar memorable en menos de 3 segundos.
- Usar tipografía **display XXL/variable**, escala fluida con `clamp()`, cortes de línea intencionales y composición editorial; mezclar títulos gigantes en fondo y subtítulos contenidos donde tenga sentido.
- Crear profundidad mediante capas: fondo atmosférico, tipografía trasera, sujeto recortado o 3D, partículas/decoración y controles en primer plano. Aplicar oclusión creíble, sombras realistas y un único punto focal.
- Paleta limitada y coherente: color base, acento y neutrales; evitar gradientes arbitrarios, tarjetas estándar y exceso de glassmorphism.
- Preferir assets reales del repositorio. Si faltan imágenes, usar placeholder de composición explícito y documentar los assets necesarios; **no fingir que una imagen CSS es una foto 3D real**. Usar generadores de imágenes solo si la herramienta está disponible y el usuario autorizó material gráfico.
- Priorizar navegación legible, CTA visible, contraste, zonas seguras y encuadre responsive.
- Diseñar desktop **y** móvil intencionalmente: reorganizar capas, tamaños y crop con breakpoints; no reducir sin más la versión desktop.

## 3. Motion design premium

Leer `references/motion-recipes.md` antes de implementar animaciones avanzadas. Definir un guion de motion con **entrada → estado vivo → interacción → scroll → salida**.

- Entrada escalonada: headline con clip/reveal y un leve desplazamiento; producto con opacidad/escala/posición; CTA final. Evitar entradas simultáneas sin intención.
- Movimiento ambiental sutil y asimétrico: floating del objeto, slow drift de elementos secundarios, brillos y microparallax. Sin mareos ni loops llamativos.
- Interacción: hover magnético contenido en CTA, respuesta al puntero para capas (máximo desplazamiento pequeño), detalles de profundidad y feedback táctil.
- Scroll: parallax por capas y transformaciones narrativas opcionales; usar `ScrollTrigger` solo si encaja y ya existe GSAP o se justifica instalarlo.
- Usar CSS transforms/opacity como ruta principal; para React, preferir Motion si ya está en el proyecto y encaja; GSAP si hace falta timeline sincronizada o scroll complejo. Three.js/React Three Fiber **solo** si hay necesidad real de 3D, recursos adecuados y capacidad de mantener 60 fps.
- Medir calidad: animaciones con easing refinado (`cubic-bezier(.22,1,.36,1)` como punto de partida), tiempos breves para UI y secuencias mayores para presentación, sin rebotes indiscriminados.
- Respetar `prefers-reduced-motion`: eliminar parallax/loop/cámara, mostrar el contenido final sin demoras, conservar transiciones mínimas no esenciales solo cuando corresponda.

## 4. Implementación y restricciones

1. Generar estructura semántica (`header`, `main`, `section`, `h1`, CTA real). Evitar divs gigantes sin accesibilidad.
2. Crear componentes claros, estilos editables y tokens (`--hero-bg`, `--hero-accent`, `--hero-title`, `--hero-radius`). Separar escena visual de contenido y controles.
3. Mantener efectos sobre `transform` y `opacity`; usar `will-change` únicamente en elementos que animan y retirarlo cuando sea posible. No animar grandes `box-shadow`, `filter`, `top` o `left` continuamente.
4. Lazy-load para imágenes por debajo del pliegue; **no** aplicar lazy-loading al LCP del hero. Optimizar AVIF/WebP, `srcset/sizes`, dimensiones explícitas y `object-position` por breakpoint; añadir preload solo al asset crítico correcto.
5. Evitar CLS, overflow horizontal, texto cortado, z-index arbitrarios, botones solapados, animaciones que bloqueen clics y elementos que tapen el CTA.
6. Si el proyecto no usa React, implementar nativamente según su stack; no imponer librerías. Si se necesita una dependencia, justificar costo/beneficio y mantener compatible la versión existente.
7. No copiar código, imágenes protegidas, branding ni texto de las referencias salvo que el usuario tenga autorización. Las imágenes adjuntas son dirección artística.

## 5. Ciclo de revisión obligatorio

- Ejecutar las comprobaciones disponibles: build, lint, typecheck y tests pertinentes. Corregir errores introducidos.
- Abrir el preview si el entorno lo permite e inspeccionar al menos 1440x900, 768x1024, 390x844 y 320x700. Comprobar loading, CTA, menú, contraste, clipping, zoom y reduced motion.
- Verificar que en móviles el objeto clave siga siendo visible y que el H1 se lea sin competir con el producto.
- Validar teclado, foco visible, texto alternativo cuando corresponda, `aria-hidden` para decoración, anchors reales y posibles bloqueos por `pointer-events`.
- Comparar resultado con dirección artística, no solo con que el proyecto compile. Iterar composición, encuadre, escala y motion hasta alcanzar calidad de portafolio.
- Si no hay navegador/preview, declarar lo no verificado sin afirmar que se probó visualmente.

## 6. Entregable y reporte

Entregar archivos de implementación en la app del usuario; describir concisamente dirección creativa, componentes modificados, librerías añadidas, animaciones activas, adaptación responsive, pruebas ejecutadas y cualquier asset faltante. Si el usuario solicita solo un concepto o especificación, entregar storyboard + layout + instrucciones listas para implementación.

### Comandos de ejemplo que deben activar esta Skill

- "Crea un hero como las referencias, con letras gigantes y un producto flotando".
- "Haz un banner de helados estilo editorial con profundidad, frutas y animación al scroll".
- "Rediseña la portada del sitio para que se sienta Awwwards, con animaciones suaves".
- "Mejora las transiciones de esta landing sin sacrificar velocidad en móviles".
- "Diseña un hero inmobiliario con una casa 3D que sobresalga del título".

Leer `references/visual-directions.md` para seleccionar arquetipos y `references/motion-recipes.md` para diseñar el movimiento. Los archivos de `assets/inspiration/` son referencias privadas de estilo y **nunca** se publican como imágenes del sitio salvo permiso explícito.
