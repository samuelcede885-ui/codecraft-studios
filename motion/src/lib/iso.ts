/**
 * Proyección isométrica 2:1. Las coordenadas del mundo van en "tiles": x hacia abajo-derecha,
 * y hacia abajo-izquierda, z hacia arriba. Todo el mundo se dibuja en estos píxeles.
 */
export const TILE = 96; // mitad del ancho de un tile en pantalla
export const Z_UNIT = 84; // píxeles por unidad de altura

export type Vec3 = [x: number, y: number, z?: number];
export type Point = { x: number; y: number };

export const iso = (x: number, y: number, z = 0): Point => ({
  x: (x - y) * TILE,
  y: ((x + y) * TILE) / 2 - z * Z_UNIT,
});

export const isoV = ([x, y, z = 0]: Vec3) => iso(x, y, z);

/** Lista de puntos para <polygon points>. */
export const pts = (list: Point[]) => list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/** Polígono de un rectángulo en el suelo (o a una altura z). */
export const rect = (x: number, y: number, w: number, d: number, z = 0) =>
  pts([iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)]);

/** Orden de pintado: lo que está más "al frente" (x + y mayor) se dibuja después. */
export const depth = (x: number, y: number, w = 0, d = 0) => x + y + (w + d) / 2;
