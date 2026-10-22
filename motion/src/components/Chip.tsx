import type { CSSProperties, ReactNode } from "react";
import { fary } from "../theme/fary";
import { enterStyle, useEnter } from "../lib/motion";

/** Píldora de etiqueta en pantalla (WEB CRAFT, 11:47 PM…). Entrada estándar de UI. */
export function Chip({ children, delay = 0, dot = false, icon, style }: { children: ReactNode; delay?: number; dot?: boolean; icon?: ReactNode; style?: CSSProperties }) {
  const p = useEnter(delay);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 24px",
        borderRadius: 999,
        background: "rgba(20,21,23,0.92)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: fary.color.blanco,
        font: `600 24px ${fary.font.ui}`,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontVariantNumeric: "tabular-nums",
        boxShadow: "0 18px 40px -20px rgba(0,0,0,0.9)",
        ...enterStyle(p),
        ...style,
      }}
    >
      {dot && <span style={{ width: 12, height: 12, borderRadius: 12, background: fary.color.signal }} />}
      {icon}
      {children}
    </div>
  );
}
