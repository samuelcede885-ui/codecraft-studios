import { fary } from "../theme/fary";
import { iso } from "../lib/iso";

/** Farola: poste, luminaria cálida y halo suave en el suelo (sin pulsos). `on` 0–1. */
export function StreetLight({ x, y, height = 1.6, on = 1 }: { x: number; y: number; height?: number; on?: number }) {
  const base = iso(x, y, 0);
  const head = iso(x, y, height);
  return (
    <g>
      <ellipse cx={base.x} cy={base.y} rx={170} ry={85} fill="url(#halo-warm)" opacity={0.36 * on} />
      <line x1={base.x} y1={base.y} x2={head.x} y2={head.y} stroke="#222" strokeWidth={5} strokeLinecap="round" />
      <circle cx={head.x} cy={head.y} r={22} fill={fary.color.light} opacity={0.22 * on} filter="url(#glow)" />
      <circle cx={head.x} cy={head.y} r={6} fill="#FFF3DC" opacity={0.35 + 0.65 * on} />
    </g>
  );
}
