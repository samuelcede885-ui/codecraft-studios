import { esc, icon } from '../components/ui.js';
import { QUESTIONS, answer, answerText, sourceInfo } from '../services/agenda.js';

function itemRow(it) {
  const flags = [it.soon ? '⚑ 48 h' : '', it.weight != null ? `${it.weight}%` : ''].filter(Boolean);
  const date = it.ymd
    ? new Date(it.ymd + 'T12:00:00Z').toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
    : 'Sin fecha';
  const pond = it.weight == null && it.graded ? ' · Ponderación no especificada' : '';
  return `
    <article class="card task">
      <div class="row between top">
        <div style="min-width:0">
          <span class="tag">${esc(it.subject)}${it.type === 'practica' ? ' · práctica' : it.category ? ` · ${esc(it.category)}` : it.type ? ` · ${esc(it.type)}` : ''}</span>
          <h3>${esc(it.name)}</h3>
        </div>
        ${flags.length ? `<span class="chip ${it.soon ? 'bad' : (it.weight >= 15 ? 'blue' : '')}">${esc(flags.join(' · '))}</span>` : ''}
      </div>
      <span class="meta">${esc(date)}${esc(pond)}${it.teacher ? ` · ${esc(it.teacher)}` : ''}</span>
    </article>`;
}

export function renderAnswer(res) {
  if (res.suggestions) {
    return `
      <div class="answer">
        <h2 class="h2">${esc(res.headline)}</h2>
        <div class="pills" style="flex-wrap:wrap">${res.suggestions.map((q) => `<button class="pill" data-action="agenda-fill" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
        <p class="meta">[fuente: ${esc(res.src.kind)}]</p>
      </div>`;
  }
  const body = res.subjects
    ? res.subjects.map((s) => `<article class="card task"><h3>${esc(s.subject)}</h3><span class="meta">${esc(s.detail)}</span></article>`).join('')
    : (res.items?.length ? res.items.map(itemRow).join('') : '<p class="empty">Nada en los datos disponibles.</p>');
  const more = res.more
    ? (res.query != null
        ? `<button class="btn ghost block" data-action="agenda-ask-all">Ver las ${res.total} (hay ${res.more} más)</button>`
        : `<button class="btn ghost block" data-action="agenda-all" data-q="${esc(res.id)}">Ver las ${res.total} (hay ${res.more} más)</button>`)
    : '';
  const footer = `Fuente: datos importados${res.src.date ? ` · Comprobado: ${esc(res.src.date)}` : ' · no verificado en vivo'}. Última fuente disponible${res.src.date ? ` del ${esc(res.src.date)}` : ''}; revisa Quanta para confirmar cambios.`;
  return `
    <div class="answer">
      <h2 class="h2">${esc(res.headline)}</h2>
      ${body}
      ${more}
      ${res.recommendation ? `<p class="note" style="display:block"><b>Recomendación:</b> ${esc(res.recommendation)}</p>` : ''}
      <p class="meta">${esc(footer)} · [fuente: ${esc(res.src.kind)}]</p>
    </div>`;
}

export function renderAgenda(initial = '', text = '') {
  const src = sourceInfo();
  const res = text ? { ...answerText(text) } : { ...answer(initial || 'semana'), id: initial || 'semana' };
  return `
    <header>
      <h1 class="title">Pregúntale a Quanta AI</h1>
      <p class="sub" style="margin-top:8px">Tu agenda escolar · responde al instante y sin inventar</p>
    </header>
    ${src.date
      ? '<p class="note" style="display:block">Respondo con la exportación guardada. Gmail de Quanta no conectado; conéctalo para novedades automáticas.</p>'
      : '<p class="note warn" style="display:block">Sin fuente conectada: respondo con los datos de ejemplo.</p>'}
    <form id="agenda-form" class="row" style="gap:8px">
      <input id="agenda-input" name="q" placeholder="Escribe una pregunta sobre tus tareas o evaluaciones…" autocomplete="off" value="${esc(text)}"
        style="flex:1;min-width:0;font-size:16px;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:var(--gray);color:var(--ink)">
      <button class="btn blue" type="submit" aria-label="Preguntar">${icon.arrow}</button>
    </form>
    <div class="pills" role="tablist">
      ${QUESTIONS.map(([id, label]) => `<button class="pill ${!text && (initial || 'semana') === id ? 'on' : ''}" data-action="agenda-q" data-q="${id}">${esc(label)}</button>`).join('')}
    </div>
    <div id="agenda-answer">${renderAnswer(text ? { ...res, query: text } : { ...res, id: initial || 'semana' })}</div>`;
}
