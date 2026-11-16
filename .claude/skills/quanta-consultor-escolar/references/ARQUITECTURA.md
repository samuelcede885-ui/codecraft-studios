# Arquitectura mínima: chat de Quanta AI

## Diferencia entre tres componentes

1. **Claude en navegador**: herramienta de escritorio/navegador que puede leer una pestaña con la sesión del usuario si está disponible, autorizada y activa. No es automáticamente un servicio de datos accesible desde una web desplegada.
2. **Agente interno de Quanta AI**: componente HTML/JS que recibe la pregunta y responde usando un almacén local de tareas. Para preguntas sencillas no necesita solicitar un modelo remoto.
3. **Conector de datos**: fuente externa de solo lectura o importación explícita que actualiza el almacén. No Gmail. Solo está activo si existe permiso y soporte técnico.

## Implementación preferida (sin backend ni coste extra para preguntas básicas)

`Usuario escribe -> interpretar intención -> filtrar datos actuales -> ordenar por vencimiento -> respuesta con procedencia`.

Intenciones mínimas:
- `THIS_WEEK`: evaluación/tarea cuya fecha cae entre lunes 00:00 y domingo 23:59 (America/Caracas).
- `TOMORROW`: fecha de entrega o evaluación del día siguiente.
- `PENDING`: elementos con estado pendiente confirmado; desconocidos no cuentan como pendientes confirmados.
- `EXAMS`: evaluaciones de tipo examen/prueba/checkpoint.
- `HIGH_WEIGHT`: porcentaje numérico >= 15; si falta, clasificar como desconocido.
- `SUBJECT`: filtrar por nombre de la asignatura y variantes conocidas.
- `UNKNOWN`: pedir una aclaración breve o proporcionar opciones de pregunta.

Permitir combinación de filtros: «checkpoints de biología esta semana que valen 15 %» = `EXAMS + THIS_WEEK + SUBJECT + HIGH_WEIGHT`.

## Conexión a la plataforma escolar

Orden de elección:
1. API/exportación documentada y autorizada por Quanta o el colegio.
2. Lectura a petición del usuario en un navegador con sesión iniciada por el propio usuario, **solo si el uso de asistencia automatizada está permitido**, seguida de importación explícita y aprobada.
3. Archivo propio que importe el estudiante mediante un botón existente o nuevo.

No simular una fuente en vivo cuando solo existe `seed` o `mock.js` del HTML. No construir rutas privadas de API ni capturar tokens del navegador. Si una opción no está autorizada, no usarla y explicar qué vía segura queda.

## Integración con un modelo de lenguaje (opcional)

Solo para preguntas fuera del conjunto determinista, ejemplo «ordéname qué estudiar primero según valor y fecha». Si hay backend legítimo y clave API, mandar al modelo **solo** una lista mínima de materias, títulos, fechas y ponderaciones, sin identificadores personales. Inyectar las reglas: no inventar, no cambiar estados, devolver también procedencia.

## Estructura mínima de la vista

- Header «Pregúntale a Quanta AI».
- Campo «Escribe una pregunta sobre tus tareas o evaluaciones…».
- Botón «Preguntar» y chips opcionales de preguntas frecuentes.
- Respuesta legible con agrupación por fecha/materia.
- Estado y origen: «Datos de Quanta comprobados» solo si procede, «Datos importados [fecha]» en caso contrario.
- Actualización voluntaria de datos (cuando exista método autorizado).

Mantener todas las demás pantallas y handlers. Evitar nuevas dependencias si el proyecto actual funciona con JS puro.
