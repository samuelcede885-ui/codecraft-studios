import type { Vec3 } from "../lib/iso";

/**
 * Ecosistema digital de Fary Labs: una manzana nocturna donde cada edificio es un sistema.
 * Las coordenadas van en tiles (ver lib/iso.ts). Los reels reutilizan esta misma ciudad para
 * mantener la continuidad entre escenas.
 */
export type SystemId = "negocio" | "web" | "app" | "ia" | "crm" | "analytics" | "ecommerce" | "automatizaciones";

export type CityBuilding = { id: SystemId; label: string; x: number; y: number; w: number; d: number; h: number; screen?: boolean };

export const buildings: CityBuilding[] = [
  { id: "web", label: "Web", x: 0.5, y: 0.6, w: 1.5, d: 1.4, h: 2.4 },
  { id: "negocio", label: "Negocio", x: 2.3, y: 2.0, w: 1.3, d: 1.4, h: 1.6 },
  { id: "analytics", label: "Analytics", x: 5.6, y: 0.6, w: 1.4, d: 1.4, h: 4.6 },
  { id: "ecommerce", label: "E-commerce", x: 7.4, y: 1.4, w: 1.6, d: 1.9, h: 2.2 },
  { id: "crm", label: "CRM", x: 0.6, y: 5.6, w: 2.2, d: 1.8, h: 2.8 },
  { id: "automatizaciones", label: "Automatización", x: 1.4, y: 7.9, w: 1.6, d: 1.1, h: 1.4 },
  { id: "ia", label: "Agente IA", x: 5.6, y: 5.6, w: 2.0, d: 2.0, h: 3.4, screen: true },
  { id: "app", label: "App", x: 8.1, y: 6.1, w: 1.1, d: 1.2, h: 2.0 },
];

/** Manzanas (aceras) y calles: una avenida en cada eje que se cruzan en el centro. */
export const blocks = [
  { x: 0.2, y: 0.2, w: 3.6, d: 3.6 },
  { x: 5.2, y: 0.2, w: 4.2, d: 3.6 },
  { x: 0.2, y: 5.2, w: 3.6, d: 4.2 },
  { x: 5.2, y: 5.2, w: 4.2, d: 4.2 },
];
export const roads = [
  { axis: "x" as const, at: 4, from: -3, to: 13 },
  { axis: "y" as const, at: 4, from: -3, to: 13 },
];

export const lights: { x: number; y: number }[] = [
  { x: 3.85, y: 1.6 },
  { x: 5.15, y: 2.6 },
  { x: 1.8, y: 3.85 },
  { x: 7.6, y: 5.15 },
  { x: 3.85, y: 7.2 },
  { x: 5.15, y: 8.6 },
];
export const trees: { x: number; y: number; size?: number }[] = [
  { x: 0.7, y: 3.2 },
  { x: 3.3, y: 0.6, size: 0.8 },
  { x: 8.8, y: 0.7, size: 0.9 },
  { x: 3.3, y: 5.6, size: 0.85 },
  { x: 0.7, y: 9.0 },
  { x: 8.9, y: 8.8 },
  { x: 7.9, y: 8.9, size: 0.8 },
];
export const people: { x: number; y: number }[] = [
  { x: 3.6, y: 3.5 },
  { x: 5.5, y: 8.1 },
  { x: 8.6, y: 4.6 },
];

/** Puntos de conexión entre sistemas, sobre las fachadas visibles y las calles. */
export const anchors = {
  iaFront: [6.6, 7.65, 0.02] as Vec3,
  crmSide: [2.85, 6.5, 0.02] as Vec3,
};

export const routes = {
  /** Del agente IA al CRM, por la acera y la avenida. */
  iaToCrm: [anchors.iaFront, [6.6, 8.5, 0.02], [4.5, 8.5, 0.02], [4.5, 6.5, 0.02], anchors.crmSide] as Vec3[],
};
