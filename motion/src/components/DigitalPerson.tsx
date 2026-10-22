import { useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { iso } from "../lib/iso";
import { mix } from "../lib/color";
import { useColorAt } from "../lib/focus";
import { real } from "../data/materials";

/**
 * Personaje mínimo (cápsula + cabeza). `active` dibuja un anillo de señal en el suelo (está usando
 * el sistema); `seated` lo baja a la altura de una silla; `bob` añade un vaivén determinista.
 */
export function DigitalPerson({
  x,
  y,
  z = 0,
  active = 0,
  bob = false,
  seated = false,
  opacity = 1,
  tone = fary.color.marfil,
  shirt = 0,
}: {
  x: number;
  y: number;
  z?: number;
  active?: number;
  bob?: boolean;
  seated?: boolean;
  opacity?: number;
  tone?: string;
  /** Color de ropa (índice de real.shirts) cuando está en foco. */
  shirt?: number;
}) {
  const frame = useCurrentFrame();
  const lift = bob ? Math.abs(Math.sin(frame / 6)) * 3 : 0;
  const base = iso(x, y, z);
  const body = seated ? 26 : 38;
  const c = useColorAt(x, y);
  const clothes = mix(tone, real.shirts[shirt % real.shirts.length], c);
  const skin = mix(tone, real.skin, c);
  return (
    <g transform={`translate(${base.x}, ${base.y - lift})`} opacity={opacity}>
      <ellipse cx={0} cy={lift} rx={24} ry={12} fill="none" stroke={fary.color.signal} strokeWidth={2.5} opacity={active} />
      <ellipse cx={0} cy={lift} rx={12} ry={6} fill="#050505" opacity={0.6} />
      <rect x={-9} y={-body - 6} width={18} height={body} rx={9} fill={clothes} opacity={0.92} />
      <circle cx={0} cy={-body - 17} r={8} fill={skin} />
    </g>
  );
}
