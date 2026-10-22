import { fary } from "../theme/fary";
import { mix } from "../lib/color";
import { useColorField } from "../lib/focus";
import { real } from "../data/materials";
import { depth, rect } from "../lib/iso";
import { blocks, fillers, lights, office, people, roads, systems, trees, type SystemId } from "../data/city";
import { Building } from "./Building";
import { DigitalPerson } from "./DigitalPerson";
import { WorldLayer } from "./IsometricWorld";
import { OfficeRoom } from "./OfficeRoom";
import { Road } from "./Road";
import { StreetLight } from "./StreetLight";
import { Tree } from "./Tree";

export type CityState = {
  /** Vida nocturna de los edificios de relleno (0 = ciudad dormida). */
  ambient: number;
  /** Nivel de encendido de cada sistema (0–1). */
  systems: Partial<Record<SystemId, number>>;
  office: { lamp: number; occupied: number; system: number };
  /** Personas que usan el sistema (anillo de señal). */
  peopleActive?: number;
};

/** La ciudad completa por capas, con su estado decidido por la escena. */
export function City({ state }: { state: CityState }) {
  const colorAt = useColorField();
  const items = [
    ...fillers.map((b) => ({ z: depth(b.x, b.y, b.w, b.d), node: <Building key={b.id} {...b} idle={state.ambient} level={0} /> })),
    ...(Object.keys(systems) as SystemId[]).map((id) => {
      const s = systems[id];
      return { z: depth(s.x, s.y, s.w, s.d), node: <Building key={id} {...s} level={state.systems[id] ?? 0} idle={0.04} /> };
    }),
    { z: depth(office.x, office.y, office.w, office.d), node: <OfficeRoom key="office" {...office} {...state.office} /> },
    ...trees.map((t, i) => ({ z: depth(t.x, t.y), node: <Tree key={`t${i}`} {...t} /> })),
    ...lights.map((l, i) => ({ z: depth(l.x, l.y), node: <StreetLight key={`l${i}`} {...l} /> })),
    ...people.map(([x, y], i) => ({ z: depth(x, y), node: <DigitalPerson key={`p${i}`} x={x} y={y} tone={fary.color.muted} shirt={i + 1} active={state.peopleActive ?? 0} /> })),
  ].sort((a, b) => a.z - b.z);

  return (
    <>
      <WorldLayer name="ground">
        {blocks.map((b, i) => (
          <polygon key={i} points={rect(b.x, b.y, b.w, b.d)} fill={mix(fary.world.block, real.sidewalk, colorAt(b.x + b.w / 2, b.y + b.d / 2))} stroke={mix(fary.world.blockEdge, real.sidewalkEdge, colorAt(b.x + b.w / 2, b.y + b.d / 2))} strokeWidth={3} />
        ))}
        {roads.map((r, i) => (
          <Road key={i} {...r} />
        ))}
      </WorldLayer>
      <WorldLayer name="structures">{items.map((it) => it.node)}</WorldLayer>
    </>
  );
}
