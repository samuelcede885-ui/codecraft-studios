import { useMemo } from "react";
import { AdditiveBlending, BoxGeometry, Color, EdgesGeometry } from "three";
import { HERO } from "./layout";
import { facadeMaterial, palette, type CityUniforms } from "./materials";
import type { Drivers } from "../drivers";

const hdr = (hex: string, k: number) => new Color(hex).multiplyScalar(k);

/**
 * Comercio protagonista: planta baja con fachada de vidrio e interior visible (estanterías,
 * mostrador, lámparas y el comerciante), un piso superior y el letrero que se moderniza.
 * Frente hacia +z. `msg` = 0–1 por cada mensaje que entra (vibra el teléfono).
 */
export function HeroShop({ u, d, frame, msg }: { u: CityUniforms; d: Drivers; frame: number; msg: number }) {
  const { x, z, w, d: depth, h, upper } = HERO;
  const front = z + depth / 2;
  const back = z - depth / 2;
  const upperMat = useMemo(() => facadeMaterial(u, { color: palette.grafito, roughness: 0.8, metalness: 0.1 }), [u]);
  const outline = useMemo(() => new EdgesGeometry(new BoxGeometry(w + 0.04, h + upper + 0.04, depth + 0.04)), [w, h, upper, depth]);
  const plateEdges = useMemo(() => new EdgesGeometry(new BoxGeometry(w + 0.9, 0.012, depth + 0.9)), [w, depth]);

  const warmth = (0.35 + 0.65 * Math.min(1, d.litRadius / 4)) * (1 - 0.45 * d.stress) * (1 - 0.35 * d.freeze);
  const signColor = new Color(palette.calido).lerp(new Color(palette.azul), d.heroDigital).multiplyScalar((1.2 + 2.4 * Math.min(1, d.litRadius / 4)) * (1 + 0.8 * d.heroDigital));
  const products = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number]; c: string }[] = [];
    const tones = ["#E9E4DA", "#2C3E66", "#3A4A62", "#C7B79E", "#1F2B44", "#8FA6C9"];
    for (let row = 0; row < 3; row++)
      for (let k = 0; k < 9; k++) {
        const sx = 0.09 + ((k * 7 + row * 3) % 4) * 0.02;
        const sy = 0.08 + ((k * 5 + row) % 3) * 0.035;
        out.push({ p: [-0.95 + k * 0.235, 0.34 + row * 0.33 + sy / 2, back + 0.17], s: [sx, sy, 0.12], c: tones[(k + row * 2) % tones.length] });
      }
    return out;
  }, [back]);

  // Comerciante: respira, mira el teléfono y reacciona a cada mensaje.
  const t = frame / 30;
  const breathe = 1 + 0.012 * Math.sin(t * 2.2);
  const headTilt = -0.25 - 0.12 * d.stress + 0.04 * Math.sin(t * 1.3);
  const buzz = msg > 0 ? Math.sin(msg * Math.PI * 6) * 0.012 * (1 - msg) : 0;
  const mx = x - 0.12;
  const mz = z - 0.32;

  return (
    <group>
      {/* Piso, paredes y techo de la planta baja */}
      <mesh position={[x, 0.03, z]} receiveShadow>
        <boxGeometry args={[w, 0.06, depth]} />
        <meshStandardMaterial color="#1B1E26" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[x, h / 2, back + 0.03]} receiveShadow castShadow>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial color="#20252F" roughness={0.9} />
      </mesh>
      {[-1, 1].map((k) => (
        <mesh key={k} position={[x + (k * (w - 0.06)) / 2, h / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[0.06, h, depth]} />
          <meshStandardMaterial color="#1C2029" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[x, h + 0.02, z]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.06, 0.08, depth + 0.06]} />
        <meshStandardMaterial color="#232934" roughness={0.8} />
      </mesh>
      {/* Piso superior con ventanas */}
      <mesh position={[x, h + 0.06 + upper / 2, z]} material={upperMat} castShadow receiveShadow>
        <boxGeometry args={[w, upper, depth]} />
      </mesh>
      <mesh position={[x, h + upper + 0.09, z]} castShadow>
        <boxGeometry args={[w + 0.06, 0.06, depth + 0.06]} />
        <meshStandardMaterial color={palette.grafitoClaro} roughness={0.7} />
      </mesh>

      {/* Fachada: marcos, vidrio y letrero */}
      {[-1.12, -0.42, 0.42, 1.12].map((px) => (
        <mesh key={px} position={[x + px, h / 2, front - 0.02]} castShadow>
          <boxGeometry args={[0.035, h, 0.04]} />
          <meshStandardMaterial color="#2E3542" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[x, 0.08, front - 0.02]}>
        <boxGeometry args={[w, 0.1, 0.04]} />
        <meshStandardMaterial color="#2E3542" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[x, h * 0.5, front - 0.015]}>
        <planeGeometry args={[w - 0.05, h - 0.3]} />
        <meshStandardMaterial color="#9DB4E0" metalness={0.9} roughness={0.06} transparent opacity={0.09 * (1 - 0.8 * d.interior)} depthWrite={false} />
      </mesh>
      <mesh position={[x, h - 0.12, front + 0.03]}>
        <boxGeometry args={[w * 0.82, 0.16, 0.05]} />
        <meshStandardMaterial color="#12161E" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[x, h - 0.12, front + 0.058]}>
        <boxGeometry args={[w * 0.6, 0.05, 0.01]} />
        <meshBasicMaterial color={signColor} toneMapped={false} />
      </mesh>
      {/* Toldo */}
      <mesh position={[x, h - 0.32, front + 0.2]} rotation={[0.32, 0, 0]} castShadow>
        <boxGeometry args={[w * 0.9, 0.025, 0.42]} />
        <meshStandardMaterial color="#1A202B" roughness={0.6} />
      </mesh>
      {/* Contorno digital (escena 4 en adelante) */}
      {d.heroDigital > 0 && (
        <lineSegments geometry={outline} position={[x, (h + upper) / 2 + 0.03, z]}>
          <lineBasicMaterial color={hdr(palette.cian, 1.4 * d.heroDigital * d.linesFade)} toneMapped={false} transparent opacity={0.6 * d.heroDigital} fog={false} />
        </lineSegments>
      )}

      {/* Escena 5: el edificio se vuelve panel — planos de datos que emergen piso a piso */}
      {d.dashboard > 0 &&
        [1.62, 1.98, 2.34, 2.7].map((y, i) => {
          const k = Math.min(1, Math.max(0, d.dashboard * 1.6 - i * 0.18));
          if (k <= 0) return null;
          const sc = 0.7 + 0.3 * k;
          return (
            <group key={y} position={[x, y + 0.06 * Math.sin(frame / 18 + i), z]} scale={[sc, 1, sc]}>
              <mesh>
                <boxGeometry args={[w + 0.9, 0.012, depth + 0.9]} />
                <meshBasicMaterial color={hdr(palette.azul, 0.9)} transparent opacity={0.16 * k} depthWrite={false} toneMapped={false} />
              </mesh>
              <lineSegments geometry={plateEdges}>
                <lineBasicMaterial color={hdr(palette.cian, 2.2)} transparent opacity={0.85 * k} toneMapped={false} fog={false} />
              </lineSegments>
            </group>
          );
        })}
      {d.dashboard > 0 && (
        <mesh position={[x, h + upper + 2.2, z]}>
          <cylinderGeometry args={[0.05, 0.4, 4.2, 24, 1, true]} />
          <meshBasicMaterial color={hdr(palette.azul, 1.2)} transparent opacity={0.12 * d.dashboard} blending={AdditiveBlending} depthWrite={false} side={2} toneMapped={false} />
        </mesh>
      )}

      {/* Interior: estanterías con productos */}
      {[0.3, 0.63, 0.96].map((y) => (
        <mesh key={y} position={[x, y, back + 0.17]} receiveShadow castShadow>
          <boxGeometry args={[w - 0.2, 0.025, 0.2]} />
          <meshStandardMaterial color="#3A3F4A" roughness={0.6} />
        </mesh>
      ))}
      {products.map((p, i) => (
        <mesh key={i} position={p.p} castShadow>
          <boxGeometry args={p.s} />
          <meshStandardMaterial color={p.c} roughness={0.55} />
        </mesh>
      ))}
      {/* Mostrador */}
      <mesh position={[x - 0.1, 0.24, z + 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.42, 0.32]} />
        <meshStandardMaterial color="#262C38" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[x - 0.1, 0.455, z + 0.05]} receiveShadow>
        <boxGeometry args={[1.29, 0.02, 0.36]} />
        <meshStandardMaterial color="#8E8B85" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Pedidos en papel sobre el mostrador */}
      {[0, 1, 2].map((k) => (
        <mesh key={k} position={[x + 0.3 + k * 0.012, 0.47 + k * 0.004, z + 0.08 - k * 0.01]} rotation={[-Math.PI / 2, 0, 0.2 * k - 0.2]}>
          <planeGeometry args={[0.1, 0.13]} />
          <meshStandardMaterial color="#F5F5F3" roughness={0.9} />
        </mesh>
      ))}
      {/* Lámparas colgantes */}
      {[-0.45, 0.35].map((lx) => (
        <group key={lx} position={[x + lx, h - 0.25, z - 0.05]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.24, 4]} />
            <meshBasicMaterial color="#555B66" />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.03, 0.07, 0.06, 16, 1, true]} />
            <meshStandardMaterial color="#1B1F27" side={2} />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <sphereGeometry args={[0.022, 12, 8]} />
            <meshBasicMaterial color={hdr(palette.calido, 5 * warmth)} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <pointLight position={[x - 0.05, h - 0.35, z + 0.1]} color={palette.calido} intensity={2.4 * warmth} distance={3.2} decay={1.6} />
      <pointLight position={[x, 0.9, front + 0.8]} color="#BFD3FF" intensity={0.9 * (0.4 + 0.6 * d.heroDigital)} distance={4} decay={1.8} />

      {/* Comerciante (estilizado, sin rasgos): torso, delantal, cabeza, brazos y teléfono */}
      <group position={[mx, 0, mz]} rotation={[0, 0.5, 0]} scale={[1, breathe, 1]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.112, 0.088, 0.32, 24]} />
          <meshStandardMaterial color="#2E3A52" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.655, 0]} scale={[1, 0.42, 0.86]} castShadow>
          <sphereGeometry args={[0.114, 24, 16]} />
          <meshStandardMaterial color="#2E3A52" roughness={0.75} />
        </mesh>
        {/* Delantal */}
        <mesh position={[0, 0.47, 0.083]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.15, 0.25, 0.012]} />
          <meshStandardMaterial color="#CFCAC0" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.028, 0.032, 0.06, 12]} />
          <meshStandardMaterial color="#8A6B57" roughness={0.6} />
        </mesh>
        <group position={[0, 0.79, 0.005]} rotation={[-headTilt * 0.6, 0.1 * Math.sin(t * 0.7), 0]}>
          <mesh scale={[1, 1.12, 1]} castShadow>
            <sphereGeometry args={[0.066, 28, 20]} />
            <meshStandardMaterial color="#8A6B57" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.022, -0.008]} scale={[1.06, 0.95, 1.08]}>
            <sphereGeometry args={[0.066, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
            <meshStandardMaterial color="#121418" roughness={0.85} />
          </mesh>
        </group>
        {/* Brazos: el derecho sostiene el teléfono, el izquierdo apoyado */}
        <mesh position={[0.1, 0.6, 0.03]} rotation={[-0.35, 0, -0.12]} castShadow>
          <capsuleGeometry args={[0.03, 0.11, 4, 10]} />
          <meshStandardMaterial color="#2E3A52" roughness={0.75} />
        </mesh>
        <mesh position={[0.085, 0.58, 0.12]} rotation={[-1.35, 0, 0.35]} castShadow>
          <capsuleGeometry args={[0.026, 0.1, 4, 10]} />
          <meshStandardMaterial color="#2E3A52" roughness={0.75} />
        </mesh>
        <mesh position={[-0.11, 0.56, 0.02]} rotation={[-0.25, 0, 0.12]} castShadow>
          <capsuleGeometry args={[0.03, 0.16, 4, 10]} />
          <meshStandardMaterial color="#2E3A52" roughness={0.75} />
        </mesh>
        <group position={[0.05 + buzz, 0.61, 0.18]} rotation={[-0.8, 0.25, 0]}>
          <mesh>
            <boxGeometry args={[0.05, 0.096, 0.008]} />
            <meshStandardMaterial color="#0C0F15" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.0045]}>
            <planeGeometry args={[0.044, 0.088]} />
            <meshBasicMaterial color={hdr("#CFE3FF", 1.1 + 2.2 * msg)} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {/* Luz de contorno fría desde el fondo */}
      <pointLight position={[x + 0.7, 1.2, back + 0.35]} color="#7FA6FF" intensity={0.7 * (1 - 0.4 * d.freeze)} distance={2.4} decay={1.6} />
    </group>
  );
}
