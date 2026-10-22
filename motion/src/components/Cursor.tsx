import { fary } from "../theme/fary";

/** Puntero de interacción; `press` (0–1) dibuja el anillo del clic. */
export function Cursor({ x, y, press = 0, opacity = 1 }: { x: number; y: number; press?: number; opacity?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none" }}>
      {press > 0 && (
        <span style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 60, border: `3px solid ${fary.color.signal}`, opacity: 1 - press, transform: `scale(${0.4 + press})` }} />
      )}
      <svg width={34} height={40} viewBox="0 0 34 40" style={{ transform: `scale(${1 - 0.12 * Math.sin(Math.PI * press)})`, transformOrigin: "0 0" }}>
        <path d="M2 2 L2 32 L10 25 L16 38 L22 35 L16 22 L28 22 Z" fill={fary.color.negro} stroke={fary.color.blanco} strokeWidth={2.5} strokeLinejoin="round" />
      </svg>
    </div>
  );
}
