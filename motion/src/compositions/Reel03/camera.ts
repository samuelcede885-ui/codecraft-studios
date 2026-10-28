import { cameraPath, type CameraKey } from "../../lib/camera3d";
import { s, scenes } from "./timeline";

/**
 * Recorrido de cámara del reel 03 (sin cortes). Las dos tiendas están en la manzana central,
 * con la fachada hacia +z; la izquierda (x < 0) es SIN Fary Labs y la derecha, CON Fary Labs.
 */
const { presentacion, problema, transformacion, administracion, diferencia, cierre } = scenes;

const keys: CameraKey[] = [
  // 1 · Desde arriba: la línea de luz divide la calle; descendemos y giramos un poco.
  { f: presentacion.from, pos: [0.4, 26, 10], at: [0, 0, 0.6], fov: 34 },
  { f: s(2.6), pos: [5.5, 7.8, 12.5], at: [0, 1.3, 0.4], fov: 34 },
  { f: s(5.4), pos: [-1.6, 3.0, 11.2], at: [0, 2.2, 0.4], fov: 36 },
  // 2 · Pantalla dividida: las dos fachadas de frente, abajo; arriba, lo que pasa en cada una.
  { f: problema.from + s(0.8), pos: [0, 2.7, 10.6], at: [0, 2.45, 0.4], fov: 36 },
  { f: problema.to - s(0.2), pos: [0, 2.6, 9.6], at: [0, 2.4, 0.4], fov: 36, ease: "linear" },
  // 3 · Nos acercamos a la tienda con Fary Labs.
  { f: transformacion.from + s(1.4), pos: [2.6, 2.5, 7.0], at: [0.75, 2.05, 0.4], fov: 36 },
  { f: transformacion.to - s(0.3), pos: [3.3, 2.7, 6.4], at: [0.6, 2.1, 0.3], fov: 36 },
  // 4 · Corte arquitectónico: se levantan los pisos y vemos los dos interiores desde arriba.
  { f: administracion.from + s(1.0), pos: [0.2, 7.6, 4.0], at: [0, 0.55, -0.05], fov: 36 },
  { f: administracion.to - s(0.2), pos: [0.8, 7.8, 3.9], at: [0, 0.6, -0.05], fov: 36 },
  // 5 · Nos alejamos: los dos negocios, cada uno con su forma de trabajar.
  { f: diferencia.from + s(1.2), pos: [0, 3.9, 12.6], at: [0, 2.3, 0.3], fov: 36 },
  { f: diferencia.to - s(0.2), pos: [-1.4, 4.5, 13.4], at: [0, 2.35, 0.3], fov: 36 },
  // 6 · La cámara se eleva: la red sale de la tienda digital y la ciudad se apaga.
  { f: cierre.from + s(2.8), pos: [2.4, 52, 9], at: [0.8, 0, 0.6], fov: 34 },
  { f: cierre.to, pos: [1.2, 72, 4], at: [0.8, 0, 0.6], fov: 34 },
];

export const { cameraAt, makeCamera, project } = cameraPath(keys);
