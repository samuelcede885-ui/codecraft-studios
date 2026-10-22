import { fary } from "../theme/fary";
import { iso } from "../lib/iso";

/** Árbol geométrico: tronco corto y copa en dos tonos. */
export function Tree({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const base = iso(x, y, 0);
  const top = iso(x, y, 0.75 * size);
  const r = 32 * size;
  return (
    <g>
      <ellipse cx={base.x} cy={base.y} rx={r * 0.9} ry={r * 0.45} fill="#050505" opacity={0.7} />
      <line x1={base.x} y1={base.y} x2={top.x} y2={top.y + r * 0.6} stroke="#1C1C1C" strokeWidth={6} />
      <circle cx={top.x} cy={top.y} r={r} fill={fary.world.foliage} />
      <circle cx={top.x - r * 0.22} cy={top.y - r * 0.25} r={r * 0.62} fill={fary.world.foliageTop} />
    </g>
  );
}
