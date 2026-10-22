import { interpolate, useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { isoV, type Point, type Vec3 } from "../lib/iso";
import { clamp, easeInOut } from "../lib/motion";

export type DataFlowProps = {
  /** Recorrido en el mundo (tiles). Para arcos entre azoteas, usar arc()/arcs() de lib/iso. */
  path: Vec3[];
  active?: boolean;
  /** Frame en el que se activa: se dibuja y empiezan a circular los paquetes. */
  since?: number;
  drawFrames?: number;
  pulses?: number;
  /** Velocidad de los paquetes, en px de mundo por frame. */
  speed?: number;
  /** Nodos marcados: solo extremos (arcos) o todos los vértices (rutas por calles). */
  nodes?: "ends" | "all" | "none";
  opacity?: number;
  width?: number;
};

/**
 * Línea de datos: se dibuja con strokeDashoffset, marca los nodos cuando llega y hace circular
 * pulsos a velocidad constante. Explica el proceso (de dónde a dónde), no decora.
 */
export function DataFlow({ path, active = true, since = 0, drawFrames = 36, pulses = 2, speed = 9, nodes = "ends", opacity = 1, width = 3.5 }: DataFlowProps) {
  const frame = useCurrentFrame();
  const p = path.map(isoV);
  const lengths = p.slice(1).map((pt, i) => Math.hypot(pt.x - p[i].x, pt.y - p[i].y));
  const total = lengths.reduce((s, l) => s + l, 0) || 1;
  const cumulative = lengths.reduce<number[]>((acc, l) => [...acc, acc[acc.length - 1] + l], [0]);
  const t = frame - since;
  const drawn = active ? interpolate(t, [0, drawFrames], [0, 1], { ...clamp, easing: easeInOut }) : 0;
  if (drawn <= 0 || opacity <= 0) return null;
  const d = `M ${p.map((pt) => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" L ")}`;
  const reach = drawn * total;

  const pointAt = (dist: number): Point => {
    let i = 0;
    while (i < lengths.length - 1 && cumulative[i + 1] < dist) i++;
    const k = lengths[i] ? (dist - cumulative[i]) / lengths[i] : 0;
    return { x: p[i].x + (p[i + 1].x - p[i].x) * k, y: p[i].y + (p[i + 1].y - p[i].y) * k };
  };
  const packets = Array.from({ length: pulses }, (_, i) => {
    const dist = (t * speed + (i * total) / pulses) % total;
    if (dist > reach) return null;
    return { ...pointAt(dist), o: Math.min(1, dist / 50, (total - dist) / 50) };
  }).filter((x): x is Point & { o: number } => x !== null);
  const marks = nodes === "none" ? [] : nodes === "all" ? p.map((pt, i) => ({ pt, at: cumulative[i] })) : [{ pt: p[0], at: 0 }, { pt: p[p.length - 1], at: total }];

  const dash = { strokeDasharray: total, strokeDashoffset: total * (1 - drawn) };
  return (
    <g data-flow opacity={opacity}>
      <path d={d} fill="none" stroke={fary.color.signal} strokeWidth={width * 3} strokeOpacity={0.28} filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round" {...dash} />
      <path d={d} fill="none" stroke={fary.color.signal} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" {...dash} />
      {marks.map(({ pt, at }, i) => (
        <g key={i} opacity={interpolate(reach - at, [-1, 20], [0, 1], clamp)} transform={`translate(${pt.x}, ${pt.y})`}>
          <ellipse rx={17} ry={8.5} fill="none" stroke={fary.color.signal} strokeWidth={2.5} />
          <ellipse rx={5.5} ry={2.75} fill={fary.color.signal} />
        </g>
      ))}
      {packets.map((pk, i) => (
        <g key={i} opacity={pk.o}>
          <circle cx={pk.x} cy={pk.y} r={13} fill={fary.color.signal} opacity={0.4} filter="url(#glow)" />
          <circle cx={pk.x} cy={pk.y} r={5.5} fill={fary.color.blanco} />
        </g>
      ))}
    </g>
  );
}
