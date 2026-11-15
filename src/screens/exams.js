import { state, subjectOf } from '../state/store.js';
import { esc } from '../components/ui.js';

export function renderExams() {
  const exams = [...state.exams].sort((a, b) => a.inDays - b.inDays);
  return `
    <header>
      <h1 class="title">Exámenes</h1>
      <p class="sub" style="margin-top:8px">${exams.length} exámenes próximos</p>
    </header>
    ${exams.map((e, i) => `
      <article class="card ${i === 0 ? 'dark' : ''} task">
        <div class="row between top">
          <div>
            <span class="tag" ${i === 0 ? 'style="color:#60A5FA"' : ''}>${esc(subjectOf(e.subjectId).name)}</span>
            <h3>${esc(e.title)}</h3>
          </div>
          <span class="pct">${e.inDays} días</span>
        </div>
        <span class="meta">${e.topics.map(esc).join(' · ')}</span>
        <div class="row">
          <button class="btn ${i === 0 ? 'white' : 'black'}" data-action="guide" data-subject="${e.subjectId}">Guía y simulacro</button>
        </div>
      </article>`).join('')}`;
}
