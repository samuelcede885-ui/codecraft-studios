import { fary } from "../theme/fary";
import { iso } from "../lib/iso";

/** Farola: poste, luminaria cálida y halo en el suelo. `on` regula la intensidad (0–1). */
export function StreetLight({ x, y, height = 1.6, on = 1 }: { x: number; y: number; height?: number; on?: number }) {
  const base = iso(x, y, 0);
  const head = iso(x, y, height);
  return (
    <g>
      <ellipse cx={base.x} cy={base.y} rx={150} ry={75} fill="url(#fary-halo-warm)" opacity={0.42 * on} />
      <line x1={base.x} y1={base.y} x2={head.x} y2={head.y} stroke="#1E211E" strokeWidth={5} strokeLinecap="round" />
      <circle cx={head.x} cy={head.y} r={16} fill={fary.color.warm} opacity={0.35 * on} filter="url(#fary-glow)" />
      <circle cx={head.x} cy={head.y} r={6} fill={fary.color.warm} opacity={0.4 + 0.6 * on} />
    </g>
  );
}
