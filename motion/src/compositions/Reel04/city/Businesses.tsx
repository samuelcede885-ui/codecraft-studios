import { useMemo, type ReactNode } from "react";
import { CanvasTexture, Color, RepeatWrapping, type Material } from "three";
import { facadeMaterial, palette, type CityUniforms } from "../../Reel02/city/materials";
import { BIZ, type BizId, type Drivers } from "../drivers";

/**
 * Negocios de la ciudad, cada uno con una arquitectura reconocible y actividad interna.
 * `build` (0–1) los construye pieza a pieza: piso, paredes que suben, techo que baja,
 * fachada que se desliza y objetos que aparecen. Frente hacia +z.
 */
export const SHELL = { w: 2.4, d: 2.0, h: 1.45, upper: 1.0, zc: -0.1 };
const FRONT = SHELL.zc + SHELL.d / 2;
const BACK = SHELL.zc - SHELL.d / 2;
const hdr = (hex: string, k: number) => new Color(hex).multiplyScalar(k);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** Progreso de una pieza dentro de la construcción. */
const piece = (b: number, a: number, z: number) => easeOut(clamp01((b - a) / (z - a)));

export function Businesses({ u, d, frame }: { u: CityUniforms; d: Drivers; frame: number }) {
  const upperMat = useMemo(() => facadeMaterial(u, { color: palette.grafito, roughness: 0.8, metalness: 0.1 }), [u]);
  return (
    <group>
      {BIZ.map((b) => (
        <group key={b.id} position={[b.x, 0, b.z]}>
          <Business id={b.id} build={d.build(b.id)} frame={frame} d={d} upperMat={upperMat} />
        </group>
      ))}
    </group>
  );
}

const SIGN: Record<BizId, string> = {
  barberia: "#CFE3FF",
  arepera: palette.calido,
  bodega: palette.calido,
  ropa: "#FFFFFF",
  cafe: palette.calido,
  tecno: palette.cian,
};

