import { useLayoutEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BoxGeometry, Color, ConeGeometry, CylinderGeometry, DynamicDrawUsage, IcosahedronGeometry, InstancedMesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, SphereGeometry } from "three";
import { BLOCK, N, PITCH, ROAD_LENGTH, cars, city, lamps, trees, type Face } from "./layout";
import { facadeMaterial, palette, type CityUniforms } from "./materials";
import type { Drivers } from "../drivers";

const dummy = new Object3D();
const hdr = (hex: string, k: number) => new Color(hex).multiplyScalar(k);

/** Suelo, aceras de cada manzana y marcas de la calzada. */
export function Ground({ d }: { d: Drivers }) {
  const blocks = useRef<InstancedMesh>(null);
  const dashes = useRef<InstancedMesh>(null);
  const count = (2 * N + 1) ** 2;
  const dashList = useMemo(() => {
    const out: [number, number, boolean][] = [];
    for (let k = -N - 1; k <= N; k++) {
      const c = (k + 0.5) * PITCH;
      for (let t = -ROAD_LENGTH / 2; t < ROAD_LENGTH / 2; t += 0.9) {
        if (Math.abs(((t % PITCH) + PITCH) % PITCH - PITCH / 2) < 0.6) continue; // sin marcas en los cruces
        out.push([c, t, true], [t, c, false]);
      }
    }
    return out;
  }, []);
  useLayoutEffect(() => {
    let n = 0;
    for (let i = -N; i <= N; i++)
      for (let j = -N; j <= N; j++) {
        dummy.position.set(i * PITCH, 0.03, j * PITCH);
        dummy.scale.set(BLOCK, 0.06, BLOCK);
        dummy.updateMatrix();
        blocks.current!.setMatrixAt(n++, dummy.matrix);
      }
    blocks.current!.instanceMatrix.needsUpdate = true;
    dashList.forEach(([a, b, alongZ], k) => {
      dummy.position.set(a, 0.004, b);
      dummy.scale.set(alongZ ? 0.03 : 0.38, 0.004, alongZ ? 0.38 : 0.03);
      dummy.updateMatrix();
      dashes.current!.setMatrixAt(k, dummy.matrix);
    });
    dashes.current!.instanceMatrix.needsUpdate = true;
  }, [dashList]);
  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const dashMat = useMemo(() => new MeshBasicMaterial({ color: "#2A3140" }), []);
  dashMat.opacity = d.fade;
  dashMat.transparent = true;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color={palette.calzada} roughness={0.55} metalness={0.25} />
      </mesh>
      <instancedMesh ref={blocks} args={[box, undefined, count]} receiveShadow>
        <meshStandardMaterial color={palette.acera} roughness={0.8} metalness={0.1} />
      </instancedMesh>
      <instancedMesh ref={dashes} args={[box, dashMat, dashList.length]} />
    </group>
  );
}

