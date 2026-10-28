import { s, scenes } from "./timeline";

/** Curvas de la historia del reel 04 (por frame). Todo lo que cambia en el 3D sale de aquí. */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
export const ramp = (f: number, a: number, b: number) => smooth(clamp01((f - a) / (b - a)));
export const lin = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));

/** Negocios de la ciudad (cada uno con su arquitectura). La bodega es la protagonista. */
export const BIZ = [
  { id: "barberia", x: -8, z: 0, label: "Barbería" },
  { id: "arepera", x: -4, z: 0, label: "Arepera" },
  { id: "bodega", x: 0, z: 0, label: "Bodega" },
  { id: "ropa", x: 4, z: 0, label: "Tienda de ropa" },
  { id: "cafe", x: -4, z: 4, label: "Cafetería" },
  { id: "tecno", x: 4, z: 4, label: "Tecnología" },
] as const;
export type BizId = (typeof BIZ)[number]["id"];

/** Orden de construcción en la escena 3 (la bodega ya existe). */
const buildOrder: BizId[] = ["arepera", "ropa", "cafe", "tecno", "barberia"];

export const T = {
  tap: s(1.2),
  orbFrom: s(9.8),
  orbTo: s(11.0),
  notebookOpen: s(20.6),
  pulse: s(24.0),
  flowFrom: s(26.2),
  flowStep: s(0.82),
};

export function drivers(f: number) {
  const { compra, ciudad, procesos, conexion, venezuela, cierre } = scenes;
  const grow = ramp(f, ciudad.from + s(0.6), ciudad.from + s(5.6));
  return {
    /** Onda del toque sobre el vidrio del teléfono. */
    ripple: lin(f, T.tap, T.tap + s(0.9)),
    /** El teléfono se separa en capas (explicación de cómo funciona por dentro). */
    explode: ramp(f, s(1.75), s(3.3)),
    /** El teléfono desaparece cuando la cámara lo atraviesa. */
    phone: 1 - ramp(f, s(3.3), s(3.9)),
    /** Esfera del pedido: de la interfaz a la puerta de la bodega. */
    orb: (f - T.orbFrom) / (T.orbTo - T.orbFrom),
    /** Crecimiento de la ciudad (radio desde el centro). */
    growRadius: 2 + 44 * grow,
    grow,
    /** Construcción de cada negocio temático (0–1). */
    build: (id: BizId) => (id === "bodega" ? 1 : ramp(f, ciudad.from + s(0.5) + buildOrder.indexOf(id) * s(0.7), ciudad.from + s(1.9) + buildOrder.indexOf(id) * s(0.7))),
    /** Luz cálida y tenue de los procesos manuales. */
    warm: ramp(f, procesos.from - s(0.5), procesos.from + s(0.8)) * (1 - ramp(f, T.pulse, T.pulse + s(1.2))),
    /** Libreta: abrir, levantar páginas, fragmentos que flotan, se reúnen al llegar el pulso. */
    open: ramp(f, T.notebookOpen, T.notebookOpen + s(0.8)),
    lift: ramp(f, T.notebookOpen + s(0.7), T.notebookOpen + s(1.7)),
    scatter: ramp(f, T.notebookOpen + s(1.4), procesos.to),
    pulse: lin(f, T.pulse, T.pulse + s(1.1)),
    assemble: ramp(f, T.pulse + s(0.3), T.pulse + s(1.6)),
    notebookOut: ramp(f, T.flowFrom - s(0.4), T.flowFrom + s(0.4)),
    /** Flujo del pedido (escena 5): avance continuo por las 5 estaciones. */
    flow: Math.max(0, (f - T.flowFrom) / T.flowStep),
    flowShow: ramp(f, T.flowFrom - s(0.3), T.flowFrom + s(0.3)) * (1 - ramp(f, conexion.to - s(3.4), conexion.to - s(2.6))),
    /** Escena 6: red, ventanas que se encienden al conectarse. */
    net: lin(f, venezuela.from + s(0.2), venezuela.from + s(5.5)),
    connected: ramp(f, venezuela.from, venezuela.to - s(1)),
    /** Cierre: las líneas convergen, la ciudad se apaga. */
    converge: ramp(f, cierre.from, cierre.from + s(2.0)),
    fade: 1 - ramp(f, cierre.from + s(0.6), cierre.from + s(2.6)),
    linesFade: 1 - ramp(f, cierre.from + s(3.0), cierre.from + s(4.2)),
    /** Vacío inicial: la niebla oculta todo menos la bodega hasta que crece la ciudad. */
    voidFog: 1 - ramp(f, ciudad.from, ciudad.from + s(3)),
    traffic: f / 30,
    city: ramp(f, ciudad.from + s(3.5), ciudad.from + s(5.5)),
    compra: ramp(f, compra.from, compra.from + s(0.6)),
  };
}

export type Drivers = ReturnType<typeof drivers>;