function Business({ id, build, frame, d, upperMat }: { id: BizId; build: number; frame: number; d: Drivers; upperMat: Material }) {
  if (build <= 0) return null;
  const { w, d: depth, h, upper, zc } = SHELL;
  const floor = piece(build, 0, 0.22);
  const walls = piece(build, 0.12, 0.5);
  const roof = piece(build, 0.38, 0.72);
  const front = piece(build, 0.58, 0.88);
  const props = piece(build, 0.72, 1);
  const t = frame / 30;
  const lit = (0.35 + 0.65 * props) * d.fade;
  const warmK = id === "bodega" || id === "arepera" ? 1 + 1.2 * d.warm : 1;
  return (
    <group>
      {/* Base y piso */}
      <mesh position={[0, 0.03 - 0.3 * (1 - floor), zc]} scale={[floor, 1, floor]} receiveShadow>
        <boxGeometry args={[w + 0.3, 0.06, depth + 0.4]} />
        <meshStandardMaterial color="#1A1E27" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* Paredes que suben */}
      <group position={[0, -h * (1 - walls), 0]}>
        <mesh position={[0, h / 2, BACK + 0.03]} castShadow receiveShadow>
          <boxGeometry args={[w, h, 0.06]} />
          <meshStandardMaterial color="#20252F" roughness={0.9} />
        </mesh>
        {[-1, 1].map((k) => (
          <mesh key={k} position={[(k * (w - 0.06)) / 2, h / 2, zc]} castShadow receiveShadow>
            <boxGeometry args={[0.06, h, depth]} />
            <meshStandardMaterial color="#1C2029" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* Techo y piso superior que bajan */}
      <group position={[0, 3.2 * (1 - roof), 0]}>
        <mesh position={[0, h + 0.03, zc]} castShadow receiveShadow>
          <boxGeometry args={[w + 0.06, 0.08, depth + 0.06]} />
          <meshStandardMaterial color="#232934" roughness={0.8} />
        </mesh>
        <mesh position={[0, h + 0.07 + upper / 2, zc]} material={upperMat} castShadow receiveShadow>
          <boxGeometry args={[w, upper, depth]} />
        </mesh>
        <mesh position={[0, h + upper + 0.1, zc]} castShadow>
          <boxGeometry args={[w + 0.06, 0.06, depth + 0.06]} />
          <meshStandardMaterial color={palette.grafitoClaro} roughness={0.7} />
        </mesh>
      </group>
      {/* Fachada: marco, letrero y toldo que se deslizan desde el frente */}
      <group position={[0, 0, 1.6 * (1 - front)]} scale={[1, front, 1]}>
        {[-1.17, 1.17].map((px) => (
          <mesh key={px} position={[px, h / 2, FRONT - 0.02]} castShadow>
            <boxGeometry args={[0.05, h, 0.05]} />
            <meshStandardMaterial color="#2E3542" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, h - 0.13, FRONT + 0.03]}>
          <boxGeometry args={[w * 0.86, 0.18, 0.05]} />
          <meshStandardMaterial color="#12161E" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, h - 0.13, FRONT + 0.058]}>
          <boxGeometry args={[w * 0.56, 0.05, 0.01]} />
          <meshBasicMaterial color={hdr(SIGN[id], 2.6 * lit * warmK)} toneMapped={false} />
        </mesh>
        <mesh position={[0, h - 0.34, FRONT + 0.22]} rotation={[0.32, 0, 0]} castShadow>
          <boxGeometry args={[w * 0.92, 0.025, 0.44]} />
          <meshStandardMaterial color={id === "cafe" || id === "arepera" ? "#2A2622" : "#1A202B"} roughness={0.6} />
        </mesh>
      </group>
      {/* Luz interior */}
      <pointLight position={[0, h - 0.3, zc + 0.2]} color={id === "tecno" || id === "barberia" ? "#BFD6FF" : palette.calido} intensity={1.9 * lit * warmK} distance={3.4} decay={1.6} />
      {/* Interior temático */}
      <group scale={[props, props, props]} position={[0, 0, (1 - props) * 0.4]}>
        {INTERIORS[id](t, lit)}
      </group>
    </group>
  );
}

// ── Piezas reutilizables ───────────────────────────────────────────────────────

const M = ({ c, r = 0.6, m = 0.1, e }: { c: string; r?: number; m?: number; e?: Color }) =>
  e ? <meshBasicMaterial color={e} toneMapped={false} /> : <meshStandardMaterial color={c} roughness={r} metalness={m} />;

/** Persona estilizada (sin rasgos): torso, delantal opcional, cabeza y brazos. */
export function Person({ x = 0, z = 0, rot = 0, shirt = "#2E3A52", apron = false, arm = 0, nod = 0 }: { x?: number; z?: number; rot?: number; shirt?: string; apron?: boolean; arm?: number; nod?: number }) {
  const skin = "#8A6B57";
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.088, 0.32, 20]} />
        <M c={shirt} r={0.75} />
      </mesh>
      <mesh position={[0, 0.655, 0]} scale={[1, 0.42, 0.86]} castShadow>
        <sphereGeometry args={[0.112, 20, 14]} />
        <M c={shirt} r={0.75} />
      </mesh>
      {apron && (
        <mesh position={[0, 0.47, 0.083]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.15, 0.25, 0.012]} />
          <M c="#CFCAC0" r={0.85} />
        </mesh>
      )}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.028, 0.032, 0.06, 10]} />
        <M c={skin} />
      </mesh>
      <group position={[0, 0.79, 0.005]} rotation={[nod, 0, 0]}>
        <mesh scale={[1, 1.12, 1]} castShadow>
          <sphereGeometry args={[0.066, 24, 16]} />
          <M c={skin} />
        </mesh>
        <mesh position={[0, 0.022, -0.008]} scale={[1.06, 0.95, 1.08]}>
          <sphereGeometry args={[0.066, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
          <M c="#121418" r={0.85} />
        </mesh>
      </group>
      <mesh position={[0.1, 0.58, 0.06]} rotation={[-0.6 - arm, 0, -0.15]} castShadow>
        <capsuleGeometry args={[0.028, 0.16, 4, 8]} />
        <M c={shirt} r={0.75} />
      </mesh>
      <mesh position={[-0.11, 0.56, 0.03]} rotation={[-0.3, 0, 0.12]} castShadow>
        <capsuleGeometry args={[0.028, 0.16, 4, 8]} />
        <M c={shirt} r={0.75} />
      </mesh>
    </group>
  );
}

