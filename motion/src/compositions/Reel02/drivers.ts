import { FREEZE, s, scenes } from "./timeline";

/**
 * Curvas de la historia: valores 0–1 (o radios) que cada frame entrega a la ciudad.
 * Todo lo que cambia en el mundo 3D depende de aquí, no de temporizadores.
 */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
/** 0 → 1 entre dos frames, con suavizado. */
export const ramp = (f: number, a: number, b: number) => smooth(clamp01((f - a) / (b - a)));

export const UNFREEZE = s(14.1);

export function drivers(f: number) {
  const { ciudad, problema, vision, automatizacion, comunidad, cierre } = scenes;
  return {
    /** Radio iluminado desde el centro: los comercios se encienden poco a poco. */
    litRadius: 3 + 44 * ramp(f, ciudad.from, s(4.8)),
    /** Interior del comercio protagonista (vidrio, luz y personaje). */
    interior: ramp(f, s(5.4), problema.from + s(0.4)) * (1 - ramp(f, s(15.6), s(17))),
    /** La escena se oscurece con la saturación de mensajes. */
    stress: ramp(f, s(8.5), s(12.4)) * (1 - ramp(f, UNFREEZE, s(15))),
    /** Congelado (escena 3): 1 mientras todo se detiene. */
    freeze: ramp(f, FREEZE - 4, FREEZE + 4) * (1 - ramp(f, UNFREEZE - 2, UNFREEZE + 10)),
    /** Línea principal: recorre la ciudad entre estos frames. */
    main: clamp01((f - (UNFREEZE + s(0.5))) / (s(19.6) - UNFREEZE - s(0.5))),
    /** Modernización: fachadas y letreros hacia el azul. */
    blue: 0.65 * ramp(f, s(15.6), s(20)) + 0.35 * ramp(f, automatizacion.from, comunidad.from + s(4)),
    /** Comercio protagonista ya digital (escena 4 en adelante). */
    heroDigital: ramp(f, vision.from + s(2.5), vision.to),
    /** Panel de gestión sobre el edificio (escena 5). */
    dashboard: ramp(f, scenes.gestion.from, scenes.gestion.from + s(1.2)) * (1 - ramp(f, automatizacion.from + s(0.5), automatizacion.from + s(1.6))),
    /** Modo red (escena 6): la ciudad se apaga y destacan las conexiones. */
    dim: 0.72 * ramp(f, automatizacion.from, automatizacion.from + s(1.5)) * (1 - 0.45 * ramp(f, comunidad.from, comunidad.from + s(2))) + 0.5 * ramp(f, cierre.from + s(0.5), cierre.from + s(2.5)),
    /** Red de rutas entre comercios (escenas 6–7). */
    net: clamp01((f - (automatizacion.from + s(0.8))) / s(7.5)),
    /** Arcos sobre los techos (escena 7). */
    arcs: clamp01((f - (comunidad.from + s(0.6))) / s(8)),
    /** Personas (puntos) que se mueven por la red. */
    people: ramp(f, comunidad.from + s(1), comunidad.from + s(3)) * (1 - ramp(f, cierre.from + s(1.6), cierre.from + s(2.6))),
    /** Cierre: la ciudad desaparece, luego las líneas. */
    fade: 1 - ramp(f, cierre.from + s(0.6), cierre.from + s(2.6)),
    linesFade: 1 - ramp(f, cierre.from + s(2.2), cierre.from + s(3.6)),
    /** Tiempo del tráfico (s): se detiene durante el congelado. */
    traffic: (f < FREEZE ? f : f < UNFREEZE ? FREEZE : f - (UNFREEZE - FREEZE)) / 30,
  };
}

export type Drivers = ReturnType<typeof drivers>;

/** Progreso (0–1) de una ruta escalonada dentro de un tramo global. */
export const routeProgress = (global: number, start: number, dur: number) => clamp01((global - start * (1 - dur)) / dur);
