---
name: service-scroll-experience
description: Diseñar e implementar landing pages y sitios web de servicios que convierten usando animaciones cinematográficas dirigidas por scroll, storytelling comercial, sticky/pinned sections, parallax, textos cinéticos, morphing de elementos, transiciones de escena y microinteracciones. Usar en Claude Code cuando pidan una web de agencia, consultoría, estudio, SaaS o servicio premium con efectos de scroll similares a reels de webs inmersivas, optimizada para reservas, leads, WhatsApp o ventas. Se adapta al repositorio, branding y stack existente.
---

# Service Scroll Experience

Construir páginas comerciales que usen motion para explicar y vender un servicio, sin sacrificar velocidad ni claridad. Ejecutar cambios reales en el proyecto de Claude Code; no entregar solamente una maqueta o una lista de recomendaciones si se pidió implementación.

## 1. Descubrir antes de editar

1. Inspeccionar rutas, frameworks, dependencias, estilos, componentes y diseño existente. Conservar el stack y convenciones presentes; no rehacer el proyecto sin permiso.
2. Identificar servicio, público objetivo, diferenciador, oferta, evidencia, objeciones, CTA principal y destino funcional (formulario, WhatsApp, calendario, email). Preguntar solo los datos que impidan implementar correctamente; nunca inventar precios, métricas, logotipos, clientes o testimonios.
3. Ver `references/video-motion-map.md` para los cinco videos de referencia y `assets/reference-contact-sheet.jpg` para su interpretación visual. Inspirarse en patrones, no replicar textos, marcas o productos ajenos.
4. Definir un concepto visual único de alta calidad, con paleta, escala tipográfica, capas, contraste, densidad y ritmo de movimiento. Evitar un carrusel genérico de cards.
5. Entregar un mapa breve de secciones y movimientos antes de programar si el alcance es considerable; luego implementar directamente.

## 2. Funnel narrativo obligatorio

Mantener una progresión clara:

- **Hero / Promesa:** titular orientado al resultado, subtítulo de soporte, CTA visible sin scroll. Entrada con reveal tipográfico y escena hero elegante.
- **Problema / Fricción:** enunciar un dolor específico; usar scroll para mostrar el antes, sin forzar que el usuario espere a descubrir la solución.
- **Transformación / Mecanismo:** secciones sticky/pinned donde elementos se reorganizan, escalan, giran o cambian al hacer scroll; ilustrar *cómo* funciona el servicio.
- **Beneficios:** 3 a 5 beneficios concretos y legibles; intercalar escenas inmersivas con tramos de lectura tranquilos.
- **Pruebas:** casos, números verificados, proceso, demostraciones o ejemplos marcados como ilustrativos; no fabricar resultados.
- **Objeciones:** FAQ, proceso, tiempos y garantías únicamente si están documentados.
- **Oferta / Conversión:** propuesta precisa y CTA accionable y verificable; contacto accesible también en navegación y en móvil.

Cada animación debe tener un propósito: captar atención, explicar, comparar, dar confianza o dirigir al CTA. No ocultar información crítica tras efectos.

## 3. Coreografía de scroll

Combinar 3 a 6 técnicas relevantes (no todas de forma indiscriminada):

1. **Pinned storytelling**: fijar un contenedor mientras el scroll avanza escenas/textos; duración acotada (aprox. 150–300vh según contenido) y salida natural.
2. **Scroll-scrubbed transitions**: timeline ligada al progreso de scroll, reversibilidad al desplazar hacia arriba, easing sobrio y snap opcional solo si no obstaculiza navegación.
3. **Depth/parallax**: capas con velocidades distintas, 3D CSS moderado, escalado y cambios de perspectiva ligeros.
4. **Typography reveals**: máscaras/clip-path, splitting por palabras o líneas, reveals escalonados respetando HTML accesible.
5. **Scene transformation**: pasar de objeto/vista compacta a experiencia expandida mediante transform y opacity (FLIP cuando aplica).
6. **Horizontal gallery**: progreso horizontal vinculado a scroll vertical para presentar un proceso o casos; mantener interacción por teclado.
7. **Product/visual focus**: cuando no hay producto físico, protagonista visual = interfaz, mockup, diagrama propio, dato verificable, proceso o resultado del servicio; nunca hacer que la página parezca una tienda de bebidas.
8. **CTA microinteractions**: hover/focus/press refinados; nunca esconder el CTA tras una transición.

