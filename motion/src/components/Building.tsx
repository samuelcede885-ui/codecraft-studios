import { random } from "remotion";
import { fary } from "../theme/fary";
import { iso, pts, type Point } from "../lib/iso";
import { useActivation } from "../lib/motion";
import { mix } from "../lib/color";
import { useColorAt } from "../lib/focus";
import { facadeFor, real } from "../data/materials";

export type BuildingProps = {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  /** Estado del sistema: activo (encendido) o inactivo. */
  active?: boolean;
  /** Frame en el que cambió de estado (0 = desde el inicio). */
  since?: number;
  /** Alternativa a active/since: nivel de encendido 0–1 calculado por la escena. */
  level?: number;
  /** Ventanas encendidas en reposo (vida nocturna). */
  idle?: number;
  /** Pantalla en la fachada frontal (se ilumina en azul al activarse). */
  screen?: boolean;
  /** Material real cuando está en foco (ver data/materials.ts); por defecto, uno estable por id. */
  material?: string;
};

type Face = { o: [number, number]; u: [number, number]; len: number };

/**
 * Edificio por capas: caras, ventanas, pantalla, glow y azotea.
 * Activo: se enciende la pantalla, sube el brillo, las ventanas se iluminan en orden
 * determinista y aparece un halo azul sutil en el suelo.
 */
export function Building({ id, x, y, w, d, h, active = false, since = 0, level, idle = 0.1, screen = false, material }: BuildingProps) {
  const activation = useActivation(active, since, 30);
  const a = level ?? activation;
  const power = idle + (1 - idle) * a;
  // En foco, el edificio muestra su material real; fuera de foco, los grises de la marca.
  const c = useColorAt(x + w / 2, y + d / 2);
  const facade = facadeFor(id, material);
  const fill = { top: mix(fary.world.faceTop, facade.top, c), left: mix(fary.world.faceLeft, facade.left, c), right: mix(fary.world.faceRight, facade.right, c) };
  const lit = mix(fary.world.windowOn, real.window, c);
  const floor = 0.5;

  const P = iso;
  const top = pts([P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h)]);
  const right = pts([P(x + w, y, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x + w, y, h)]);
  const left = pts([P(x, y + d, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x, y + d, h)]);

  const faces: Face[] = [
    { o: [x + w, y], u: [0, 1], len: d },
    { o: [x, y + d], u: [1, 0], len: w },
  ];
  const quad = (f: Face, u0: number, u1: number, v0: number, v1: number) => {
    const at = (u: number, v: number): Point => P(f.o[0] + f.u[0] * u, f.o[1] + f.u[1] * u, v);
    return pts([at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]);
  };

  const floors = Math.max(1, Math.floor((h - 0.35) / floor));
  const windows: { points: string; lit: number; cool: boolean }[] = [];
  faces.forEach((f, fi) => {
    const cols = Math.max(1, Math.round(f.len * 2.4));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < floors; r++) {
        const v0 = 0.32 + r * floor;
        if (screen && fi === 1 && c / cols > 0.1 && c / cols < 0.86 && v0 > h * 0.26 && v0 < h * 0.74) continue;
        const u0 = (c + 0.22) * (f.len / cols);
        const u1 = (c + 0.78) * (f.len / cols);
        const seed = random(`${id}-${fi}-${c}-${r}`);
        const lit = Math.min(1, Math.max(0, (power - seed * 0.94) / 0.06));
        windows.push({ points: quad(f, u0, u1, v0, v0 + floor * 0.52), lit, cool: random(`${id}-c-${fi}-${c}-${r}`) > 0.78 });
      }
    }
  });

  const panel = quad(faces[1], w * 0.14, w * 0.86, h * 0.28, h * 0.74);
  const bars = [0.62, 0.52, 0.42].map((v, i) => quad(faces[1], w * 0.22, w * (0.48 + i * 0.12), h * v, h * (v + 0.045)));
  const center = P(x + w / 2, y + d / 2, 0);

  return (
    <g data-building={id}>
      <ellipse cx={center.x} cy={center.y + 18} rx={(w + d) * 115} ry={(w + d) * 58} fill="url(#halo-signal)" opacity={a * 0.3} />
      <polygon points={right} fill={fill.right} />
      <polygon points={left} fill={fill.left} />
      <polygon points={top} fill={fill.top} />
      <g fill={fary.color.blanco} opacity={a * 0.03}>
        <polygon points={right} />
        <polygon points={left} />
      </g>
      {windows.map((win, i) => (
        <g key={i}>
          <polygon points={win.points} fill={fary.world.windowOff} />
          {win.lit > 0 && <polygon points={win.points} fill={win.cool ? fary.world.windowOn : lit} opacity={win.lit * (win.cool ? 0.38 : 0.66 + 0.2 * c)} />}
        </g>
      ))}
      {screen && (
        <g>
          <polygon points={panel} fill="#0A0A0A" stroke={fary.world.edge} strokeWidth={1.5} />
          <polygon points={panel} fill={fary.color.signal} opacity={a * 0.13} />
          <polygon points={panel} fill={fary.color.signal} opacity={a * 0.3} filter="url(#glow)" />
          {bars.map((b, i) => (
            <polygon key={i} points={b} fill={fary.color.signal} opacity={a * (0.9 - i * 0.2)} />
          ))}
        </g>
      )}
      <g fill="none" strokeLinejoin="round">
        <polygon points={top} stroke={fary.world.edge} strokeWidth={1.5} />
        <polyline points={pts([P(x + w, y + d, 0), P(x + w, y + d, h)])} stroke={fary.world.edge} strokeWidth={1.5} />
        <polygon points={top} stroke={fary.color.signal} strokeWidth={2} opacity={a * 0.75} />
      </g>
    </g>
  );
}
