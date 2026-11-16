import { state } from '../state/store.js';
import { esc, icon } from '../components/ui.js';

export function renderSubjects() {
  const cards = state.subjects.map((s) => {
    const tasks = state.tasks.filter((x) => x.subjectId === s.id);
    const done = tasks.filter((x) => x.status === 'resuelta').length;
    const todo = tasks.length - done;
    const pct = s.progress ?? (tasks.length ? Math.round((done / tasks.length) * 100) : 0);
    return `
      <button class="card task" data-action="open-subject" data-subject="${s.id}">
        <div class="row between top">
          <div style="min-width:0">
            <h3>${esc(s.name)}</h3>
            ${s.teacher ? `<span class="meta">${esc(s.teacher)}</span>` : ''}
          </div>
          <span class="meta" style="white-space:nowrap">${todo ? `${todo} pendiente${todo === 1 ? '' : 's'}` : tasks.length ? 'Al día' : 'Sin contenido'}</span>
        </div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="meta">${s.totalItems != null ? `Avance en Quanta: ${pct}% · ${s.completedItems || 0} de ${s.totalItems} actividades` : `${done} de ${tasks.length} tareas listas`}</span>
      </button>`;
  }).join('');

  return `
    <header>
      <h1 class="title">Materias</h1>
      <p class="sub" style="margin-top:8px">${state.subjects.length} materias sincronizadas con Quanta</p>
    </header>
    <button class="card outline row between" data-action="go-all" style="display:flex">
      <span class="h2">Ver todas mis tareas</span>${icon.chev}
    </button>
    ${cards}`;
}
