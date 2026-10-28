import { useMemo } from "react";
import { AdditiveBlending, Color, LatheGeometry, QuadraticBezierCurve3, TubeGeometry, Vector2, Vector3 } from "three";
import { palette } from "../../Reel02/city/materials";
import { s } from "../timeline";

/**
 * Escena 1 (estilo explicativo): corte de la pantalla en primerísimo plano. Vidrio, sensores con
 * su campo eléctrico en arcos, píxeles RGB y capas inferiores. Un dedo baja y toca: el campo se
 * concentra bajo la yema (la "carga") y sale un pulso de datos por la línea de sensores.
 */
export const SEC = new Vector3(0, 1.2, 9.0);
export const SEC_GEO = { pitch: 0.05, n: 34, glassY: 0.0, padY: -0.024, rgbY: -0.04 };
const hdr = (hex: string, k: number) => new Color(hex).multiplyScalar(k);
const TAP_FRAME = s(1.2);

/** Dónde está la yema del dedo en cada frame (coordenadas locales del corte). */
export function fingerTip(frame: number) {
  const t = frame / 30;
  // El dedo ya está entrando en el primer fotograma (acción desde el segundo cero).
  const come = Math.min(1, 0.35 + (0.65 * t) / 1.2);
  const ease = 1 - (1 - come) ** 3;
  const lift = Math.max(0, Math.min(1, (t - 2.4) / 0.8));
  const y = 0.32 * (1 - ease) + 0.012 + 0.25 * lift * lift;
  return new Vector3(-0.06 - 0.12 * (1 - ease), y, 0.0);
}

