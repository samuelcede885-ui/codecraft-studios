import { state, pending, resolved, nextExam, subjectOf } from '../state/store.js';
import { esc, icon, initials } from '../components/ui.js';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
}

export function renderHome() {
  const { student, prep } = state;
  const exam = nextExam();
  const todo = pending().length;
  const doneTopics = Math.floor((prep / 100) * exam.topics.length);

  return `
    <header class="row between top">
      <h1 class="display">${greeting()},<br>${esc(student.name.split(' ')[0])}</h1>
      <button class="avatar" data-action="go" data-screen="profile" aria-label="Ver perfil">${esc(initials(student.name))}</button>
    </header>

    <p class="label">Sugerencia de estudio hoy</p>
    <section class="card dark suggest">
      <div>
        <span class="tag" style="color:#60A5FA">${esc(subjectOf(exam.subjectId).name)} · en ${exam.inDays} días</span>
        <h2 class="h2" style="margin-top:4px">${esc(exam.title)}</h2>
      </div>
      <ul class="route">
        ${exam.topics.map((topic, i) => `<li class="${i < doneTopics ? 'done' : ''}">${esc(topic)}</li>`).join('')}
      </ul>
      <div class="bar" role="progressbar" aria-valuenow="${prep}" aria-valuemin="0" aria-valuemax="100"><i style="width:${prep}%"></i></div>
      <div class="row between">
        <span class="meta">Preparación: ${prep}%</span>
        <button class="btn white" data-action="review" data-subject="${exam.subjectId}">Comenzar repaso</button>
      </div>
    </section>

    <button class="banner" data-action="go-pending">
      <div>
        <strong>${todo ? 'Resolver tareas de Quanta' : 'Tareas de Quanta al día'}</strong>
        <span>${todo ? `${todo} pendiente${todo === 1 ? '' : 's'}` : 'No tienes tareas pendientes'}</span>
      </div>
      <span class="circle">${icon.arrow}</span>
    </button>

    <div class="grid2">
      <div class="card stat">
        <span class="big">${resolved().length}</span>
        <span class="meta">Tareas listas</span>
      </div>
      <div class="card dark stat" style="border-radius:var(--r-md)">
        <span class="big">${icon.star}${student.performance}%</span>
        <span class="meta">Rendimiento</span>
      </div>
    </div>`;
}
