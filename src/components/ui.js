// Utilidades de interfaz compartidas: iconos, escape de HTML, toast y hoja inferior.

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const svg = (body, fill = false) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" ${fill
    ? 'fill="currentColor"'
    : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'}>${body}</svg>`;

export const icon = {
  home: svg('<path d="M12 3 3 10.5V20a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-9.5z"/>', true),
  book: svg('<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20a2 2 0 0 0 2 2h13v-4"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0z"/>', true),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chev: svg('<path d="m9 6 6 6-6 6"/>'),
  star: svg('<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1z"/>', true),
  x: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  sliders: svg('<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>'),
  bell: svg('<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>'),
  refresh: svg('<path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2"/><path d="M20 4v5h-5M4 20v-5h5"/>'),
  sync: svg('<path d="M5 13l4 4L19 7"/>'),
};

export const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');

let toastTimer;
export function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

const sheetEl = () => document.getElementById('sheet');

export function openSheet(html) {
  const el = sheetEl();
  el.innerHTML = `<div class="backdrop" data-action="close-sheet"></div>
    <section class="panel" role="dialog" aria-modal="true">${html}</section>`;
  el.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => el.classList.add('open'));
}

export function setSheet(html) {
  const panel = sheetEl().querySelector('.panel');
  if (panel) { panel.innerHTML = html; panel.scrollTop = 0; }
}

export function closeSheet() {
  const el = sheetEl();
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
}

export const sheetIsOpen = () => sheetEl().classList.contains('open');

export const sheetHeader = (tag, title) => `
  <div class="row between top">
    <div><span class="tag">${esc(tag)}</span><h2>${esc(title)}</h2></div>
    <button class="close" data-action="close-sheet" aria-label="Cerrar">${icon.x}</button>
  </div>`;
