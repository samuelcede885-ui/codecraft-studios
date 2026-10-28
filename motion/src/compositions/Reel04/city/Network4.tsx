import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, InstancedMesh, MeshBasicMaterial, Object3D, QuadraticBezierCurve3, SphereGeometry, TubeGeometry, Vector3 } from "three";
import { PITCH, STREET_Y, city, snapStreet, type Route } from "../../Reel02/city/layout";
import { buildRoute, RouteTube } from "../../Reel02/city/Connections";
import { routeProgress } from "../../Reel02/drivers";
import { palette } from "../../Reel02/city/materials";
import { BIZ, type Drivers } from "../drivers";
import { SHELL } from "./Businesses";

/**
 * Escena 6: los negocios se conectan por las calles (rutas de luz con pulsos que viajan entre
 * comercios y consumidores). Escena 7: arcos que convergen hacia el centro.
 * Representa una visión: no es una red de comercios que ya funcione.
 */
type P2 = [number, number];
const corner = ([x, z]: P2): P2 => [snapStreet(x), snapStreet(z)];

function route(from: P2, door: [number, number], target: (typeof city.shops)[number], xFirst: boolean, start: number): Route {
  const a = corner(from);
  const b = corner(target.shop!.street);
  const mid: P2 = xFirst ? [b[0], a[1]] : [a[0], b[1]];
  const out: [number, number, number][] = [[door[0], STREET_Y, door[1]]];
  for (const p of [from, a, mid, b, target.shop!.street] as P2[]) {
    const last = out[out.length - 1];
    if (Math.hypot(last[0] - p[0], last[2] - p[1]) > 0.01) out.push([p[0], STREET_Y, p[1]]);
  }
  out.push([target.shop!.door[0], STREET_Y, target.shop!.door[2]]);
  return { points: out, start, dur: 0.4, width: 0.04, tone: (start * 10) % 3 > 2 ? "cyan" : "blue" };
}

const targets = city.shops.filter((b) => b.dist > 5 && b.dist < 28).sort((a, b) => ((a.seed * 17.3) % 1) - ((b.seed * 17.3) % 1));
const routes: Route[] = [];
BIZ.forEach((biz, bi) => {
  const door: [number, number] = [biz.x, biz.z + SHELL.zc + SHELL.d / 2 + 0.05];
  const street: P2 = [biz.x, biz.z + PITCH / 2];
  for (let k = 0; k < 5; k++) routes.push(route(street, door, targets[(bi * 5 + k) % targets.length], k % 2 === 0, (bi * 5 + k) / 30));
});

/** Arcos del cierre: desde puntos de la periferia hacia el centro. */
const converge = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  const r = 18 + (i % 4) * 4;
  return { from: new Vector3(Math.cos(a) * r, 0.2, Math.sin(a) * r), start: (i % 6) / 6 };
});

const dummy = new Object3D();

export function Network4({ d, frame }: { d: Drivers; frame: number }) {
  const built = useMemo(() => routes.map(buildRoute), []);
  const arcs = useMemo(
    () =>
      converge.map((c) => {
        const end = new Vector3(0, 0.6, 0.6);
        const mid = c.from.clone().add(end).multiplyScalar(0.5).setY(6 + c.from.length() * 0.2);
        const curve = new QuadraticBezierCurve3(c.from, mid, end);
        return { start: c.start, geo: new TubeGeometry(curve, 60, 0.05, 6, false) };
      }),
    [],
  );
  const arcMat = useMemo(() => new MeshBasicMaterial({ toneMapped: false, fog: false, transparent: true }), []);
  arcMat.color.copy(new Color(palette.cian).multiplyScalar(2.4 * d.linesFade));
  const pulses = useRef<InstancedMesh>(null);
  const pulseGeo = useMemo(() => new SphereGeometry(0.06, 8, 6), []);
  const pulseMat = useMemo(() => new MeshBasicMaterial({ color: new Color(palette.cian).multiplyScalar(4), toneMapped: false, fog: false, transparent: true }), []);
  pulseMat.opacity = d.linesFade;
  const N = 80;
  useLayoutEffect(() => {
    if (!pulses.current) return;
    for (let i = 0; i < N; i++) {
      const b = built[i % built.length];
      const on = routeProgress(d.net, b.route.start, b.route.dur) >= 1;
      const u = (((frame / 30) * (0.2 + (i % 5) * 0.05) + i * 0.173) % 1 + 1) % 1;
      const p = b.curve.getPointAt(u);
      const k = on ? 1 : 0.0001;
      dummy.position.set(p.x, p.y + 0.04, p.z);
      dummy.scale.set(k, k, k);
      dummy.updateMatrix();
      pulses.current.setMatrixAt(i, dummy.matrix);
    }
    pulses.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group visible={d.net > 0}>
      {built.map((b, i) => (
        <RouteTube key={i} built={b} progress={routeProgress(d.net, b.route.start, b.route.dur)} intensity={d.linesFade} />
      ))}
      {arcs.map((a, i) => {
        const p = routeProgress(d.converge, a.start, 0.5);
        a.geo.setDrawRange(0, Math.floor(p * 60) * 36);
        return p > 0 ? <mesh key={i} geometry={a.geo} material={arcMat} /> : null;
      })}
      <instancedMesh ref={pulses} args={[pulseGeo, pulseMat, N]} />
    </group>
  );
}
