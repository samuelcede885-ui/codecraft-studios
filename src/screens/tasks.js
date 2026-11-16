import { state, subjectOf } from '../state/store.js';
import { dueLabel, urgency } from '../services/quanta.js';
import { esc, icon } from '../components/ui.js';

export const FILTERS = [
  ['todas', 'Todas', () => true],
  ['pendientes', 'Pendientes', (x) => x.status === 'pendiente'],
  ['resueltas', 'Resueltas IA', (x) => x.status === 'resuelta'],
  ['examen', 'Para Examen', (x) => x.forExam],
];

const far = (n) => (n == null ? 9999 : Math.abs(n));

function taskCard(task) {
  const done = task.status === 'resuelta';
  const urgent = urgency(task) === 'alta';
  return `
    <article class="card task">
      <div class="row between top">
        <div style="min-width:0">
          <span class="tag">${esc(subjectOf(task.subjectId).name)}</span>
          <h3>${esc(task.title)} <span class="state ${done ? 'ok' : ''}">→ ${done ? 'Completado' : 'Pendiente'}</span></h3>
        </div>
        <span class="pct">${task.weight != null ? `${task.weight}% Nota` : 'Práctica'}</span>
      </div>
      <span class="meta ${urgent ? 'urgent' : ''}">${urgent ? 'Urgente · ' : ''}${esc(dueLabel(task))}</span>
      ${done
        ? `<button class="link" data-action="guide" data-subject="${task.subjectId}">Ver guía de estudio generada ${icon.chev}</button>`
        : `<button class="btn black" data-action="solve" data-id="${task.id}">Resolver con Estudiante Pro</button>`}
    </article>`;
}

export function renderTasks({ filter, subjectId }) {
  const match = FILTERS.find(([id]) => id === filter)[2];
  const bySubject = state.tasks.filter((x) => !subjectId || x.subjectId === subjectId);
  const list = bySubject.filter(match)
    .sort((a, b) => (a.status === b.status ? far(a.dueIn) - far(b.dueIn) : a.status === 'pendiente' ? -1 : 1));

  return `
    <header>
      <h1 class="title">Mis Tareas</h1>
      <p class="sub" style="margin-top:8px">${bySubject.length} tareas en total${subjectId ? ` · ${esc(subjectOf(subjectId).name)}` : ''}</p>
    </header>
    <div class="pills" role="tablist">
      ${FILTERS.map(([id, label]) =>
        `<button class="pill ${id === filter ? 'on' : ''}" role="tab" aria-selected="${id === filter}" data-action="filter" data-filter="${id}">${label}</button>`).join('')}
      ${subjectId ? `<button class="pill blue" data-action="clear-subject">${esc(subjectOf(subjectId).name)} ${icon.x}</button>` : ''}
    </div>
    ${list.length ? list.map(taskCard).join('') : '<p class="empty">No hay tareas en este filtro.</p>'}`;
}
