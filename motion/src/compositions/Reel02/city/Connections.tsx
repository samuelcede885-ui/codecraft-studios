import { useLayoutEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Color, CurvePath, InstancedMesh, LineCurve3, MeshBasicMaterial, Object3D, QuadraticBezierCurve3, RingGeometry, SphereGeometry, TubeGeometry, Vector3 } from "three";
import { arcs, mainRoutes, netRoutes, type Route } from "./layout";
import { palette } from "./materials";
import { routeProgress, type Drivers } from "../drivers";

const dummy = new Object3D();
const color = (tone: "blue" | "cyan", k: number) => new Color(tone === "blue" ? palette.azul : palette.cian).multiplyScalar(k);

type Built = { route: Route; curve: CurvePath<Vector3>; geo: TubeGeometry; segments: number };

const RADIAL = 6;

function buildRoute(route: Route): Built {
  const curve = new CurvePath<Vector3>();
  for (let i = 0; i < route.points.length - 1; i++) curve.add(new LineCurve3(new Vector3(...route.points[i]), new Vector3(...route.points[i + 1])));
  const segments = Math.max(8, Math.round(curve.getLength() * 10));
  const geo = new TubeGeometry(curve as unknown as LineCurve3, segments, route.width, RADIAL, false);
  return { route, curve, geo, segments };
}

/**
 * Una ruta luminosa que se dibuja a lo largo de la calle (drawRange de la malla del tubo),
 * con un pulso de luz en la punta mientras avanza.
 */
function RouteTube({ built, progress, intensity }: { built: Built; progress: number; intensity: number }) {
  const mat = useMemo(() => new MeshBasicMaterial({ toneMapped: false, fog: false, transparent: true }), []);
  const glow = useMemo(() => new MeshBasicMaterial({ toneMapped: false, fog: false, transparent: true, blending: AdditiveBlending, depthWrite: false }), []);
  mat.color.copy(color(built.route.tone, 2.4 * intensity));
  glow.color.copy(color(built.route.tone, 1.6 * intensity));
  glow.opacity = 0.9;
  built.geo.setDrawRange(0, Math.floor(progress * built.segments) * RADIAL * 6);
  if (progress <= 0) return null;
  const tip = built.curve.getPointAt(Math.min(0.999, progress));
  return (
    <group>
      <mesh geometry={built.geo} material={mat} />
      {progress < 1 && (
        <mesh position={tip} material={glow}>
          <sphereGeometry args={[built.route.width * 2.6, 12, 10]} />
        </mesh>
      )}
    </group>
  );
}

/** Nodo en la puerta de un comercio conectado: anillo que se expande una vez. */
function DoorNodes({ ends, d }: { ends: { p: [number, number, number]; t: number; tone: "blue" | "cyan" }[]; d: Drivers }) {
  const ref = useRef<InstancedMesh>(null);
  const ring = useMemo(() => new RingGeometry(0.1, 0.13, 32), []);
  const mat = useMemo(() => new MeshBasicMaterial({ color: color("cyan", 2), toneMapped: false, transparent: true, blending: AdditiveBlending, depthWrite: false, fog: false }), []);
  useLayoutEffect(() => {
    ends.forEach((e, i) => {
      const age = e.t;
      const k = age <= 0 ? 0 : 1 + 1.8 * Math.min(1, age);
      dummy.position.set(e.p[0], e.p[1] + 0.01, e.p[2]);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(k, k, k);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  });
  mat.opacity = 0.8 * d.linesFade;
  return <instancedMesh ref={ref} args={[ring, mat, ends.length]} />;
}

/** Línea principal (escena 3) + red entre comercios (escenas 6–7) + arcos y pulsos. */
export function Connections({ d, frame }: { d: Drivers; frame: number }) {
  const main = useMemo(() => mainRoutes.map(buildRoute), []);
  const net = useMemo(() => netRoutes.map(buildRoute), []);
  const arcBuilt = useMemo(
    () =>
      arcs.map((a) => {
        const A = new Vector3(...a.a);
        const B = new Vector3(...a.b);
        const mid = A.clone().add(B).multiplyScalar(0.5);
        mid.y += A.distanceTo(B) * 0.32 + 1.5;
        const curve = new QuadraticBezierCurve3(A, mid, B);
        const segments = 60;
        return { start: a.start, curve, geo: new TubeGeometry(curve, segments, 0.025, RADIAL, false), segments };
      }),
    [],
  );
  const arcMat = useMemo(() => new MeshBasicMaterial({ toneMapped: false, fog: false, transparent: true }), []);
  const fade = d.linesFade;
  const mainK = 1 - 0.35 * d.dim * (1 - d.net);

  // Pulsos (datos / personas) que recorren las rutas ya dibujadas.
  const pulses = useRef<InstancedMesh>(null);
  const pulseGeo = useMemo(() => new SphereGeometry(0.045, 8, 6), []);
  const pulseMat = useMemo(() => new MeshBasicMaterial({ color: color("cyan", 4), toneMapped: false, fog: false, transparent: true }), []);
  const PULSES = 90;
  useLayoutEffect(() => {
    const all = [...main, ...net];
    for (let i = 0; i < PULSES; i++) {
      const b = all[i % all.length];
      const isNet = i % all.length >= main.length;
      const p = isNet ? routeProgress(d.net, b.route.start, b.route.dur) : routeProgress(d.main, b.route.start, b.route.dur);
      const on = p >= 1 && (isNet || frame < 1800);
      const u = (((frame / 30) * (0.18 + (i % 7) * 0.03) + i * 0.137) % 1 + 1) % 1;
      const pt = b.curve.getPointAt(u);
      dummy.position.set(pt.x, pt.y + 0.03, pt.z);
      const k = on ? 1 : 0.0001;
      dummy.scale.set(k, k, k);
      dummy.updateMatrix();
      pulses.current!.setMatrixAt(i, dummy.matrix);
    }
    pulses.current!.instanceMatrix.needsUpdate = true;
  });
  pulseMat.opacity = fade * (0.6 + 0.4 * d.people);

  const ends = [
    ...main.map((b) => ({ p: b.route.points[b.route.points.length - 1], t: (routeProgress(d.main, b.route.start, b.route.dur) - 1) * 4 + (d.main >= 1 ? 1 : 0), tone: b.route.tone })),
    ...net.map((b) => ({ p: b.route.points[b.route.points.length - 1], t: routeProgress(d.net, b.route.start, b.route.dur) >= 1 ? 1 : 0, tone: b.route.tone })),
  ];

  return (
    <group>
      {main.map((b, i) => (
        <RouteTube key={`m${i}`} built={b} progress={routeProgress(d.main, b.route.start, b.route.dur)} intensity={fade * mainK} />
      ))}
      {net.map((b, i) => (
        <RouteTube key={`n${i}`} built={b} progress={routeProgress(d.net, b.route.start, b.route.dur)} intensity={fade * 0.85} />
      ))}
      {arcBuilt.map((a, i) => {
        const p = routeProgress(d.arcs, a.start, 0.35);
        a.geo.setDrawRange(0, Math.floor(p * a.segments) * RADIAL * 6);
        if (p <= 0) return null;
        arcMat.color.copy(color("blue", 2.2 * fade));
        return <mesh key={`a${i}`} geometry={a.geo} material={arcMat} />;
      })}
      <instancedMesh ref={pulses} args={[pulseGeo, pulseMat, PULSES]} />
      <DoorNodes ends={ends} d={d} />
    </group>
  );
}
