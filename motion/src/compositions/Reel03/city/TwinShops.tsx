import { useMemo } from "react";
import { AdditiveBlending, BoxGeometry, CanvasTexture, Color, EdgesGeometry, type Texture } from "three";
import { facadeMaterial, palette, type CityUniforms } from "../../Reel02/city/materials";
import type { Drivers } from "../drivers";

const hdr = (hex: string, k: number) => new Color(hex).multiplyScalar(k);

/** Las dos tiendas: misma arquitectura y dimensiones; cambia la luz y la forma de operar. */
export const TWIN = { w: 1.5, d: 1.9, h: 1.45, upper: 1.15, z: -0.1, xs: { manual: -0.82, digital: 0.82 } } as const;
export const FRONT_Z = TWIN.z + TWIN.d / 2;

export function TwinShops({ u, d, frame }: { u: CityUniforms; d: Drivers; frame: number }) {
  const spill = useMemo(() => radialTexture(), []);
  const screen = useMemo(() => dashboardTexture(), []);
  return (
    <group>
      <Shop side="manual" x={TWIN.xs.manual} u={u} d={d} frame={frame} spill={spill} screen={screen} />
      <Shop side="digital" x={TWIN.xs.digital} u={u} d={d} frame={frame} spill={spill} screen={screen} />
      <Divider d={d} />
    </group>
  );
}

