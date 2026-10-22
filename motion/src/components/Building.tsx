import { random } from "remotion";
import { fary } from "../theme/fary";
import { iso, pts, type Point } from "../lib/iso";
import { useActivation } from "../lib/motion";

export type BuildingProps = {
  id: string;
  /** Esquina trasera (tiles), huella (w × d) y altura en pisos de Z_UNIT. */
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  /** Estado: encendido (sistema funcionando) o apagado. */
  active?: boolean;
  /** Frame en el que cambió de estado (0 = ya estaba así desde el inicio). */
  since?: number;
  /** Proporción de ventanas encendidas en reposo (vida nocturna). 0 = totalmente apagado. */
  idle?: number;
  /** Pantalla en la fachada izquierda (se enciende en verde cuando el edificio está activo). */
  screen?: boolean;
  floor?: number;
};

type Face = { o: [number, number]; u: [number, number]; len: number };

/**
 * Edificio isométrico por capas: caras, ventanas, pantalla, glow y borde de azotea.
 * Al activarse se encienden las ventanas (en orden determinista), sube el brillo de las caras,
 * se ilumina la pantalla y aparece un halo verde sutil en el suelo.
 */
export function Building({ id, x, y, w, d, h, active = false, since = 0, idle = 0.12, screen = false, floor = 0.5 }: BuildingProps) {
  const a = useActivation(active, since, 30);
  const power = idle + (1 - idle) * a;

  const P = (px: number, py: number, pz: number) => iso(px, py, pz);
  const top = pts([P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h)]);
  const right = pts([P(x + w, y, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x + w, y, h)]);
  const left = pts([P(x, y + d, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x, y + d, h)]);

  // Caras con ventanas: derecha (x = x + w, avanza en y) e izquierda (y = y + d, avanza en x).
  const faces: Face[] = [
    { o: [x + w, y], u: [0, 1], len: d },
    { o: [x, y + d], u: [1, 0], len: w },
  ];
  const quad = (f: Face, u0: number, u1: number, v0: number, v1: number) => {
    const at = (u: number, v: number): Point => P(f.o[0] + f.u[0] * u, f.o[1] + f.u[1] * u, v);
    return pts([at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]);
  };

  const floors = Math.max(1, Math.floor((h - 0.35) / floor));
  const windows: { points: string; lit: number }[] = [];
  faces.forEach((f, fi) => {
    const cols = Math.max(1, Math.round(f.len * 2.4));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < floors; r++) {
        // En la cara izquierda, la pantalla ocupa el centro: ahí no hay ventanas.
        if (screen && fi === 1 && c / cols > 0.12 && c / cols < 0.82 && r * floor > h * 0.28 && r * floor < h * 0.72) continue;
        const u0 = (c + 0.22) * (f.len / cols);
        const u1 = (c + 0.78) * (f.len / cols);
        const v0 = 0.32 + r * floor;
        const v1 = v0 + floor * 0.52;
        const seed = random(`${id}-${fi}-${c}-${r}`);
        // Cada ventana se enciende al superar su umbral: encendido escalonado y repetible.
        const lit = Math.min(1, Math.max(0, (power - seed * 0.92) / 0.08));
        windows.push({ points: quad(f, u0, u1, v0, v1), lit });
      }
    }
  });

  const panel = quad(faces[1], w * 0.16, w * 0.84, h * 0.3, h * 0.72);
  const bars = [0.62, 0.5, 0.38].map((v, i) => quad(faces[1], w * 0.24, w * (0.5 + i * 0.1), h * v, h * (v + 0.04)));
  const roof = P(x + w / 2, y + d / 2, 0);

  return (
    <g data-building={id}>
      {/* Halo verde en el suelo cuando el sistema está activo. */}
      <ellipse cx={roof.x} cy={roof.y + 20} rx={(w + d) * 110} ry={(w + d) * 55} fill="url(#fary-halo-accent)" opacity={a * 0.35} />
      <polygon points={right} fill={fary.world.faceRight} />
      <polygon points={left} fill={fary.world.faceLeft} />
      <polygon points={top} fill={fary.world.faceTop} />
      {/* Brillo general al encenderse. */}
      <g fill={fary.color.white} opacity={a * 0.035}>
        <polygon points={right} />
        <polygon points={left} />
      </g>
      {windows.map((win, i) => (
        <g key={i}>
          <polygon points={win.points} fill={fary.world.windowOff} />
          {win.lit > 0 && <polygon points={win.points} fill={fary.color.warm} opacity={win.lit * 0.75} />}
        </g>
      ))}
      {screen && (
        <g>
          <polygon points={panel} fill="#0A0B0A" stroke={fary.world.edge} strokeWidth={1.5} />
          <polygon points={panel} fill={fary.color.accent} opacity={a * 0.14} />
          <polygon points={panel} fill={fary.color.accent} opacity={a * 0.35} filter="url(#fary-glow)" />
          {bars.map((b, i) => (
            <polygon key={i} points={b} fill={fary.color.accent} opacity={a * (0.9 - i * 0.2)} />
          ))}
        </g>
      )}
      {/* Aristas: blancas tenues; verdes en la azotea cuando está activo. */}
      <g fill="none" strokeLinejoin="round">
        <polygon points={top} stroke={fary.world.edge} strokeWidth={1.5} />
        <polyline points={pts([P(x + w, y + d, 0), P(x + w, y + d, h)])} stroke={fary.world.edge} strokeWidth={1.5} />
        <polygon points={top} stroke={fary.color.accent} strokeWidth={2} opacity={a * 0.8} />
      </g>
    </g>
  );
}
