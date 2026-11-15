// Estado global de la app, persistido en localStorage.
import { seed } from '../data/mock.js';

const KEY = 'quanta-ai-v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* almacenamiento no disponible: se usa la semilla */ }
  return structuredClone(seed);
}

export const state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* sin persistencia */ }
}

export function reset() {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, structuredClone(seed));
  save();
}

// Selectores
export const subjectOf = (id) => state.subjects.find((s) => s.id === id);
export const taskById = (id) => state.tasks.find((x) => x.id === id);
export const pending = () => state.tasks.filter((x) => x.status === 'pendiente').sort((a, b) => a.dueIn - b.dueIn);
export const resolved = () => state.tasks.filter((x) => x.status === 'resuelta');
export const nextExam = () => [...state.exams].sort((a, b) => a.inDays - b.inDays)[0];

// Las tareas valen el 15 % de la nota: se asegura en proporción a las entregadas.
export function securedGrade() {
  const total = state.tasks.length;
  return total ? Math.round((15 * resolved().length / total) * 10) / 10 : 0;
}
