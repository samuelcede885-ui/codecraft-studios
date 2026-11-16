---
name: quanta-agente-diario
description: Implementa y mantiene en una app escolar Quanta AI un agente de estudio que comprueba tareas nuevas una vez al día mediante fuentes autorizadas, genera borradores completos de apoyo y avisa al estudiante cuando están listos para revisión y copia. Usar cuando se pida automatizar el flujo Quanta → tareas → Claude/Anthropic API → borradores → notificación sin alterar el diseño, funciones ni seguridad de la aplicación existente.
---

# Quanta: agente diario de tareas y avisos

## Resultado que debes construir

Convertir la preparación manual de tareas en un flujo desatendido **hasta la revisión final del estudiante**:

1. Una tarea programada se ejecuta una vez al día en un servidor persistente.
2. Consulta **solo fuentes y conexiones autorizadas** de tareas; guarda la fecha y resultado de la sincronización.
3. Detecta tareas nuevas o modificadas, evita duplicados y ordena por fecha límite.
4. Genera automáticamente un borrador o material de apoyo sustancial por cada tarea apta, en una sola ejecución; incluye desarrollo, referencias verificables y notas de revisión si procede.
5. Guarda cada resultado dentro de Quanta AI y envía **una notificación por borrador preparado** (o un resumen diario configurable).
6. El estudiante puede abrir, revisar, copiar y **enviar manualmente** el trabajo desde el portal escolar. Nunca declarar ni marcar en Quanta una tarea como entregada por haber generado el borrador.

**No basta con escribir una Skill.** Implementar scheduler, backend, proveedor de IA y proveedor de notificaciones reales. Indicar con claridad qué credenciales/configuración faltan; no reportar una sincronización o notificación como realizada sin confirmación del servicio.

## Reglas imprescindibles

- Conservar las vistas, módulos, paleta, PIN, navegación, archivos importados, estados y acciones existentes. Hacer cambios aditivos y reversibles; no romper la versión móvil.
- No acceder a la plataforma escolar por medios no autorizados. No automatizar login, scraping privado, uso de sesiones o mecanismos para evadir límites, vigilancia o detección. Una sincronización diaria es una opción de rendimiento, **no un mecanismo para ocultar accesos**.
- No usar credenciales pegadas en chat, código fuente del frontend o archivos públicos. Configurar secretos exclusivamente en el servidor/gestor de secretos.
- No enviar respuestas, presentar exámenes ni completar evaluaciones directamente en Quanta. Dejar el envío manual al estudiante. Respetar instrucciones del profesor sobre uso de IA; no afirmar que un texto es indetectable o de autoría enteramente humana si no lo es.
- No inventar datos experimentales, citas, fuentes, experiencias personales ni lecturas de documentos no disponibles. Si faltan requisitos esenciales, producir la mejor estructura/borrador posible y marcar claramente lo pendiente.
- Datos académicos/personales: mínimo necesario, control de acceso, conexiones HTTPS, retención limitada, registros sin datos sensibles.

## Antes de tocar código

1. Abrir el proyecto real de Claude y localizar los módulos de tareas, importador, Estudiante Pro, simulación del modelo, PIN y estado local.
2. Si la única entrada es `Quanta AI.html`, reconocer que es una exportación frontend con datos ya importados: no asumir que la sesión ni la integración del colegio existen. La versión observada usa una semilla en `src/data/mock.js`, importación `.ics/.json`, un botón para **copiar petición a Claude**, y un aviso que la sincronización automática está desactivada.
3. Hacer copia/commit, inventariar pantallas y pruebas de regresión antes de editar. Elegir adaptadores desacoplados, sin reescribir toda la app.
4. Confirmar qué **fuente autorizada** existe para recibir novedades: API oficial/contrato con permiso, exportación automática de calendario, correo del estudiante autorizado, feed institucional, o importación manual. Si no existe fuente que se actualice sola, **no prometer detección diaria real**: implementar el resto y mostrar `Esperando fuente autorizada`.

