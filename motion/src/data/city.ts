import { random } from "remotion";
import { arc, arcs, type Vec3 } from "../lib/iso";

/**
 * La ciudad de Fary Labs: una cuadrícula de manzanas separadas por avenidas cada 5 tiles.
 * Los sistemas del ecosistema son edificios fijos; el resto se genera de forma determinista
 * para llenar el plano cuando la cámara se aleja.
 */
export type SystemId = "web" | "app" | "ai" | "datos";
export type BuildingSpec = { id: string; x: number; y: number; w: number; d: number; h: number; screen?: boolean; material?: string };

const STEP = 5; // una manzana (3.6) + acera + avenida
const RANGE = [-3, -2, -1, 0, 1, 2, 3, 4];

export const systems: Record<SystemId, BuildingSpec & { label: string }> = {
  web: { id: "web", label: "Web", x: 0.6, y: 5.7, w: 2.4, d: 2.2, h: 3.0, screen: true, material: "ladrillo" },
  app: { id: "app", label: "App", x: 5.7, y: 0.6, w: 2.4, d: 2.0, h: 3.6, screen: true, material: "vidrioVerde" },
  ai: { id: "ai", label: "AI", x: 10.6, y: 5.6, w: 2.4, d: 2.4, h: 4.2, screen: true, material: "vidrioAzul" },
  datos: { id: "datos", label: "Datos", x: 10.8, y: 0.8, w: 1.9, d: 1.9, h: 5.2, screen: true, material: "arena" },
};

/** Oficina del hook, en la manzana central. */
export const office = { x: 5.7, y: 5.7, w: 2.6, d: 2.6 };

export const blocks = RANGE.flatMap((i) => RANGE.map((j) => ({ x: i * STEP + 0.2, y: j * STEP + 0.2, w: 3.6, d: 3.6 })));
export const roads = RANGE.flatMap((i) => [
  { axis: "x" as const, at: i * STEP + 4, from: -16, to: 32 },
  { axis: "y" as const, at: i * STEP + 4, from: -16, to: 32 },
]);

const reserved = [...Object.values(systems), { ...office, h: 0 }];
const overlaps = (x: number, y: number, w: number, d: number) =>
  reserved.some((r) => x < r.x + r.w + 0.2 && x + w > r.x - 0.2 && y < r.y + r.d + 0.2 && y + d > r.y - 0.2);

/** Edificios de relleno: cuatro solares por manzana, alturas y huellas variadas. */
export const fillers: BuildingSpec[] = blocks.flatMap((b, bi) =>
  [
    [0.25, 0.25],
    [1.95, 0.25],
    [0.25, 1.95],
    [1.95, 1.95],
  ].flatMap(([ox, oy], li) => {
    const r = random(`lot-${bi}-${li}`);
    if (r < 0.14) return []; // solar libre (árboles)
    const w = 1.1 + random(`w-${bi}-${li}`) * 0.3;
    const d = 1.1 + random(`d-${bi}-${li}`) * 0.3;
    const x = b.x + ox;
    const y = b.y + oy;
    if (overlaps(x, y, w, d)) return [];
    return [{ id: `f-${bi}-${li}`, x, y, w, d, h: 0.9 + random(`h-${bi}-${li}`) * 2.6 }];
  }),
);

export const trees: { x: number; y: number; size?: number }[] = blocks.flatMap((b, bi) =>
  [0, 1].map((k) => ({ x: b.x + 0.25 + random(`tx-${bi}-${k}`) * 3.1, y: b.y + (k ? 3.35 : 0.25 + random(`ty-${bi}`) * 3.1), size: 0.7 + random(`ts-${bi}-${k}`) * 0.35 })).filter((t) => !overlaps(t.x - 0.3, t.y - 0.3, 0.6, 0.6) && !fillers.some((f) => t.x > f.x - 0.3 && t.x < f.x + f.w + 0.3 && t.y > f.y - 0.3 && t.y < f.y + f.d + 0.3)),
);

/** Farolas en las esquinas de las avenidas (sobre la acera). */
export const lights = RANGE.flatMap((i) => RANGE.filter((j) => (i + j) % 2 === 0).map((j) => ({ x: i * STEP + 3.85, y: j * STEP + 3.85 })));

export const people: Vec3[] = [
  [4.5, 9.0],
  [9.4, 3.2],
  [3.4, 4.6],
  [14.6, 8.2],
];

/** Puntos de anclaje en azoteas y personas. */
const roof = (s: BuildingSpec, extra = 0.15): Vec3 => [s.x + s.w / 2, s.y + s.d / 2, s.h + extra];
export const anchors = {
  cliente: [2.2, 9.4, 0.7] as Vec3,
  web: roof(systems.web),
  app: roof(systems.app),
  ai: roof(systems.ai),
  datos: roof(systems.datos),
  officeDesk: [7.0, 7.0, 1.0] as Vec3,
  email: [14.6, 8.2, 0.7] as Vec3,
  chat: [9.4, 3.2, 0.7] as Vec3,
  social: [8.6, 11.6, 2.4] as Vec3,
};

export const routes = {
  clienteWeb: arc(anchors.cliente, anchors.web, 0.8),
  webApp: arc(anchors.web, anchors.app, 1.8),
  appAi: arc(anchors.app, anchors.ai, 1.6),
  aiDatos: arc(anchors.ai, anchors.datos, 1.0),
  chain: arcs([anchors.cliente, anchors.web, anchors.app, anchors.ai, anchors.datos], 1.2),
  // Canales que llegan al agente.
  inWeb: arc(anchors.web, anchors.ai, 2.0),
  inEmail: arc(anchors.email, anchors.ai, 1.0),
  inChat: arc(anchors.chat, anchors.ai, 1.4),
  inSocial: arc(anchors.social, anchors.ai, 1.2),
};
