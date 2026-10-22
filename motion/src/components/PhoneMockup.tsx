import type { ReactNode } from "react";
import { fary } from "../theme/fary";
import { useActivation } from "../lib/motion";

/** Pantalla lógica: las interfaces se diseñan a 390 × 844 y se escalan. */
export const PHONE_SCREEN = { width: 390, height: 844 };

/**
 * Teléfono gráfico minimalista (no hiperrealista) que recibe una interfaz React.
 * `active` enciende la pantalla: más brillo y glow verde sutil.
 */
export function PhoneMockup({ width = 400, active = true, since = 0, children }: { width?: number; active?: boolean; since?: number; children?: ReactNode }) {
  const a = useActivation(active, since, 22);
  const bezel = width * 0.032;
  const screenW = width - bezel * 2;
  const scale = screenW / PHONE_SCREEN.width;
  const height = PHONE_SCREEN.height * scale + bezel * 2;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: width * 0.15,
        background: fary.color.surface,
        padding: bezel,
        boxShadow: `0 0 0 2px rgba(255,255,255,0.1), 0 50px 90px -30px rgba(0,0,0,0.95), 0 0 ${70 * a}px rgba(25,255,114,${0.12 * a})`,
      }}
    >
      <div style={{ position: "relative", width: screenW, height: height - bezel * 2, borderRadius: width * 0.12, overflow: "hidden", background: fary.color.light }}>
        <div style={{ width: PHONE_SCREEN.width, height: PHONE_SCREEN.height, transform: `scale(${scale})`, transformOrigin: "0 0" }}>{children}</div>
        <div style={{ position: "absolute", top: 12 * scale, left: "50%", width: 104 * scale, height: 30 * scale, marginLeft: -52 * scale, borderRadius: 999, background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, background: fary.color.black, opacity: (1 - a) * 0.85 }} />
      </div>
    </div>
  );
}
