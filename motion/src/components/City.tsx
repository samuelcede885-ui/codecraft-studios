import { fary } from "../theme/fary";
import { depth, rect } from "../lib/iso";
import { blocks, buildings, lights, people, roads, trees, type SystemId } from "../data/city";
import { Building } from "./Building";
import { DigitalPerson } from "./DigitalPerson";
import { WorldLayer } from "./IsometricWorld";
import { Road } from "./Road";
import { StreetLight } from "./StreetLight";
import { Tree } from "./Tree";

export type SystemState = { active: boolean; since?: number; idle?: number };

/**
 * La ciudad de Fary Labs por capas: suelo (manzanas y calles) y estructuras ordenadas por
 * profundidad. Cada escena decide qué sistemas están encendidos con `states`.
 */
export function City({ states = {} }: { states?: Partial<Record<SystemId, SystemState>> }) {
  const items = [
    ...buildings.map((b) => ({ key: b.id, z: depth(b.x, b.y, b.w, b.d), node: <Building key={b.id} {...b} {...states[b.id]} /> })),
    ...trees.map((t, i) => ({ key: `t${i}`, z: depth(t.x, t.y), node: <Tree key={`t${i}`} {...t} /> })),
    ...lights.map((l, i) => ({ key: `l${i}`, z: depth(l.x, l.y), node: <StreetLight key={`l${i}`} {...l} /> })),
    ...people.map((p, i) => ({ key: `p${i}`, z: depth(p.x, p.y), node: <DigitalPerson key={`p${i}`} {...p} tone={fary.color.muted} /> })),
  ].sort((a, b) => a.z - b.z);

  return (
    <>
      <WorldLayer name="ground">
        {blocks.map((b, i) => (
          <polygon key={i} points={rect(b.x, b.y, b.w, b.d)} fill="#0E0F0E" stroke="#171917" strokeWidth={3} />
        ))}
        {roads.map((r, i) => (
          <Road key={i} {...r} />
        ))}
      </WorldLayer>
      <WorldLayer name="structures">{items.map((it) => it.node)}</WorldLayer>
    </>
  );
}
