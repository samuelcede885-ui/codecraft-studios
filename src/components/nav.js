import { icon } from './ui.js';

const TABS = [
  ['home', 'Inicio', icon.home],
  ['subjects', 'Materias', icon.book],
  null, // botón central
  ['exams', 'Exámenes', icon.clock],
  ['profile', 'Perfil', icon.user],
];

// "Mis Tareas" cuelga de Materias en la navegación.
const tabOf = (screen) => (screen === 'tasks' ? 'subjects' : screen === 'agent' ? 'home' : screen);

export function renderNav(screen) {
  return TABS.map((tab) => {
    if (!tab) return `<button class="plus" data-action="new-task" aria-label="Nueva tarea">${icon.plus}</button>`;
    const [id, label, svg] = tab;
    const on = tabOf(screen) === id;
    return `<button class="${on ? 'on' : ''}" data-action="go" data-screen="${id}" ${on ? 'aria-current="page"' : ''}>${svg}${label}</button>`;
  }).join('');
}
