// Conector de Quanta (SIMULADO).
// Punto único de entrada para todo lo que venga de la plataforma escolar.
// Para conectar el backend real, sustituye el cuerpo de estas funciones por
// llamadas a tu API (p. ej. GET /api/quanta/tasks) manteniendo las firmas.
import { state, save } from '../state/store.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Sincroniza tareas, fechas y adjuntos. Devuelve cuántas tareas hay. */
export async function syncQuanta() {
  await wait(900);
  state.lastSync = Date.now();
  save();
  return { total: state.tasks.length };
}

/** Clasificación por urgencia a partir de los días restantes. */
export function urgency(task) {
  if (task.status !== 'pendiente') return 'ninguna';
  if (task.dueIn <= 1) return 'alta';
  if (task.dueIn <= 3) return 'media';
  return 'baja';
}

export function dueLabel(task) {
  const d = task.dueIn;
  if (d < 0) return `Entregada hace ${-d} día${d === -1 ? '' : 's'}`;
  if (d === 0) return 'Entrega hoy';
  if (d === 1) return 'Entrega mañana';
  return `Entrega en ${d} días`;
}
