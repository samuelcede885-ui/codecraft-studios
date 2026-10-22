import { createContext, useContext, type ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, easeInOut } from "./motion";

/**
 * Foco de color: lo que la cámara está mirando se ve con colores reales; el resto queda en gris.
 * `x, y` (tiles) es el centro, `radius` el alcance y `amount` la intensidad (0 = todo gris).
 */
export type Focus = { x: number; y: number; radius: number; amount: number };

const FocusContext = createContext<Focus>({ x: 0, y: 0, radius: 0, amount: 0 });

export function FocusProvider({ focus, children }: { focus: Focus; children: ReactNode }) {
  return <FocusContext.Provider value={focus}>{children}</FocusContext.Provider>;
}

/** Cantidad de color (0–1) en un punto (x, y): plena dentro del radio y se apaga al salir. */
export const colorAmount = (f: Focus, x: number, y: number) => {
  if (f.amount <= 0 || f.radius <= 0) return 0;
  const t = Math.min(1, Math.max(0, (f.radius - Math.hypot(x - f.x, y - f.y)) / (f.radius * 0.45)));
  return f.amount * t * t * (3 - 2 * t);
};

/** Devuelve la función de color del foco actual, para elementos con varias partes. */
export function useColorField() {
  const f = useContext(FocusContext);
  return (x: number, y: number) => colorAmount(f, x, y);
}

export function useColorAt(x: number, y: number) {
  return colorAmount(useContext(FocusContext), x, y);
}

export type FocusKey = Focus & { frame: number };

/** Recorrido del foco entre claves, con la misma curva que la cámara. */
export function useFocusPath(keys: FocusKey[]): Focus {
  const frame = useCurrentFrame();
  const frames = keys.map((k) => k.frame);
  const ch = (pick: (k: FocusKey) => number) => interpolate(frame, frames, keys.map(pick), { ...clamp, easing: easeInOut });
  return { x: ch((k) => k.x), y: ch((k) => k.y), radius: ch((k) => k.radius), amount: ch((k) => k.amount) };
}
