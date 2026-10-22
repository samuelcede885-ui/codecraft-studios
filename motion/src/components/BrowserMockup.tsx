import type { ReactNode } from "react";
import { fary } from "../theme/fary";
import { useActivation } from "../lib/motion";

/** Ventana lógica del navegador: el contenido se diseña a 1280 × 800 y se escala. */
export const BROWSER_VIEW = { width: 1280, height: 800 };

/**
 * Navegador minimalista: barra con tres puntos y dirección genérica; recibe cualquier página React
 * (home, servicio, producto, CTA, checkout, formulario, dashboard).
 */
export function BrowserMockup({ width = 860, url = "tunegocio.com", active = true, since = 0, children }: { width?: number; url?: string; active?: boolean; since?: number; children?: ReactNode }) {
  const a = useActivation(active, since, 22);
  const scale = width / BROWSER_VIEW.width;
  const bar = 56 * scale;
  return (
    <div style={{ width, borderRadius: 26 * scale + 6, overflow: "hidden", background: fary.color.carbon, boxShadow: `0 0 0 2px rgba(255,255,255,0.1), 0 50px 90px -30px rgba(0,0,0,0.95), 0 0 ${70 * a}px rgba(${fary.signalRgb},${0.18 * a})` }}>
      <div style={{ height: bar, display: "flex", alignItems: "center", gap: 10 * scale, padding: `0 ${22 * scale}px`, background: "#1D1D1D" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 14 * scale, height: 14 * scale, borderRadius: 20, background: "rgba(255,255,255,0.18)" }} />
        ))}
        <span style={{ marginLeft: 20 * scale, flex: 1, maxWidth: 520 * scale, height: 30 * scale, borderRadius: 30, background: "#111", color: fary.color.muted, font: `500 ${16 * scale}px ${fary.font.ui}`, display: "flex", alignItems: "center", paddingLeft: 16 * scale }}>
          {url}
        </span>
      </div>
      <div style={{ position: "relative", width, height: BROWSER_VIEW.height * scale, overflow: "hidden", background: fary.color.marfil }}>
        <div style={{ width: BROWSER_VIEW.width, height: BROWSER_VIEW.height, transform: `scale(${scale})`, transformOrigin: "0 0" }}>{children}</div>
        <div style={{ position: "absolute", inset: 0, background: fary.color.negro, opacity: (1 - a) * 0.85 }} />
      </div>
    </div>
  );
}
