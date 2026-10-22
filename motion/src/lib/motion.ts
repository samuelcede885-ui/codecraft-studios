import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Curva de la casa: entra rápido y se posa con suavidad. */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Progreso 0 → 1 entre dos frames, con curva y sin salirse del rango. */
export const progress = (frame: number, from: number, duration: number, easing = easeOut) =>
  interpolate(frame, [from, from + duration], [0, 1], { ...clamp, easing });

/** Spring sin rebote para entradas de interfaz. */
export function useEnter(delay = 0, durationInFrames = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, durationInFrames, config: { damping: 200 } });
}

/** Estilo de entrada estándar de UI: opacity 0 → 1, translateY 30 → 0, scale .96 → 1. */
export const enterStyle = (p: number, distance = 30) => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px) scale(${0.96 + 0.04 * p})`,
});

/**
 * Transición de estado activo / inactivo. Devuelve 0 (apagado) → 1 (encendido).
 * `since` es el frame en el que cambió el estado; antes de él se mantiene el estado contrario.
 */
export function useActivation(active: boolean, since = 0, durationInFrames = 24) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (since <= 0) return active ? 1 : 0;
  const p = spring({ frame: frame - since, fps, durationInFrames, config: { damping: 200 } });
  return active ? p : 1 - p;
}

export { clamp };
