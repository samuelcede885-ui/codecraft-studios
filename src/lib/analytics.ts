/**
 * Eventos de medición. No hay ninguna plataforma integrada: `track` emite el evento en la página
 * (CustomEvent "fary:analytics") y, si ya existe un `dataLayer` (p. ej. Tag Manager), lo añade ahí.
 * Para conectar una herramienta en el futuro basta con escuchar ese evento; los componentes no cambian.
 */
export type AnalyticsEvent =
  | "hero_stage_view"
  | "featured_project_view"
  | "project_preview_started"
  | "project_preview_completed"
  | "project_opened"
  | "project_quote_clicked"
  | "project_filter_used"
  | "inspire_opened"
  | "inspire_completed"
  | "quote_started"
  | "quote_step_completed"
  | "quote_submitted"
  | "whatsapp_clicked";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

export const ANALYTICS_EVENT = "fary:analytics";

declare global {
  interface Window {
    dataLayer?: object[];
  }
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  const detail = { event, ...props };
  window.dispatchEvent(new CustomEvent(ANALYTICS_EVENT, { detail }));
  window.dataLayer?.push(detail);
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, props);
}

/**
 * Atributos para medir clics en enlaces sin JavaScript propio (componentes de servidor):
 * `<a {...trackAttrs("project_quote_clicked", { project: "gramercy" })}>`. Los recoge AnalyticsClicks.
 */
export function trackAttrs(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  const attrs: Record<string, string> = { "data-track": event };
  for (const [k, v] of Object.entries(props)) if (v !== undefined) attrs[`data-track-${k}`] = String(v);
  return attrs;
}
