import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { iso, type Vec3 } from "../lib/iso";
import { clamp, easeInOut } from "../lib/motion";

export type CameraState = {
  /** Punto del mundo (tiles) que queda en el ancla de la pantalla. */
  x: number;
  y: number;
  /** Altura del punto observado (pisos). */
  z?: number;
  scale: number;
  /** Giro en grados (opcional, muy sutil). */
  rotation?: number;
  /** Altura de pantalla (0–1) donde queda el punto observado: deja sitio a la UI de cada escena. */
  anchorY?: number;
};

/**
 * Cámara del mundo. Encuadra (x, y, z) —o `focusTarget`, si se da— en el ancla de la pantalla.
 * Para moverla: estados interpolados con useCameraPath.
 */
export function IsometricCamera({
  x,
  y,
  z = 0,
  scale,
  rotation = 0,
  anchorY = 0.56,
  focusTarget,
  children,
}: CameraState & { focusTarget?: Vec3; children: ReactNode }) {
  const p = focusTarget ? iso(focusTarget[0], focusTarget[1], focusTarget[2]) : iso(x, y, z);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${anchorY * 100}%`,
          transform: `rotate(${rotation}deg) scale(${scale}) translate(${-p.x}px, ${-p.y}px)`,
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
 * Un único recorrido continuo entre claves: cada tramo se suaviza con la misma curva, así que la
 * cámara nunca corta. Para escenas "quietas", dos claves cercanas mantienen un movimiento leve.
 */
export function useCameraPath(keys: CameraKey[], easing = easeInOut): CameraState {
  const frame = useCurrentFrame();
  const frames = keys.map((k) => k.frame);
  const ch = (pick: (k: CameraKey) => number) =>
    keys.length === 1 ? pick(keys[0]) : interpolate(frame, frames, keys.map(pick), { ...clamp, easing });
  return { x: ch((k) => k.x), y: ch((k) => k.y), z: ch((k) => k.z ?? 0), scale: ch((k) => k.scale), rotation: ch((k) => k.rotation ?? 0), anchorY: ch((k) => k.anchorY ?? 0.56) };
}