function Counter({ x = 0, z = 0, w = 1.2, top = "#8E8B85" }: { x?: number; z?: number; w?: number; top?: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.42, 0.32]} />
        <M c="#262C38" r={0.5} m={0.2} />
      </mesh>
      <mesh position={[0, 0.455, 0]} receiveShadow>
        <boxGeometry args={[w + 0.04, 0.02, 0.36]} />
        <M c={top} r={0.35} m={0.1} />
      </mesh>
    </group>
  );
}

function Steam({ x, y, z, t, k = 1 }: { x: number; y: number; z: number; t: number; k?: number }) {
  return (
    <group position={[x, y, z]}>
      {[0, 1, 2].map((i) => {
        const p = (t * 0.6 + i / 3) % 1;
        return (
          <mesh key={i} position={[Math.sin(p * 6 + i) * 0.015, p * 0.22 * k, 0]} scale={(0.5 + p) * k}>
            <sphereGeometry args={[0.02, 8, 6]} />
            <meshBasicMaterial color="#DDE6F5" transparent opacity={0.25 * (1 - p)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function Shelves({ tones, rows = 3 }: { tones: string[]; rows?: number }) {
  const items: ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let k = 0; k < 8; k++) {
      const sy = 0.08 + ((k * 5 + r) % 3) * 0.035;
      items.push(
        <mesh key={`${r}-${k}`} position={[-0.86 + k * 0.245, 0.34 + r * 0.33 + sy / 2, BACK + 0.17]} castShadow>
          <boxGeometry args={[0.1 + ((k * 7 + r * 3) % 4) * 0.018, sy, 0.12]} />
          <M c={tones[(k + r * 2) % tones.length]} r={0.55} />
        </mesh>,
      );
    }
  return (
    <group>
      {Array.from({ length: rows }, (_, r) => (
        <mesh key={r} position={[0, 0.3 + r * 0.33, BACK + 0.17]} receiveShadow>
          <boxGeometry args={[SHELL.w - 0.24, 0.025, 0.2]} />
          <M c="#3A3F4A" />
        </mesh>
      ))}
      {items}
    </group>
  );
}

function stripes() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const g = c.getContext("2d")!;
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 ? "#F5F5F3" : "#2563EB";
    g.save();
    g.translate(0, i * 16);
    g.transform(1, 0.5, 0, 1, 0, 0);
    g.fillRect(-64, -32, 192, 16);
    g.restore();
  }
  const tex = new CanvasTexture(c);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  return tex;
}
let stripeTex: CanvasTexture | null = null;

// ── Interiores ────────────────────────────────────────────────────────────────

const INTERIORS: Record<BizId, (t: number, lit: number) => ReactNode> = {
  /** Arepera: plancha con arepas, cocinero que las voltea, mesas al frente y vapor. */
  arepera: (t) => (
    <group>
      <Counter z={-0.55} w={1.6} top="#3B3F48" />
      <mesh position={[-0.3, 0.475, -0.55]}>
        <cylinderGeometry args={[0.16, 0.16, 0.015, 28]} />
        <M c="#15171C" r={0.4} m={0.6} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.38 + i * 0.08, 0.49 + (i === 1 ? Math.max(0, Math.sin(t * 3)) * 0.05 : 0), -0.56]} rotation={[i === 1 ? Math.sin(t * 3) * 1.2 : 0, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.014, 18]} />
          <M c="#E2C98F" r={0.8} />
        </mesh>
      ))}
      <Steam x={-0.3} y={0.5} z={-0.55} t={t} />
      <Person x={-0.2} z={-0.85} shirt="#3A3530" apron arm={Math.max(0, Math.sin(t * 3)) * 0.6} nod={0.25} />
      {[-0.6, 0.6].map((tx) => (
        <group key={tx} position={[tx, 0, 0.45]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.025, 24]} />
            <M c="#D9D6CF" r={0.4} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 0.3, 8]} />
            <M c="#2E3542" m={0.6} />
          </mesh>
          {[-1, 1].map((k) => (
            <mesh key={k} position={[k * 0.3, 0.12, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.24, 12]} />
              <M c="#2A2622" />
            </mesh>
          ))}
          <mesh position={[0.05, 0.33, 0.02]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
            <M c="#E2C98F" r={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  ),
  /** Bodega: estanterías con víveres, cajas de frutas y verduras, mostrador y dueño. */
  bodega: (t) => (
    <group>
      <Shelves tones={["#E9E4DA", "#2C3E66", "#C7B79E", "#3A4A62", "#8FA6C9", "#C79A4B"]} />
      <Counter x={0.35} z={0.05} w={1.0} />
      {[-0.75, -0.35].map((cx, i) => (
        <group key={cx} position={[cx, 0, 0.45]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.34, 0.24, 0.26]} />
            <M c="#4A3F33" r={0.9} />
          </mesh>
          {Array.from({ length: 6 }, (_, k) => (
            <mesh key={k} position={[-0.1 + (k % 3) * 0.1, 0.27, -0.05 + Math.floor(k / 3) * 0.1]}>
              <sphereGeometry args={[0.045, 12, 10]} />
              <M c={i ? "#7E9A55" : "#D08A3E"} r={0.7} />
            </mesh>
          ))}
        </group>
      ))}
      <Person x={0.3} z={-0.3} apron rot={0.15} nod={0.1 + 0.05 * Math.sin(t)} />
    </group>
  ),
  /** Tienda de ropa: vitrinas con maniquíes que giran y un perchero. */
  ropa: (t) => (
    <group>
      {[-0.6, 0.6].map((mx, i) => (
        <group key={mx} position={[mx, 0, 0.45]} rotation={[0, t * 0.5 + i * 1.5, 0]}>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.03, 20]} />
            <M c="#2E3542" m={0.6} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4, 6]} />
            <M c="#888" m={0.8} />
          </mesh>
          <mesh position={[0, 0.58, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.26, 6, 14]} />
            <M c={i ? "#2563EB" : "#E9E4DA"} r={0.8} />
          </mesh>
          <mesh position={[0, 0.86, 0]}>
            <sphereGeometry args={[0.06, 16, 12]} />
            <M c="#D9D6CF" r={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.9, BACK + 0.3]}>
        <cylinderGeometry args={[0.012, 0.012, 1.6, 8]} />
        <M c="#9AA0AA" m={0.8} />
      </mesh>
      {Array.from({ length: 9 }, (_, k) => (
        <mesh key={k} position={[-0.7 + k * 0.175, 0.62, BACK + 0.3]} rotation={[0, Math.PI / 2 + Math.sin(t + k) * 0.05, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.02]} />
          <M c={["#1F2B44", "#E9E4DA", "#3A4A62", "#C7B79E", "#2C3E66"][k % 5]} r={0.85} />
        </mesh>
      ))}
    </group>
  ),
  /** Cafetería: máquina de espresso, tazas con vapor y mesitas. */
  cafe: (t) => (
    <group>
      <Counter z={-0.5} w={1.7} top="#3B3F48" />
      <mesh position={[0.45, 0.62, -0.55]} castShadow>
        <boxGeometry args={[0.36, 0.3, 0.24]} />
        <M c="#B9BEC8" r={0.25} m={0.85} />
      </mesh>
      {[-0.2, -0.05].map((cx) => (
        <group key={cx}>
          <mesh position={[cx, 0.5, -0.45]}>
            <cylinderGeometry args={[0.03, 0.025, 0.05, 14]} />
            <M c="#F5F5F3" r={0.3} />
          </mesh>
          <Steam x={cx} y={0.53} z={-0.45} t={t + cx} k={0.7} />
        </group>
      ))}
      <Person x={0.1} z={-0.85} shirt="#2A2622" apron arm={0.4 + 0.2 * Math.sin(t * 2)} nod={0.2} />
      {[-0.55, 0.55].map((tx) => (
        <group key={tx} position={[tx, 0, 0.45]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 20]} />
            <M c="#2E3542" m={0.6} r={0.3} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.3, 8]} />
            <M c="#2E3542" m={0.6} />
          </mesh>
          <mesh position={[0, 0.335, 0]}>
            <cylinderGeometry args={[0.028, 0.022, 0.045, 12]} />
            <M c="#F5F5F3" r={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  ),
  /** Tecnología: pared de pantallas con contenido que cambia y mostrador con laptop. */
  tecno: (t, lit) => (
    <group>
      {Array.from({ length: 6 }, (_, k) => {
        const on = 0.5 + 0.5 * Math.sin(t * 2 + k * 1.3);
        return (
          <group key={k} position={[-0.7 + (k % 3) * 0.7, 0.6 + Math.floor(k / 3) * 0.42, BACK + 0.08]}>
            <mesh>
              <boxGeometry args={[0.6, 0.36, 0.03]} />
              <M c="#0C0F15" m={0.6} r={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.017]}>
              <planeGeometry args={[0.56, 0.32]} />
              <M c="#000" e={hdr(k % 2 ? palette.azul : palette.cian, (0.5 + 0.9 * on) * lit)} />
            </mesh>
          </group>
        );
      })}
      <Counter z={0.2} w={1.4} top="#2E3542" />
      <mesh position={[0.2, 0.56, 0.2]} rotation={[-0.35, -0.3, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.012]} />
        <M c="#0C0F15" m={0.6} />
      </mesh>
      <mesh position={[0.205, 0.56, 0.208]} rotation={[-0.35, -0.3, 0]}>
        <planeGeometry args={[0.28, 0.18]} />
        <M c="#000" e={hdr("#7FA6FF", 1.3 * lit)} />
      </mesh>
      <Person x={-0.25} z={-0.15} rot={0.3} nod={0.1} />
    </group>
  ),
  /** Barbería: sillón, espejo, barbero y el poste a rayas que gira en la entrada. */
  barberia: (t) => {
    stripeTex ??= stripes();
    stripeTex.offset.y = -t * 0.6;
    return (
      <group>
        <mesh position={[0, 0.85, BACK + 0.07]}>
          <boxGeometry args={[1.2, 0.6, 0.02]} />
          <meshStandardMaterial color="#8FA6C9" metalness={1} roughness={0.08} />
        </mesh>
        <group position={[0, 0, -0.35]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.34, 0.12, 0.34]} />
            <M c="#1F2B44" r={0.4} />
          </mesh>
          <mesh position={[0, 0.48, -0.14]} castShadow>
            <boxGeometry args={[0.34, 0.36, 0.08]} />
            <M c="#1F2B44" r={0.4} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.04, 0.12, 0.24, 12]} />
            <M c="#B9BEC8" m={0.85} r={0.25} />
          </mesh>
        </group>
        <Person x={0.35} z={-0.2} rot={-0.6} shirt="#E9E4DA" arm={0.4 + 0.25 * Math.sin(t * 4)} nod={0.25} />
        <group position={[1.0, 0.75, FRONT + 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 20]} />
            <meshStandardMaterial map={stripeTex} emissiveMap={stripeTex} emissive="#ffffff" emissiveIntensity={0.35} roughness={0.3} />
          </mesh>
          {[-0.28, 0.28].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <sphereGeometry args={[0.06, 14, 10]} />
              <M c="#B9BEC8" m={0.85} r={0.25} />
            </mesh>
          ))}
        </group>
      </group>
    );
  },
};
