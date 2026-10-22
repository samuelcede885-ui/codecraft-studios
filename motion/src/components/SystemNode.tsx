import type { CSSProperties, ReactNode } from "react";
import { fary } from "../theme/fary";

/** Nodo de sistema en pantalla: círculo con contenido (símbolo, sigla). `active` 0–1 lo enciende. */
export function SystemNode({ size = 140, active = 0, children, style }: { size?: number; active?: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        display: "grid",
        placeItems: "center",
        background: fary.color.surface,
        border: `2px solid ${active > 0.01 ? `rgba(25,255,114,${0.25 + 0.75 * active})` : "rgba(255,255,255,0.12)"}`,
        boxShadow: `0 0 ${50 * active}px rgba(25,255,114,${0.22 * active}), 0 30px 60px -30px rgba(0,0,0,0.9)`,
        color: fary.color.white,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
