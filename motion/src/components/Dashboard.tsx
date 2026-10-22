import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fary } from "../theme/fary";
import { enterStyle, progress } from "../lib/motion";

/**
 * Panel de una app de negocio (claro, para móvil). Muestra módulos y tendencias sin cifras:
 * las barras y líneas son ilustrativas, nunca datos de un cliente.
 */
export function Dashboard({ modules, from = 0, stagger = 5 }: { modules: string[]; from?: number; stagger?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shapes = [
    [0.4, 0.55, 0.5, 0.7, 0.65, 0.85],
    [0.3, 0.45, 0.6, 0.55, 0.75, 0.8],
    [0.5, 0.4, 0.65, 0.7, 0.6, 0.9],
    [0.35, 0.5, 0.45, 0.65, 0.8, 0.75],
  ];
  return (
    <div style={{ width: 390, height: 844, background: fary.color.marfil, padding: "78px 22px 22px", font: `500 15px ${fary.font.ui}`, color: fary.color.negro }}>
      <div style={{ ...enterStyle(spring({ frame: frame - from, fps, durationInFrames: 18, config: { damping: 200 } })) }}>
        <div style={{ font: `600 12px ${fary.font.ui}`, letterSpacing: "0.2em", color: "#7A7A7A" }}>TU SISTEMA</div>
        <div style={{ font: `900 30px/1.1 ${fary.font.display}`, marginTop: 6 }}>Todo en un lugar.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22 }}>
        {modules.map((m, i) => {
          const p = spring({ frame: frame - from - (i + 1) * stagger, fps, durationInFrames: 18, config: { damping: 200 } });
          const grow = progress(frame, from + (i + 1) * stagger + 6, 18);
          return (
            <div key={m} style={{ background: "#FFFFFF", borderRadius: 18, padding: 14, height: 150, boxShadow: "0 6px 18px -10px rgba(0,0,0,0.25)", ...enterStyle(p, 24) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: `700 12px ${fary.font.ui}`, letterSpacing: "0.12em" }}>
                <span style={{ width: 8, height: 8, borderRadius: 8, background: fary.color.signal }} />
                {m}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 86, marginTop: 18 }}>
                {shapes[i % shapes.length].map((v, k) => (
                  <span key={k} style={{ flex: 1, height: `${v * 100 * grow}%`, borderRadius: 4, background: k === 5 ? fary.color.negro : "#DADADA" }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, background: fary.color.negro, color: fary.color.blanco, borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 10, ...enterStyle(spring({ frame: frame - from - 6 * stagger, fps, durationInFrames: 18, config: { damping: 200 } }), 20) }}>
        <span style={{ width: 10, height: 10, borderRadius: 10, background: fary.color.signal }} />
        Sincronizado con la web y el agente
      </div>
    </div>
  );
}
