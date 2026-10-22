import { fary } from "../theme/fary";
import { isoV, type Vec3 } from "../lib/iso";
import { useEnter } from "../lib/motion";

/**
 * Etiqueta flotante dentro del mundo (escala con la cámara), con la entrada estándar de UI.
 * `active` añade el punto verde de sistema funcionando. `visible` permite sacarla (0–1).
 */
export function FloatingLabel({ at, text, delay = 0, active = false, lift = 70, visible = 1, size = 20 }: { at: Vec3; text: string; delay?: number; active?: boolean; lift?: number; visible?: number; size?: number }) {
  const p = useEnter(delay) * visible;
  if (p <= 0) return null;
  const pt = isoV(at);
  const label = text.toUpperCase();
  const k = size / 20;
  const width = (label.length * 15 + (active ? 70 : 48)) * k;
  return (
    <g opacity={p} transform={`translate(${pt.x}, ${pt.y - lift + (1 - p) * 30}) scale(${(0.96 + 0.04 * p) * k})`}>
      <line x1={0} y1={22} x2={0} y2={lift / k} stroke={fary.color.gray} strokeOpacity={0.4} strokeWidth={2} />
      <rect x={-width / k / 2} y={-22} width={width / k} height={44} rx={22} fill={fary.color.surface} stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
      {active && <circle cx={-width / k / 2 + 25} cy={0} r={6} fill={fary.color.accent} />}
      <text x={active ? 11 : 0} y={1} textAnchor="middle" dominantBaseline="middle" fill={fary.color.white} style={{ font: `600 20px ${fary.font.ui}`, letterSpacing: "0.12em" }}>
        {label}
      </text>
    </g>
  );
}