## Diseño del flujo

Leer [references/arquitectura.md](references/arquitectura.md) antes de implementar la ejecución programada y leer [references/pruebas.md](references/pruebas.md) antes de dar por terminada la modificación.

- **Scheduler:** cron del servidor (o scheduler administrado); horario configurable, preferiblemente zona `America/Caracas` si la escuela opera en Venezuela. Máximo una ejecución diaria planificada; botón de prueba manual separado. Usar bloqueo de ejecución, reintento controlado y estado de última corrida.
- **Ingesta:** adaptador `AssignmentSource` que retorne registros normalizados. Mantener `source`, `externalId`, `subject`, `title`, `instructions`, `dueAt`, `rubric`, `attachments`, `contentHash`, `updatedAt` y `sourcePermitted`.
- **Detección:** persistir `(source, externalId, contentHash)`; procesar solo nuevas versiones. Si cambia la consigna, crear nueva revisión y avisar del cambio; no duplicar avisos por reintentos.
- **Clasificación:** separar prácticas, ensayos, ejercicios, proyectos, evaluaciones supervisadas y laboratorios. Para exámenes o pruebas supervisadas, generar guía de estudio, no respuestas destinadas a hacerse pasar por una evaluación personal.
- **Agente de redacción:** invocar la Anthropic API desde backend con una plantilla especializada por materia/rúbrica. Generar en una pasada un borrador desarrollado, explicación corta, checklist de requisitos, fuentes y campo `needsStudentInput`. Nunca inventar enlaces ni afirmar haber consultado fuentes inexistentes.
- **Persistencia:** estados `new`, `drafting`, `ready_for_review`, `needs_input`, `failed`, `reviewed`, `submitted_by_student` (el último solo lo marca el estudiante o una señal autorizada comprobada); no cambiar el estado académico remoto.
- **Notificaciones:** implementar opción real de Web Push o email transaccional; pedir autorización del navegador y dirección/consentimiento donde corresponda. Mensaje: `Nueva tarea preparada: [materia] — [título]. Revisa y copia tu borrador en Quanta AI.` No incluir contenido escolar privado en vista previa.
- **UI:** pestaña o tarjeta aditiva `Agente diario`, estado de conexión, última ejecución, lista de borradores listos, botones `Ver`, `Copiar`, `Marcar revisado`, errores recuperables. Mantener todas las funciones originales.
- **Seguridad:** secretos de Anthropic en backend, autenticación y autorización por usuario, datos separados entre usuarios, límites de coste y tokens, sanitización HTML, protección CSRF/CORS, logs sin credenciales.

## Estrategia de implementación

1. Definir una interfaz desacoplada para `AssignmentSource` y otro adaptador de notificaciones. No acoplar directamente la UI a Quanta ni incrustar passwords.
2. Construir persistencia e idempotencia, luego scheduler, después generador de borradores, y por último notificaciones y UI.
3. Usar prueba de fuente local con tareas ficticias si la fuente real no está autorizada. Etiquetar explícitamente `demo` y `real`.
4. Integrar la IA sin depender de tener abierto Claude Chat. La conversación con Claude no es un servicio de ejecución periódica; usar **API + servidor desplegado**.
5. Mantener el proyecto original operativo en todo momento. Ante fallo parcial, conservar los borradores existentes y no repetir los ya completados.
6. Ejecutar todas las pruebas de [references/pruebas.md](references/pruebas.md), mostrar evidencia y registrar limitaciones sin maquillar resultados.

## Formato de entrega al usuario

Entregar: código modificado o cambios listos para integrar, archivo `.env.example` sin secretos, instrucciones exactas de despliegue y configuración, pruebas realizadas, configuración de horario y canal de avisos, y una tabla `implementado / pendiente / bloqueado`.

No afirmar que el agente ya envía notificaciones, se conecta solo al colegio o trabaja cada madrugada si no existe servicio desplegado, credenciales válidas, permisos y confirmaciones de prueba.
