import type { ReactNode } from "react";
import { fary } from "../theme/fary";
import { useActivation } from "../lib/motion";

/** Tamaño lógico de la pantalla: las interfaces se diseñan a esta medida y se escalan. */
export const PHONE_SCREEN = { width: 390, height: 844 };

/**
 * Teléfono gráfico (no hiperrealista). Recibe cualquier interfaz React como hijo, diseñada a
 * 390 × 844. `active` enciende la pantalla: sube el brillo y aparece un glow verde sutil.
 */
export function PhoneMockup({
  width = 440,
  active = true,
  since = 0,
  children,
}: {
  width?: number;
  active?: boolean;
  since?: number;
  children?: ReactNode;
}) {
  const a = useActivation(active, since, 24);
  const bezel = width * 0.035;
  const screenW = width - bezel * 2;
  const scale = screenW / PHONE_SCREEN.width;
  const height = PHONE_SCREEN.height * scale + bezel * 2;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: width * 0.14,
        background: fary.color.surface,
        boxShadow: `0 0 0 2px rgba(245,245,243,0.08), 0 40px 80px -30px rgba(0,0,0,0.9), 0 0 ${60 * a}px rgba(25,255,114,${0.14 * a})`,
        padding: bezel,
      }}
    >
      <div style={{ position: "relative", width: screenW, height: height - bezel * 2, borderRadius: width * 0.11, overflow: "hidden", background: fary.color.bg }}>
        <div style={{ width: PHONE_SCREEN.width, height: PHONE_SCREEN.height, transform: `scale(${scale})`, transformOrigin: "0 0", filter: `brightness(${0.35 + 0.65 * a})` }}>
          {children}
        </div>
        <div style={{ position: "absolute", top: 12 * scale, left: "50%", width: 110 * scale, height: 32 * scale, marginLeft: -55 * scale, borderRadius: 999, background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, background: fary.color.bg, opacity: (1 - a) * 0.75 }} />
      </div>
    </div>
  );
}
