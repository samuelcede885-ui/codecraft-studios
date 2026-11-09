---
name: base44-premium-motion
description: Estandariza animaciones de calidad premium en aplicaciones Base44 basadas en React. Usar al construir o mejorar cualquier app, pantalla, modulo, navegacion, modal, menu, tarjeta, formulario o transicion de Base44. Implementa tokens de movimiento, fade-in scale de arranque, entradas escalonadas, transiciones de rutas, salidas controladas, microinteracciones, accesibilidad reduced-motion y auditoria de rendimiento sin cambiar logica de negocio.
---

# Base44 Premium Motion

## Mision
Agregar movimiento consistente, discreto y elegante al frontend de una app Base44, sin romper rutas, accesos, formularios, consultas, branding ni funcionalidad. Aplicar automaticamente a cada modulo nuevo cuando el usuario solicite implementacion de frontend Base44.

## Secuencia obligatoria
1. Inspeccionar la estructura REAL del proyecto: package.json, enrutador, Layout, paginas, componentes, estilos, utilidades de Base44, rutas y estado. No asumir estructura ni instalar paquetes sin verificar compatibilidad o permisos.
2. Identificar puntos de montaje y navegacion. Preservar providers, auth, roles, cache, datos, formularios, eventos y persistencia de estado.
3. Definir sistema unico de tokens de movimiento. Reutilizar `assets/premium-motion.css` como base o adaptar sus variables a los estilos existentes. Consultar `references/patterns.md` para decisiones y requisitos.
4. Por defecto priorizar CSS transform/opacity y transiciones cortas. Si `motion/react` o `framer-motion` ya esta disponible, usarlo para presencia de vistas y transiciones complejas. Si instalar dependencias no es posible, implementar fallback CSS sin bloquear desarrollo.
5. Integrar un solo orquestador de navegacion; no insertar `AnimatePresence` anidados sin razon. Asegurar key de ruta estable, outlet compatible con el router real, y unmount posterior a exit. Respetar estado de formularios, carga de datos y scroll.
6. Entrada inicial solo una vez por montaje del shell, con fade + desplazamiento/escala moderados; nunca impedir interaccion por un splash largo ni ocultar contenido indefinidamente.
7. Navegacion de pantallas: transicion saliente corta cuando se controla el cambio de ruta y entrada direccional leve, con stagger en 3-8 bloques importantes. No animar listas de cientos de filas ni datos criticos como si fueran indicadores de carga.
8. Microinteracciones: hover, focus-visible, press, menus, dialogs, feedback asincrono y estados de error/confirmacion. Mantener foco, teclado, orden de lectura y objetivos tactiles.
9. Integrar `prefers-reduced-motion`: eliminar desplazamientos, escalas, parallax y stagger; conservar cambios de estado instantaneos o desvanecimientos minimos. Evitar flashes y cualquier bloqueo a personas con sensibilidad vestibular.
10. Probar en dispositivos moviles y desktop, rutas profundas, back/forward, autenticacion y cambios rapidos de rutas. Medir long tasks, fotogramas lentos, CLS y tiempos de interaccion. 60 FPS es un objetivo sujeto a dispositivo y carga, nunca una garantia.
11. Reportar archivos concretos modificados, controles probados, degradaciones, problemas de rendimiento y requisitos pendientes. No declarar cobertura global antes de verificar cada shell/pagina.

## Entregables obligatorios en una implementacion
- Tokens globales con convencion `--pm-*` y clases `pm-*`.
- Wrapper de pagina sin cambios de logica ni endpoints, o transicion CSS equivalente.
- Wrapper de modal/menu accesible si existen.
- Ejemplo de animacion de entrada, navegacion saliente y stagger.
- QA reproducible acorde con `references/qa.md`.

## Restricciones no negociables
- No simular ni prometer animacion al cerrar pestaña, matar proceso, forzar reload, abandonar sitio externo o descargar app: `beforeunload` / `pagehide` no garantizan ejecutar o completar animaciones. Solo animar `exit` al navegar dentro de la SPA o al cerrar modales/paneles controlados.
- No utilizar `setTimeout` arbitrario para temporizar navegaciones ni interceptar enlaces externos sin necesidad.
- No animar width/height/top/left/box-shadow/filter/blur intensos en loops. Priorizar transform y opacity; para expansion variable usar medicion prudente en pocos elementos.
- No usar `will-change` indiscriminado: aplicar solo a elementos animados brevemente y revisar consumo de memoria.
- No introducir libreria adicional si ya existe una solucion equivalente integrada.
- No garantizar 60 FPS. Medir sobre hardware objetivo, throttling razonable y rutas representativas.
- Nunca reemplazar shell, rutas, autenticacion o SDK Base44 para implementar animaciones.

## Material incluido
- `assets/premium-motion.css`: tokens, entradas, stagger, feedback de botones, reduced motion.
- `assets/PremiumMotion.jsx`: envoltorios React de uso opcional con Motion; adaptar import al paquete instalado.
- `references/patterns.md`: integracion y limites Base44.
- `references/qa.md`: pruebas y criterios de aceptacion.
- `assets/BASE44_PROMPT.md`: instrucciones listas para pegar al asistente de Base44.
