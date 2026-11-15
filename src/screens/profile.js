import { state, resolved, securedGrade } from '../state/store.js';
import { esc, icon, initials } from '../components/ui.js';

const setting = (action, svg, title, detail) => `
  <button class="setting" data-action="${action}">
    ${svg}
    <div><b>${title}</b><span class="meta">${detail}</span></div>
    <span class="chev">${icon.chev}</span>
  </button>`;

export function renderProfile() {
  const { student, prep, examMode, notifications } = state;
  return `
    <header style="display:flex;flex-direction:column;gap:6px">
      <span class="avatar lg">${esc(initials(student.name))}</span>
      <h1 class="title" style="font-size:30px;margin-top:10px">${esc(student.name)}</h1>
      <p class="sub">${esc(student.email)} · ${esc(student.studentId)}</p>
    </header>
    <div class="row between">
      <span class="pill blue">${icon.sync} Quanta Sync Activo</span>
      <button class="pill ${examMode ? 'on' : ''}" data-action="toggle-exam" aria-pressed="${examMode}">Modo Examen${examMode ? ' · On' : ''}</button>
    </div>

    <section class="card dark metrics">
      <div class="cols">
        <div><span class="big">${resolved().length}</span><span class="meta">Tareas hechas</span></div>
        <div><span class="big">${securedGrade()}%</span><span class="meta">Nota asegurada</span></div>
        <div><span class="big blue">${student.average}</span><span class="meta">Promedio</span></div>
      </div>
      <div class="bar" role="progressbar" aria-valuenow="${prep}" aria-valuemin="0" aria-valuemax="100"><i style="width:${prep}%"></i></div>
      <span class="meta" style="margin-top:-8px">Preparación examen: ${prep}%</span>
    </section>

    <h2 class="h2" style="margin-top:8px">Configuración</h2>
    ${setting('sync', icon.link, 'Conexión con Quanta', state.lastSync ? 'Sincronizado hace un momento' : 'Toca para sincronizar')}
    ${setting('prefs', icon.sliders, 'Preferencias de Estudio IA', 'Guías, resúmenes y simulacros')}
    ${setting('toggle-notif', icon.bell, 'Notificaciones de Exámenes', notifications ? 'Activadas' : 'Desactivadas')}
    ${setting('reset', icon.refresh, 'Reiniciar demo', 'Restaura los datos de ejemplo')}`;
}
