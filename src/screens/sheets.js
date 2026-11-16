// Contenido de las hojas inferiores: resolver tarea, guía de estudio y nueva tarea.
import { state, subjectOf } from '../state/store.js';
import { SOLVE_STEPS } from '../services/ai.js';
import { esc, sheetHeader } from '../components/ui.js';

export function solvingSheet(task, step) {
  const pct = Math.round((step / SOLVE_STEPS.length) * 100);
  return `
    ${sheetHeader(subjectOf(task.subjectId).name, 'Resolviendo tarea…')}
    <p>${esc(task.title)}</p>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <ul class="steps">
      ${SOLVE_STEPS.map((label, i) =>
        `<li class="${i < step ? 'done' : i === step ? 'active' : ''}"><i></i>${label}</li>`).join('')}
    </ul>`;
}

export function draftSheet(task, draft) {
  return `
    ${sheetHeader(subjectOf(task.subjectId).name, draft.kind === 'plan' ? 'Plan de trabajo' : 'Borrador listo para revisar')}
    <p class="note">${draft.kind === 'plan'
      ? 'Plan armado con las lecciones reales de Quanta, no una respuesta. Marcarla como lista solo cambia esta app, no Quanta.'
      : 'Demo: este borrador es simulado. Revísalo y ajústalo antes de entregarlo en Quanta.'}</p>
    <div class="draft">
      <p>${esc(draft.intro)}</p>
      ${draft.sections.map((s) => `<h4>${esc(s.heading)}</h4><p>${esc(s.body)}</p>`).join('')}
    </div>
    <button class="btn blue block" data-action="approve" data-id="${task.id}">Aprobar y marcar como lista</button>
    <button class="btn ghost block" data-action="close-sheet">Descartar</button>`;
}

export function guideSheet(guide) {
  return `
    ${sheetHeader(guide.subject, 'Guía de estudio')}
    <p>${esc(guide.summary)}</p>
    ${guide.concepts.length ? `<h3 class="h2">${esc(guide.conceptsTitle || 'Conceptos clave')}</h3>
    <ul>${guide.concepts.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
    <h3 class="h2">Simulacro</h3>
    ${guide.quiz.length ? '' : '<p class="note">Los simulacros con preguntas se generarán cuando se conecte el modelo de IA. Por ahora, repasa estas lecciones y haz los puntos de práctica en Quanta.</p>'}
    ${guide.quiz.map((item, qi) => `
      <div class="quiz">
        <p><b>${qi + 1}. ${esc(item.q)}</b></p>
        ${item.options.map((o, oi) =>
          `<button class="opt" data-action="answer" data-ok="${oi === item.answer}">${esc(o)}</button>`).join('')}
      </div>`).join('')}
    <button class="btn black block" data-action="close-sheet">Terminar repaso</button>`;
}

export function newTaskSheet() {
  return `
    ${sheetHeader('Nueva tarea', 'Añadir tarea manual')}
    <form id="new-task-form" style="display:flex;flex-direction:column;gap:14px">
      <label class="field">Título
        <input name="title" required maxlength="80" placeholder="Ej. Ejercicios de logaritmos" autocomplete="off">
      </label>
      <label class="field">Materia
        <select name="subjectId">${state.subjects.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select>
      </label>
      <label class="field">Instrucciones del profesor
        <textarea name="instructions" rows="3" maxlength="300" placeholder="Pega aquí el enunciado"></textarea>
      </label>
      <label class="field">Días para la entrega
        <input name="dueIn" type="number" min="0" max="60" value="3" inputmode="numeric">
      </label>
      <button class="btn blue block" type="submit">Guardar tarea</button>
    </form>`;
}
