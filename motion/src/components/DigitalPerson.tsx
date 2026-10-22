import { useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { iso } from "../lib/iso";

/**
 * Personaje mínimo: cabeza y cuerpo en cápsula. Con `active`, un anillo verde en el suelo
 * indica que está interactuando con el sistema. `bob` añade un vaivén determinista al caminar.
 */
export function DigitalPerson({ x, y, active = 0, bob = false, tone = fary.color.white }: { x: number; y: number; active?: number; bob?: boolean; tone?: string }) {
  const frame = useCurrentFrame();
  const lift = bob ? Math.abs(Math.sin(frame / 5)) * 3 : 0;
  const base = iso(x, y, 0);
  const s = 1;
  return (
    <g transform={`translate(${base.x}, ${base.y - lift})`}>
      <ellipse cx={0} cy={lift} rx={20} ry={10} fill="none" stroke={fary.color.accent} strokeWidth={2} opacity={active} />
      <ellipse cx={0} cy={lift} rx={12} ry={6} fill="#050505" opacity={0.6} />
      <rect x={-9 * s} y={-44 * s} width={18 * s} height={38 * s} rx={9 * s} fill={tone} opacity={0.88} />
      <circle cx={0} cy={-55 * s} r={8 * s} fill={tone} />
    </g>
  );
}
