/**
 * Proyecto de referencia para el formulario de cotización.
 * - En la portada: el catálogo avisa al formulario con un evento y deja el enlace en la URL.
 * - Desde una ficha de proyecto: el enlace /?proyecto=<slug>#cotizacion lo lleva la URL.
 */
import { track } from "./analytics";
import type { Plan } from "@/data/plans";

export const QUOTE_EVENT = "fary:quote";

/** `from` indica desde dónde se pidió (ficha del catálogo, destacado, preview…), para la medición. */
export function selectQuoteReference(slug: string, from = "catalog") {
  track("project_quote_clicked", { project: slug, from });
  window.dispatchEvent(new CustomEvent<string>(QUOTE_EVENT, { detail: slug }));
  try {
    history.replaceState(null, "", `?proyecto=${encodeURIComponent(slug)}#cotizacion`);
  } catch {}
}

export const PLAN_EVENT = "fary:plan";

/** Plan elegido en la sección de planes: el formulario lo muestra y lo incluye en el mensaje. */
export function selectQuotePlan(plan: Plan) {
  track("plan_selected", { plan: plan.id, price: plan.price });
  window.dispatchEvent(new CustomEvent<Plan>(PLAN_EVENT, { detail: plan }));
}

export function quoteReferenceFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get("proyecto") ?? "";
  } catch {
    return "";
  }
}
