import type { ReactNode } from "react";
import { fary } from "../theme/fary";
import { iso, pts } from "../lib/iso";

/**
 * Lienzo del mundo isométrico. Dibuja el suelo y define los recursos compartidos (glow,
 * degradados). El contenido se organiza por capas con <WorldLayer>, en este orden:
 * ground (suelo, calles) → structures (edificios, árboles, personas) → light (halos) →
 * data (DataFlow) → labels (FloatingLabel).
 * El origen (0, 0) de las coordenadas isométricas está en el (0, 0) del SVG; la cámara lo encuadra.
 */
export function IsometricWorld({ size = 14, children }: { size?: number; children: ReactNode }) {
  const lines = [];
  for (let i = -size; i <= size * 2; i++) {
    lines.push(<line key={`a${i}`} {...seg(iso(i, -size), iso(i, size * 2))} />);
    lines.push(<line key={`b${i}`} {...seg(iso(-size, i), iso(size * 2, i))} />);
  }
  return (
    <svg width={1} height={1} overflow="visible" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <filter id="fary-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="fary-glow-soft" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
        <radialGradient id="fary-halo-accent">
          <stop offset="0%" stopColor={fary.color.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={fary.color.accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fary-halo-warm">
          <stop offset="0%" stopColor={fary.color.warm} stopOpacity="0.5" />
          <stop offset="100%" stopColor={fary.color.warm} stopOpacity="0" />
        </radialGradient>
      </defs>
      <WorldLayer name="floor">
        <polygon
          points={pts([iso(-size, -size), iso(size * 2, -size), iso(size * 2, size * 2), iso(-size, size * 2)])}
          fill={fary.world.ground}
        />
        <g stroke={fary.world.groundLine} strokeWidth={1}>
          {lines}
        </g>
      </WorldLayer>
      {children}
    </svg>
  );
}

const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

export type LayerName = "floor" | "ground" | "structures" | "light" | "data" | "labels";

/** Capa con nombre: mantiene el orden de pintado explícito y facilita depurar el mundo. */
export function WorldLayer({ name, children, opacity = 1 }: { name: LayerName; children: ReactNode; opacity?: number }) {
  return (
    <g data-layer={name} opacity={opacity}>
      {children}
    </g>
  );
}
