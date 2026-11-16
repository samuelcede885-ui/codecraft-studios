// Punto de entrada: router de pantallas y manejo de acciones (delegación de eventos).
import { state, save, reset, taskById } from './state/store.js';
import { syncQuanta } from './services/quanta.js';
import { solveTask, buildGuide } from './services/ai.js';
import { toast, openSheet, setSheet, closeSheet, sheetIsOpen } from './components/ui.js';
import { renderNav } from './components/nav.js';
import { renderHome } from './screens/home.js';
import { renderTasks } from './screens/tasks.js';
import { renderSubjects } from './screens/subjects.js';
import { renderExams } from './screens/exams.js';
import { renderProfile } from './screens/profile.js';
import { solvingSheet, draftSheet, guideSheet, newTaskSheet } from './screens/sheets.js';

// Estado de navegación (no se persiste)
const view = { screen: 'home', filter: 'todas', subjectId: null };
let solveRun = 0; // invalida una resolución en curso si se cierra la hoja

const SCREENS = {
  home: renderHome,
  tasks: () => renderTasks(view),
  subjects: renderSubjects,
  exams: renderExams,
  profile: renderProfile,
};

function render() {
  document.getElementById('screen').innerHTML = SCREENS[view.screen]();
  document.getElementById('nav').innerHTML = renderNav(view.screen);
}

function go(screen, patch = {}) {
  Object.assign(view, { screen }, patch);
  render();
  window.scrollTo(0, 0);
}

const actions = {
  go: ({ screen }) => go(screen),
  'go-pending': () => go('tasks', { filter: 'pendientes', subjectId: null }),
  'go-all': () => go('tasks', { filter: 'todas', subjectId: null }),
  'open-subject': ({ subject }) => go('tasks', { filter: 'todas', subjectId: subject }),
  'clear-subject': () => go('tasks', { subjectId: null }),
  filter: ({ filter }) => { view.filter = filter; render(); },

  'close-sheet': () => { solveRun++; closeSheet(); },

  async solve({ id }) {
    const task = taskById(id);
    const run = ++solveRun;
    openSheet(solvingSheet(task, 0));
    const draft = await solveTask(task, (step) => {
      if (run === solveRun && step < 4) setSheet(solvingSheet(task, step));
    });
    if (run !== solveRun || !sheetIsOpen()) return;
    setSheet(draftSheet(task, draft));
  },

  approve({ id }) {
    taskById(id).status = 'resuelta';
    save();
    closeSheet();
    render();
    toast('Tarea lista · guía de estudio generada');
  },

  guide: ({ subject }) => openSheet(guideSheet(buildGuide(subject))),

  review({ subject }) {
    if (state.prep != null) { state.prep = Math.min(100, state.prep + 5); save(); render(); }
    openSheet(guideSheet(buildGuide(subject)));
  },

  answer(_, el) {
    const quiz = el.closest('.quiz');
    if (quiz.dataset.done) return;
    quiz.dataset.done = '1';
    const ok = el.dataset.ok === 'true';
    el.classList.add(ok ? 'right' : 'wrong');
    if (!ok) quiz.querySelector('[data-ok="true"]').classList.add('right');
  },

  'new-task': () => openSheet(newTaskSheet()),

  async sync() {
    toast('Sincronizando con Quanta…');
    const { total, fetchedAt } = await syncQuanta();
    render();
    toast(fetchedAt ? `${total} tareas de Quanta · pide a Claude actualizar los datos` : `Quanta sincronizado · ${total} tareas`);
  },
  prefs: () => toast('Preferencias de IA: próximamente'),
  'toggle-exam': () => {
    state.examMode = !state.examMode; save(); render();
    toast(state.examMode ? 'Modo Examen activado' : 'Modo Examen desactivado');
  },
  'toggle-notif': () => { state.notifications = !state.notifications; save(); render(); },
  reset: () => { reset(); render(); toast('Datos restaurados'); },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (el) actions[el.dataset.action]?.(el.dataset, el);
});

document.addEventListener('submit', (e) => {
  if (e.target.id !== 'new-task-form') return;
  e.preventDefault();
  const form = new FormData(e.target);
  const title = String(form.get('title')).trim();
  if (!title) return;
  state.tasks.push({
    id: `t${Date.now()}`,
    subjectId: form.get('subjectId'),
    title,
    dueIn: Math.max(0, Number(form.get('dueIn')) || 0),
    status: 'pendiente',
    forExam: false,
    instructions: String(form.get('instructions')).trim() || 'Sin instrucciones adicionales.',
    weight: null,
    kind: 'manual',
  });
  save();
  closeSheet();
  go('tasks', { filter: 'pendientes', subjectId: null });
  toast('Tarea añadida');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sheetIsOpen()) actions['close-sheet']();
});

render();
