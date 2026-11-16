# Quanta Agente Diario

Skill para Claude enfocada en mejorar la aplicación Quanta AI ya creada, preservando su interfaz y funciones. Al detectar tareas nuevas mediante una fuente permitida, prepara borradores completos para revisión y avisa al estudiante; el estudiante copia y entrega manualmente.

## Instalación

Importa el ZIP como Skill de Claude si tu plan/entorno lo permite, y adjunta el código fuente completo de Quanta AI. La Skill no sustituye el backend ni crea una conexión al colegio por sí misma.

## Primera instrucción sugerida

> Aplica la Skill Quanta Agente Diario a mi proyecto. No cambies la navegación, PIN, materias, exámenes ni diseño. Implementa scheduler diario, fuente autorizada de novedades, generación de borradores mediante Anthropic API, persistencia y una notificación al terminar. Mantén las tareas como pendientes hasta que yo las entregue. Muéstrame primero qué está implementado y qué depende de una conexión o permiso que aún no tenemos.

## Importante

Si no existe una fuente autorizada de tareas nuevas, Claude puede construir el flujo de borradores y notificaciones para las tareas importadas, pero no debe afirmar que ya sabe lo que se publicó hoy en la plataforma del colegio.
