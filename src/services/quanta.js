// Conector de Quanta.
// Los datos reales se obtienen con scripts/quanta-sync.cjs (solo lectura) y se
// convierten con scripts/quanta-import.cjs. Desde el navegador no se puede
// sincronizar: eso requiere un servidor que guarde la sesión de forma segura.
import { state, save, dayLabel } from '../state/store.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function syncQuanta() {
  await wait(700);
  if (state.source === 'quanta') return { total: state.tasks.length, fetchedAt: state.fetchedAt };
  state.lastSync = Date.now();
  save();
  return { total: state.tasks.length };
}

/** Clasificación por urgencia a partir de los días restantes. */
export function urgency(task) {
  if (task.status !== 'pendiente' || task.dueIn == null || task.dueIn < 0) return 'ninguna';
  if (task.dueIn <= 1) return 'alta';
  if (task.dueIn <= 3) return 'media';
  return 'baja';
}

export function dueLabel(task) {
  if (task.dueIn == null) return [task.unit, task.minutes ? `${task.minutes} min` : ''].filter(Boolean).join(' · ') || 'Sin fecha límite';
  if (task.dueIn < 0) return `${task.status === 'resuelta' ? 'Entregada' : 'Venció'} ${dayLabel(task.dueIn)}`;
  return `Entrega ${dayLabel(task.dueIn)}`;
}
