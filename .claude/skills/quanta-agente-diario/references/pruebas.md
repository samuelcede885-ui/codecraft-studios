# Lista de aceptación y pruebas de regresión

## Pruebas obligatorias

1. **Pantallas existentes:** inicio, materias, tareas, exámenes, perfil, ajustes, navegación inferior, Estudiante Pro, PIN, modo oscuro y modal de importación. Sin pérdidas funcionales.
2. **Fuente desconectada:** estado `sin fuente autorizada`, cero llamadas a Quanta y aviso claro. La aplicación sigue funcionando con archivos importados.
3. **Primera ejecución:** 2 tareas nuevas ficticias producen 2 borradores completos, 2 estados `ready_for_review` y notificaciones correspondientes si hay proveedor habilitado.
4. **Idempotencia:** ejecutar dos veces con los mismos IDs/hashes no crea duplicados ni reenvía avisos.
5. **Edición de tarea:** cambiar la consigna crea revisión nueva y enlaza la anterior; no pierde el trabajo previo.
6. **Cron diario:** respetar zona horaria declarada y el lock por usuario/fecha. Comprobar cambio de día sin duplicar trabajos por reinicio del servidor.
7. **Fallo LLM:** registrar `failed` con reintento controlado; no publicar como `ready_for_review` un borrador incompleto.
8. **Fallo de notificación:** conservar `ready_for_review` y reintentar solo aviso, no regenerar el texto.
9. **Privacidad:** user A no puede leer borradores de user B; no enviar claves ni datos sensibles al frontend o logs.
10. **No entrega automática:** comprobar que no hay llamadas remotas de envío; `submitted_by_student` solo se marca por acción explícita del estudiante o una confirmación institucional autorizada.
11. **Pruebas supervisadas:** producir guía de estudio, no respuestas para completar la evaluación en nombre del estudiante.
12. **Sin información suficiente:** `needs_input` y preguntas concretas, sin inventar resultados de laboratorio, citas o experiencias.
13. **Copiar:** el botón copia el borrador correcto, no el prompt de Claude. Confirmar accesibilidad en móvil.
14. **Persistencia:** cerrar el navegador, reabrir y verificar que los borradores aún existen en backend.
15. **Verificación real:** con proveedor configurado, hacer un envío de notificación de prueba y documentar resultado. Sin proveedor, reportarlo como pendiente.

## Definición de listo

Solo informar `operativo` cuando hayan pasado pruebas de scheduler, fuente autorizada viva, generación real, persistencia y notificación de prueba. Diferenciar `simulado`, `local probado`, `desplegado`, `configuración pendiente`, `bloqueado por permisos`.
