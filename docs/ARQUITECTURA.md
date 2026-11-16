# Quanta AI — Arquitectura del sistema

## Visión general

```
┌──────────────┐  import   ┌────────────────────┐   jobs   ┌──────────────────┐
│ Plataforma   │ ────────▶ │ Backend Quanta AI  │ ───────▶ │ Motor de IA      │
│ Quanta       │  (export. │  · Conector Quanta │          │  · Resolución    │
│ (tareas,     │  archivo  │  · Normalizador    │ ◀─────── │  · Guías/resumen │
│  adjuntos)   │  .ics)    │  · Cola de trabajos│ borrador │  · Simulacros    │
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
- **Estado actual:** sin conexión automática. Quanta no ofrece una API oficial para terceros y no hay autorización del colegio, así que el acceso automatizado está desactivado (`SECURITY.md`, SEC-002).
- **Ahora:** importación manual de un calendario `.ics` o una copia `.json` (`src/services/importer.js`), con validación de esquema (`src/state/schema.js`) y límites de tamaño.
- **Futuro, solo con autorización:** API oficial con OAuth (authorization code + PKCE, RFC 9700/10017), permisos de solo lectura, tokens en el servidor y nunca en `localStorage`, y opciones de revocación y borrado.
- **Clasificación:** materia (por nombre) y urgencia (alta ≤ 1 día, media ≤ 3, baja).

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
| POST | `/api/import` | Importar un archivo exportado por el alumno |
| GET  | `/api/tasks` | Listado con filtros |
| POST | `/api/tasks/:id/solve` | Generar borrador (asíncrono) |
| POST | `/api/tasks/:id/approve` | Marcar como lista |
| GET  | `/api/subjects/:id/guide` | Guía + simulacro |
| GET  | `/api/exams` | Próximos exámenes |

Para pasar de la demo a producción solo hay que reemplazar el cuerpo de
`src/services/quanta.js` y `src/services/ai.js` por llamadas a esta API; las pantallas no cambian.
