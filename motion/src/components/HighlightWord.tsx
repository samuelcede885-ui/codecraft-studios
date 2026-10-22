import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { easeInOut, easeOut, progress } from "../lib/motion";

export type HighlightTone = "signal" | "problem";
export type HighlightTiming = { appear: number; grow: number; reveal: number };

/**
 * Palabra protagonista, siempre con la misma transición:
 * 1. aparece una barra fina al pie; 2. crece de izquierda a derecha;
 * 3. sube a toda la altura y revela la palabra (oscura sobre el color).
 * Tono: azul (señal: sistema, resultado) o grafito (el problema).
 */
export function HighlightWord({
  children,
  from = 0,
  tone = "signal",
  timing = { appear: 5, grow: 12, reveal: 10 },
  style,
}: {
  children: string;
  from?: number;
  tone?: HighlightTone;
  timing?: HighlightTiming;
  style?: CSSProperties;
}) {
  const f = useCurrentFrame() - from;
  const appear = progress(f, 0, timing.appear);
  const grow = progress(f, timing.appear, timing.grow, easeInOut);
  const reveal = progress(f, timing.appear + timing.grow - 2, timing.reveal, easeOut);
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 0.1em", ...style }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "0.1em 0 0.04em",
          background: tone === "signal" ? fary.color.signal : "#3E3F44",
          opacity: appear,
          transformOrigin: "left bottom",
          transform: `scaleX(${0.05 + 0.95 * grow}) scaleY(${0.12 + 0.88 * reveal})`,
        }}
      />
      <span
        style={{
          position: "relative",
          display: "inline-block",
          color: tone === "signal" ? fary.color.blanco : fary.color.marfil,
          clipPath: `inset(-0.1em ${(1 - reveal) * 100}% -0.1em 0)`,
          transform: `translateY(${(1 - reveal) * 0.16}em)`,
        }}
      >
        {children}
      </span>
    </span>
  );
}
