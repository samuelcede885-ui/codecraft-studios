import { drivers as reel02Drivers, type Drivers as CityDrivers } from "../Reel02/drivers";
import { s, scenes } from "./timeline";

/** Curvas de la historia del reel 03 (0–1 salvo radios y tiempos), todas por frame. */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
export const ramp = (f: number, a: number, b: number) => smooth(clamp01((f - a) / (b - a)));

export function drivers(f: number) {
  const { presentacion, problema, transformacion, administracion, diferencia, cierre } = scenes;
  return {
    /** La ciudad se enciende desde las dos tiendas hacia afuera. */
    litRadius: 7 + 40 * ramp(f, presentacion.from, s(4)),
    /** Línea de luz que divide las dos tiendas. */
    divider: ramp(f, s(0.1), s(1.3)) * (1 - ramp(f, cierre.from, cierre.from + s(1.2))),
    /** Actividad manual en la tienda izquierda (mensajes, notas, pendientes). */
    manual: ramp(f, problema.from + s(0.3), problema.from + s(1.2)) * (1 - ramp(f, cierre.from, cierre.from + s(1))),
    /** Corte arquitectónico: los pisos superiores suben y dejan ver los interiores. */
    cutaway: ramp(f, administracion.from - s(0.4), administracion.from + s(0.8)) * (1 - ramp(f, diferencia.from - s(0.2), diferencia.from + s(0.9))),
    /** Flujo de pedido en la tienda digital (escena 3). */
    flow: clamp01((f - (transformacion.from + s(6.3))) / s(2.6)),
    /** Modo red del cierre: la ciudad se apaga y destacan las conexiones. */
    dim: 0.75 * ramp(f, cierre.from + s(0.4), cierre.from + s(2)),
    net: clamp01((f - (cierre.from + s(0.3))) / s(3.6)),
    arcs: clamp01((f - (cierre.from + s(1.2))) / s(3.4)),
    fade: 1 - ramp(f, cierre.from + s(2.6), cierre.from + s(4.6)),
    linesFade: 1 - ramp(f, cierre.from + s(5.2), cierre.from + s(6.4)),
    traffic: f / 30,
  };
}

export type Drivers = ReturnType<typeof drivers>;

/** Adaptador para reutilizar la ciudad del reel 02 (suelo, edificios, comercios, faroles, tráfico). */
export function cityDrivers(d: Drivers): CityDrivers {
  return { ...reel02Drivers(0), litRadius: d.litRadius, fade: d.fade, dim: d.dim, traffic: d.traffic, linesFade: d.linesFade, blue: 0.25 + 0.5 * d.dim };
}
