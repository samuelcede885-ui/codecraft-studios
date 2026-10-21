/**
 * Proyecto de referencia para el formulario de cotización.
 * - En la portada: el catálogo avisa al formulario con un evento y deja el enlace en la URL.
 * - Desde una ficha de proyecto: el enlace /?proyecto=<slug>#cotizacion lo lleva la URL.
 */
export const QUOTE_EVENT = "fary:quote";

export function selectQuoteReference(slug: string) {
  window.dispatchEvent(new CustomEvent<string>(QUOTE_EVENT, { detail: slug }));
  try {
    history.replaceState(null, "", `?proyecto=${encodeURIComponent(slug)}#cotizacion`);
  } catch {}
}

export function quoteReferenceFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get("proyecto") ?? "";
  } catch {
    return "";
  }
}
