import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import { fary } from "../theme/fary";

/** Guías de la zona segura (solo para revisión): lo que tapan la cabecera, la descripción y los botones. */
export function SafeAreaGuides() {
  const s = fary.safe;
  const zone: CSSProperties = { position: "absolute", background: "rgba(255,40,40,0.16)", outline: "2px dashed rgba(255,80,80,0.7)" };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...zone, top: 0, left: 0, right: 0, height: s.top }} />
      <div style={{ ...zone, bottom: 0, left: 0, right: 0, height: s.bottom }} />
      <div style={{ ...zone, top: s.top, bottom: s.bottom, right: 0, width: s.right }} />
      <div style={{ ...zone, top: s.top, bottom: s.bottom, left: 0, width: s.left }} />
    </AbsoluteFill>
  );
}
