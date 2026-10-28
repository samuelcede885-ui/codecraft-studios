import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, InstancedMesh, MeshBasicMaterial, Object3D, QuadraticBezierCurve3, SphereGeometry, TubeGeometry, Vector3 } from "three";
import { PITCH, STREET_Y, city, snapStreet, type Route } from "../../Reel02/city/layout";
import { buildRoute, RouteTube } from "../../Reel02/city/Connections";
import { routeProgress } from "../../Reel02/drivers";
import { palette } from "../../Reel02/city/materials";
import { FRONT_Z, TWIN } from "./TwinShops";
import type { Drivers } from "../drivers";

/**
 * Cierre: desde la puerta de la tienda digital salen rutas de luz por las calles hacia
 * comercios de toda la ciudad, y arcos sobre los techos completan la red.
 */
type P2 = [number, number];
const door: [number, number, number] = [TWIN.xs.digital, STREET_Y, FRONT_Z + 0.05];
const street: P2 = [TWIN.xs.digital, PITCH / 2];
const corner = ([x, z]: P2): P2 => [snapStreet(x), snapStreet(z)];

function route(target: (typeof city.shops)[number], xFirst: boolean, start: number): Route {
  const a = corner(street);
  const b = corner(target.shop!.street);
  const mid: P2 = xFirst ? [b[0], a[1]] : [a[0], b[1]];
  const pts: P2[] = [street, a, mid, b, target.shop!.street];
  const out: [number, number, number][] = [door];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (Math.hypot(last[0] - p[0], last[2] - p[1]) > 0.01) out.push([p[0], STREET_Y, p[1]]);
  }
  out.push([target.shop!.door[0], STREET_Y, target.shop!.door[2]]);
  return { points: out, start, dur: 0.42, width: 0.04, tone: start * 10 > 6 ? "cyan" : "blue" };
}

const targets = city.shops.filter((b) => b.dist > 4 && b.dist < 26).sort((a, b) => (a.seed * 13.7) % 1 - (b.seed * 13.7) % 1).slice(0, 26);
const routes = targets.map((b, i) => route(b, i % 2 === 0, i / targets.length));
const arcs = Array.from({ length: 22 }, (_, i) => {
  const a = targets[(i * 3) % targets.length];
  const b = targets[(i * 7 + 5) % targets.length];
  return { a: [a.x, a.h + 0.1, a.z] as [number, number, number], b: [b.x, b.h + 0.1, b.z] as [number, number, number], start: i / 22 };
});

const dummy = new Object3D();

export function Network({ d, frame }: { d: Drivers; frame: number }) {
  const built = useMemo(() => routes.map(buildRoute), []);
  const arcBuilt = useMemo(
    () =>
      arcs.map((a) => {
        const A = new Vector3(...a.a);
        const B = new Vector3(...a.b);
        const mid = A.clone().add(B).multiplyScalar(0.5);
        mid.y += A.distanceTo(B) * 0.3 + 1.5;
        const curve = new QuadraticBezierCurve3(A, mid, B);
        return { start: a.start, curve, geo: new TubeGeometry(curve, 60, 0.03, 6, false) };
      }),
    [],
  );
  const arcMat = useMemo(() => new MeshBasicMaterial({ toneMapped: false, fog: false, transparent: true }), []);
  arcMat.color.copy(new Color(palette.azul).multiplyScalar(2.2 * d.linesFade));

  const pulses = useRef<InstancedMesh>(null);
  const pulseGeo = useMemo(() => new SphereGeometry(0.05, 8, 6), []);
  const pulseMat = useMemo(() => new MeshBasicMaterial({ color: new Color(palette.cian).multiplyScalar(4), toneMapped: false, fog: false, transparent: true }), []);
  pulseMat.opacity = d.linesFade;
  const N = 60;
  useLayoutEffect(() => {
    if (!pulses.current) return;
    for (let i = 0; i < N; i++) {
      const b = built[i % built.length];
      const on = routeProgress(d.net, b.route.start, b.route.dur) >= 1;
      const u = (((frame / 30) * (0.22 + (i % 5) * 0.04) + i * 0.173) % 1 + 1) % 1;
      const p = b.curve.getPointAt(u);
      const k = on ? 1 : 0.0001;
      dummy.position.set(p.x, p.y + 0.03, p.z);
      dummy.scale.set(k, k, k);
      dummy.updateMatrix();
      pulses.current!.setMatrixAt(i, dummy.matrix);
    }
    pulses.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <group visible={d.net > 0}>
      {built.map((b, i) => (
        <RouteTube key={i} built={b} progress={routeProgress(d.net, b.route.start, b.route.dur)} intensity={d.linesFade} />
      ))}
      {arcBuilt.map((a, i) => {
        const p = routeProgress(d.arcs, a.start, 0.35);
        a.geo.setDrawRange(0, Math.floor(p * 60) * 6 * 6);
        return p > 0 ? <mesh key={i} geometry={a.geo} material={arcMat} /> : null;
      })}
      <instancedMesh ref={pulses} args={[pulseGeo, pulseMat, N]} />
    </group>
  );
}