/** Edificios de la ciudad (instanciados) con ventanas procedurales, cornisas y equipos en azotea. */
export function Buildings({ u }: { u: CityUniforms }) {
  const concreteRef = useRef<InstancedMesh>(null);
  const glassRef = useRef<InstancedMesh>(null);
  const capsRef = useRef<InstancedMesh>(null);
  const unitsRef = useRef<InstancedMesh>(null);
  const concrete = useMemo(() => city.buildings.filter((b) => !b.glass), []);
  const glass = useMemo(() => city.buildings.filter((b) => b.glass), []);
  const units = useMemo(() => city.buildings.filter((b) => !b.glass && b.seed > 0.35), []);
  const concreteMat = useMemo(() => facadeMaterial(u, { color: palette.grafito, roughness: 0.82, metalness: 0.08 }), [u]);
  const glassMat = useMemo(() => facadeMaterial(u, { color: "#0E1320", roughness: 0.16, metalness: 0.85, cell: [0.22, 0.32] }), [u]);
  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);
  useLayoutEffect(() => {
    concrete.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      concreteRef.current!.setMatrixAt(i, dummy.matrix);
    });
    glass.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      glassRef.current!.setMatrixAt(i, dummy.matrix);
    });
    city.buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.h + 0.025, b.z);
      dummy.scale.set(b.w + 0.05, 0.05, b.d + 0.05);
      dummy.updateMatrix();
      capsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    units.forEach((b, i) => {
      const ox = (b.seed - 0.5) * b.w * 0.5;
      dummy.position.set(b.x + ox, b.h + 0.1, b.z - b.d * 0.15);
      dummy.scale.set(0.28, 0.16, 0.22);
      dummy.updateMatrix();
      unitsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    [concreteRef, glassRef, capsRef, unitsRef].forEach((r) => (r.current!.instanceMatrix.needsUpdate = true));
  }, [concrete, glass, units]);
  return (
    <group>
      <instancedMesh ref={concreteRef} args={[box, concreteMat, concrete.length]} castShadow receiveShadow />
      <instancedMesh ref={glassRef} args={[box, glassMat, glass.length]} castShadow receiveShadow />
      <instancedMesh ref={capsRef} args={[box, undefined, city.buildings.length]} castShadow>
        <meshStandardMaterial color={palette.grafitoClaro} roughness={0.7} metalness={0.2} />
      </instancedMesh>
      <instancedMesh ref={unitsRef} args={[box, undefined, units.length]} castShadow>
        <meshStandardMaterial color="#2B3240" roughness={0.6} metalness={0.4} />
      </instancedMesh>
    </group>
  );
}

const faceNormal: Record<Face, [number, number]> = { "+x": [1, 0], "-x": [-1, 0], "+z": [0, 1], "-z": [0, -1] };

/**
 * Comercios en planta baja: escaparate iluminado, letrero y toldo. Se encienden con el radio
 * de iluminación y se modernizan (azul / cian) cuando la red los alcanza.
 */
