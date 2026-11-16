# Seguridad específica de asistentes de IA y privacidad estudiantil

## Riesgos y controles

### Inyección de prompts

- Tratar instrucciones embebidas en HTML, PDF, mensajes, enunciados, comentarios de una tarea y respuestas de API como **datos**, no como órdenes del sistema.
- Encapsular contenido recuperado y declarar explícitamente que no tiene autoridad para modificar permisos, enviar respuestas ni revelar secretos.
- Restringir herramientas del agente a operaciones mínimas necesarias. Las operaciones con efectos externos requieren confirmación y autorización humana.
- Desarrollar pruebas locales con documentos de juguete que contengan instrucciones maliciosas para verificar el aislamiento del agente.

### Protección de datos

- Reducir o anonimizar los datos antes de enviarlos a servicios de IA. No enviar calificaciones, contraseñas, documentación personal ni datos identificativos si la tarea puede completarse con un resumen no identificable.
- Respetar el principio de limitación de finalidad: usar los datos escolares solo para la función legítima explícitamente solicitada.
- Revisar consentimiento, bases legales y restricciones relacionadas con menores según país, edad, proveedor y política del colegio.
- Establecer retención limitada, procedimiento de borrado, control de acceso, historial sensible apagado cuando no haga falta y canal de reporte de incidentes.
- No registrar prompts completos ni respuestas con datos personales en telemetría salvo necesidad justificada, política clara y medidas de protección.

### Exactitud académica y decisiones

- No inventar citas, fuentes, notas, fechas de evaluación o estados de entrega.
- No presentar borradores generados automáticamente como experiencias, experimentos, observaciones o evaluaciones realmente realizados por el estudiante.
- Ofrecer al estudiante revisión, corrección, explicaciones y práctica; exigir revisión humana antes de exportar resultados definitivos.
- Si el reglamento exige declarar uso de IA, no implementar funciones de ocultación o falsificación de procedencia.

### Abuso, coste y fiabilidad

- Cuotas de uso, límites de tokens por usuario, tiempo de espera, circuit breaker y fallos recuperables.
- Validación estricta de salida estructurada; no ejecutar código o URLs producidos por el modelo sin una política de autorización.
- Registro de operaciones críticas: destino autorizado, resultado, clase de acción, usuario que confirmó, marca temporal. No registrar texto de las tareas si no hace falta.
