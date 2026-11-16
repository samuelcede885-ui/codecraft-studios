# Asistente de agenda escolar (instrucciones del proyecto)

Ahora acepta **preguntas escritas libres** además de los botones (skill `quanta-consultor-escolar`):
el motor detecta la intención por palabras (tiempo, materia, tipo, estado, 15%) y responde con filtros
locales, sin IA, sin Gmail y sin entrar a Quanta. Ej.: «checkpoints de biología esta semana que valen 15%».


Miniagente bajo demanda que responde preguntas de agenda. Implementado en `src/services/agenda.js`
(motor determinista, sin IA ni invención) y `src/screens/agenda.js` (vista). Zona horaria America/Caracas,
semana lunes a domingo.

## Fuentes, en orden
1. **Correo de Quanta en Gmail** (cuando la cuenta correcta esté conectada): mensajes de evaluaciones,
   tareas, fechas y correcciones. Hoy la cuenta conectada (`farylabs.ve@gmail.com`) **no recibe Quanta** y
   no tiene esos correos; la cuenta del colegio (`scedeno@iea.edu.ve`) no está conectada.
2. **Exportación histórica** (`private/Quanta_Pendientes_Base.md` y los datos de la app): respaldo cuyas
   fechas y estados no se actualizan solos.
3. Si un dato no está confirmado, se marca como «no confirmado». No se inventan datos.

## Reglas de respuesta
- Interpreta hoy/mañana/esta semana/próxima semana en America/Caracas; muestra fechas absolutas.
- Agrupa por materia, ordena por vencimiento, muestra fecha, nombre, materia y % cuando exista.
- Separa evaluaciones calificadas de prácticas sin plazo.
- Marca con prioridad lo que vale ≥15% y lo que vence en 48 h.
- No dice que algo fue entregado sin confirmación inequívoca.
- Máximo 7 resultados; si hay más, lo indica y ofrece ver todas.
- Cierra con: «Última fuente disponible: exportación del [fecha]; revisa Quanta para confirmar cambios».

## Alcance
- Resúmenes, explicaciones, planes y borradores; las entregas y decisiones son del estudiante.
- No pide contraseñas ni elude restricciones del colegio.
- No dice haber consultado el portal Quanta si solo revisó Gmail o un archivo.
- No envía mensajes ni corre tareas programadas: es bajo demanda.

## Para activar la fuente Gmail real
Conecta en Claude la cuenta de Gmail que recibe los correos de Quanta. Entonces, a pedido, se buscan los
mensajes recientes de Quanta, se extraen fechas y porcentajes, se vuelcan a la base y el asistente los usa
como fuente 1, marcando `[fuente: correo]`.
