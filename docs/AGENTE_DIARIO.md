# Agente diario de estudio

Implementa la skill `quanta-agente-diario` **dentro de la app** (sin servidor), conservando todas las
funciones existentes. Prepara material de estudio y borradores de apoyo para que el estudiante los
revise, copie y entregue en persona. No entrega nada, no se conecta a Quanta y no marca tareas como
entregadas. Para evaluaciones prepara guía de estudio, no respuestas de examen.

## Cómo funciona
- Al abrir la app, una vez por día local (America/Caracas), prepara borradores de las tareas pendientes.
- Cada borrador usa Estudiante Pro con las lecciones reales de la unidad: estructura, qué aportar tú,
  preguntas de defensa y una petición lista para Claude.
- Estados: `ready_for_review` (listo para revisar), `needs_input` (requiere tus datos),
  `reviewed` (revisado por ti). Nunca `entregado`.
- Es idempotente: no repite una tarea cuyo contenido no cambió. Si el profesor cambia la consigna,
  prepara una revisión nueva.
- Avisos: in-app, y notificación del navegador si la activas (solo con la app abierta).

Se abre desde la tarjeta «Agente diario» en Inicio o desde Perfil → Agente de estudio diario.

## Tabla de estado

| Componente | Estado |
|---|---|
| Vista del agente, lista de borradores, ver/copiar/revisar | **Implementado** (local, probado) |
| Preparación diaria (1×/día local) al abrir la app | **Implementado** (local, probado) |
| Idempotencia y detección de cambios de consigna | **Implementado** (local, probado) |
| Guía de estudio para evaluaciones (no respuestas) | **Implementado** (local, probado) |
| Avisos in-app + notificación del navegador con permiso | **Implementado** · limitado: solo con la app abierta |
| Preparación en segundo plano con la app cerrada | **Bloqueado**: un HTML sin servidor no corre solo |
| Generación con un modelo de IA real (borrador redactado completo) | **Pendiente**: requiere backend con clave de API; hoy el borrador es el plan de Estudiante Pro, y tú pides el texto a Claude con «Copiar petición» |
| Detección automática de tareas nuevas en Quanta | **Bloqueado**: Quanta no ofrece API ni autorización; se usa importación manual |
| Web Push real / email | **Pendiente**: requiere servidor y credenciales |
| Entrega automática en Quanta | **No se hará**: fuera de los límites de la skill y de la integridad académica |

## Si en el futuro hay un backend autorizado
`docs/agente.env.example` lista la configuración (sin secretos). Para que el agente corra solo cada día
y redacte con un modelo real haría falta un servidor propio desplegado, con la clave de API fuera del
frontend, y una fuente de tareas **autorizada** por Quanta o el colegio. No se monta en esta sesión.
