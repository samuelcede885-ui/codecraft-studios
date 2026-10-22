import type { ReactNode } from "react";
import { fary } from "../theme/fary";
import { iso, pts } from "../lib/iso";

export type LayerName = "floor" | "ground" | "structures" | "light" | "data" | "labels";

/**
 * Lienzo del mundo isométrico: suelo infinito y recursos compartidos (glow, halos).
 * El contenido va por capas con <WorldLayer>: ground → structures → light → data → labels.
 */
export function IsometricWorld({ from = -16, to = 32, children }: { from?: number; to?: number; children: ReactNode }) {
  const lines = [];
  for (let i = from; i <= to; i++) {
    lines.push(<line key={`a${i}`} {...seg(iso(i, from), iso(i, to))} />);
    lines.push(<line key={`b${i}`} {...seg(iso(from, i), iso(to, i))} />);
  }
  return (
    <svg width={1} height={1} overflow="visible" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="glow-soft" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        {/* Halo de sistema activo (azul de señal) y de luz de calle (marfil). */}
        {(
          [
            ["signal", fary.color.signal, 0.55],
            ["lamp", fary.color.marfil, 0.32],
          ] as const
        ).map(([k, c, o]) => (
          <radialGradient key={k} id={`halo-${k}`}>
            <stop offset="0%" stopColor={c} stopOpacity={o} />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      <WorldLayer name="floor">
        <polygon points={pts([iso(from, from), iso(to, from), iso(to, to), iso(from, to)])} fill={fary.world.ground} />
        <g stroke={fary.world.groundLine} strokeWidth={1}>{lines}</g>
      </WorldLayer>
      {children}
    </svg>
  );
}

const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

export function WorldLayer({ name, children, opacity = 1 }: { name: LayerName; children: ReactNode; opacity?: number }) {
  return (
    <g data-layer={name} opacity={opacity}>
      {children}
    </g>
  );
}