export function ScreenSection({ frame }: { frame: number }) {
  const { pitch, n, padY, rgbY } = SEC_GEO;
  const t = frame / 30;
  const pads = useMemo(() => Array.from({ length: n }, (_, i) => (i - n / 2) * pitch), [n, pitch]);
  // Arcos del campo entre sensores vecinos (como fuentes que suben hasta el vidrio).
  const arcs = useMemo(
    () =>
      pads.flatMap((x, i) =>
        [-1, 1].map((dir) => {
          const a = new Vector3(x, padY, 0);
          const b = new Vector3(x + dir * pitch * 0.9, padY, 0);
          const c = new Vector3(x + dir * pitch * 0.45, -0.002, 0);
          return { x, i, geo: new TubeGeometry(new QuadraticBezierCurve3(a, c, b), 16, 0.0011, 4, false) };
        }),
      ),
    [pads, padY, pitch],
  );
  // Arcos de carga: del sensor a la yema (aparecen al tocar).
  const charge = useMemo(
    () =>
      Array.from({ length: 9 }, (_, k) => {
        const x0 = -0.06 + (k - 4) * 0.022;
        return new TubeGeometry(new QuadraticBezierCurve3(new Vector3(x0, padY, 0), new Vector3(x0 * 0.6 - 0.024, 0.0, 0), new Vector3(-0.06 + (k - 4) * 0.006, 0.012, 0)), 20, 0.0016, 5, false);
      }),
    [padY],
  );
  const finger = useMemo(() => fingerGeometry(), []);
  const near = (frame >= TAP_FRAME - 6 ? Math.min(1, (frame - TAP_FRAME + 6) / 10) : 0) * (1 - Math.max(0, Math.min(1, (t - 2.6) / 0.6)));
  const pulseX = t > 1.25 ? -0.06 + (t - 1.25) * 0.55 : -10;
  const tip = fingerTip(frame);
  const show = 1 - Math.max(0, Math.min(1, (t - 3.3) / 0.5));
  if (show <= 0) return null;
  return (
    <group position={SEC} scale={2}>
      {/* Luz de estudio suave para el dedo (como en un plano macro) */}
      <pointLight position={[-0.25, 0.45, 0.5]} color="#FFE6DC" intensity={0.9} distance={2.5} decay={1.5} />
      {/* Vidrio */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[n * pitch + 0.2, 0.02, 0.3]} />
        <meshPhysicalMaterial color="#9DB4E0" metalness={0.1} roughness={0.08} transmission={0} transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, 0.0005, 0.151]}>
        <boxGeometry args={[n * pitch + 0.2, 0.0012, 0.002]} />
        <meshBasicMaterial color={hdr("#DDE8FF", 1.6)} toneMapped={false} />
      </mesh>
      {/* Sensores */}
      {pads.map((x) => (
        <mesh key={x} position={[x, padY, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.003, 12]} />
          <meshStandardMaterial color="#E8ECF4" emissive="#9DB4E0" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Campo en reposo: arcos tenues que laten */}
      {arcs.map((a, k) => {
        const d = Math.abs(a.x - tip.x);
        const boost = near * Math.max(0, 1 - d / 0.12);
        const breathe = 0.55 + 0.25 * Math.sin(t * 3 + a.i * 0.7);
        return (
          <mesh key={k} geometry={a.geo}>
            <meshBasicMaterial color={hdr(palette.cian, (breathe + 2.2 * boost) * 1.2)} transparent opacity={0.55 + 0.45 * boost} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
      {/* Carga: el campo se concentra hacia la yema */}
      {near > 0 &&
        charge.map((g, k) => (
          <mesh key={k} geometry={g}>
            <meshBasicMaterial color={hdr(palette.azul, 4 * near)} transparent opacity={near} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      {near > 0 && (
        <mesh position={[tip.x, 0.002, 0]}>
          <sphereGeometry args={[0.03, 20, 14]} />
          <meshBasicMaterial color={hdr(palette.azul, 1.2 * near)} transparent opacity={0.35 * near} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      {/* Píxeles RGB */}
      {Array.from({ length: n * 3 }, (_, k) => (
        <mesh key={k} position={[(k - (n * 3) / 2) * (pitch / 3), rgbY, 0.02]}>
          <boxGeometry args={[pitch / 3 - 0.004, 0.006, 0.01]} />
          <meshBasicMaterial color={hdr(["#3B6BFF", "#36D07A", "#FF5A5A"][k % 3], 1.3)} toneMapped={false} />
        </mesh>
      ))}
      {/* Capas inferiores y cuerpo */}
      <mesh position={[0, -0.056, 0]}>
        <boxGeometry args={[n * pitch + 0.2, 0.012, 0.3]} />
        <meshStandardMaterial color="#2A3142" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <boxGeometry args={[n * pitch + 0.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#1A1F2B" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Pulso de datos: el toque viaja por la línea de sensores */}
      {pulseX > -1 && pulseX < 1.2 && (
        <group>
          <mesh position={[pulseX, padY + 0.004, 0.0]}>
            <sphereGeometry args={[0.009, 12, 10]} />
            <meshBasicMaterial color={hdr(palette.cian, 8)} toneMapped={false} />
          </mesh>
          <mesh position={[(pulseX - 0.06) / 2 - 0.0, padY + 0.004, 0]} scale={[Math.max(0.001, pulseX + 0.06), 1, 1]}>
            <boxGeometry args={[1, 0.002, 0.002]} />
            <meshBasicMaterial color={hdr(palette.azul, 3)} toneMapped={false} />
          </mesh>
        </group>
      )}
      {/* Dedo */}
      <group position={tip} rotation={[0, 0, 0.72]}>
        <mesh geometry={finger} castShadow>
          <meshPhysicalMaterial color="#E7B3A2" roughness={0.48} sheen={0.7} sheenColor="#FFD2C4" sheenRoughness={0.55} clearcoat={0.1} />
        </mesh>
        <mesh position={[0.036, 0.075, 0.0]} rotation={[0, 0, -0.08]} scale={[0.32, 1.25, 0.95]}>
          <sphereGeometry args={[0.05, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshPhysicalMaterial color="#EBC2B6" roughness={0.25} clearcoat={0.6} clearcoatRoughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/** Dedo por torno: yema redondeada abajo (en el origen) y se ensancha hacia la mano. */
function fingerGeometry() {
  const pts: Vector2[] = [];
  const r = 0.058;
  for (let k = 0; k <= 10; k++) {
    const a = (k / 10) * (Math.PI / 2);
    pts.push(new Vector2(Math.sin(a) * r, r - Math.cos(a) * r));
  }
  pts.push(new Vector2(r * 1.02, 0.15), new Vector2(r * 1.08, 0.32), new Vector2(r * 1.12, 0.6));
  const geo = new LatheGeometry(pts, 40);
  // Ligeramente aplanado (un dedo no es un cilindro perfecto).
  geo.scale(1, 1, 0.9);
  return geo;
}
