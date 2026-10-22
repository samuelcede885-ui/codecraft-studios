import { useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { isoV, type Point, type Vec3 } from "../lib/iso";
import { clamp, easeInOut } from "../lib/motion";
import { interpolate } from "remotion";

export type DataFlowProps = {
  /** Recorrido en coordenadas del mundo (tiles). Ej.: cliente → web → agente → CRM → resultado. */
  path: Vec3[];
  active?: boolean;
  /** Frame en el que se activa: desde ahí la línea se dibuja y empiezan a circular los datos. */
  since?: number;
  /** Frames que tarda en dibujarse el recorrido completo. */
  drawFrames?: number;
  /** Paquetes de datos que circulan a la vez y su velocidad (px de mundo por frame). */
  pulses?: number;
  speed?: number;
  /** Muestra el trazado apagado antes de activarse. */
  track?: boolean;
  color?: string;
};

/**
 * Línea de datos entre sistemas. Se dibuja con strokeDashoffset, marca cada nodo al pasar y
 * hace circular paquetes a velocidad constante. Todo depende del frame: render determinista.
 */
export function DataFlow({ path, active = true, since = 0, drawFrames = 40, pulses = 3, speed = 7, track = false, color = fary.color.accent }: DataFlowProps) {
  const frame = useCurrentFrame();
  const p = path.map(isoV);
  const lengths = p.slice(1).map((pt, i) => Math.hypot(pt.x - p[i].x, pt.y - p[i].y));
  const total = lengths.reduce((s, l) => s + l, 0);
  const cumulative = lengths.reduce<number[]>((acc, l) => [...acc, acc[acc.length - 1] + l], [0]);
  const t = frame - since;
  const drawn = active ? interpolate(t, [0, drawFrames], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  const d = `M ${p.map((pt) => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" L ")}`;

  const pointAt = (dist: number): Point => {
    let i = 0;
    while (i < lengths.length - 1 && cumulative[i + 1] < dist) i++;
    const k = lengths[i] ? (dist - cumulative[i]) / lengths[i] : 0;
    return { x: p[i].x + (p[i + 1].x - p[i].x) * k, y: p[i].y + (p[i + 1].y - p[i].y) * k };
  };

  const reach = drawn * total;
  const packets = active && t > 0
    ? Array.from({ length: pulses }, (_, i) => {
        const dist = (t * speed + (i * total) / pulses) % total;
        if (dist > reach) return null;
        // Aparecen y se desvanecen en los extremos para que el bucle no "salte".
        const fade = Math.min(1, dist / 60, (total - dist) / 60);
        return { ...pointAt(dist), o: fade };
      }).filter((x): x is Point & { o: number } => x !== null)
    : [];

  return (
    <g data-flow>
      {track && <path d={d} fill="none" stroke={fary.color.muted} strokeOpacity={0.18} strokeWidth={3} strokeDasharray="6 10" />}
      <path d={d} fill="none" stroke={color} strokeWidth={10} strokeOpacity={0.35} filter="url(#fary-glow)" strokeDasharray={total} strokeDashoffset={total * (1 - drawn)} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={3.5} strokeDasharray={total} strokeDashoffset={total * (1 - drawn)} strokeLinecap="round" strokeLinejoin="round" />
      {p.map((pt, i) => {
        const on = interpolate(reach - cumulative[i], [0, 24], [0, 1], clamp);
        return (
          <g key={i} opacity={on} transform={`translate(${pt.x}, ${pt.y})`}>
            <ellipse rx={18} ry={9} fill="none" stroke={color} strokeWidth={2.5} />
            <ellipse rx={6} ry={3} fill={color} />
          </g>
        );
      })}
      {packets.map((pk, i) => (
        <g key={i} opacity={pk.o}>
          <circle cx={pk.x} cy={pk.y} r={14} fill={color} opacity={0.45} filter="url(#fary-glow)" />
          <circle cx={pk.x} cy={pk.y} r={6} fill={fary.color.white} />
        </g>
      ))}
    </g>
  );
}
