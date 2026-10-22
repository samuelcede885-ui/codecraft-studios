import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { iso } from "../lib/iso";
import { clamp, easeInOut } from "../lib/motion";

export type CameraState = {
  /** Punto del mundo (en tiles) que queda en el ancla de la pantalla. */
  x: number;
  y: number;
  /** Altura del punto observado (en unidades de piso), opcional. */
  z?: number;
  scale: number;
};

/**
 * Cámara del mundo isométrico. Encuadra el punto (x, y, z) en el ancla de la pantalla con la
 * escala indicada. Para moverla, se le pasan estados interpolados con useCameraPath.
 */
export function IsometricCamera({
  x,
  y,
  z = 0,
  scale,
  anchor = { x: 0.5, y: 0.42 },
  rotate = 0,
  children,
}: CameraState & { anchor?: { x: number; y: number }; rotate?: number; children: ReactNode }) {
  const p = iso(x, y, z);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: `${anchor.x * 100}%`,
          top: `${anchor.y * 100}%`,
          transform: `rotate(${rotate}deg) scale(${scale}) translate(${-p.x}px, ${-p.y}px)`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}

export type CameraKey = CameraState & { frame: number };

/**
 * Recorrido continuo de cámara entre claves. Interpola cada canal con la misma curva para que
 * el movimiento sea uno solo, lento y sin cortes.
 */
export function useCameraPath(keys: CameraKey[], easing = easeInOut): CameraState {
  const frame = useCurrentFrame();
  const frames = keys.map((k) => k.frame);
  const ch = (pick: (k: CameraKey) => number) =>
    keys.length === 1 ? pick(keys[0]) : interpolate(frame, frames, keys.map(pick), { ...clamp, easing });
  return { x: ch((k) => k.x), y: ch((k) => k.y), z: ch((k) => k.z ?? 0), scale: ch((k) => k.scale) };
}
