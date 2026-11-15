import { state } from '../state/store.js';
import { esc, icon } from '../components/ui.js';

export function renderSubjects() {
  const cards = state.subjects.map((s) => {
    const tasks = state.tasks.filter((x) => x.subjectId === s.id);
    const done = tasks.filter((x) => x.status === 'resuelta').length;
    const todo = tasks.length - done;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    return `
      <button class="card task" data-action="open-subject" data-subject="${s.id}">
        <div class="row between">
          <h3>${esc(s.name)}</h3>
          <span class="meta">${todo ? `${todo} pendiente${todo === 1 ? '' : 's'}` : 'Al día'}</span>
        </div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <span class="meta">${done} de ${tasks.length} tareas listas</span>
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
