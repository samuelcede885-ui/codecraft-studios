# Contrato normalizado de datos para el agente

Representar cada tarea en un objeto simple y seguro:

```json
{
  "id": "task-01",
  "materia": "Matemáticas",
  "titulo": "Checkpoint de funciones",
  "tipo": "checkpoint",
  "fecha_limite": "2026-11-20T18:00:00-04:00",
  "fecha_evento": null,
  "porcentaje": 15,
  "estado": "pendiente",
  "instrucciones": "Repasar el dominio de las funciones",
  "fuente": "importacion_usuario",
  "url_origen": null,
  "comprobado_en": "2026-11-15T14:00:00-04:00"
}
```

Todos los valores son ilustrativos. No asumir que existen en la cuenta de la persona.

## Reglas de normalización

- `tipo`: `practica`, `tarea`, `examen`, `checkpoint`, `evaluacion`, `proyecto` u `otro`.
- `porcentaje`: número de 0 a 100, `null` si desconocido; eliminar `%` solo cuando represente una ponderación real.
- `estado`: `pendiente`, `completado`, `entregado`, `vencido` o `desconocido`, siempre según la fuente.
- `fecha_limite`: instante ISO 8601 con zona; no confundir fecha de entrega con fecha en que ocurre un examen.
- `fecha_evento`: conservar separadamente si se proporciona.
- `fuente`: `quanta_api_autorizada`, `quanta_navegador_autorizado`, `importacion_usuario` o `demo`.
- `comprobado_en`: último momento real de obtención del dato, nunca fecha actual fabricada.
- `url_origen`: mantener solo cuando exista una URL legítima a la propia tarea y la interfaz la proteja adecuadamente.

## Deduplicación

Si existe identificador estable provisto por la fuente, utilizarlo. Si no, generar clave de coincidencia `materia normalizada + titulo normalizado + fecha_limite + tipo`, cuidando colisiones y permitiendo revisión de cambios. No sobrescribir estados de Quanta con marcas locales de «he leído la ficha».

## Clasificación de consultas

La intención se detecta por palabras, sin necesidad de un LLM: `esta semana`, `mañana`, `pendiente`, `examen`, `prueba`, `checkpoint`, `15%`, `importante`, nombres de materia. «Importante» sin umbral explícito puede significar: vencimiento cercano, ponderación conocida alta y pruebas, pero explicar criterio y no inventar porcentaje.

Al responder: ordenar por fecha ascendente, elementos sin fecha al final; mostrar fecha y hora en la zona seleccionada. Si `fuente=demo`, anteponer un aviso inequívoco «Datos de ejemplo; no son información actual de Quanta».
