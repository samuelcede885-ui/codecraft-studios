import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Curvas de la casa. */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Progreso 0 → 1 entre dos frames. */
export const progress = (frame: number, from: number, duration: number, easing = easeOut) =>
  interpolate(frame, [from, from + duration], [0, 1], { ...clamp, easing });

/** Rampa de entrada y salida: 0 → 1 en [inFrom, +inDur] y 1 → 0 en [outFrom, +outDur]. */
export const ramp = (frame: number, inFrom: number, inDur: number, outFrom = Infinity, outDur = 8) =>
  Math.min(progress(frame, inFrom, inDur), 1 - progress(frame, outFrom, outDur, easeIn));

/** Spring sin rebote para entradas de interfaz. */
export function useEnter(delay = 0, durationInFrames = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, durationInFrames, config: { damping: 200 } });
}

/** Entrada estándar de UI: opacity 0 → 1, translateY 30 → 0, scale .96 → 1. */
export const enterStyle = (p: number, distance = 30) => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px) scale(${0.96 + 0.04 * p})`,
});

/** Salida breve: sube un poco y se desvanece. */
export const exitStyle = (q: number) => ({ opacity: 1 - q, transform: `translateY(${-14 * q}px)` });

/**
 * Transición entre estados activo / inactivo: 0 (apagado) → 1 (encendido).
 * `since` = frame del cambio; antes de él se mantiene el estado contrario.
 */
export function useActivation(active: boolean, since = 0, durationInFrames = 26) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (since <= 0) return active ? 1 : 0;
  const p = spring({ frame: frame - since, fps, durationInFrames, config: { damping: 200 } });
  return active ? p : 1 - p;
}
