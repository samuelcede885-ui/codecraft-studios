// Contenido de las hojas inferiores: resolver tarea, guía de estudio y nueva tarea.
import { state, subjectOf } from '../state/store.js';
import { SOLVE_STEPS } from '../services/ai.js';
import { CHECKLIST, EVIDENCE, PRINCIPLES } from '../services/estudiante-pro.js';
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

const list = (items, tag = 'ul') => `<${tag}>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</${tag}>`;

function proSheet(task, plan) {
  const checks = state.checks?.[task.id] || [];
  const done = checks.filter(Boolean).length;
  return `
    ${sheetHeader(`Estudiante Pro · ${plan.format}`, task.title)}
    <p class="meta">${esc(plan.intro)}</p>
    <p class="note">Plan para hacer el trabajo tú, con ayuda. No inventa datos, experiencias ni fuentes. Marcarla como lista solo cambia esta app, no Quanta.</p>
    ${plan.warn ? `<p class="note warn">${esc(plan.warn)}</p>` : ''}
    <h3 class="h2">Supuestos</h3>${list(plan.assumptions)}
    <h3 class="h2">Estructura</h3>${list(plan.structure, 'ol')}
    <h3 class="h2">Qué debes personalizar</h3>${list(plan.personalize)}
    <h3 class="h2">Preguntas que podrían hacerte</h3>${list(plan.questions)}
    <h3 class="h2">Pídele el borrador a Claude</h3>
    <textarea class="prompt" id="pro-prompt" readonly rows="8" aria-label="Petición para Claude">${esc(plan.prompt)}</textarea>
    <button class="btn black block" data-action="copy-prompt">Copiar petición</button>
    <h3 class="h2">Revisión de calidad · ${done}/${CHECKLIST.length}</h3>
    <div class="checklist">
      ${CHECKLIST.map((c, i) => `
        <label class="check"><input type="checkbox" data-action="check" data-id="${task.id}" data-i="${i}" ${checks[i] ? 'checked' : ''}><span>${esc(c)}</span></label>`).join('')}
    </div>
    <h3 class="h2">Protege tu autoría</h3>${list(EVIDENCE)}
    <button class="btn blue block" data-action="approve" data-id="${task.id}">Marcar como lista</button>
    <button class="btn ghost block" data-action="close-sheet">Cerrar</button>`;
}

export function principlesSheet() {
  return `
    ${sheetHeader('Preferencias de Estudio IA', 'Estudiante Pro')}
    <p>La app ayuda a planificar, investigar y revisar tus trabajos con estas reglas:</p>
    ${list(PRINCIPLES, 'ol')}
    <h3 class="h2">Si te acusan por un detector de IA</h3>
    <p>Un detector da una probabilidad, no una prueba. Conserva tus borradores, apuntes y fuentes, y pide una revisión humana con esa evidencia.</p>
    <button class="btn black block" data-action="close-sheet">Entendido</button>`;
}

export function draftSheet(task, draft) {
  if (draft.kind === 'pro') return proSheet(task, draft);
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

export function syncSheet() {
  const when = state.importedAt || state.fetchedAt;
  return `
    ${sheetHeader('Conexión con Quanta', 'Importar tareas')}
    <p class="note">La sincronización automática está desactivada: Quanta no ofrece una API oficial para apps de terceros y no hay autorización del colegio. Tus datos se actualizan importando archivos tuyos o añadiendo tareas con el botón +.</p>
    ${when ? `<p class="meta">Últimos datos: ${esc(new Date(when).toLocaleString('es-VE', { timeZone: 'America/Caracas' }))}</p>` : ''}
    <form id="import-form" style="display:flex;flex-direction:column;gap:14px">
      <label class="field">Archivo de calendario (.ics) o copia de esta app (.json), máximo 1 MB
        <input id="import-file" name="file" type="file" accept=".ics,.json,text/calendar,application/json" required>
      </label>
      <p class="lock-msg" id="import-error" role="alert"></p>
      <button class="btn blue block" type="submit">Importar</button>
    </form>
    <p class="meta">Si un archivo trae tareas que ya existen, no se duplican. Las tareas sin materia reconocible van a «Importadas».</p>`;
}
