import { PerspectiveCamera, Vector3 } from "three";
import { s, scenes } from "./timeline";

/**
 * Una sola cámara para todo el reel: un recorrido continuo por la ciudad (sin cortes).
 * Cada clave fija posición, punto de mira y apertura; entre claves se interpola con una
 * curva Catmull-Rom (trayectoria suave) y un easing por tramo (aceleración y frenado).
 */
type V3 = [number, number, number];
type Key = { f: number; pos: V3; at: V3; fov: number; ease?: "inOut" | "out" | "in" | "linear" };

const { ciudad, problema, compra, gestion, automatizacion, comunidad, cierre } = scenes;

export const keys: Key[] = [
  // 1 · Sobrevuelo nocturno y descenso hacia el comercio.
  { f: ciudad.from, pos: [30, 34, 36], at: [0, 0, 0], fov: 34 },
  { f: s(3.6), pos: [15, 15, 19], at: [0, 0.6, 0.6], fov: 32 },
  { f: s(5.9), pos: [3.0, 1.9, 7.0], at: [0, 0.95, 0.6], fov: 34 },
  // Pasamos bajo el toldo, frente al vidrio.
  { f: s(6.9), pos: [0.78, 0.86, 1.75], at: [-0.1, 0.72, -0.2], fov: 44 },
  // 2 · Atravesamos el vidrio: interior del comercio.
  { f: problema.from + s(0.4), pos: [0.77, 0.95, 1.12], at: [-0.12, 0.66, -0.45], fov: 50, ease: "inOut" },
  { f: s(9.6), pos: [0.76, 1.1, 0.8], at: [-0.14, 0.64, -0.45], fov: 50 },
  { f: s(12.6), pos: [0.64, 1.05, 0.68], at: [-0.15, 0.64, -0.45], fov: 50, ease: "linear" },
  // 3 · Congelado y salida: la línea azul recorre la ciudad.
  { f: s(13.5), pos: [0.66, 1.06, 0.7], at: [-0.14, 0.65, -0.44], fov: 50 },
  { f: s(15.2), pos: [2.6, 2.6, 6.2], at: [0, 0.6, 1.2], fov: 38 },
  { f: s(18.2), pos: [16, 19, 21], at: [1, 0, 2], fov: 36 },
  // 4 · Volvemos al comercio, ya digital.
  { f: compra.from, pos: [6.2, 4.6, 9.4], at: [0, 1.0, 0.8], fov: 34 },
  { f: s(25), pos: [3.4, 2.0, 6.6], at: [0, 1.15, 0.6], fov: 34 },
  { f: s(29.4), pos: [-2.6, 2.3, 6.4], at: [0, 1.2, 0.5], fov: 34 },
  // 5 · Subimos al edificio, que se convierte en panel de gestión.
  { f: gestion.from + s(0.5), pos: [-3.2, 3.5, 5.4], at: [0, 2.05, 0], fov: 38 },
  { f: s(36), pos: [3.4, 4.0, 5.6], at: [0, 2.15, 0], fov: 38 },
  // 6 · La ciudad se vuelve red.
  { f: automatizacion.from + s(1.2), pos: [11, 13, 15], at: [0, 0, 1], fov: 34 },
  { f: s(44), pos: [17, 16, 9], at: [0, 0, 0], fov: 34 },
  // 7 · Gran plano: la comunidad conectada.
  { f: comunidad.from + s(2.5), pos: [34, 38, 30], at: [0, 0, 0], fov: 34 },
  { f: s(53.6), pos: [40, 52, 18], at: [0, 0, 0], fov: 34 },
  // 8 · La cámara se eleva; la ciudad desaparece.
  { f: cierre.from + s(2.2), pos: [6, 92, 6], at: [0, 0, 0], fov: 34 },
  { f: cierre.to, pos: [2, 110, 2], at: [0, 0, 0], fov: 34 },
];

const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  out: (t: number) => 1 - (1 - t) ** 3,
  in: (t: number) => t * t * t,
  linear: (t: number) => t,
};

function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

const lerpV = (k: (key: Key) => V3, i: number, t: number): V3 => {
  const a = keys[Math.max(0, i - 1)];
  const b = keys[i];
  const c = keys[Math.min(keys.length - 1, i + 1)];
  const d = keys[Math.min(keys.length - 1, i + 2)];
  return [0, 1, 2].map((n) => catmull(k(a)[n], k(b)[n], k(c)[n], k(d)[n], t)) as V3;
};

export type CameraState = { pos: V3; at: V3; fov: number };

export function cameraAt(frame: number): CameraState {
  if (frame <= keys[0].f) return keys[0];
  const last = keys[keys.length - 1];
  if (frame >= last.f) return last;
  let i = 0;
  while (keys[i + 1].f <= frame) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = ease[b.ease ?? "inOut"]((frame - a.f) / (b.f - a.f));
  return { pos: lerpV((k) => k.pos, i, t), at: lerpV((k) => k.at, i, t), fov: a.fov + (b.fov - a.fov) * t };
}

export const VIEW = { width: 1080, height: 1920 };

/** Cámara de three.js con el estado del frame (la misma que usa el lienzo 3D). */
export function makeCamera(frame: number) {
  const c = cameraAt(frame);
  const cam = new PerspectiveCamera(c.fov, VIEW.width / VIEW.height, 0.05, 400);
  cam.position.set(...c.pos);
  cam.lookAt(...c.at);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  return cam;
}

/** Proyecta un punto del mundo a píxeles del video (para anclar interfaces a edificios). */
export function project(frame: number, p: V3) {
  const cam = makeCamera(frame);
  const v = new Vector3(...p).project(cam);
  const behind = v.z > 1;
  const depth = cam.position.distanceTo(new Vector3(...p));
  return { x: ((v.x + 1) / 2) * VIEW.width, y: ((1 - v.y) / 2) * VIEW.height, behind, depth };
}
