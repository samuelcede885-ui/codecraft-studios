import { PerspectiveCamera, Vector3 } from "three";

/**
 * Cámara 3D continua por claves: posición, punto de mira y apertura por frame, con trayectoria
 * Catmull-Rom (suave) y easing por tramo. `project()` lleva un punto del mundo a píxeles del
 * video, para anclar interfaces DOM a la escena con la misma cámara que dibuja el 3D.
 */
export type V3 = [number, number, number];
export type CameraKey = { f: number; pos: V3; at: V3; fov: number; ease?: "inOut" | "out" | "in" | "linear" };
export type CameraState = { pos: V3; at: V3; fov: number };

const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  out: (t: number) => 1 - (1 - t) ** 3,
  in: (t: number) => t * t * t,
  linear: (t: number) => t,
};

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

export function cameraPath(keys: CameraKey[], view = { width: 1080, height: 1920 }) {
  const lerpV = (k: (key: CameraKey) => V3, i: number, t: number): V3 => {
    const a = keys[Math.max(0, i - 1)];
    const b = keys[i];
    const c = keys[Math.min(keys.length - 1, i + 1)];
    const d = keys[Math.min(keys.length - 1, i + 2)];
    return [0, 1, 2].map((n) => catmull(k(a)[n], k(b)[n], k(c)[n], k(d)[n], t)) as V3;
  };

  function cameraAt(frame: number): CameraState {
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

  function makeCamera(frame: number) {
    const c = cameraAt(frame);
    const cam = new PerspectiveCamera(c.fov, view.width / view.height, 0.05, 400);
    cam.position.set(...c.pos);
    cam.lookAt(...c.at);
    cam.updateMatrixWorld();
    cam.updateProjectionMatrix();
    return cam;
  }

  function project(frame: number, p: V3) {
    const cam = makeCamera(frame);
    const v = new Vector3(...p).project(cam);
    return { x: ((v.x + 1) / 2) * view.width, y: ((1 - v.y) / 2) * view.height, behind: v.z > 1, depth: cam.position.distanceTo(new Vector3(...p)) };
  }

  return { cameraAt, makeCamera, project, view };
}
