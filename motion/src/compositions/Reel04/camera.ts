import { cameraPath, type CameraKey } from "../../lib/camera3d";
import { s } from "./timeline";

/**
 * Una sola cámara: muy cerca del teléfono → atraviesa sus capas → la bodega en el vacío →
 * sube y revela la ciudad → entra a los negocios → se detiene (pulso) → sigue el pedido →
 * retrocede y orbita la ciudad conectada → se eleva para el cierre.
 */
export const PHONE = { x: 0, y: 1.3, z: 8.6 };

const keys: CameraKey[] = [
  // 1 · Corte de la pantalla en primerísimo plano (estilo explicativo): el dedo toca, el campo se
  //     concentra y la cámara sigue el pulso de datos hacia la derecha; luego gira hacia la bodega.
  { f: 0, pos: [-0.02, 1.5, 10.75], at: [-0.04, 1.36, 9.0], fov: 34 },
  { f: s(1.4), pos: [-0.06, 1.46, 10.5], at: [-0.08, 1.33, 9.0], fov: 34 },
  { f: s(2.6), pos: [0.9, 1.44, 10.55], at: [0.85, 1.3, 9.0], fov: 34 },
  { f: s(3.45), pos: [1.5, 1.6, 7.9], at: [0.4, 0.95, 2.0], fov: 42 },
  // 2 · La bodega en el vacío; el pedido viaja a su puerta
  { f: s(4.6), pos: [1.5, 1.75, 5.6], at: [0.65, 0.9, 0.3], fov: 40 },
  { f: s(9.6), pos: [-0.4, 1.6, 5.0], at: [0.7, 0.9, 0.3], fov: 40 },
  { f: s(10.5), pos: [0.35, 1.15, 3.1], at: [0, 0.7, 0.6], fov: 42 },
  { f: s(11.0), pos: [0.2, 1.0, 2.2], at: [0, 0.75, 0.2], fov: 44 },
  // 3 · Sale, se eleva: la ciudad se construye alrededor
  { f: s(12.2), pos: [0.6, 2.6, 6.2], at: [0, 0.9, 0.4], fov: 40 },
  { f: s(15.0), pos: [8.5, 8.5, 14], at: [-1.5, 0.6, 1.5], fov: 36 },
  { f: s(17.8), pos: [-6.5, 8.2, 14], at: [-1.6, 0.6, 1.5], fov: 36 },
  // 4 · Dentro de la arepera; luego la libreta frente a la bodega
  { f: s(19.0), pos: [-3.55, 1.05, 2.8], at: [-4.1, 0.65, 0.1], fov: 44 },
  { f: s(20.5), pos: [-3.4, 0.98, 2.45], at: [-4.1, 0.62, 0.0], fov: 44 },
  { f: s(21.1), pos: [-3.0, 1.35, 4.0], at: [-1.8, 1.0, 2.4], fov: 42 },
  { f: s(22.2), pos: [-1.2, 2.0, 6.5], at: [0, 1.3, 2.6], fov: 40 },
  { f: s(23.6), pos: [-0.6, 1.9, 6.3], at: [0, 1.3, 2.6], fov: 40 },
  // 5 · La cámara se detiene (pulso); el pedido recorre el flujo hasta el panel
  { f: s(25.4), pos: [0, 1.95, 6.4], at: [0, 1.35, 2.7], fov: 40 },
  { f: s(26.6), pos: [2.4, 3.9, 8.8], at: [0, 0.7, 3.0], fov: 38 },
  { f: s(30.2), pos: [1.6, 3.5, 8.0], at: [0, 0.7, 2.9], fov: 38 },
  { f: s(33.2), pos: [0.3, 2.3, 5.4], at: [0, 1.7, 1.2], fov: 38 },
  // 6 · Atraviesa el panel y retrocede: la ciudad conectada (órbita suave)
  { f: s(35.0), pos: [0, 6.5, 14], at: [0, 0.4, 1], fov: 38 },
  { f: s(38.0), pos: [14, 15, 18], at: [0, 0, 0], fov: 36 },
  { f: s(41.2), pos: [21, 21, 4], at: [0, 0, 0], fov: 36 },
  // 7 · Se eleva sobre la ciudad
  { f: s(43.4), pos: [3, 62, 6], at: [0, 0, 0], fov: 34 },
  { f: s(47.2), pos: [1.5, 78, 3], at: [0, 0, 0], fov: 34 },
];

export const { cameraAt, makeCamera, project } = cameraPath(keys);