/** Línea de luz que separa las dos tiendas: sube por la medianera y corre por la acera. */
function Divider({ d }: { d: Drivers }) {
  const k = d.divider;
  if (k <= 0) return null;
  const up = Math.min(1, k * 1.6);
  const along = Math.max(0, Math.min(1, k * 1.6 - 0.4));
  const color = hdr("#DDEBFF", 3.2 * d.linesFade);
  return (
    <group>
      <mesh position={[0, 1.65 * up, FRONT_Z + 0.04]} scale={[1, up, 1]}>
        <boxGeometry args={[0.022, 3.3, 0.022]} />
        <meshBasicMaterial color={color} toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[0, 0.06, FRONT_Z + 0.04 + 2.6 * along]} scale={[1, 1, Math.max(0.001, along)]}>
        <boxGeometry args={[0.03, 0.01, 5.2]} />
        <meshBasicMaterial color={color} toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[0, 1.65, FRONT_Z + 0.05]}>
        <planeGeometry args={[0.16, 3.4]} />
        <meshBasicMaterial color={hdr("#7FA6FF", 0.35 * up * d.linesFade)} transparent opacity={0.3} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Shop({ side, x, u, d, frame, spill, screen }: { side: "manual" | "digital"; x: number; u: CityUniforms; d: Drivers; frame: number; spill: Texture; screen: Texture }) {
  const { w, d: depth, h, upper, z } = TWIN;
  const digital = side === "digital";
  const front = z + depth / 2;
  const back = z - depth / 2;
  const t = frame / 30;
  const cut = d.cutaway;
  const upperMat = useMemo(() => {
    const m = facadeMaterial(u, { color: palette.grafito, roughness: 0.8, metalness: 0.1 });
    m.transparent = true;
    return m;
  }, [u]);
  upperMat.opacity = 1 - cut;
  upperMat.depthWrite = cut < 0.5;
  const outline = useMemo(() => new EdgesGeometry(new BoxGeometry(w + 0.03, h + upper + 0.04, depth + 0.03)), [w, h, upper, depth]);

  // Luz de cada tienda: cálida y tenue (manual) o azul tecnológica (digital).
  const lit = Math.min(1, d.litRadius / 8) * d.fade;
  const key = digital ? "#9CC2FF" : palette.calido;
  const keyI = (digital ? 2.1 : 1.6) * lit;
  const signColor = digital ? hdr(palette.azul, 3.4 * lit) : hdr(palette.calido, 1.6 * lit);

  const products = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number]; c: string }[] = [];
    const tones = ["#E9E4DA", "#2C3E66", "#3A4A62", "#C7B79E", "#1F2B44", "#8FA6C9"];
    for (let row = 0; row < 3; row++)
      for (let k = 0; k < 6; k++) {
        const sx = 0.09 + ((k * 7 + row * 3) % 4) * 0.018;
        const sy = 0.08 + ((k * 5 + row) % 3) * 0.035;
        out.push({ p: [-0.58 + k * 0.232, 0.34 + row * 0.33 + sy / 2, back + 0.17], s: [sx, sy, 0.12], c: tones[(k + row * 2) % tones.length] });
      }
    return out;
  }, [back]);

  // Comerciante: el de la izquierda alterna entre teléfono y libreta; el de la derecha, tranquilo.
  const cycle = (Math.sin(t * 2.4) + 1) / 2;
  const look = digital ? 0.05 * Math.sin(t * 0.8) : d.manual * (cycle > 0.5 ? 0.55 : -0.25);
  const tilt = digital ? -0.15 : -0.3 - 0.15 * d.manual;
  const phoneUp = digital ? 0 : d.manual * (Math.sin(t * 2.4) > 0 ? 1 : 0.35);
  const buzz = !digital && d.manual > 0 ? Math.sin(t * 40) * 0.006 * (Math.sin(t * 3.1) > 0.6 ? 1 : 0) : 0;
  const skin = "#8A6B57";
  const shirt = digital ? "#2B3A57" : "#3A3530";

  return (
    <group position={[x, 0, 0]}>
      {/* Planta baja: piso, paredes, techo */}
      <mesh position={[0, 0.03, z]} receiveShadow>
        <boxGeometry args={[w, 0.06, depth]} />
        <meshStandardMaterial color="#1B1E26" roughness={0.42} metalness={0.25} />
      </mesh>
      <mesh position={[0, h / 2, back + 0.03]} receiveShadow castShadow>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial color="#20252F" roughness={0.9} />
      </mesh>
      {[-1, 1].map((k) => (
        <mesh key={k} position={[(k * (w - 0.06)) / 2, h / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[0.06, h, depth]} />
          <meshStandardMaterial color="#1C2029" roughness={0.9} />
        </mesh>
      ))}
      {/* Pisos superiores: suben y se desvanecen en el corte arquitectónico */}
      <group position={[0, 2.4 * cut, -0.4 * cut]}>
        <mesh position={[0, h + 0.02, z]} castShadow={cut < 0.5}>
          <boxGeometry args={[w + 0.06, 0.08, depth + 0.06]} />
          <meshStandardMaterial color="#232934" roughness={0.8} transparent opacity={1 - cut} depthWrite={cut < 0.5} />
        </mesh>
        <mesh position={[0, h + 0.06 + upper / 2, z]} material={upperMat} castShadow={cut < 0.5}>
          <boxGeometry args={[w, upper, depth]} />
        </mesh>
        <mesh position={[0, h + upper + 0.09, z]}>
          <boxGeometry args={[w + 0.06, 0.06, depth + 0.06]} />
          <meshStandardMaterial color={palette.grafitoClaro} roughness={0.7} transparent opacity={1 - cut} depthWrite={cut < 0.5} />
        </mesh>
      </group>
      {/* Fachada: marcos, vidrio, letrero y toldo (idénticos) */}
      {[-0.73, 0, 0.73].map((px) => (
        <mesh key={px} position={[px, h / 2, front - 0.02]} castShadow>
          <boxGeometry args={[0.035, h, 0.04]} />
          <meshStandardMaterial color="#2E3542" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, front - 0.02]}>
        <boxGeometry args={[w, 0.1, 0.04]} />
        <meshStandardMaterial color="#2E3542" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, h * 0.5, front - 0.015]}>
        <planeGeometry args={[w - 0.05, h - 0.3]} />
        <meshStandardMaterial color="#9DB4E0" metalness={0.9} roughness={0.06} transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh position={[0, h - 0.12, front + 0.03]}>
        <boxGeometry args={[w * 0.84, 0.16, 0.05]} />
        <meshStandardMaterial color="#12161E" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, h - 0.12, front + 0.058]}>
        <boxGeometry args={[w * 0.6, 0.05, 0.01]} />
        <meshBasicMaterial color={signColor} toneMapped={false} />
      </mesh>
      <mesh position={[0, h - 0.32, front + 0.2]} rotation={[0.32, 0, 0]} castShadow>
        <boxGeometry args={[w * 0.9, 0.025, 0.42]} />
        <meshStandardMaterial color="#1A202B" roughness={0.6} />
      </mesh>
      {digital && (
        <lineSegments geometry={outline} position={[0, (h + upper) / 2 + 0.03, z]}>
          <lineBasicMaterial color={hdr(palette.cian, 1.3 * lit * d.linesFade)} toneMapped={false} transparent opacity={0.5 * (1 - cut)} fog={false} />
        </lineSegments>
      )}
      {/* Luz que sale a la acera (volumen discreto) */}
      <mesh position={[0, 0.07, front + 0.75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 1.5, 1.5]} />
        <meshBasicMaterial map={spill} color={hdr(digital ? palette.azul : palette.calido, (digital ? 1.1 : 0.7) * lit)} transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Interior idéntico: estanterías con los mismos productos */}
      {[0.3, 0.63, 0.96].map((y) => (
        <mesh key={y} position={[0, y, back + 0.17]} receiveShadow castShadow>
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
      <mesh position={[0, 0.24, z + 0.12]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.42, 0.32]} />
        <meshStandardMaterial color="#262C38" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.455, z + 0.12]} receiveShadow>
        <boxGeometry args={[1.04, 0.02, 0.36]} />
        <meshStandardMaterial color="#8E8B85" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Lámparas */}
      {[-0.35, 0.35].map((lx) => (
        <group key={lx} position={[lx, h - 0.25, z]}>
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
            <meshBasicMaterial color={hdr(key, 4 * lit)} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, h - 0.35, z + 0.15]} color={key} intensity={keyI} distance={2.8} decay={1.6} />
      <pointLight position={[0.55, 1.15, back + 0.35]} color={digital ? palette.cian : "#7FA6FF"} intensity={(digital ? 0.9 : 0.35) * lit} distance={2.2} decay={1.6} />

      {/* Mostrador: la diferencia está en las herramientas */}
      {digital ? (
        <group position={[0.28, 0.47, z + 0.1]}>
          <mesh position={[0, 0.12, 0]} rotation={[-0.25, -0.35, 0]}>
            <boxGeometry args={[0.32, 0.21, 0.015]} />
            <meshStandardMaterial color="#0C0F15" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.003, 0.12, 0.009]} rotation={[-0.25, -0.35, 0]}>
            <planeGeometry args={[0.3, 0.19]} />
            <meshBasicMaterial map={screen} color={hdr("#FFFFFF", 1.25 * lit)} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.02, 0.03]}>
            <boxGeometry args={[0.06, 0.04, 0.05]} />
            <meshStandardMaterial color="#1C2230" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[-0.42, 0.012, 0.05]}>
            <boxGeometry args={[0.07, 0.012, 0.07]} />
            <meshStandardMaterial color="#141820" />
          </mesh>
          <mesh position={[-0.42, 0.022, 0.05]}>
            <sphereGeometry args={[0.008, 8, 6]} />
            <meshBasicMaterial color={hdr(palette.cian, 3 * (0.6 + 0.4 * Math.sin(t * 4)))} toneMapped={false} />
          </mesh>
        </group>
      ) : (
        <group position={[0.18, 0.468, z + 0.1]}>
          {/* Libreta abierta, papeles, calculadora y un segundo teléfono que no para */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0.15]}>
            <planeGeometry args={[0.22, 0.15]} />
            <meshStandardMaterial color="#EDE7DA" roughness={0.9} />
          </mesh>
          {[-0.03, 0, 0.03].map((oz) => (
            <mesh key={oz} position={[0.01, 0.001, oz]} rotation={[-Math.PI / 2, 0, 0.15]}>
              <planeGeometry args={[0.16, 0.004]} />
              <meshBasicMaterial color="#9AA0AA" />
            </mesh>
          ))}
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} position={[-0.3 + k * 0.012, 0.001 + k * 0.002, 0.02 - k * 0.012]} rotation={[-Math.PI / 2, 0, 0.3 * k - 0.4]}>
              <planeGeometry args={[0.1, 0.13]} />
              <meshStandardMaterial color="#F5F5F3" roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0.22, 0.008, 0.03]}>
            <boxGeometry args={[0.07, 0.016, 0.1]} />
            <meshStandardMaterial color="#2A2E36" />
          </mesh>
          <mesh position={[-0.12 + buzz, 0.006, 0.07]}>
            <boxGeometry args={[0.05, 0.008, 0.095]} />
            <meshStandardMaterial color="#0C0F15" />
          </mesh>
          <mesh position={[-0.12 + buzz, 0.011, 0.07]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.044, 0.088]} />
            <meshBasicMaterial color={hdr("#DCE8FF", (0.5 + 2 * (Math.sin(t * 3.1) > 0.6 ? 1 : 0)) * d.manual * lit + 0.2)} toneMapped={false} />
          </mesh>
        </group>
      )}
      {/* Notas pegadas en la pared (solo en la tienda manual) */}
      {!digital &&
        [
          [-0.45, 1.18],
          [-0.3, 1.24],
          [0.42, 1.2],
        ].map(([nx, ny], k) => (
          <mesh key={k} position={[nx, ny, back + 0.065]} rotation={[0, 0, 0.12 * (k - 1)]}>
            <planeGeometry args={[0.1, 0.1]} />
            <meshStandardMaterial color="#E8DFC8" roughness={0.9} />
          </mesh>
        ))}

      {/* Comerciante */}
      <group position={[-0.12, 0, z - 0.2]} rotation={[0, 0.25 + look, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.112, 0.088, 0.32, 24]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.655, 0]} scale={[1, 0.42, 0.86]} castShadow>
          <sphereGeometry args={[0.114, 24, 16]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.47, 0.083]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.15, 0.25, 0.012]} />
          <meshStandardMaterial color="#CFCAC0" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.028, 0.032, 0.06, 12]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        <group position={[0, 0.79, 0.005]} rotation={[-tilt * 0.6, 0.08 * Math.sin(t * 0.7), 0]}>
          <mesh scale={[1, 1.12, 1]} castShadow>
            <sphereGeometry args={[0.066, 28, 20]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.022, -0.008]} scale={[1.06, 0.95, 1.08]}>
            <sphereGeometry args={[0.066, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
            <meshStandardMaterial color="#121418" roughness={0.85} />
          </mesh>
        </group>
        <mesh position={[0.1, 0.6, 0.03]} rotation={[-0.35, 0, -0.12]} castShadow>
          <capsuleGeometry args={[0.03, 0.11, 4, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh position={[0.085, 0.56 + 0.04 * phoneUp, 0.12]} rotation={[-1.1 - 0.35 * phoneUp, 0, 0.35]} castShadow>
          <capsuleGeometry args={[0.026, 0.1, 4, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh position={[-0.11, 0.56, 0.02]} rotation={[-0.25, 0, 0.12]} castShadow>
          <capsuleGeometry args={[0.03, 0.16, 4, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        {!digital && (
          <group position={[0.05, 0.58 + 0.05 * phoneUp, 0.18]} rotation={[-0.8 - 0.3 * phoneUp, 0.25, 0]}>
            <mesh>
              <boxGeometry args={[0.05, 0.096, 0.008]} />
              <meshStandardMaterial color="#0C0F15" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.0045]}>
              <planeGeometry args={[0.044, 0.088]} />
              <meshBasicMaterial color={hdr("#DCE8FF", 1.6 * lit + 0.2)} toneMapped={false} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

/** Mancha de luz radial (para la luz que sale de cada vidriera). */
function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 40, 4, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.18)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/** Pantalla del punto de venta digital: un panel con barras y línea (dibujado una vez). */
function dashboardTexture() {
  const c = document.createElement("canvas");
  c.width = 320;
  c.height = 200;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0B1222";
  g.fillRect(0, 0, 320, 200);
  g.fillStyle = "#16213A";
  g.fillRect(0, 0, 60, 200);
  for (let i = 0; i < 5; i++) {
    g.fillStyle = i === 0 ? "#2563EB" : "#2A3550";
    g.fillRect(12, 18 + i * 34, 36, 18);
  }
  g.fillStyle = "#1A2540";
  g.fillRect(74, 16, 110, 52);
  g.fillRect(194, 16, 110, 52);
  g.fillStyle = "#38DDF5";
  g.fillRect(84, 46, 60, 8);
  g.fillStyle = "#7FA6FF";
  g.fillRect(204, 46, 80, 8);
  [40, 62, 50, 78, 70, 92].forEach((v, i) => {
    g.fillStyle = i === 5 ? "#38DDF5" : "#2563EB";
    g.fillRect(82 + i * 38, 186 - v, 24, v);
  });
  return new CanvasTexture(c);
}
