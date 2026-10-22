/**
 * Proyección isométrica 2:1. Coordenadas del mundo en "tiles": x hacia abajo-derecha,
 * y hacia abajo-izquierda, z hacia arriba (en pisos).
 */
export const TILE = 96; // medio ancho de un tile en pantalla
export const Z_UNIT = 84; // píxeles por unidad de altura

export type Vec3 = [x: number, y: number, z?: number];
export type Point = { x: number; y: number };

export const iso = (x: number, y: number, z = 0): Point => ({
  x: (x - y) * TILE,
  y: ((x + y) * TILE) / 2 - z * Z_UNIT,
});
export const isoV = ([x, y, z = 0]: Vec3) => iso(x, y, z);

export const pts = (list: Point[]) => list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/** Rectángulo horizontal (suelo, azotea) a la altura z. */
export const rect = (x: number, y: number, w: number, d: number, z = 0) =>
  pts([iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)]);

/** Orden de pintado: lo que está más al frente (x + y mayor) se dibuja después. */
export const depth = (x: number, y: number, w = 0, d = 0) => x + y + (w + d) / 2;

/** Arco en el aire entre dos puntos (para líneas de datos entre azoteas). */
export const arc = (a: Vec3, b: Vec3, lift = 1.4, steps = 28): Vec3[] =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const za = a[2] ?? 0;
    const zb = b[2] ?? 0;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, za + (zb - za) * t + 4 * lift * t * (1 - t)] as Vec3;
  });

/** Encadena tramos de arco: a → b → c … */
export const arcs = (stops: Vec3[], lift = 1.4) => stops.slice(1).flatMap((s, i) => arc(stops[i], s, lift).slice(i ? 1 : 0));
