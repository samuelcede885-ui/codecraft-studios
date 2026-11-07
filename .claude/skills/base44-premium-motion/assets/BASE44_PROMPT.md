# Prompt listo para Base44

Actua como ingeniero senior de interfaces React especializado en Base44. Implementa un sistema de movimiento global premium en esta aplicacion SIN alterar logica de negocio, base de datos, SDK, permisos, rutas, contenido, branding ni flujos existentes.

Primero inspecciona la estructura actual, enrutador, Layout, librerias y CSS global. Integra un sistema unico de tokens de movimiento `--pm-*` (rapido 130ms, normal 240ms, entrada 380ms; easing cubic-bezier(.22,1,.36,1)).

1. Arranque: fade in + scale .985 -> 1 en 380ms una sola vez por montaje del shell, sin splash prolongado.
2. Navegacion interna: salida breve 130-180ms y entrada 180-260ms con desplazamiento maximo de 12px. Si el layout/routing lo permite, usa AnimatePresence bien ubicado y keyed por ruta, de lo contrario implementa CSS first-entry sin falsificar transiciones de salida.
3. Bloques prioritarios por pagina: stagger discreto 55ms entre un maximo de 8 elementos; no aplicarlo a tablas masivas ni resultados asincronos continuamente.
4. Botones, cards, tabs, menus, dialogos y toasts: interacciones fluidas con hover, press, focus-visible y estados de carga; no sacrificar semantica ni teclado.
5. Usar preferentemente transform y opacity, sin blur pesado ni layout thrashing. Activar reduced-motion y deshabilitar transformaciones y stagger para ese ajuste.
6. No animar cierre real de pestaña: los navegadores no lo garantizan. Solo cierre de overlays o rutas controladas.
7. Usa Motion para React solo si existe o se puede instalar correctamente; alternativa 100% CSS si no. No instales librerias duplicadas.
8. Prueba navegacion directa, atras/adelante, inicio de sesion, formularios, mobile, menus, reduced-motion y rendimiento. Reporta cambios exactos y fallos corregidos. Nunca declares 60 FPS garantizados sin medir.

Antes de editar realiza un plan por archivos y despues implementa y verifica los cambios, no te limites a describirlos.
