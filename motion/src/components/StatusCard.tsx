import type { CSSProperties } from "react";
import { fary } from "../theme/fary";
import { enterStyle, useEnter } from "../lib/motion";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "./Icon";

/** Tarjeta de estado: título y lista de tareas que se completan con check marfil, en stagger. */
export function StatusCard({ title, items, delay = 0, stagger = 6, style }: { title: string; items: string[]; delay?: number; stagger?: number; style?: CSSProperties }) {
  const p = useEnter(delay);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width: 640, borderRadius: 32, background: "rgba(20,21,23,0.95)", border: "1px solid rgba(255,255,255,0.08)", padding: "30px 34px", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.95)", ...enterStyle(p), ...style }}>
      <div style={{ font: `600 20px ${fary.font.ui}`, letterSpacing: "0.24em", textTransform: "uppercase", color: fary.color.muted }}>{title}</div>
      {items.map((it, i) => {
        const q = spring({ frame: frame - delay - 8 - i * stagger, fps, durationInFrames: 16, config: { damping: 200 } });
        return (
          <div key={it} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 22, ...enterStyle(q, 20) }}>
            <span style={{ width: 40, height: 40, borderRadius: 40, background: fary.color.signal, color: fary.color.negro, display: "grid", placeItems: "center", transform: `scale(${0.6 + 0.4 * q})` }}>
              <Icon name="check" size={26} stroke={3.2} />
            </span>
            <span style={{ font: `600 32px ${fary.font.ui}`, color: fary.color.blanco }}>{it}</span>
          </div>
        );
      })}
    </div>
  );
}
