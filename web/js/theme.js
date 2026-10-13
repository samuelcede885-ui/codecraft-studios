/**
 * Aplica la personalización de la marca como variables CSS.
 * Toda la interfaz usa var(--brand), así que basta con llamar a applyBranding().
 */

/** Devuelve '#000' o '#fff' según el contraste con el color dado. */
export function readableTextOn(hex) {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.4 ? '#111827' : '#ffffff';
}

/**
 * @param {import('./services/api.js').Branding} branding
 * @param {HTMLElement} [root]
 */
export function applyBranding(branding, root = document.documentElement) {
  const { primary_color, accent_color, font_family } = branding;
  root.style.setProperty('--brand', primary_color);
  root.style.setProperty('--brand-contrast', readableTextOn(primary_color));
  root.style.setProperty('--brand-soft', `color-mix(in srgb, ${primary_color} 12%, transparent)`);
  if (accent_color) root.style.setProperty('--accent', accent_color);
  if (font_family) root.style.setProperty('--font-brand', `'${font_family}', system-ui, sans-serif`);
}
