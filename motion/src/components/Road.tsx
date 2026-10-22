import { fary } from "../theme/fary";
import { iso, pts, rect } from "../lib/iso";
import { mix } from "../lib/color";
import { useColorField } from "../lib/focus";
import { real } from "../data/materials";

/**
 * Calle recta: `axis` "x" (abajo-derecha) o "y" (abajo-izquierda). Se dibuja por tramos de un
 * tile para que el foco de color la pinte solo donde está mirando la cámara.
 */
export function Road({ axis, at, from, to, width = 1 }: { axis: "x" | "y"; at: number; from: number; to: number; width?: number }) {
  const colorAt = useColorField();
  const c = at + width / 2;
  const segs = [];
  for (let s = from; s < to; s++) {
    const amt = axis === "x" ? colorAt(s + 0.5, c) : colorAt(c, s + 0.5);
    const body = axis === "x" ? rect(s, at, 1, width) : rect(at, s, width, 1);
    const edge = (o: number) => (axis === "x" ? [iso(s, at + o), iso(s + 1, at + o)] : [iso(at + o, s), iso(at + o, s + 1)]);
    const a = axis === "x" ? iso(s + 0.1, c) : iso(c, s + 0.1);
    const b = axis === "x" ? iso(s + 0.55, c) : iso(c, s + 0.55);
    segs.push(
      <g key={s}>
        <polygon points={body} fill={mix(fary.world.road, real.asphalt, amt)} stroke={mix(fary.world.road, real.asphalt, amt)} strokeWidth={1} />
        {[0, width].map((o) => (
          <polyline key={o} points={pts(edge(o))} stroke={mix(fary.world.roadEdge, real.roadEdge, amt)} strokeWidth={4} fill="none" />
        ))}
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={amt > 0.01 ? mix("#5A5C60", real.roadMark, amt) : fary.world.roadMark} strokeWidth={3} />
      </g>,
    );
  }
  return <g>{segs}</g>;
}
