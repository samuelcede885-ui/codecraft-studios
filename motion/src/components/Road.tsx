import { fary } from "../theme/fary";
import { iso, pts, rect } from "../lib/iso";

/** Calle recta: `axis` "x" (abajo-derecha) o "y" (abajo-izquierda); bordillos y línea central. */
export function Road({ axis, at, from, to, width = 1 }: { axis: "x" | "y"; at: number; from: number; to: number; width?: number }) {
  const body = axis === "x" ? rect(from, at, to - from, width) : rect(at, from, width, to - from);
  const c = at + width / 2;
  const a = axis === "x" ? iso(from, c) : iso(c, from);
  const b = axis === "x" ? iso(to, c) : iso(c, to);
  const edge = (o: number) => (axis === "x" ? [iso(from, at + o), iso(to, at + o)] : [iso(at + o, from), iso(at + o, to)]);
  return (
    <g>
      <polygon points={body} fill={fary.world.road} />
      {[0, width].map((o) => (
        <polyline key={o} points={pts(edge(o))} stroke={fary.world.roadEdge} strokeWidth={4} fill="none" />
      ))}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={fary.world.roadMark} strokeWidth={3} strokeDasharray="18 22" />
    </g>
  );
}
