/** Utilidades compartidas, sin dependencias del DOM de una página concreta. */

/** Escapa texto para interpolarlo de forma segura en plantillas HTML. */
export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
}

/** Formatea un precio con la moneda del restaurante (locale por defecto del navegador). */
export function formatPrice(amount, currency = 'USD', locale = undefined) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

/** Crea un elemento a partir de una cadena HTML (un único nodo raíz). */
export function html(markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = markup.trim();
  return tpl.content.firstElementChild;
}

/** Iniciales para usar como logo de respaldo. */
export function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

/** Sustituye las imágenes que no cargan por el nodo que devuelva `makeFallback(img)`. */
export function fallbackOnError(root, makeFallback) {
  root.querySelectorAll('img').forEach((img) => img.addEventListener('error', () => {
    img.replaceWith(makeFallback(img));
  }, { once: true }));
  return root;
}
