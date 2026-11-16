# Arquitectura de automatización diaria para Quanta AI

## Componentes mínimos

- **Frontend existente:** conserva PIN, tareas, materias, exámenes, navegación y estado de importación. Añadir listado de borradores y configuración del agente.
- **Backend (Node.js o framework existente):** autenticación; endpoints para tareas/borradores; llamadas al proveedor de IA; endpoint de suscripciones a notificaciones; persistencia.
- **Scheduler persistente:** ejecutar `dailySync` una vez al día en una zona horaria explícita; backend activo incluso con el navegador cerrado.
- **AssignmentSource:** un proveedor intercambiable. Orden de preferencia: API autorizada, exportación/ICS oficialmente compartida, avisos recibidos por email autorizado, carga manual de JSON/ICS. Un archivo HTML estático **no es** una fuente en vivo.
- **LLM provider:** Anthropic API con clave secreta del servidor. Enfocar la salida a un borrador verificable y material de estudio.
- **Notify provider:** Web Push/email con consentimiento y comprobación de entrega.

## Modelo lógico de datos

```ts
interface Assignment {
  id: string; // id interno
  source: string;
  externalId: string;
  sourcePermitted: boolean;
  subject: string;
  title: string;
  instructions: string;
  rubric?: string;
  attachments?: string[];
  dueAt?: string;
  updatedAt?: string;
  contentHash: string;
  assessmentType: 'practice'|'homework'|'project'|'supervised_exam'|'lab'|'other';
}
interface Draft {
  assignmentId: string;
  contentHash: string;
  status: 'new'|'drafting'|'ready_for_review'|'needs_input'|'failed'|'reviewed'|'submitted_by_student';
  body: string;
  explanation: string;
  references: Array<{title:string; url?:string; verified:boolean}>;
  needsStudentInput: string[];
  createdAt: string;
  notifiedAt?: string;
}
```

## Cron de ejecución, de forma esquemática

```text
scheduler diario (zona horaria configurada)
  adquirir lock para userId + fecha local
  extraer tareas desde AssignmentSource autorizado
  normalizar y registrar snapshot
  por cada (source, externalId, contentHash) no procesado:
    clasificar tarea
    preparar borrador o guía de estudio con API
    guardar estado y artefacto
    notificar una sola vez al quedar listo
  escribir run summary, lastSuccessfulSync y errores
  liberar lock
```

`sourcePermitted=false` implica no sincronizar; no crear automatizaciones de login encubiertas. Si `AssignmentSource` no está disponible, mostrar un estado claro y permitir una importación manual para seguir preparando borradores automáticamente desde lo importado.

## API sugerida (ajustar al stack real)

- `GET /api/agent/status`: `lastRunAt`, `nextRunAt`, `sourceStatus`, `llmStatus`, `notifyStatus`, `processedCount`, `errors`.
- `POST /api/agent/run`: disparo manual autenticado con control anti-abuso y sin modificación remota.
- `GET /api/agent/drafts`: lista paginada del usuario autenticado.
- `GET /api/agent/drafts/:id`: borrador completo, control de ownership.
- `PATCH /api/agent/drafts/:id/review`: marca revisión local.
- `POST /api/agent/notifications/subscribe`: registra consentimiento/endpoint Web Push.

## Generación por materia

Entregar en una sola llamada de IA por tarea si el contexto alcanza:

1. Título, consigna transcrita y contexto de la rúbrica.
2. Borrador desarrollado con nivel de 4.º año de bachillerato, sin fingir experiencias.
3. Desarrollo matemático o científico paso a paso cuando corresponda.
4. Tres ideas esenciales para que el estudiante pueda explicar el contenido.
5. Checklist de requisitos cumplidos/no comprobables y bibliografía contrastada.
6. Preguntas abiertas marcadas para los apartados que requieran datos personales, experimentos o trabajo presencial.

Para pruebas supervisadas entregar exclusivamente preparación, explicación, problemas semejantes y ejercicios de práctica.

## Notificaciones

Estado esperado: `draft-ready` (no `task-submitted`). En móvil, las notificaciones web pueden necesitar PWA, configuración del sistema, permisos y servicio push; no prometerlas en un HTML abierto mediante `file://`. Si Web Push no es viable, dejar preparada opción de email y explicar credenciales/configuración necesarias.

## Compatibilidad con aplicación aportada

La exportación `Quanta AI.html` contiene datos semilla importados, tareas de `src/data/mock.js`, importación `.ics/.json`, Estudiante Pro con copia de prompts y conexión automática desactivada. Mantener esos módulos. Si el usuario entrega una versión más reciente, inspeccionar código en lugar de asumir que conserva estas rutas.

## Configuración sugerida (sin secretos)

```dotenv
APP_BASE_URL=https://tu-app.example
APP_TIMEZONE=America/Caracas
DAILY_SYNC_CRON=0 7 * * *
ASSIGNMENT_SOURCE=manual-import
ANTHROPIC_API_KEY=
NOTIFICATION_PROVIDER=webpush
WEB_PUSH_PUBLIC_KEY=
WEB_PUSH_PRIVATE_KEY=
MAX_DRAFTS_PER_RUN=30
MAX_MODEL_COST_USD_PER_DAY=2
```

Cambiar `ASSIGNMENT_SOURCE` a otro adaptador solo después de verificar permiso y contrato. `manual-import` puede procesar archivos nuevos cargados por el usuario, pero no comprueba por sí solo tareas nuevas del colegio.
