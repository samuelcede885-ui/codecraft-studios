# Quanta AI — Arquitectura del sistema

## Visión general

```
┌──────────────┐   sync    ┌────────────────────┐   jobs   ┌──────────────────┐
│ Plataforma   │ ────────▶ │ Backend Quanta AI  │ ───────▶ │ Motor de IA      │
│ Quanta       │  (API o   │  · Conector Quanta │          │  · Resolución    │
│ (tareas,     │  scraping │  · Normalizador    │ ◀─────── │  · Guías/resumen │
│  adjuntos)   │  autoriz.)│  · Cola de trabajos│ borrador │  · Simulacros    │
└──────────────┘           │  · Base de datos   │          └──────────────────┘
                           └─────────┬──────────┘
                                     │ REST/JSON
                           ┌─────────▼──────────┐
                           │ App (este repo)    │
                           │ Inicio · Tareas ·  │
                           │ Exámenes · Perfil  │
                           └────────────────────┘
```

## 1. Integración con Quanta
- **Conector** (`src/services/quanta.js` en el frontend es el punto de entrada simulado).
  En producción: OAuth/credenciales del estudiante guardadas cifradas en el backend, nunca en el cliente.
  Si Quanta no ofrece API, se usa un sincronizador autorizado por el estudiante.
- **Sincronización periódica** (p. ej. cada 30 min + bajo demanda): tareas, fechas, instrucciones y adjuntos.
- **Normalización**: cada tarea → `{ id, subjectId, title, instructions, dueIn, attachments, weight }`.
- **Clasificación**: materia (por curso de origen) y urgencia (alta ≤ 1 día, media ≤ 3, baja).

## 2. Motor de tareas (15 % de la nota)
1. Extracción de texto de enunciado y adjuntos (PDF/DOCX/imágenes → OCR).
2. Prompt por materia con plantilla de estructura (`outline` en `src/data/mock.js`).
3. Se genera un **borrador** que el estudiante **revisa y aprueba** antes de entregar.
   La app nunca entrega automáticamente: el estudiante es responsable del trabajo final y de
   respetar las normas académicas de su centro.

## 3. Motor de preparación de exámenes
- Base de conocimiento por materia: material de Quanta + tareas ya trabajadas (indexado con embeddings).
- Genera: guía de estudio, resumen ejecutivo, conceptos clave/mapa conceptual y simulacros
  (test + preguntas abiertas), priorizando los temas del próximo examen.
- El progreso del simulacro alimenta el indicador “Preparación examen”.

## 4. Modelo de datos (resumen)
| Entidad   | Campos clave |
|-----------|--------------|
| Student   | name, email, studentId, average, performance |
| Subject   | id, name, outline, guide |
| Task      | id, subjectId, title, instructions, dueIn, status (`pendiente`/`resuelta`), forExam, weight |
| Exam      | id, subjectId, title, inDays, topics |

## 5. API prevista
| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/api/quanta/sync` | Sincronizar con Quanta |
| GET  | `/api/tasks` | Listado con filtros |
| POST | `/api/tasks/:id/solve` | Generar borrador (asíncrono) |
| POST | `/api/tasks/:id/approve` | Marcar como lista |
| GET  | `/api/subjects/:id/guide` | Guía + simulacro |
| GET  | `/api/exams` | Próximos exámenes |

Para pasar de la demo a producción solo hay que reemplazar el cuerpo de
`src/services/quanta.js` y `src/services/ai.js` por llamadas a esta API; las pantallas no cambian.
