import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, PointsMaterial } from "three";
import { rng } from "../../Reel02/city/layout";

/**
 * Fondo del estilo explicativo: cielo azul noche con estrellas lejanas y partículas de polvo
 * que flotan cerca de la cámara (se desenfocan con la profundidad de campo).
 */
export function Starfield({ frame, opacity = 1 }: { frame: number; opacity?: number }) {
  const stars = useMemo(() => {
    const r = rng(77);
    const pos: number[] = [];
    for (let i = 0; i < 1800; i++) {
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const rad = 150;
      const s = Math.sqrt(1 - u * u);
      pos.push(rad * s * Math.cos(th), Math.abs(rad * u) * 0.9 + 5, rad * s * Math.sin(th));
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  const dust = useMemo(() => {
    const r = rng(91);
    const pos: number[] = [];
    for (let i = 0; i < 700; i++) pos.push((r() - 0.5) * 14, r() * 5, (r() - 0.5) * 18 + 4);
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  const starMat = useMemo(() => new PointsMaterial({ color: "#C9D6F2", size: 0.45, sizeAttenuation: true, transparent: true, fog: false, depthWrite: false }), []);
  const dustMat = useMemo(() => new PointsMaterial({ color: "#9FB6E8", size: 0.012, sizeAttenuation: true, transparent: true, depthWrite: false }), []);
  starMat.opacity = 0.75 * opacity;
  dustMat.opacity = 0.55 * opacity;
  const t = frame / 30;
  return (
    <group>
      <points geometry={stars} material={starMat} />
      <points geometry={dust} material={dustMat} position={[Math.sin(t * 0.2) * 0.15, (t * 0.03) % 0.5, Math.cos(t * 0.17) * 0.15]} />
    </group>
  );
}
