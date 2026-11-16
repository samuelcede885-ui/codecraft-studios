import { state, subjectOf, topicsFor, dayLabel } from '../state/store.js';
import { esc } from '../components/ui.js';

const dateOf = (iso) => new Date(iso).toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Caracas' });

export function renderExams() {
  const exams = state.exams.filter((e) => e.inDays >= 0).sort((a, b) => a.inDays - b.inDays);
  return `
    <header>
      <h1 class="title">Exámenes</h1>
      <p class="sub" style="margin-top:8px">${exams.length} evaluaciones próximas</p>
    </header>
    ${exams.length ? '' : '<p class="empty">No hay evaluaciones próximas.</p>'}
    ${exams.map((e, i) => {
      const topics = topicsFor(e);
      return `
      <article class="card ${i === 0 ? 'dark' : ''} task">
        <div class="row between top">
          <div style="min-width:0">
            <span class="tag ${i === 0 ? 'light' : ''}">${esc(subjectOf(e.subjectId).name)}${e.category ? ` · ${esc(e.category)}` : ''}</span>
            <h3>${esc(e.title)}</h3>
          </div>
          <span class="pct">${e.weight != null ? `${e.weight}%` : `${e.inDays} días`}</span>
        </div>
        <span class="meta">${e.due ? `${esc(dateOf(e.due))} · ${dayLabel(e.inDays)}` : dayLabel(e.inDays)}${e.teacher ? ` · ${esc(e.teacher)}` : ''}</span>
        ${topics.length ? `<span class="meta">${topics.map(esc).join(' · ')}</span>` : ''}
        <div class="row">
          <button class="btn ${i === 0 ? 'white' : 'black'}" data-action="guide" data-subject="${e.subjectId}">Guía de estudio</button>
        </div>
      </article>`;
    }).join('')}`;
}
