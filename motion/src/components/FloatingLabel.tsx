import { fary } from "../theme/fary";
import { isoV, type Vec3 } from "../lib/iso";
import { useEnter } from "../lib/motion";

/**
 * Etiqueta flotante dentro del mundo (escala con la cámara). Entra con la animación estándar
 * de UI. `active` muestra el punto verde de sistema funcionando.
 */
export function FloatingLabel({ at, text, delay = 0, active = false, lift = 70 }: { at: Vec3; text: string; delay?: number; active?: boolean; lift?: number }) {
  const p = useEnter(delay);
  const pt = isoV(at);
  const label = text.toUpperCase();
  const width = label.length * 15.5 + (active ? 74 : 52);
  const y = pt.y - lift + (1 - p) * 30;
  return (
    <g opacity={p} transform={`translate(${pt.x}, ${y}) scale(${0.96 + 0.04 * p})`}>
      <line x1={0} y1={22} x2={0} y2={lift - (1 - p) * 30} stroke={fary.color.muted} strokeOpacity={0.35} strokeWidth={2} />
      <rect x={-width / 2} y={-22} width={width} height={44} rx={22} fill={fary.color.surface} stroke="rgba(245,245,243,0.1)" strokeWidth={1.5} />
      {active && <circle cx={-width / 2 + 26} cy={0} r={6} fill={fary.color.accent} />}
      <text
        x={active ? 12 : 0}
        y={1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={fary.color.white}
        style={{ font: `600 20px ${fary.font.body}`, letterSpacing: "0.12em" }}
      >
        {label}
      </text>
    </g>
  );
}
