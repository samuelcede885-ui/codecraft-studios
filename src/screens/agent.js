import { esc, icon } from '../components/ui.js';
import { allDrafts, readyCount, lastRun, pendingTasks } from '../services/agent.js';

const STATE_LABEL = {
  ready_for_review: ['Listo para revisar', 'blue'],
  needs_input: ['Requiere tus datos', 'on'],
  reviewed: ['Revisado', 'ok'],
  failed: ['No se pudo preparar', 'bad'],
};

function draftCard(d) {
  const [label, tone] = STATE_LABEL[d.status] || STATE_LABEL.ready_for_review;
  return `
    <article class="card task">
      <div class="row between top">
        <div style="min-width:0">
          <span class="tag">${esc(d.subject)}${d.isAssessment ? ' · guía de estudio' : ''}</span>
          <h3>${esc(d.title)}</h3>
        </div>
        <span class="chip ${tone}">${label}</span>
      </div>
      ${d.needsInput?.length ? `<span class="meta">Tú aportas: ${esc(d.needsInput.slice(0, 2).join(' · '))}${d.needsInput.length > 2 ? '…' : ''}</span>` : ''}
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <button class="btn black" data-action="agent-view" data-id="${esc(d.taskId)}">Ver y copiar</button>
        ${d.status === 'reviewed'
          ? '<span class="meta">Revisado · cópialo y entrégalo tú en Quanta</span>'
          : `<button class="btn ghost" data-action="agent-review" data-id="${esc(d.taskId)}">Marcar revisado</button>`}
      </div>
    </article>`;
}

export function renderAgent() {
  const drafts = allDrafts();
  const ready = readyCount();
  const run = lastRun();
  return `
    <header>
      <h1 class="title">Agente diario</h1>
      <p class="sub" style="margin-top:8px">Prepara tus tareas para que tú las revises y entregues</p>
    </header>

    <section class="card dark suggest">
      <div class="row between top">
        <div>
          <span class="tag light">Agente de estudio</span>
          <h2 class="h2" style="margin-top:4px">${ready ? `${ready} borrador${ready === 1 ? '' : 'es'} por revisar` : 'Todo revisado'}</h2>
        </div>
        ${icon.sync}
      </div>
      <span class="meta">${run ? `Última preparación: ${esc(run)}` : 'Aún no se ha preparado nada'} · ${pendingTasks().length} tareas pendientes</span>
      <div class="row" style="gap:8px">
        <button class="btn white" data-action="agent-run">Preparar ahora</button>
        <button class="btn ghost" data-action="agent-notifs" style="color:#fff;background:#ffffff22">Activar avisos</button>
      </div>
    </section>

    <p class="note" style="display:block">El agente no entrega nada ni se conecta a Quanta. Prepara material con Estudiante Pro desde tus tareas importadas; tú revisas, copias y entregas en persona. Para pruebas prepara guía de estudio, no respuestas de examen.</p>

    ${drafts.length ? drafts.map(draftCard).join('') : '<p class="empty">Aún no hay borradores. Importa tus tareas y toca «Preparar ahora».</p>'}`;
}
