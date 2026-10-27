/**
 * Modelo de la ciudad: manzanas, edificios, comercios, faroles, árboles, autos y rutas de conexión.
 * Generado con una semilla fija: la misma ciudad en cada render (determinista).
 * Unidades: 1 = un piso aproximado. Manzanas de 3,2 con calles de 0,8 (paso de 4).
 */
export const PITCH = 4;
export const BLOCK = 3.2;
export const N = 7; // manzanas de -N a N en cada eje
export const STREET_Y = 0.045;

export type Category = "ropa" | "restaurante" | "tecnologia" | "servicios" | "emprendimiento";
export const categories: Category[] = ["ropa", "restaurante", "tecnologia", "servicios", "emprendimiento"];

export type Face = "+x" | "-x" | "+z" | "-z";
export type Shop = { face: Face; category: Category; door: [number, number, number]; street: [number, number] };
export type Building = { x: number; z: number; w: number; d: number; h: number; glass: boolean; seed: number; shop?: Shop; dist: number };

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Comercio protagonista: manzana central, fachada de vidrio hacia +z. */
export const HERO = { x: 0, z: -0.1, w: 2.3, d: 1.9, h: 1.45, upper: 1.15, front: 0.85 };

const r = rng(20261027);

const buildings: Building[] = [];
for (let i = -N; i <= N; i++) {
  for (let j = -N; j <= N; j++) {
    const cx = i * PITCH;
    const cz = j * PITCH;
    const dist = Math.hypot(cx, cz);
    if (i === 0 && j === 0) {
      // Manzana del comercio protagonista (se dibuja aparte, en HeroShop).
      continue;
    }
    // Plaza frente al comercio protagonista (deja ver su fachada) y vecinos bajos a los lados.
    if (i === 0 && j === 1) continue;
    const low = Math.abs(i) <= 1 && Math.abs(j) <= 1;
    // Centro con alturas bajas (comercio de barrio); torres de vidrio hacia la periferia media.
    const tower = dist > 9 && r() < 0.16;
    const split = r();
    const lots: [number, number, number, number][] = [];
    if (tower) lots.push([0, 0, BLOCK - 0.5, BLOCK - 0.5]);
    else if (split < 0.3) lots.push([-0.8, 0, 1.45, BLOCK - 0.3], [0.8, 0, 1.45, BLOCK - 0.3]);
    else if (split < 0.62) lots.push([-0.8, -0.8, 1.45, 1.45], [0.8, -0.8, 1.45, 1.45], [-0.8, 0.8, 1.45, 1.45], [0.8, 0.8, 1.45, 1.45]);
    else lots.push([0, -0.8, BLOCK - 0.3, 1.45], [-0.8, 0.8, 1.45, 1.45], [0.8, 0.8, 1.45, 1.45]);
    for (const [ox, oz, w, d] of lots) {
      const h = tower ? 3.5 + r() * 4.5 : low ? 0.6 + r() * 0.7 : 0.7 + r() * (dist < 10 ? 1.4 : 2.4);
      const b = lot(cx + ox, cz + oz, w - 0.12 - r() * 0.15, d - 0.12 - r() * 0.15, h, tower || (h > 2.6 && r() < 0.5), dist);
      // Comercio en planta baja si el lote da a la calle.
      if (!tower && h < 3 && r() < 0.62) {
        const faces: Face[] = [];
        if (oz >= 0) faces.push("+z");
        if (oz <= 0) faces.push("-z");
        if (ox >= 0) faces.push("+x");
        if (ox <= 0) faces.push("-x");
        const face = faces[Math.floor(r() * faces.length)];
        b.shop = makeShop(b, face, categories[Math.floor(r() * categories.length)]);
      }
      buildings.push(b);
    }
  }
}

function lot(x: number, z: number, w: number, d: number, h: number, glass: boolean, dist: number): Building {
  return { x, z, w, d, h, glass, seed: r(), dist };
}

function makeShop(b: Building, face: Face, category: Category): Shop {
  const out = face === "+z" ? [b.x, b.z + b.d / 2] : face === "-z" ? [b.x, b.z - b.d / 2] : face === "+x" ? [b.x + b.w / 2, b.z] : [b.x - b.w / 2, b.z];
  // Punto de la calle más cercana (eje de la calzada) frente a la puerta.
  const street: [number, number] =
    face === "+z" || face === "-z"
      ? [b.x, snapStreet(b.z + (face === "+z" ? 1 : -1) * 1.0)]
      : [snapStreet(b.x + (face === "+x" ? 1 : -1) * 1.0), b.z];
  return { face, category, door: [out[0], 0.0, out[1]], street };
}

/** Eje de calle más cercano a una coordenada (las calles están en (k + 0,5) · PITCH). */
export function snapStreet(v: number) {
  return (Math.round(v / PITCH - 0.5) + 0.5) * PITCH;
}

export const city = { buildings, shops: buildings.filter((b) => b.shop) };

/** Faroles: uno por esquina de manzana, sobre la acera. */
export const lamps: [number, number][] = [];
for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) lamps.push([i * PITCH + 1.5, j * PITCH + 1.5]);

