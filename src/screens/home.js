import { state, pending, resolved, nextExam, subjectOf, topicsFor, prepFor, dayLabel } from '../state/store.js';
import { esc, icon, initials } from '../components/ui.js';
import { readyCount } from '../services/agent.js';

function greeting() {
  const h = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Caracas' }));
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

function suggestion() {
  const exam = nextExam();
  if (!exam) return '<p class="empty">No hay evaluaciones próximas.</p>';
  const topics = topicsFor(exam);
  const prep = prepFor(exam.subjectId);
  const doneTopics = Math.floor((prep / 100) * topics.length);
  return `
    <section class="card dark suggest">
      <div>
        <span class="tag light">${esc(subjectOf(exam.subjectId).name)} · ${dayLabel(exam.inDays)}${exam.weight != null ? ` · ${exam.weight}%` : ''}</span>
        <h2 class="h2" style="margin-top:4px">${esc(exam.title)}</h2>
      </div>
      <ul class="route">
        ${topics.map((topic, i) => `<li class="${i < doneTopics ? 'done' : ''}">${esc(topic)}</li>`).join('')}
      </ul>
      <div class="bar" role="progressbar" aria-valuenow="${prep}" aria-valuemin="0" aria-valuemax="100"><i style="width:${prep}%"></i></div>
      <div class="row between">
        <span class="meta">Preparación: ${prep}%</span>
        <button class="btn white" data-action="review" data-subject="${exam.subjectId}">Comenzar repaso</button>
      </div>
    </section>`;
}

export function renderHome() {
  const { student } = state;
  const todo = pending();
  const evals = todo.filter((t) => t.kind === 'evaluacion').length;
  const note = state.announcements?.[0];

  return `
    <header class="row between top">
      <h1 class="display">${greeting()},<br>${esc(student.name.split(' ')[0])}</h1>
      <button class="avatar" data-action="go" data-screen="profile" aria-label="Ver perfil">${esc(initials(student.name))}</button>
    </header>

    <button class="card outline row between" data-action="go-agenda" style="display:flex;margin-bottom:2px">
      <div><span class="tag">Asistente de agenda</span><div class="label" style="margin-top:2px">Pregúntame qué tienes esta semana</div></div>
      <span class="circle" style="background:var(--dark)">${icon.arrow}</span>
    </button>

    <p class="label">Sugerencia de estudio hoy</p>
    ${suggestion()}

    ${(() => { const r = readyCount(); return r ? `
    <button class="card outline row between" data-action="go" data-screen="agent" style="display:flex">
      <div><span class="tag">Agente diario</span><div class="label" style="margin-top:2px">${r} borrador${r === 1 ? '' : 'es'} por revisar</div></div>
      <span class="circle" style="background:var(--blue)">${icon.arrow}</span>
    </button>` : ''; })()}

    <button class="banner" data-action="go-pending">
      <div>
        <strong>${todo.length ? 'Resolver tareas de Quanta' : 'Tareas de Quanta al día'}</strong>
        <span>${todo.length
          ? `${todo.length} pendiente${todo.length === 1 ? '' : 's'}${evals ? ` · ${evals} evaluaciones` : ''}`
          : 'No tienes tareas pendientes'}</span>
      </div>
      <span class="circle">${icon.arrow}</span>
    </button>

    <div class="grid2">
      <div class="card stat">
        <span class="big">${resolved().length}</span>
        <span class="meta">Tareas listas</span>
      </div>
      <div class="card dark stat" style="border-radius:var(--r-md)">
        ${student.xp != null
          ? `<span class="big">${icon.star}Nv. ${student.level}</span><span class="meta">${student.xp} XP en Quanta</span>`
          : `<span class="big">${icon.star}${student.performance}%</span><span class="meta">Rendimiento</span>`}
      </div>
    </div>

    ${note ? `
      <article class="card outline task">
        <span class="tag">${esc(note.title.replace(/^Nuevo anuncio en /, ''))}</span>
        <p class="sub" style="color:var(--ink);white-space:pre-line">${esc(note.message)}</p>
        <span class="meta">Anuncio del profesor</span>
      </article>` : ''}`;
}
