import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { fary } from "../theme/fary";

/**
 * Contenedor dentro de la zona segura de Reels/TikTok. Con `guides` dibuja las zonas que tapan
 * los controles de la app (solo para revisar, nunca en el render final).
 */
export function SafeArea({ children, guides = false, style }: { children?: ReactNode; guides?: boolean; style?: CSSProperties }) {
  const s = fary.safe;
  return (
    <AbsoluteFill style={{ padding: `${s.top}px ${s.right}px ${s.bottom}px ${s.left}px`, ...style }}>
      {guides && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div style={{ ...zone, top: 0, left: 0, right: 0, height: s.top }} />
          <div style={{ ...zone, bottom: 0, left: 0, right: 0, height: s.bottom }} />
          <div style={{ ...zone, top: s.top, bottom: s.bottom, right: 0, width: s.right }} />
        </AbsoluteFill>
      )}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
    </AbsoluteFill>
  );
}

const zone: CSSProperties = { position: "absolute", background: "rgba(255,40,40,0.18)", outline: "1px dashed rgba(255,80,80,0.6)" };