/** Árboles en las aceras de algunas manzanas y en la plaza frente al comercio. */
export const trees: [number, number, number][] = [
  [-1.1, PITCH - 1.0, 1.2], [1.1, PITCH - 1.0, 1.1], [-1.1, PITCH + 1.0, 1.0], [1.1, PITCH + 1.0, 1.25], [0, PITCH + 0.2, 1.4],
];
for (let i = -N; i <= N; i++)
  for (let j = -N; j <= N; j++) {
    if (r() < 0.45) continue;
    const side = Math.floor(r() * 4);
    for (let k = -1; k <= 1; k += 2) {
      const t = k * 0.7;
      const [x, z] = side === 0 ? [t, 1.52] : side === 1 ? [t, -1.52] : side === 2 ? [1.52, t] : [-1.52, t];
      trees.push([i * PITCH + x, j * PITCH + z, 0.8 + r() * 0.5]);
    }
  }

/** Autos: carril, sentido, desfase y velocidad. Recorren calles completas en bucle. */
export const cars = Array.from({ length: 56 }, () => {
  const alongX = r() < 0.5;
  const lane = (Math.floor(r() * (2 * N)) - N + 0.5) * PITCH;
  const dir = r() < 0.5 ? 1 : -1;
  return { alongX, lane: lane + dir * 0.17, dir, offset: r(), speed: 0.9 + r() * 0.8, tone: r() };
});
export const ROAD_LENGTH = (2 * N + 1) * PITCH;

// ── rutas de conexión por las calles ─────────────────────────────────────────

type P2 = [number, number];
const key = ([x, z]: P2) => `${x.toFixed(1)},${z.toFixed(1)}`;

/** Ruta tipo Manhattan por los ejes de calle entre dos puntos de calle. */
function manhattan(a: P2, b: P2, xFirst: boolean): P2[] {
  const pts: P2[] = [a];
  const mid: P2 = xFirst ? [b[0], a[1]] : [a[0], b[1]];
  if (key(mid) !== key(a) && key(mid) !== key(b)) pts.push(mid);
  pts.push(b);
  return pts;
}

export type Route = { points: [number, number, number][]; start: number; dur: number; width: number; tone: "blue" | "cyan" };

const heroStreet: P2 = [0, PITCH / 2];
const heroDoor: [number, number, number] = [0, STREET_Y, HERO.z + HERO.d / 2 + 0.05];

/** Calles que pasan por esquinas: convierte un punto de calle a una esquina vecina (cruce). */
const corner = ([x, z]: P2): P2 => [snapStreet(x), snapStreet(z)];

function routeTo(from: P2, door: [number, number, number], street: P2, xFirst: boolean): [number, number, number][] {
  const c1 = corner(from);
  const c2 = corner(street);
  const path: P2[] = [from, ...manhattan(c1, c2, xFirst), street];
  const pts: [number, number, number][] = [];
  for (const p of path) {
    const last = pts[pts.length - 1];
    if (!last || Math.hypot(last[0] - p[0], last[2] - p[1]) > 0.01) pts.push([p[0], STREET_Y, p[1]]);
  }
  pts.push([door[0], STREET_Y, door[2]]);
  return pts;
}

/** Escena 3: la línea principal sale del comercio y recorre la ciudad conectando comercios. */
const near = city.shops.filter((b) => b.dist > 5 && b.dist < 22).sort((a, b) => a.seed - b.seed);
export const mainRoutes: Route[] = near.slice(0, 7).map((b, i) => ({
  points: [heroDoor, ...routeTo(heroStreet, b.shop!.door, b.shop!.street, i % 2 === 0)],
  start: i * 0.08,
  dur: 0.55,
  width: 0.05,
  tone: "blue",
}));

/** Escenas 6–7: la red crece entre comercios de toda la ciudad. */
const far = city.shops.filter((b) => b.dist < 27).sort((a, b) => a.seed * 7.3 - Math.floor(a.seed * 7.3) - (b.seed * 7.3 - Math.floor(b.seed * 7.3)));
export const netRoutes: Route[] = Array.from({ length: 34 }, (_, i) => {
  const a = far[(i * 2) % far.length];
  const b = far[(i * 2 + 7) % far.length];
  return {
    points: [[a.shop!.door[0], STREET_Y, a.shop!.door[2]], ...routeTo(a.shop!.street, b.shop!.door, b.shop!.street, i % 2 === 1)],
    start: i / 34,
    dur: 0.45,
    width: 0.035,
    tone: i % 3 === 0 ? "cyan" : "blue",
  };
});

/** Arcos sobre los techos (escenas 7–8): enlaces entre zonas lejanas. */
export const arcs = Array.from({ length: 26 }, (_, i) => {
  const a = far[(i * 5 + 3) % far.length];
  const b = far[(i * 11 + 17) % far.length];
  return { a: [a.x, a.h + 0.1, a.z] as [number, number, number], b: [b.x, b.h + 0.1, b.z] as [number, number, number], start: i / 26 };
});

/** Pines de categoría de la escena 7: un comercio visible de cada tipo, cerca del centro. */
export const pins = categories.map((c, i) => {
  const options = city.shops.filter((b) => b.shop!.category === c && b.dist > 6 && b.dist < 18);
  const b = options[(i * 3) % options.length];
  return { category: c, at: [b.x, b.h + 0.4, b.z] as [number, number, number] };
});

export { heroDoor };
