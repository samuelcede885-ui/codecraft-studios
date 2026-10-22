import { fary } from "../theme/fary";
import { enterStyle, useEnter } from "../lib/motion";

/** Interfaz de ejemplo: confirmación de una reserva (390 × 844, dentro de PhoneMockup). */
export function BookingScreen({ from = 0 }: { from?: number }) {
  const s = fary.stagger;
  const rows = [
    ["Servicio", "Consulta inicial"],
    ["Fecha", "Sábado 14"],
    ["Hora", "12:30"],
  ];
  return (
    <div style={{ width: 390, height: 844, background: fary.color.bg, color: fary.color.white, font: `500 16px ${fary.font.body}`, padding: "84px 24px 24px" }}>
      <div style={{ ...enterStyle(useEnter(from)), color: fary.color.muted, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase" }}>Reserva</div>
      <div style={{ ...enterStyle(useEnter(from + s)), font: `900 34px/1.05 ${fary.font.display}`, marginTop: 10 }}>Todo listo.</div>
      <div style={{ ...enterStyle(useEnter(from + s * 2)), marginTop: 28, borderRadius: 20, background: fary.color.surface, border: "1px solid rgba(245,245,243,0.08)", padding: "6px 18px" }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: i ? "1px solid rgba(245,245,243,0.06)" : "none" }}>
            <span style={{ color: fary.color.muted }}>{k}</span>
            <span style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ ...enterStyle(useEnter(from + s * 3)), marginTop: 18, display: "flex", alignItems: "center", gap: 10, color: fary.color.muted, fontSize: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: 8, background: fary.color.accent }} />
        Confirmación enviada automáticamente
      </div>
      <div style={{ ...enterStyle(useEnter(from + s * 4)), marginTop: 36, borderRadius: 16, background: fary.color.accent, color: fary.color.bg, textAlign: "center", padding: "16px 0", fontWeight: 700 }}>
        Añadir al calendario
      </div>
    </div>
  );
}
