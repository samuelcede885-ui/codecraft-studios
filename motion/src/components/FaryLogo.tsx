import type { CSSProperties } from "react";
import { FARY_PATHS, FIRMA_VIEWBOX, LABS_PATHS, MARK_PATHS, MARK_VIEWBOX } from "../assets/brand";

/** Isotipo oficial (≥ 24 px). Sin efectos, contornos ni deformaciones. */
export function FaryMark({ size, color = "#FFFFFF", style }: { size: number; color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox={MARK_VIEWBOX} width={size} height={(size * 198) / 185} fill={color} style={style} aria-label="Fary Labs">
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** Firma completa oficial (≥ 180 px de ancho). `word` (0–1) revela el wordmark tras el símbolo. */
export function FaryLogo({ width, color = "#FFFFFF", word = 1, style }: { width: number; color?: string; word?: number; style?: CSSProperties }) {
  return (
    <svg viewBox={FIRMA_VIEWBOX} width={width} height={(width * 248) / 790} fill={color} fillRule="evenodd" style={style} aria-label="Fary Labs">
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <g opacity={word} style={{ clipPath: `inset(0 ${(1 - word) * 100}% 0 0)` }}>
        {FARY_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {LABS_PATHS.map((d, i) => (
          <path key={`l${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}