export function Shops({ d, modern }: { d: Drivers; modern: (i: number) => number }) {
  const windowsRef = useRef<InstancedMesh>(null);
  const signsRef = useRef<InstancedMesh>(null);
  const awningsRef = useRef<InstancedMesh>(null);
  const shops = city.shops;
  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const glowMat = useMemo(() => new MeshBasicMaterial({ toneMapped: false }), []);
  const signMat = useMemo(() => new MeshBasicMaterial({ toneMapped: false }), []);
  useLayoutEffect(() => {
    shops.forEach((b, i) => {
      const [nx, nz] = faceNormal[b.shop!.face];
      const across = nx !== 0 ? b.d : b.w;
      const cx = b.x + (nx * b.w) / 2;
      const cz = b.z + (nz * b.d) / 2;
      // Escaparate
      dummy.position.set(cx + nx * 0.006, 0.22, cz + nz * 0.006);
      dummy.scale.set(nx !== 0 ? 0.01 : across * 0.72, 0.26, nz !== 0 ? 0.01 : across * 0.72);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      windowsRef.current!.setMatrixAt(i, dummy.matrix);
      // Letrero
      dummy.position.set(cx + nx * 0.03, 0.43, cz + nz * 0.03);
      dummy.scale.set(nx !== 0 ? 0.04 : across * 0.5, 0.07, nz !== 0 ? 0.04 : across * 0.5);
      dummy.updateMatrix();
      signsRef.current!.setMatrixAt(i, dummy.matrix);
      // Toldo inclinado
      dummy.position.set(cx + nx * 0.13, 0.37, cz + nz * 0.13);
      dummy.scale.set(nx !== 0 ? 0.26 : across * 0.78, 0.02, nz !== 0 ? 0.26 : across * 0.78);
      dummy.rotation.set(nz * 0.35, 0, -nx * 0.35);
      dummy.updateMatrix();
      awningsRef.current!.setMatrixAt(i, dummy.matrix);
      dummy.rotation.set(0, 0, 0);
    });
    [windowsRef, signsRef, awningsRef].forEach((r) => (r.current!.instanceMatrix.needsUpdate = true));
  }, [shops]);
  // Colores por frame: encendido progresivo y modernización.
  useLayoutEffect(() => {
    const warm = new Color(palette.calido);
    const cool = new Color("#CFE3FF");
    const blue = new Color(palette.azul);
    const cyan = new Color(palette.cian);
    const c = new Color();
    shops.forEach((b, i) => {
      const lit = Math.min(1, Math.max(0, (d.litRadius - b.dist) / 3));
      const m = modern(i);
      const base = b.seed > 0.5 ? warm : cool;
      c.copy(base).lerp(b.seed > 0.7 ? cyan : blue, m).multiplyScalar((0.25 + 1.6 * lit) * d.fade * (1 - 0.5 * d.dim));
      windowsRef.current!.setColorAt(i, c);
      c.copy(base).lerp(m > 0 ? (b.seed > 0.5 ? cyan : blue) : base, m).multiplyScalar((0.2 + 2.6 * lit) * d.fade * (1 - 0.3 * d.dim) * (1 + 1.2 * m));
      signsRef.current!.setColorAt(i, c);
    });
    windowsRef.current!.instanceColor!.needsUpdate = true;
    signsRef.current!.instanceColor!.needsUpdate = true;
  });
  return (
    <group>
      <instancedMesh ref={windowsRef} args={[box, glowMat, shops.length]} />
      <instancedMesh ref={signsRef} args={[box, signMat, shops.length]} />
      <instancedMesh ref={awningsRef} args={[box, undefined, shops.length]} castShadow>
        <meshStandardMaterial color="#1E2430" roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

/** Faroles con bombilla y halo volumétrico (cono aditivo muy sutil). */
export function Lamps({ d }: { d: Drivers }) {
  const poles = useRef<InstancedMesh>(null);
  const bulbs = useRef<InstancedMesh>(null);
  const cones = useRef<InstancedMesh>(null);
  const pole = useMemo(() => new CylinderGeometry(0.012, 0.016, 0.62, 6), []);
  const bulb = useMemo(() => new SphereGeometry(0.035, 10, 8), []);
  const cone = useMemo(() => new ConeGeometry(0.34, 0.62, 18, 1, true), []);
  const bulbMat = useMemo(() => new MeshBasicMaterial({ color: hdr("#CFE0FF", 4), toneMapped: false }), []);
  const coneMat = useMemo(() => new MeshBasicMaterial({ color: "#7FA6FF", transparent: true, opacity: 0.05, blending: AdditiveBlending, depthWrite: false }), []);
  useLayoutEffect(() => {
    lamps.forEach(([x, z], i) => {
      dummy.position.set(x, 0.31, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      poles.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 0.64, z);
      dummy.updateMatrix();
      bulbs.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 0.33, z);
      dummy.updateMatrix();
      cones.current!.setMatrixAt(i, dummy.matrix);
    });
    [poles, bulbs, cones].forEach((r) => (r.current!.instanceMatrix.needsUpdate = true));
  }, []);
  bulbMat.color.copy(hdr("#CFE0FF", 0.6 + 3.4 * Math.min(1, d.litRadius / 30))).multiplyScalar(d.fade * (1 - 0.6 * d.dim));
  coneMat.opacity = 0.03 * Math.min(1, d.litRadius / 30) * d.fade * (1 - 0.8 * d.dim);
  return (
    <group>
      <instancedMesh ref={poles} args={[pole, undefined, lamps.length]} castShadow>
        <meshStandardMaterial color="#2A3140" metalness={0.6} roughness={0.4} />
      </instancedMesh>
      <instancedMesh ref={bulbs} args={[bulb, bulbMat, lamps.length]} />
      <instancedMesh ref={cones} args={[cone, coneMat, lamps.length]} />
    </group>
  );
}

export function Trees() {
  const trunks = useRef<InstancedMesh>(null);
  const crowns = useRef<InstancedMesh>(null);
  const trunk = useMemo(() => new CylinderGeometry(0.018, 0.025, 0.22, 5), []);
  const crown = useMemo(() => new IcosahedronGeometry(0.16, 1), []);
  useLayoutEffect(() => {
    trees.forEach(([x, z, k], i) => {
      dummy.position.set(x, 0.11, z);
      dummy.scale.set(1, k, 1);
      dummy.updateMatrix();
      trunks.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 0.22 + 0.14 * k, z);
      dummy.scale.set(k, k * 1.1, k);
      dummy.updateMatrix();
      crowns.current!.setMatrixAt(i, dummy.matrix);
    });
    [trunks, crowns].forEach((r) => (r.current!.instanceMatrix.needsUpdate = true));
  }, []);
  return (
    <group>
      <instancedMesh ref={trunks} args={[trunk, undefined, trees.length]} castShadow>
        <meshStandardMaterial color="#1A1F28" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[crown, undefined, trees.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#18202A" roughness={0.85} flatShading />
      </instancedMesh>
    </group>
  );
}

/** Tráfico: autos que recorren las calles en bucle, con faros. Se detienen en el congelado. */
export function Traffic({ d }: { d: Drivers }) {
  const bodies = useRef<InstancedMesh>(null);
  const lights = useRef<InstancedMesh>(null);
  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const bodyMat = useMemo(() => new MeshStandardMaterial({ roughness: 0.3, metalness: 0.7, transparent: true }), []);
  const lightMat = useMemo(() => new MeshBasicMaterial({ color: hdr("#E6F0FF", 5), toneMapped: false, transparent: true }), []);
  useLayoutEffect(() => {
    bodies.current!.instanceMatrix.setUsage(DynamicDrawUsage);
    lights.current!.instanceMatrix.setUsage(DynamicDrawUsage);
    const c = new Color();
    cars.forEach((car, i) => bodies.current!.setColorAt(i, c.set(car.tone > 0.7 ? "#C9CED8" : car.tone > 0.35 ? "#2B3446" : "#151A24")));
    bodies.current!.instanceColor!.needsUpdate = true;
  }, []);
  useLayoutEffect(() => {
    cars.forEach((car, i) => {
      const travel = (((car.offset * ROAD_LENGTH + car.dir * car.speed * d.traffic) % ROAD_LENGTH) + ROAD_LENGTH) % ROAD_LENGTH - ROAD_LENGTH / 2;
      const [x, z] = car.alongX ? [travel, car.lane] : [car.lane, travel];
      const yaw = car.alongX ? (car.dir > 0 ? 0 : Math.PI) : car.dir > 0 ? -Math.PI / 2 : Math.PI / 2;
      dummy.position.set(x, 0.07, z);
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.set(0.3, 0.1, 0.15);
      dummy.updateMatrix();
      bodies.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x + Math.cos(yaw) * 0.155, 0.07, z - Math.sin(yaw) * 0.155);
      dummy.scale.set(0.012, 0.03, 0.13);
      dummy.updateMatrix();
      lights.current!.setMatrixAt(i, dummy.matrix);
    });
    bodies.current!.instanceMatrix.needsUpdate = true;
    lights.current!.instanceMatrix.needsUpdate = true;
    dummy.rotation.set(0, 0, 0);
  });
  bodyMat.opacity = d.fade * (1 - 0.7 * d.dim);
  lightMat.opacity = d.fade * (1 - 0.5 * d.dim);
  return (
    <group>
      <instancedMesh ref={bodies} args={[box, bodyMat, cars.length]} castShadow />
      <instancedMesh ref={lights} args={[box, lightMat, cars.length]} />
    </group>
  );
}
