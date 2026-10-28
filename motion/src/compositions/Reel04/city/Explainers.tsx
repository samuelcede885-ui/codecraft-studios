import { useMemo } from "react";
import { AdditiveBlending, BoxGeometry, CanvasTexture, Color, EdgesGeometry, LineCurve3, CurvePath, QuadraticBezierCurve3, TubeGeometry, Vector3 } from "three";
import { palette } from "../../Reel02/city/materials";
import type { Drivers } from "../drivers";
import { Person, SHELL } from "./Businesses";

const hdr = (hex: string, k: number) => new Color(hex).multiplyScalar(k);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const DOOR = new Vector3(0, 0.7, SHELL.zc + SHELL.d / 2 + 0.05);

/** Escena 2: el pedido confirmado se vuelve una esfera de luz que entra a la bodega. */
export function OrderOrb({ d }: { d: Drivers }) {
  const curve = useMemo(() => new QuadraticBezierCurve3(new Vector3(1.6, 1.55, 3.0), new Vector3(1.0, 2.3, 1.8), DOOR.clone()), []);
  if (d.orb <= 0 || d.orb >= 1.15) return null;
  const p = smooth(clamp01(d.orb));
  const flash = d.orb > 0.92 ? (d.orb - 0.92) / 0.23 : 0;
  return (
    <group>
      {[0, 0.04, 0.08, 0.12].map((lag, i) => {
        const q = Math.max(0, p - lag);
        const pt = curve.getPointAt(Math.min(1, q));
        return (
          <mesh key={i} position={pt} scale={(1 - i * 0.22) * (1 + 1.2 * flash)}>
            <sphereGeometry args={[0.07, 20, 14]} />
            <meshBasicMaterial color={hdr(i ? palette.azul : palette.cian, (i ? 2.5 : 5) * (1 - flash))} transparent opacity={(1 - i * 0.22) * (1 - flash)} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Escena 4: la libreta se abre y sus datos quedan sueltos ───────────────────

export const NOTE = new Vector3(0, 1.25, 2.7);

const records = [
  "Pedido #12 · 2 harinas",
  "¿Pagó? — Ana",
  "Stock café: ¿?",
  "Gasto proveedor",
  "Entregar a las 5",
  "Fiado: Luis",
  "Pedido #13 · queso",
  "Ventas de hoy",
  "Revisar inventario",
  "Responder mensajes",
  "Precio actualizado",
  "Caja: cuadrar",
];

function noteTexture(text: string, clean: boolean) {
  const c = document.createElement("canvas");
  c.width = 360;
  c.height = 200;
  const g = c.getContext("2d")!;
  g.fillStyle = clean ? "#101A33" : "#EFE8D8";
  g.fillRect(0, 0, 360, 200);
  if (!clean) {
    g.strokeStyle = "rgba(80,90,110,0.25)";
    for (let y = 52; y < 200; y += 44) {
      g.beginPath();
      g.moveTo(16, y);
      g.lineTo(344, y);
      g.stroke();
    }
  } else {
    g.strokeStyle = "rgba(56,221,245,0.8)";
    g.lineWidth = 4;
    g.strokeRect(2, 2, 356, 196);
  }
  g.fillStyle = clean ? "#EAF1FF" : "#3A342C";
  g.font = clean ? "700 34px Inter, sans-serif" : "italic 600 34px Inter, sans-serif";
  g.fillText(text, 22, 110);
  return new CanvasTexture(c);
}

export function Notebook({ d, frame }: { d: Drivers; frame: number }) {
  const messy = useMemo(() => records.map((r) => noteTexture(r, false)), []);
  const tidy = useMemo(() => records.map((r) => noteTexture(r, true)), []);
  const sheet = useMemo(() => sheetTexture(), []);
  const chat = useMemo(() => chatTexture(), []);
  const show = Math.max(d.warm, d.assemble) * (1 - d.notebookOut);
  if (show <= 0.01 && d.pulse <= 0) return null;
  const t = frame / 30;
  const open = d.open;
  // Rejilla organizada (tras el pulso): 3 columnas × 4 filas frente a la cámara.
  const tile = (i: number) => new Vector3(NOTE.x + ((i % 3) - 1) * 0.42, NOTE.y + 0.42 - Math.floor(i / 3) * 0.26, NOTE.z + 0.1);
  return (
    <group>
      <group position={NOTE} scale={show}>
        {/* Tapa que se abre sobre el lomo */}
        <group position={[-0.25, 0, 0]} rotation={[0, -2.6 * open, 0]}>
          <mesh position={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.68, 0.025]} />
            <meshStandardMaterial color="#3B3027" roughness={0.8} />
          </mesh>
        </group>
        {/* Hojas que se levantan */}
        {[0, 1, 2, 3].map((k) => {
          const l = clamp01(d.lift * 1.4 - k * 0.12);
          return (
            <mesh key={k} position={[0.02 * k, 0.32 * l * (k + 1), -0.02 - 0.012 * k + 0.25 * l]} rotation={[-0.5 * l, 0.25 * l * (k - 1.5), 0]} castShadow>
              <planeGeometry args={[0.46, 0.64]} />
              <meshStandardMaterial map={messy[k]} color="#FFFFFF" roughness={0.9} side={2} transparent opacity={1 - d.assemble} />
            </mesh>
          );
        })}
        <mesh position={[0, 0, -0.045]}>
          <boxGeometry args={[0.5, 0.68, 0.03]} />
          <meshStandardMaterial color="#3B3027" roughness={0.8} transparent opacity={1 - d.assemble} />
        </mesh>
      </group>
      {/* Fragmentos de datos sueltos (y luego ordenados por el pulso) */}
      {records.map((_, i) => {
        const a = (i / records.length) * Math.PI * 2;
        const r = 0.65 + (i % 3) * 0.22;
        const loose = new Vector3(NOTE.x + Math.cos(a) * r * 1.1, NOTE.y + Math.sin(a * 1.3) * 0.55 + 0.1 * Math.sin(t + i), NOTE.z - 0.3 + Math.sin(a) * r * 0.7);
        const born = clamp01(d.scatter * 1.3 - i * 0.03);
        const pos = NOTE.clone().lerp(loose, smooth(born)).lerp(tile(i), smooth(d.assemble));
        const k = born * (1 - d.notebookOut);
        if (k <= 0.01) return null;
        return (
          <mesh key={i} position={pos} rotation={[0.25 * Math.sin(t * 0.7 + i) * (1 - d.assemble), (a - Math.PI / 2) * 0.35 * (1 - d.assemble), 0.2 * Math.sin(i) * (1 - d.assemble)]} scale={[k, k, k]}>
            <planeGeometry args={[0.38, 0.21]} />
            <meshBasicMaterial map={d.assemble > 0.5 ? tidy[i] : messy[i]} color={d.assemble > 0.5 ? hdr("#FFFFFF", 1.3) : hdr("#FFFFFF", 0.95)} side={2} toneMapped={false} />
          </mesh>
        );
      })}
      {/* Otras fuentes separadas: hoja de cálculo y teléfono con mensajes */}
      {[
        { tex: sheet, p: new Vector3(-1.05, 1.55, 2.2), r: 0.35, s: [0.62, 0.42] as [number, number] },
        { tex: chat, p: new Vector3(1.05, 1.45, 2.3), r: -0.35, s: [0.32, 0.6] as [number, number] },
      ].map((o, i) => {
        const k = clamp01(d.scatter * 1.5 - 0.2) * (1 - d.notebookOut);
        if (k <= 0.01) return null;
        const pos = o.p.clone().lerp(tile(i === 0 ? 1 : 10), smooth(d.assemble));
        return (
          <mesh key={i} position={pos} rotation={[0, o.r * (1 - d.assemble), 0.05 * Math.sin(t + i) * (1 - d.assemble)]} scale={[k * (1 - 0.4 * d.assemble), k * (1 - 0.4 * d.assemble), 1]}>
            <planeGeometry args={o.s} />
            <meshBasicMaterial map={o.tex} color={hdr("#FFFFFF", 1.1)} side={2} toneMapped={false} transparent opacity={1 - 0.8 * d.assemble} />
          </mesh>
        );
      })}
      {/* Luz cálida y tenue de los procesos manuales */}
      <pointLight position={[NOTE.x + 0.3, NOTE.y + 0.8, NOTE.z + 0.8]} color={palette.calido} intensity={1.6 * d.warm} distance={3.5} decay={1.6} />
    </group>
  );
}

/** El pulso azul: una onda que atraviesa el escenario y desencadena la conexión. */
export function Pulse({ d }: { d: Drivers }) {
  if (d.pulse <= 0 || d.pulse >= 1) return null;
  const r = 0.2 + d.pulse * 7;
  return (
    <group position={NOTE}>
      <mesh scale={r}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshBasicMaterial color={hdr(palette.azul, 1.6 * (1 - d.pulse))} transparent opacity={0.22 * (1 - d.pulse)} blending={AdditiveBlending} depthWrite={false} side={2} toneMapped={false} />
      </mesh>
      <mesh position={[0, -NOTE.y + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={r}>
        <ringGeometry args={[0.95, 1, 96]} />
        <meshBasicMaterial color={hdr(palette.cian, 3 * (1 - d.pulse))} transparent opacity={1 - d.pulse} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── Escena 5: cliente → tienda digital → pedido → inventario → panel ──────────

export const STATIONS = [
  new Vector3(0.95, 0, 6.3),
  new Vector3(0.45, 0, 5.15),
  new Vector3(0.0, 0, 4.0),
  new Vector3(-0.4, 0, 2.85),
  new Vector3(0.0, 0, 1.6),
];

export function Flow({ d, frame }: { d: Drivers; frame: number }) {
  const path = useMemo(() => {
    const c = new CurvePath<Vector3>();
    for (let i = 0; i < STATIONS.length - 1; i++) c.add(new LineCurve3(STATIONS[i].clone().setY(0.08), STATIONS[i + 1].clone().setY(0.08)));
    return { curve: c, geo: new TubeGeometry(c as unknown as LineCurve3, 120, 0.018, 6, false) };
  }, []);
  const dash = useMemo(() => dashTexture(), []);
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(0.26, 0.2, 0.18)), []);
  if (d.flowShow <= 0.01) return null;
  const t = frame / 30;
  const f = Math.min(d.flow, 4.6);
  path.geo.setDrawRange(0, Math.floor(Math.min(1, f / 4) * 120) * 36);
  const lit = (i: number) => clamp01((d.flow - i + 0.3) * 3);
  // Paquete: nace en el carrito (estación 2) y viaja a inventario y panel.
  const seg = Math.min(3.999, Math.max(2, f));
  const i0 = Math.floor(seg);
  const local = smooth(seg - i0);
  const pkg = STATIONS[i0].clone().lerp(STATIONS[Math.min(4, i0 + 1)], local).setY(0.35 + 0.15 * Math.sin(local * Math.PI));
  const pkgOn = d.flow > 2 && d.flow < 4.2;
  const stockGone = d.flow > 3.15;
  const k = d.flowShow;
  return (
    <group scale={[1, k, 1]}>
      <mesh geometry={path.geo}>
        <meshBasicMaterial color={hdr(palette.cian, 2.2)} toneMapped={false} />
      </mesh>
      {STATIONS.map((p, i) => (
        <mesh key={i} position={[p.x, 0.07, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.24, 0.3, 48]} />
          <meshBasicMaterial color={hdr(i < 4 ? palette.azul : palette.cian, 0.6 + 2.6 * lit(i))} transparent opacity={0.5 + 0.5 * lit(i)} toneMapped={false} />
        </mesh>
      ))}
      {/* 1 · Cliente */}
      <Person x={STATIONS[0].x} z={STATIONS[0].z} rot={-2.6} shirt="#2B3A57" arm={0.9} nod={0.35} />
      {/* 2 · Tienda digital: teléfono flotante con la tienda */}
      <group position={[STATIONS[1].x, 0.75 + 0.03 * Math.sin(t * 2), STATIONS[1].z]} rotation={[-0.2, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.5, 0.025]} />
          <meshStandardMaterial color="#0C0F15" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.23, 0.46]} />
          <meshBasicMaterial map={dash} color={hdr("#FFFFFF", 0.8 + 0.7 * lit(1))} toneMapped={false} />
        </mesh>
      </group>
      {/* 3 · Pedido: carrito que genera el paquete */}
      <group position={[STATIONS[2].x, 0, STATIONS[2].z]} rotation={[0, 0.4, 0]}>
        <lineSegments geometry={edges} position={[0, 0.3, 0]}>
          <lineBasicMaterial color={hdr(palette.cian, 1.2 + 2 * lit(2))} toneMapped={false} />
        </lineSegments>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 0.17, 0.07]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.03, 0.008, 8, 16]} />
            <meshBasicMaterial color={hdr(palette.cian, 1.5)} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* 4 · Inventario: estante; una caja sale al confirmarse el pedido */}
      <group position={[STATIONS[3].x, 0, STATIONS[3].z]} rotation={[0, 0.3, 0]}>
        {[0.25, 0.55].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[0.6, 0.02, 0.22]} />
            <meshStandardMaterial color="#3A3F4A" />
          </mesh>
        ))}
        {Array.from({ length: 6 }, (_, b) => {
          const gone = stockGone && b === 5;
          return (
            <mesh key={b} position={[-0.2 + (b % 3) * 0.2, 0.33 + Math.floor(b / 3) * 0.3 + (gone ? 0.4 * clamp01((d.flow - 3.15) * 3) : 0), 0]} scale={gone ? 1 - clamp01((d.flow - 3.15) * 2) : 1}>
              <boxGeometry args={[0.14, 0.12, 0.14]} />
              <meshStandardMaterial color={b === 5 ? "#C79A4B" : "#C7B79E"} emissive={b === 5 ? hdr(palette.azul, lit(3) * 0.6) : undefined} roughness={0.7} />
            </mesh>
          );
        })}
      </group>
      {/* 5 · Panel administrativo frente a la bodega */}
      <group position={[STATIONS[4].x, 1.2, STATIONS[4].z]} rotation={[-0.12, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.9, 0.55, 0.02]} />
          <meshStandardMaterial color="#0C0F15" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.86, 0.51]} />
          <meshBasicMaterial map={dash} color={hdr("#FFFFFF", 0.7 + 0.9 * lit(4))} toneMapped={false} />
        </mesh>
      </group>
      {pkgOn && (
        <mesh position={pkg} rotation={[t, t * 1.3, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshBasicMaterial color={hdr(palette.cian, 4)} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

// ── Texturas ──────────────────────────────────────────────────────────────────

function sheetTexture() {
  const c = document.createElement("canvas");
  c.width = 420;
  c.height = 280;
  const g = c.getContext("2d")!;
  g.fillStyle = "#F7F7F5";
  g.fillRect(0, 0, 420, 280);
  g.fillStyle = "#DCDDD8";
  g.fillRect(0, 0, 420, 36);
  g.fillStyle = "#2A2F38";
  g.font = "700 20px Inter, sans-serif";
  g.fillText("inventario.xlsx", 14, 25);
  g.strokeStyle = "#CFD0CC";
  for (let y = 36; y < 280; y += 40) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(420, y);
    g.stroke();
  }
  [140, 280].forEach((x) => {
    g.beginPath();
    g.moveTo(x, 36);
    g.lineTo(x, 280);
    g.stroke();
  });
  const rows = [
    ["Harina", "18", "¿?"],
    ["Café", "—", "24"],
    ["Queso", "6", ""],
    ["Arroz", "¿?", "12"],
  ];
  g.font = "500 20px Inter, sans-serif";
  rows.forEach((r, i) => r.forEach((v, k) => g.fillText(v, 14 + k * 140, 64 + i * 40)));
  return new CanvasTexture(c);
}

function chatTexture() {
  const c = document.createElement("canvas");
  c.width = 200;
  c.height = 380;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0C0F15";
  g.fillRect(0, 0, 200, 380);
  const msgs = ["¿Precio?", "¿Hay queso?", "¿Delivery?", "¿Pagaste?", "¿Abren hoy?"];
  msgs.forEach((m, i) => {
    g.fillStyle = i % 2 ? "#2BB673" : "#F5F5F3";
    g.fillRect(i % 2 ? 60 : 12, 30 + i * 66, 128, 46);
    g.fillStyle = i % 2 ? "#FFFFFF" : "#0D1018";
    g.font = "600 20px Inter, sans-serif";
    g.fillText(m, (i % 2 ? 60 : 12) + 12, 60 + i * 66);
  });
  return new CanvasTexture(c);
}

function dashTexture() {
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


