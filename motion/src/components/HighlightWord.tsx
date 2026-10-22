import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { easeInOut, easeOut, progress } from "../lib/motion";

export type HighlightTiming = { appear: number; grow: number; reveal: number };

/**
 * Palabra clave resaltada en tres tiempos:
 * 1. aparece una barra fina al pie de la palabra;
 * 2. la barra crece de izquierda a derecha;
 * 3. sube a toda la altura y revela el texto (oscuro sobre verde).
 * `from` es el frame (relativo a la secuencia) en el que empieza.
 */
export function HighlightWord({
  children,
  from = 0,
  color = fary.color.accent,
  textColor = fary.color.bg,
  timing = { appear: 6, grow: 14, reveal: 12 },
  style,
}: {
  children: string;
  from?: number;
  color?: string;
  textColor?: string;
  timing?: HighlightTiming;
  style?: CSSProperties;
}) {
  const f = useCurrentFrame() - from;
  const appear = progress(f, 0, timing.appear);
  const grow = progress(f, timing.appear, timing.grow, easeInOut);
  const reveal = progress(f, timing.appear + timing.grow - 2, timing.reveal, easeOut);
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 0.14em", ...style }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "0.08em 0 0.02em",
          background: color,
          opacity: appear,
          transformOrigin: "left bottom",
          transform: `scaleX(${0.05 + 0.95 * grow}) scaleY(${0.12 + 0.88 * reveal})`,
        }}
      />
      <span
        style={{
          position: "relative",
          display: "inline-block",
          color: textColor,
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
          transform: `translateY(${(1 - reveal) * 0.18}em)`,
        }}
      >
        {children}
      </span>
    </span>
  );
}
