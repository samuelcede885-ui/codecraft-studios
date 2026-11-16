// Agente de estudio diario (local, dentro del teléfono).
// Una vez al día, al abrir la app, prepara material de estudio y borradores de
// apoyo con Estudiante Pro para cada tarea importada, y avisa cuando están listos.
// NO entrega nada, NO se conecta a Quanta y NO marca tareas como entregadas.
// Para pruebas supervisadas prepara guía de estudio, nunca respuestas de examen.
import { state, save, subjectOf } from '../state/store.js';
import { buildPlan } from './estudiante-pro.js';

export const MAX_PER_RUN = 30;

// Día local en la zona del colegio (America/Caracas).
export const localDay = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Caracas' });

// Hash estable del contenido de una tarea; si el profesor cambia la consigna, cambia el hash.
function contentHash(task) {
  const raw = `${task.id}|${task.title}|${task.instructions || ''}|${task.unit || ''}|${task.status}`;
  let h = 5381;
  for (let i = 0; i < raw.length; i++) h = ((h << 5) + h + raw.charCodeAt(i)) & 0xffffffff;
  return (h >>> 0).toString(16);
}

const isAssessment = (task) => task.forExam || task.kind === 'evaluacion';

function ensure() {
  if (!state.agent || typeof state.agent !== 'object') state.agent = { lastRunDay: null, drafts: {} };
  if (!state.agent.drafts) state.agent.drafts = {};
  return state.agent;
}

/** Texto del material preparado, para copiar. Es lo que el estudiante revisa, no el prompt. */
export function draftToText(draft) {
  const lines = [draft.title, '', draft.body];
  return lines.join('\n');
}

function planToText(plan) {
  const bullet = (arr) => arr.map((x) => `• ${x}`).join('\n');
  return [
    plan.intro,
    `Formato: ${plan.format}`,
    plan.warn ? `Aviso: ${plan.warn}` : '',
    '',
    'Estructura sugerida:',
    bullet(plan.structure),
    '',
    'Qué debes aportar tú (no lo inventa la IA):',
    bullet(plan.personalize),
    '',
    'Para poder defenderlo, prepárate estas preguntas:',
    bullet(plan.questions),
  ].filter((l) => l !== '' || true).join('\n');
}

export function pendingTasks() {
  return state.tasks.filter((t) => t.status === 'pendiente');
}

/** Cuántos borradores están listos y sin revisar. */
export function readyCount() {
  const d = ensure().drafts;
  return Object.values(d).filter((x) => x.status === 'ready_for_review' || x.status === 'needs_input').length;
}

export const lastRun = () => ensure().lastRunDay;
export const allDrafts = () => Object.values(ensure().drafts).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

/**
 * Prepara borradores para las tareas pendientes nuevas o modificadas.
 * force=true ignora que ya se haya ejecutado hoy. Devuelve un resumen.
 * Idempotente: no reprepara una tarea cuyo contenido no cambió.
 */
export function runDaily({ force = false } = {}) {
  const agent = ensure();
  const today = localDay();
  if (!force && agent.lastRunDay === today) return { ran: false, prepared: [], reason: 'ya-ejecutado-hoy' };

  const prepared = [];
  for (const task of pendingTasks()) {
    const hash = contentHash(task);
    const existing = agent.drafts[task.id];
    // Idempotencia: si ya hay borrador del mismo contenido, no se rehace ni se reavisa.
    if (existing && existing.hash === hash && existing.status !== 'failed') continue;

    try {
      const plan = buildPlan(task);
      agent.drafts[task.id] = {
        taskId: task.id,
        title: task.title,
        subject: subjectOf(task.subjectId).name,
        kind: task.kind,
        isAssessment: isAssessment(task),
        status: (plan.personalize || []).length ? 'needs_input' : 'ready_for_review',
        hash,
        body: planToText(plan),
        prompt: plan.prompt,
        needsInput: plan.personalize || [],
        createdAt: new Date().toISOString(),
        reviewedAt: existing?.reviewedAt || null,
        revisionOf: existing ? existing.hash : null,
      };
      prepared.push(agent.drafts[task.id]);
      if (prepared.length >= MAX_PER_RUN) break;
    } catch {
      agent.drafts[task.id] = { ...(existing || { taskId: task.id, title: task.title, subject: subjectOf(task.subjectId).name }), status: 'failed', hash, createdAt: new Date().toISOString() };
    }
  }

  agent.lastRunDay = today;
  save();
  return { ran: true, prepared, total: pendingTasks().length };
}

export function markReviewed(taskId) {
  const d = ensure().drafts[taskId];
  if (d) { d.status = 'reviewed'; d.reviewedAt = new Date().toISOString(); save(); }
}
