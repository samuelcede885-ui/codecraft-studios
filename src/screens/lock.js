import { state } from '../state/store.js';
import { esc, icon, initials, sheetHeader } from '../components/ui.js';
import { hasPin, autoLockOn } from '../services/lock.js';

export function renderLock(entered = '', message = '') {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return `
    <section class="lock">
      <span class="avatar">${esc(initials(state.student.name))}</span>
      <h1 class="title" style="font-size:28px">App bloqueada</h1>
      <p class="sub">Escribe tu PIN para ver tus tareas</p>
      <div class="dots" aria-label="${entered.length} dígitos escritos">
        ${Array.from({ length: Math.max(4, entered.length) }, (_, i) => `<i class="${i < entered.length ? 'on' : ''}"></i>`).join('')}
      </div>
      <p class="lock-msg" role="alert">${esc(message)}</p>
      <div class="pad">
        ${keys.map((k) => k === ''
          ? '<span></span>'
          : k === 'del'
            ? `<button class="key ghostkey" data-action="pin-key" data-k="del" aria-label="Borrar">${icon.x}</button>`
            : `<button class="key" data-action="pin-key" data-k="${k}">${k}</button>`).join('')}
      </div>
      <button class="btn ghost" data-action="pin-ok">Desbloquear</button>
      <button class="link" data-action="forgot-pin">Olvidé mi PIN</button>
    </section>`;
}

export function securitySettings(setting, iconSvg) {
  return `
    <h2 class="h2" style="margin-top:8px">Seguridad</h2>
    ${setting('pin-setup', iconSvg, 'Bloqueo con PIN', hasPin() ? 'Activado · toca para cambiar o quitar' : 'Desactivado · toca para activarlo')}
    ${hasPin() ? setting('toggle-autolock', icon.clock, 'Bloquear al salir de la app', autoLockOn() ? 'Activado · y tras 2 min sin uso' : 'Solo tras 2 min sin uso') : ''}
    ${setting('wipe', icon.x, 'Borrar mis datos de este dispositivo', 'Quita marcas, ajustes y PIN guardados')}
    ${setting('security-tips', icon.sync, 'Revisión de seguridad', 'Contraseña, sesiones y privacidad')}`;
}

export function pinSheet() {
  const field = (name, label) => `
    <label class="field">${label}
      <input name="${name}" id="${name}" type="password" inputmode="numeric" autocomplete="off" pattern="\\d{4,8}" maxlength="8" required>
    </label>`;
  return `
    ${sheetHeader('Seguridad', hasPin() ? 'Cambiar o quitar el PIN' : 'Activar bloqueo con PIN')}
    <p>El PIN protege la app en este dispositivo. No se guarda: solo una huella cifrada que no permite recuperarlo.</p>
    <form id="pin-form" style="display:flex;flex-direction:column;gap:14px">
      ${hasPin() ? field('pin-current', 'PIN actual') : ''}
      ${field('pin-new', hasPin() ? 'PIN nuevo (4 a 8 números)' : 'PIN (4 a 8 números)')}
      ${field('pin-repeat', 'Repite el PIN')}
      <p class="lock-msg" id="pin-error" role="alert"></p>
      <button class="btn blue block" type="submit">Guardar PIN</button>
    </form>
    ${hasPin() ? `
      <form id="pin-remove-form" style="display:flex;flex-direction:column;gap:10px">
        <button class="btn ghost block" type="submit">Quitar el PIN (usa el PIN actual de arriba)</button>
      </form>` : ''}`;
}

export function wipeSheet() {
  return `
    ${sheetHeader('Seguridad', '¿Borrar los datos de este dispositivo?')}
    <p>Se borran las tareas marcadas como listas, tus ajustes y el PIN guardados en este navegador. Tus datos en Quanta no cambian.</p>
    <button class="btn blue block" data-action="wipe-confirm">Sí, borrar todo</button>
    <button class="btn ghost block" data-action="close-sheet">Cancelar</button>`;
}

export function tipsSheet() {
  return `
    ${sheetHeader('Seguridad', 'Revisión de seguridad')}
    <ul>
      <li><b>Contraseña de Quanta:</b> cámbiala si alguna vez la escribiste en un chat o la anotaste en papel. Usa una que no uses en otro sitio.</li>
      <li><b>Enlace de la app:</b> es privado. Solo tú puedes abrirlo mientras no lo compartas.</li>
      <li><b>Teléfono:</b> activa el bloqueo de pantalla del teléfono y el PIN de esta app.</li>
      <li><b>Sincronización:</b> la contraseña se pide solo en el momento y no se guarda en archivos ni en el repositorio.</li>
      <li><b>Equipos compartidos:</b> si abriste la app en un equipo ajeno, usa «Borrar mis datos de este dispositivo».</li>
    </ul>
    <button class="btn black block" data-action="close-sheet">Entendido</button>`;
}
