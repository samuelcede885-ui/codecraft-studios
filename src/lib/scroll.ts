/** Bloquea o libera el scroll de fondo: el nativo (clase en <html>) y Lenis (ver SmoothScroll). */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle("scroll-locked", locked);
  window.dispatchEvent(new CustomEvent("fary:scroll-lock", { detail: locked }));
}
