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
import { solvingSheet, draftSheet, guideSheet, newTaskSheet, principlesSheet } from './screens/sheets.js';
import { renderLock, pinSheet, wipeSheet, tipsSheet } from './screens/lock.js';
import * as guard from './services/lock.js';

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

let pinEntry = '';
let pinMsg = '';

function render() {
  const phone = document.querySelector('.phone');
  if (guard.isLocked()) {
    phone.classList.add('locked');
    document.getElementById('screen').innerHTML = renderLock(pinEntry, pinMsg);
    document.getElementById('nav').innerHTML = '';
    return;
  }
  phone.classList.remove('locked');
  document.getElementById('screen').innerHTML = SCREENS[view.screen]();
  document.getElementById('nav').innerHTML = renderNav(view.screen);
}

function lockNow() {
  if (!guard.hasPin() || guard.isLocked()) return;
  guard.lock();
  solveRun++;
  closeSheet();
  pinEntry = '';
  pinMsg = '';
  render();
}

async function tryUnlock() {
  if (pinEntry.length < 4) { pinMsg = 'El PIN tiene al menos 4 números'; return render(); }
  const r = await guard.unlock(pinEntry);
  pinEntry = '';
  pinMsg = r.ok ? '' : r.wait ? `Demasiados intentos. Espera ${r.wait} s` : 'PIN incorrecto';
  render();
  if (r.ok) toast('Desbloqueada');
}

function go(screen, patch = {}) {
  Object.assign(view, { screen }, patch);
  render();
  window.scrollTo(0, 0);
}

const actions = {
  'pin-key'({ k }) {
    if (k === 'del') pinEntry = pinEntry.slice(0, -1);
    else if (pinEntry.length < 8) pinEntry += k;
    pinMsg = '';
    render();
    if (pinEntry.length >= 4 && guard.waitSeconds() === 0 && pinEntry.length === 8) tryUnlock();
  },
  'pin-ok': () => tryUnlock(),
  'forgot-pin': () => { pinMsg = 'Para recuperarla, borra los datos de este dispositivo'; openSheet(wipeSheet()); },
  'pin-setup': () => openSheet(pinSheet()),
  'toggle-autolock': () => { guard.setAutoLock(!guard.autoLockOn()); render(); },
  wipe: () => openSheet(wipeSheet()),
  'wipe-confirm': () => {
    reset();
    guard.wipeDevice();
    pinEntry = ''; pinMsg = '';
    closeSheet();
    go('home');
    toast('Datos de este dispositivo borrados');
  },
  'security-tips': () => openSheet(tipsSheet()),

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
  prefs: () => openSheet(principlesSheet()),
  check({ id, i }, el) {
    state.checks = state.checks || {};
    const list = state.checks[id] || [];
    list[Number(i)] = el.checked;
    state.checks[id] = list;
    save();
    const h = [...document.querySelectorAll('#sheet h3')].find((x) => x.textContent.startsWith('Revisión de calidad'));
    if (h) h.textContent = `Revisión de calidad · ${list.filter(Boolean).length}/7`;
  },
  'copy-prompt'() {
    const box = document.getElementById('pro-prompt');
    const fallback = () => { box.focus(); box.select(); toast('Selecciona y copia el texto'); };
    try {
      navigator.clipboard.writeText(box.value).then(() => toast('Petición copiada · pégala en Claude'), fallback);
    } catch { fallback(); }
  },
  'toggle-exam': () => {
    state.examMode = !state.examMode; save(); render();
    toast(state.examMode ? 'Modo Examen activado' : 'Modo Examen desactivado');
  },
  'toggle-notif': () => { state.notifications = !state.notifications; save(); render(); },
  reset: () => { reset(); render(); toast('Datos restaurados'); },
};

const LOCKED_OK = new Set(['pin-key', 'pin-ok', 'forgot-pin', 'wipe-confirm', 'close-sheet']);

document.addEventListener('click', (e) => {
  guard.touch();
  const el = e.target.closest('[data-action]');
  if (el && guard.isLocked() && !LOCKED_OK.has(el.dataset.action)) return;
  if (el) actions[el.dataset.action]?.(el.dataset, el);
});

document.addEventListener('submit', async (e) => {
  if (e.target.id === 'pin-form' || e.target.id === 'pin-remove-form') {
    e.preventDefault();
    const val = (id) => document.getElementById(id)?.value.trim() || '';
    const error = (msg) => { document.getElementById('pin-error').textContent = msg; };
    const current = val('pin-current');
    if (guard.hasPin()) {
      if (guard.waitSeconds()) return error(`Demasiados intentos. Espera ${guard.waitSeconds()} s`);
      if (e.target.id === 'pin-remove-form') {
        const r = await guard.removePin(current);
        if (!r.ok) return error(r.wait ? `Demasiados intentos. Espera ${r.wait} s` : 'El PIN actual no es correcto');
        closeSheet(); render(); return toast('PIN quitado');
      }
      const r = await guard.unlock(current);
      if (!r.ok) return error(r.wait ? `Demasiados intentos. Espera ${r.wait} s` : 'El PIN actual no es correcto');
    }
    const pin = val('pin-new');
    if (!guard.validPin(pin)) return error('Usa de 4 a 8 números');
    if (/^(\d)\1+$/.test(pin) || '0123456789012345678'.includes(pin) || '9876543210987654321'.includes(pin)) return error('Evita PIN fáciles como 1111 o 1234');
    if (pin !== val('pin-repeat')) return error('Los dos PIN no coinciden');
    try { await guard.setPin(pin); } catch (err) { return error(err.message); }
    closeSheet(); render(); toast('PIN activado');
    return;
  }
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

// Bloqueo automático: al salir de la app y tras 2 minutos sin uso.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && guard.autoLockOn()) lockNow();
});
setInterval(() => { if (guard.idleTooLong()) lockNow(); }, 15000);

document.addEventListener('keydown', (e) => {
  guard.touch();
  if (guard.isLocked() && /^\d$/.test(e.key)) return actions['pin-key']({ k: e.key });
  if (guard.isLocked() && e.key === 'Backspace') return actions['pin-key']({ k: 'del' });
  if (guard.isLocked() && e.key === 'Enter') return tryUnlock();
  if (e.key === 'Escape' && sheetIsOpen()) actions['close-sheet']();
});

render();
