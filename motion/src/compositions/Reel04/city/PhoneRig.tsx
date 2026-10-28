import { useMemo } from "react";
import { AdditiveBlending, CanvasTexture, Color, Euler, Quaternion, Vector3 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { palette } from "../../Reel02/city/materials";
import { PHONE } from "../camera";
import type { Drivers } from "../drivers";

/**
 * Escena 1: smartphone suspendido. Un dedo toca el ícono de "Tiendas", el vidrio emite una onda
 * azul y el teléfono se separa en capas (vidrio, pantalla, sensor táctil, placa y batería)
 * mientras la cámara las atraviesa: así se explica que detrás de un toque hay datos que viajan.
 */
const W = 0.72;
const H = 1.5;
const D = 0.075;
/** Punto del toque en coordenadas locales de la pantalla. */
export const TAP = { x: 0.12, y: 0.22 };
const hdr = (hex: string, k: number) => new Color(hex).multiplyScalar(k);

export function PhoneRig({ d, frame }: { d: Drivers; frame: number }) {
  const body = useMemo(() => new RoundedBoxGeometry(W, H, D, 6, 0.09), []);
  const screen = useMemo(() => homeTexture(), []);
  const board = useMemo(() => boardTexture(), []);
  const grid = useMemo(() => gridTexture(), []);
  if (d.phone <= 0) return null;
  const e = d.explode;
  const t = frame / 30;
  const ring = d.ripple;
  const layers = [
    // [desplazamiento en z, nombre]
    { z: 0, kind: "glass" },
    { z: -0.38, kind: "display" },
    { z: -0.76, kind: "touch" },
    { z: -1.18, kind: "board" },
    { z: -1.6, kind: "battery" },
  ] as const;
  return (
    <group position={[PHONE.x, PHONE.y, PHONE.z]} rotation={[0, -0.12 * (1 - e), 0.04 * (1 - e)]}>
      {/* Carcasa: se desvanece cuando el teléfono se abre en capas */}
      <mesh geometry={body} position={[0, 0, -D / 2 - 0.004 - 1.8 * e]} castShadow>
        <meshStandardMaterial color="#141820" metalness={0.85} roughness={0.28} transparent opacity={1 - e} />
      </mesh>
      {layers.map((l, i) => {
        const z = 0.003 + l.z * e;
        const spread = 1 + 0.06 * i * e;
        const show = l.kind === "glass" || l.kind === "display" ? 1 : e;
        if (show <= 0.01) return null;
        return (
          <group key={l.kind} position={[0, 0, z]} scale={[spread, spread, 1]}>
            {l.kind === "glass" && (
              <mesh>
                <planeGeometry args={[W - 0.02, H - 0.02]} />
                <meshStandardMaterial color="#AFC4EE" metalness={0.9} roughness={0.05} transparent opacity={0.1 + 0.08 * e} depthWrite={false} />
              </mesh>
            )}
            {l.kind === "display" && (
              <mesh position={[0, 0, -0.002]}>
                <planeGeometry args={[W - 0.06, H - 0.08]} />
                <meshBasicMaterial map={screen} color={hdr("#FFFFFF", 1.05 + 0.6 * Math.max(0, 1 - Math.abs(ring - 0.15) * 4))} toneMapped={false} />
              </mesh>
            )}
            {l.kind === "touch" && (
              <mesh>
                <planeGeometry args={[W - 0.06, H - 0.08]} />
                <meshBasicMaterial map={grid} color={hdr(palette.cian, 1.6 * e)} transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
              </mesh>
            )}
            {l.kind === "board" && (
              <group>
                <mesh>
                  <planeGeometry args={[W - 0.1, H - 0.2]} />
                  <meshBasicMaterial map={board} color={hdr("#FFFFFF", 1.2)} toneMapped={false} transparent opacity={e} />
                </mesh>
                {[
                  [0.0, 0.25, 0.18, 0.18],
                  [-0.16, -0.1, 0.1, 0.14],
                  [0.15, -0.25, 0.12, 0.08],
                ].map(([x, y, w, h], k) => (
                  <mesh key={k} position={[x, y, 0.02]}>
                    <boxGeometry args={[w, h, 0.03]} />
                    <meshStandardMaterial color="#1B2130" metalness={0.6} roughness={0.35} transparent opacity={e} />
                  </mesh>
                ))}
                {/* Datos que recorren las pistas de la placa */}
                {Array.from({ length: 8 }, (_, k) => {
                  const p = (t * 0.8 + k / 8) % 1;
                  const vertical = k % 2 === 0;
                  const x = vertical ? -0.25 + (k % 4) * 0.16 : -0.3 + p * 0.6;
                  const y = vertical ? -0.6 + p * 1.2 : -0.5 + (k % 4) * 0.3;
                  return (
                    <mesh key={k} position={[x, y, 0.025]}>
                      <sphereGeometry args={[0.012, 8, 6]} />
                      <meshBasicMaterial color={hdr(palette.cian, 5 * e)} toneMapped={false} />
                    </mesh>
                  );
                })}
              </group>
            )}
            {l.kind === "battery" && (
              <mesh>
                <boxGeometry args={[W - 0.2, H * 0.55, 0.04]} />
                <meshStandardMaterial color="#202634" metalness={0.5} roughness={0.5} transparent opacity={e} />
              </mesh>
            )}
          </group>
        );
      })}
      {/* Conexiones verticales entre capas: el toque viaja hacia dentro */}
      {e > 0.05 &&
        [-0.2, 0.0, 0.2].map((x, k) => {
          const p = ((t * 0.9 + k * 0.33) % 1) * e;
          return (
            <group key={x}>
              <mesh position={[x + TAP.x * 0.3, TAP.y * 0.4, -0.8 * e]}>
                <boxGeometry args={[0.004, 0.004, 1.6 * e]} />
                <meshBasicMaterial color={hdr(palette.azul, 2.2)} toneMapped={false} />
              </mesh>
              <mesh position={[x + TAP.x * 0.3, TAP.y * 0.4, -1.6 * p]}>
                <sphereGeometry args={[0.018, 8, 6]} />
                <meshBasicMaterial color={hdr(palette.cian, 5)} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      {/* Onda azul en el vidrio */}
      {ring > 0 && ring < 1 && (
        <mesh position={[TAP.x, TAP.y, 0.01]} scale={0.05 + ring * 1.4}>
          <ringGeometry args={[0.85, 1, 64]} />
          <meshBasicMaterial color={hdr(palette.azul, 3 * (1 - ring))} transparent opacity={1 - ring} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      <Finger frame={frame} />
    </group>
  );
}

/** Dedo estilizado (sin detalles anatómicos): entra, toca y se retira. */
function Finger({ frame }: { frame: number }) {
  const t = frame / 30;
  // 0 → 1.2 s: entra; 1.2 s: contacto; 1.2 → 1.9 s: se retira.
  const come = Math.min(1, t / 1.2);
  const ease = 1 - (1 - come) ** 3;
  const back = Math.max(0, Math.min(1, (t - 1.25) / 0.65));
  const k = ease * (1 - back * back);
  if (t > 2.0) return null;
  const tip = new Vector3(TAP.x, TAP.y, 0.03);
  const from = new Vector3(0.75, -0.95, 0.55);
  const pos = from.clone().lerp(tip, k);
  const press = t > 1.15 && t < 1.32 ? 0.008 : 0;
  // Orientado desde abajo a la derecha hacia la pantalla.
  const q = new Quaternion().setFromEuler(new Euler(-0.95, 0.3, 0.55));
  return (
    <group position={[pos.x, pos.y, pos.z - press]} quaternion={q}>
      <mesh position={[0, -0.28, 0]} castShadow>
        <capsuleGeometry args={[0.072, 0.46, 8, 20]} />
        <meshStandardMaterial color="#8A6B57" roughness={0.62} />
      </mesh>
      <mesh position={[0, -0.03, 0.045]} rotation={[0.25, 0, 0]} scale={[1, 1.35, 0.35]}>
        <sphereGeometry args={[0.05, 20, 14]} />
        <meshStandardMaterial color="#B49582" roughness={0.35} />
      </mesh>
    </group>
  );
}

// ── Texturas dibujadas una vez ────────────────────────────────────────────────

function homeTexture() {
  const c = document.createElement("canvas");
  c.width = 360;
  c.height = 750;
  const g = c.getContext("2d")!;
  const bg = g.createLinearGradient(0, 0, 0, 750);
  bg.addColorStop(0, "#0E1730");
  bg.addColorStop(1, "#05070C");
  g.fillStyle = bg;
  g.fillRect(0, 0, 360, 750);
  g.fillStyle = "#E8ECF4";
  g.font = "600 20px Inter, sans-serif";
  g.fillText("9:41", 26, 40);
  g.font = "300 72px Inter, sans-serif";
  g.fillText("9:41", 108, 150);
  const target = { x: 245, y: 259 };
  for (let r = 0; r < 4; r++)
    for (let k = 0; k < 4; k++) {
      const x = 32 + k * 80;
      const y = 214 + r * 92;
      const isTarget = Math.abs(x + 30 - target.x) < 40 && Math.abs(y + 30 - target.y) < 40;
      g.fillStyle = isTarget ? "#2563EB" : ["#1D2638", "#243149", "#1A2131"][(r + k) % 3];
      roundRect(g, x, y, 60, 60, 16);
      g.fill();
      if (isTarget) {
        g.strokeStyle = "#FFFFFF";
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(x + 15, y + 26);
        g.lineTo(x + 20, y + 16);
        g.lineTo(x + 40, y + 16);
        g.lineTo(x + 45, y + 26);
        g.closePath();
        g.stroke();
        g.strokeRect(x + 18, y + 28, 24, 18);
        g.fillStyle = "#FFFFFF";
        g.font = "600 13px Inter, sans-serif";
        g.fillText("Tiendas", x + 6, y + 78);
      }
    }
  g.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(g, 20, 640, 320, 84, 28);
  g.fill();
  return new CanvasTexture(c);
}

function boardTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0F141D";
  g.fillRect(0, 0, 256, 512);
  g.strokeStyle = "rgba(56,221,245,0.55)";
  g.lineWidth = 2;
  for (let i = 0; i < 18; i++) {
    const x = 20 + ((i * 53) % 216);
    const y = 30 + ((i * 97) % 452);
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x, y + 40 + (i % 3) * 30);
    g.lineTo(x + 30 + (i % 4) * 20, y + 40 + (i % 3) * 30);
    g.stroke();
    g.fillStyle = "rgba(127,166,255,0.8)";
    g.fillRect(x - 3, y - 3, 6, 6);
  }
  return new CanvasTexture(c);
}

function gridTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 1;
  for (let x = 8; x < 128; x += 16) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 256);
    g.stroke();
  }
  for (let y = 8; y < 256; y += 16) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(128, y);
    g.stroke();
  }
  return new CanvasTexture(c);
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
