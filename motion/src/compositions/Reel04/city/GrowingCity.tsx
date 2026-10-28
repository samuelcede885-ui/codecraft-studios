import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, InstancedMesh, Object3D } from "three";
import { city, type Building } from "../../Reel02/city/layout";
import { facadeMaterial, palette, type CityUniforms } from "../../Reel02/city/materials";

/**
 * La ciudad se construye: cada edificio sube desde el suelo cuando lo alcanza la onda de
 * crecimiento (con un pequeño rebote), y su cornisa se asienta encima. Las ventanas aparecen
 * con la fachada (shader de ventanas del Reel 02, en coordenadas de mundo).
 */
const dummy = new Object3D();

export function GrowingCity({ u, radius, exclude }: { u: CityUniforms; radius: number; exclude: (b: Building) => boolean }) {
  const list = useMemo(() => city.buildings.filter((b) => !exclude(b)), [exclude]);
  const concrete = useMemo(() => list.filter((b) => !b.glass), [list]);
  const glass = useMemo(() => list.filter((b) => b.glass), [list]);
  const concreteMat = useMemo(() => facadeMaterial(u, { color: palette.grafito, roughness: 0.82, metalness: 0.08 }), [u]);
  const glassMat = useMemo(() => facadeMaterial(u, { color: "#0E1320", roughness: 0.16, metalness: 0.85, cell: [0.22, 0.32] }), [u]);
  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const cRef = useRef<InstancedMesh>(null);
  const gRef = useRef<InstancedMesh>(null);
  const capRef = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const growth = (b: Building) => {
      const x = Math.min(1, Math.max(0, (radius - b.dist) / 3.5));
      // Sube con un rebote leve (como una pieza que encaja).
      return x <= 0 ? 0 : x < 1 ? 1 - (1 - x) ** 3 + Math.sin(x * Math.PI) * 0.06 : 1;
    };
    const place = (ref: InstancedMesh | null, arr: Building[]) =>
      arr.forEach((b, i) => {
        const g = growth(b);
        const h = Math.max(0.001, b.h * g);
        dummy.position.set(b.x, h / 2, b.z);
        dummy.scale.set(g > 0 ? b.w : 0.001, h, g > 0 ? b.d : 0.001);
        dummy.updateMatrix();
        ref!.setMatrixAt(i, dummy.matrix);
      });
    place(cRef.current, concrete);
    place(gRef.current, glass);
    list.forEach((b, i) => {
      const g = growth(b);
      const drop = (1 - Math.min(1, g * 1.15)) * 1.5;
      dummy.position.set(b.x, b.h * Math.min(1, g) + 0.025 + drop, b.z);
      dummy.scale.set(g > 0 ? b.w + 0.05 : 0.001, 0.05, g > 0 ? b.d + 0.05 : 0.001);
      dummy.updateMatrix();
      capRef.current!.setMatrixAt(i, dummy.matrix);
    });
    [cRef, gRef, capRef].forEach((r) => (r.current!.instanceMatrix.needsUpdate = true));
  });
  return (
    <group>
      <instancedMesh ref={cRef} args={[box, concreteMat, concrete.length]} castShadow receiveShadow />
      <instancedMesh ref={gRef} args={[box, glassMat, glass.length]} castShadow receiveShadow />
      <instancedMesh ref={capRef} args={[box, undefined, list.length]} castShadow>
        <meshStandardMaterial color={palette.grafitoClaro} roughness={0.7} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}
