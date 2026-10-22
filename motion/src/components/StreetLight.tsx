import { fary } from "../theme/fary";
import { iso } from "../lib/iso";
import { mix } from "../lib/color";
import { useColorAt } from "../lib/focus";
import { real } from "../data/materials";

/** Farola: poste, luminaria marfil y halo suave en el suelo (sin pulsos). `on` 0–1. */
export function StreetLight({ x, y, height = 1.6, on = 1 }: { x: number; y: number; height?: number; on?: number }) {
  const base = iso(x, y, 0);
  const head = iso(x, y, height);
  // En foco, la luz es cálida (sodio); fuera de foco, marfil.
  const c = useColorAt(x, y);
  return (
    <g>
      <ellipse cx={base.x} cy={base.y} rx={170} ry={85} fill="url(#halo-lamp)" opacity={0.36 * on * (1 - c)} />
      <ellipse cx={base.x} cy={base.y} rx={180} ry={90} fill="url(#halo-warm)" opacity={0.5 * on * c} />
      <line x1={base.x} y1={base.y} x2={head.x} y2={head.y} stroke="#222" strokeWidth={5} strokeLinecap="round" />
      <circle cx={head.x} cy={head.y} r={22} fill={mix(fary.color.marfil, real.lamp, c)} opacity={(0.22 + 0.15 * c) * on} filter="url(#glow)" />
      <circle cx={head.x} cy={head.y} r={6} fill={mix(fary.color.blanco, "#FFE3B0", c)} opacity={0.35 + 0.65 * on} />
    </g>
  );
}
