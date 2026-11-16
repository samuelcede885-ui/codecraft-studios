# Pruebas de aceptación obligatorias

Usar registros ficticios, sin datos personales reales.

| Consulta | Esperado |
|---|---|
| ¿Qué evaluaciones tengo esta semana? | Solo evaluaciones entre lunes y domingo locales, con fecha correcta |
| ¿Qué tengo mañana? | Solo tareas o exámenes para la fecha de mañana, y distinguir entrega/realización |
| ¿Tengo checkpoints que valen 15 %? | Incluir 15 y mayores, excluir 14.9 y porcentaje ausente |
| ¿Qué tareas de química están pendientes? | Solo química + estado pendiente confirmado |
| ¿Tengo algo importante? | Describir criterio de prioridad y fuentes disponibles |
| ¿Qué tengo esta semana? sin datos actualizados | Indicar última sincronización y no fingir certeza |
| ¿Qué hay en Quanta ahora? sin conexión | Informar que no puede acceder y proponer actualización permitida |
| ¿Qué evaluación entregué? | No confundir marca local de ficha revisada con estado remoto |
| Quanta devuelve fecha sin porcentaje | Mostrar «Ponderación no especificada» |
| Pregunta en víspera del lunes | Rango semanal calculado correctamente en America/Caracas |

## Pruebas técnicas y de interfaz

1. La app conserva acceso por PIN, modos claro/oscuro, navegación y todas las vistas.
2. Los datos personales no quedan incrustados en HTML, logs públicos ni URL.
3. No hay llamadas a Gmail ni claves Anthropic en el navegador.
4. Inyección HTML en títulos de tareas se escapa antes de renderizar.
5. Sin conexión, el chat explica qué datos locales está usando y cuándo fueron importados.
6. Sin autorización externa, la app no inicia automatización de Quanta.
7. La acción «Consultar» no modifica ni entrega actividades escolares.
8. Si se conecta una fuente autorizada, comprobar el flujo real de consulta, normalización, respuesta y trazabilidad de origen.

## Criterio de cierre

Solo declarar el módulo terminado tras ejecutar las pruebas y demostrar la respuesta a cuatro preguntas de usuario con un conjunto de datos controlado. Documentar explícitamente cualquier dependencia pendiente de acceso real a Quanta.
