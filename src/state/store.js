// Estado global de la app, persistido en localStorage.
// Los datos vienen de src/data/mock.js (demo) o de Quanta (build con QUANTA_DATA).
import { seed } from '../data/mock.js';
import { sanitize } from './schema.js';

const KEY = `quanta-ai-${seed.source || 'demo'}-${seed.version || 1}`;

// Los datos guardados en el navegador se validan igual que los de origen:
// un localStorage manipulado no puede inyectar HTML ni romper la app.
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return sanitize(JSON.parse(raw));
  } catch { /* almacenamiento no disponible o dañado: se usa la semilla */ }
  return sanitize(structuredClone(seed));
}

export const state = load();

// Días entre hoy y una fecha ISO, contados en la hora de Caracas.
const dayOf = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'America/Caracas' });
export const daysUntil = (iso) => Math.round((Date.parse(dayOf(iso)) - Date.parse(dayOf(Date.now()))) / 864e5);

function refreshDates() {
  for (const t of state.tasks) if (t.due) t.dueIn = daysUntil(t.due);
  for (const e of state.exams) if (e.due) e.inDays = daysUntil(e.due);
}
refreshDates();

/** Sustituye todo el estado por datos nuevos ya importados (se validan). */
export function replaceState(next) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, sanitize(next));
  refreshDates();
  save();
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* sin persistencia */ }
}

export function reset() {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, sanitize(structuredClone(seed)));
  refreshDates();
  save();
}

// Selectores
const far = (n) => (n == null ? 9999 : n);
export const subjectOf = (id) => state.subjects.find((s) => s.id === id) || { id, name: 'Materia', modules: [] };
export const taskById = (id) => state.tasks.find((x) => x.id === id);
export const pending = () => state.tasks.filter((x) => x.status === 'pendiente').sort((a, b) => far(a.dueIn) - far(b.dueIn));
export const resolved = () => state.tasks.filter((x) => x.status === 'resuelta');
export const upcomingExams = () => state.exams.filter((e) => e.inDays >= 0).sort((a, b) => a.inDays - b.inDays);
export const nextExam = () => upcomingExams()[0] || [...state.exams].sort((a, b) => b.inDays - a.inDays)[0];

/** Temas a repasar para un examen: los del examen o las lecciones de la última unidad de la materia. */
export function topicsFor(exam) {
  if (exam.topics) return exam.topics;
  const unit = subjectOf(exam.subjectId).modules?.at(-1);
  return unit ? unit.lessons.filter((l) => !/vocabulario/i.test(l)).slice(0, 4) : [];
}

/** Preparación (%) para una materia: valor de la demo o avance real del curso en Quanta. */
export function prepFor(subjectId) {
  if (state.prep != null) return state.prep;
  return subjectOf(subjectId).progress || 0;
}

export function dayLabel(n) {
  if (n == null) return 'Sin fecha';
  if (n < 0) return `hace ${-n} día${n === -1 ? '' : 's'}`;
  if (n === 0) return 'hoy';
  if (n === 1) return 'mañana';
  return `en ${n} días`;
}