Motion de ejemplo: hero intro de 0.6–1.2 s; reveals de 0.4–0.9 s; stagger 0.06–0.12 s; distancias 16–60 px; escalas 0.94–1.08 salvo transiciones deliberadas. Usar como punto de partida, no reglas rígidas.

## 4. Implementación técnica

- En React/Next/Vite: preferir GSAP + ScrollTrigger para timelines scrub/pin complejas; GSAP context y `gsap.matchMedia()`, registrar plugin y limpiar con `ctx.revert()` al desmontar. Motion/Framer Motion para microinteracciones y entradas sencillas, sin duplicar sistemas.
- En sitios ligeros: `IntersectionObserver`, CSS y `scroll-timeline` solo si hay soporte o fallback adecuado.
- Mantener transformaciones preferentemente en `transform` y `opacity`; evitar animar layout continuamente. Medir contenedores y refrescar triggers después de cargar recursos/resize. Reservar espacio para imágenes; evitar layout shift.
- Lazy-load de escenas secundarias; imágenes AVIF/WebP cuando sea posible; video comprimido con poster y comportamiento sin autoplay intrusivo. No importar Three.js salvo que el efecto 3D realmente lo requiera y el presupuesto de rendimiento lo permita.
- Elementos fijados no deben tapar navegación ni contenidos. Evitar conflictos de `position: sticky`, `overflow`, z-index y padres transformados. Limitar la duración de pins y preservar desplazamiento nativo.
- Implementar desktop, tablet y móvil deliberadamente, no solo reducir medidas. En móvil simplificar pins complejos, escenas 3D y horizontal-scroll; evitar largas secciones vacías.
- `prefers-reduced-motion: reduce`: reemplazar pins/parallax/scrub por contenido visible y transiciones mínimas; todas las acciones deben permanecer accesibles sin animación.
- Botones y links con foco visible, formularios accesibles, contraste, lectura correcta, alt text, navegación teclado y scroll natural; no scroll hijacking. Asegurar contenido indexable y HTML semántico.
- Si hay CTA a WhatsApp/calendario/formulario sin configuración real, solicitar el dato o señalar claramente la acción pendiente; nunca enlazar a destinos falsos.

## 5. Plan de construcción

1. Documentar mapa: **sección → promesa → efecto → intención de venta → CTA**.
2. Crear componentes reutilizables (`ScrollScene`, `PinnedNarrative`, `KineticHeading`, `ServiceProof`, `ConversionCTA`) solo si ayudan a reducir repetición.
3. Implementar la primera escena completa y probar subida/bajada de scroll antes de duplicar patrones.
4. Implementar resto de secciones manteniendo contraste entre escenas impactantes y contenido tranquilo.
5. Construir interacciones reales: nav, CTAs, formulario, enlaces, estados, validación.
6. Ejecutar build, typecheck/lint/test disponibles; probar 375px, 768px y 1440px, incluyendo scroll hacia atrás y tamaño reducido; corregir errores encontrados.
7. Si existe navegador/captura, inspeccionar capturas en hero, mitad de pin, final de pin y conversión; iterar hasta que no haya clipping, saltos ni solapamiento.
8. Entregar resumen de archivos modificados, interacciones, pruebas realizadas y elementos pendientes de contenido o integraciones. No afirmar que se hicieron pruebas inexistentes.

## 6. Criterio de aceptación

La página debe comunicar qué se vende en menos de cinco segundos, disponer de CTA funcional y visible, incluir al menos una secuencia de scroll verdaderamente conectada al avance del usuario, funcionar cuando se invierte el scroll, mantener legibles los textos sin animación, evitar saltos de layout y no romper móvil ni accesibilidad básica. El movimiento debe ayudar a comprender la transformación ofrecida por el servicio, no reemplazar el mensaje comercial.

## 7. Recursos

- `references/video-motion-map.md`: lectura de cinco clips aportados y conversión de patrones hacia venta de servicios.
- `references/copy-and-conversion.md`: plantilla para adaptar mensajes y CTA al servicio.
- `assets/reference-contact-sheet.jpg`: fotogramas seleccionados de los clips, para orientación visual exclusivamente.

## Activaciones de ejemplo

- “Usa service-scroll-experience para crear una landing de consultoría que transforme el problema en solución con scroll cinematográfico y cierre con agendamiento”.
- “Convierte esta web de servicios en una experiencia tipo Awwwards con pinning y parallax, pero sin perjudicar las conversiones ni el móvil”.
- “Haz una página de agencia con narrativa scroll-scrubbed, hero tipográfico, resultados y CTA WhatsApp”.
