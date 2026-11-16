import { esc, icon } from '../components/ui.js';
import { QUESTIONS, answer, sourceInfo } from '../services/agenda.js';

function itemRow(it) {
  const flags = [it.soon ? '⚑ 48 h' : '', it.high ? `${it.weight}%` : (it.weight != null ? `${it.weight}%` : '')].filter(Boolean);
  return `
    <article class="card task">
      <div class="row between top">
        <div style="min-width:0">
          <span class="tag">${esc(it.subject)}${it.type === 'práctica' ? ' · práctica' : it.category ? ` · ${esc(it.category)}` : ''}</span>
          <h3>${esc(it.name)}</h3>
        </div>
        ${flags.length ? `<span class="chip ${it.soon ? 'bad' : it.high ? 'blue' : ''}">${flags.join(' · ')}</span>` : ''}
      </div>
      <span class="meta">${it.ymd ? esc(new Date(it.ymd + 'T12:00:00Z').toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })) : 'Sin fecha'}${it.teacher ? ` · ${esc(it.teacher)}` : ''}</span>
    </article>`;
}

export function renderAnswer(res) {
  const body = res.subjects
    ? res.subjects.map((s) => `<article class="card task"><h3>${esc(s.subject)}</h3><span class="meta">${esc(s.detail)}</span></article>`).join('')
    : (res.items?.length ? res.items.map(itemRow).join('') : '<p class="empty">Nada en este periodo.</p>');
  const more = res.more ? `<button class="btn ghost block" data-action="agenda-all" data-q="${esc(res.id)}">Ver las ${res.total} (hay ${res.more} más)</button>` : '';
  const footer = `Última fuente disponible: ${esc(res.src.kind)}${res.src.date ? ` del ${esc(res.src.date)}` : ''}; revisa Quanta para confirmar cambios.`;
  return `
    <div class="answer">
      <h2 class="h2">${esc(res.headline)}</h2>
      ${body}
      ${more}
      <p class="note" style="display:block"><b>Recomendación:</b> ${esc(res.recommendation)}</p>
      <p class="meta">${footer} · [fuente: ${esc(res.src.kind)}]</p>
    </div>`;
}

export function renderAgenda(current = 'semana', all = false) {
  const res = { ...answer(current, { all }), id: current };
  const src = sourceInfo();
  return `
    <header>
      <h1 class="title">Asistente</h1>
      <p class="sub" style="margin-top:8px">Tu agenda escolar · responde al instante y sin inventar</p>
    </header>
    ${!src.date ? '<p class="note warn" style="display:block">La cuenta de Gmail que recibe Quanta no está conectada. Respondo con la exportación guardada.</p>'
      : '<p class="note" style="display:block">Gmail de Quanta no conectado todavía: respondo con la exportación guardada. Conéctalo para novedades automáticas.</p>'}
    <div class="pills" role="tablist">
      ${QUESTIONS.map(([id, label]) => `<button class="pill ${id === current ? 'on' : ''}" data-action="agenda-q" data-q="${id}">${esc(label)}</button>`).join('')}
    </div>
    ${renderAnswer({ ...res, id: current })}`;
}
