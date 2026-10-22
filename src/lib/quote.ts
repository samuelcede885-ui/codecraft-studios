/**
 * Proyecto de referencia para el formulario de cotización.
 * - En la portada: el catálogo avisa al formulario con un evento y deja el enlace en la URL.
 * - Desde una ficha de proyecto: el enlace /?proyecto=<slug>#cotizacion lo lleva la URL.
 */
import { track } from "./analytics";

export const QUOTE_EVENT = "fary:quote";

/** `from` indica desde dónde se pidió (ficha del catálogo, destacado, preview…), para la medición. */
export function selectQuoteReference(slug: string, from = "catalog") {
  track("project_quote_clicked", { project: slug, from });
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
