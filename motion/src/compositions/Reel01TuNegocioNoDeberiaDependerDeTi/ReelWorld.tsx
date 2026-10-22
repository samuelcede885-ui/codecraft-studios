import { interpolate, useCurrentFrame } from "remotion";
import { anchors, routes } from "../../data/city";
import { reel01 } from "../../data/reels";
import { clamp, progress } from "../../lib/motion";
import { City } from "../../components/City";
import { DataFlow } from "../../components/DataFlow";
import { FloatingLabel } from "../../components/FloatingLabel";
import { IsometricCamera, useCameraPath } from "../../components/IsometricCamera";
import { IsometricWorld, WorldLayer } from "../../components/IsometricWorld";

const S = reel01.scenes;
/** Frames clave del mundo (absolutos). */
export const W = {
  webOn: S.web.from + 18,
  webToApp: S.app.from + 4,
  appOn: S.app.from + 30,
  channels: S.agent.from + 10,
  aiOn: S.agent.from + 30,
  chain: S.resultado.from + 8,
  datosOn: S.resultado.from + 40,
  officeEmpty: S.resultado.from + 26,
};

/**
 * El mundo de todo el reel: una ciudad y una cámara continua. Las escenas solo deciden qué
 * se enciende; la cámara viaja de la oficina a cada sistema y vuelve, sin cortes.
 */
export function ReelWorld() {
  const frame = useCurrentFrame();
  const camera = useCameraPath([
    { frame: 0, x: 7.0, y: 7.0, z: 0.7, scale: 1.5, anchorY: 0.58 },
    { frame: 88, x: 7.0, y: 7.0, z: 0.7, scale: 1.95, anchorY: 0.58 },
    { frame: 178, x: 7.05, y: 7.0, z: 0.7, scale: 2.1, anchorY: 0.58 },
    { frame: 226, x: 7.0, y: 5.6, z: 1.0, scale: 0.95, anchorY: 0.56 },
    { frame: 272, x: 6.8, y: 5.8, z: 1.0, scale: 0.92, anchorY: 0.56 },
    { frame: 305, x: 1.8, y: 6.8, z: 1.5, scale: 1.4, anchorY: 0.4 },
    { frame: 388, x: 1.9, y: 6.7, z: 1.5, scale: 1.5, anchorY: 0.4 },
    { frame: 428, x: 6.9, y: 1.6, z: 1.8, scale: 1.35, anchorY: 0.38 },
    { frame: 508, x: 6.9, y: 1.7, z: 1.8, scale: 1.45, anchorY: 0.38 },
    { frame: 548, x: 11.0, y: 6.8, z: 1.6, scale: 0.95, anchorY: 0.38 },
    { frame: 628, x: 11.1, y: 6.8, z: 1.6, scale: 1.02, anchorY: 0.38 },
    { frame: 688, x: 7.6, y: 5.0, z: 1.0, scale: 0.62, anchorY: 0.56 },
    { frame: 738, x: 7.0, y: 7.0, z: 0.7, scale: 1.55, anchorY: 0.58 },
    { frame: 840, x: 7.0, y: 7.0, z: 0.7, scale: 1.7, anchorY: 0.58 },
  ]);

  const on = (at: number) => progress(frame, at, 26);
  const state = {
    ambient: interpolate(frame, [0, 200, 300, 630, 700], [0.05, 0.06, 0.1, 0.13, 0.22], clamp),
    systems: { web: on(W.webOn), app: on(W.appOn), ai: on(W.aiOn), datos: on(W.datosOn) },
    office: {
      lamp: 1 - 0.8 * progress(frame, W.officeEmpty, 24),
      occupied: 1 - progress(frame, W.officeEmpty, 16),
      system: progress(frame, W.officeEmpty + 6, 24),
    },
    peopleActive: progress(frame, W.chain + 10, 20),
  };
  // Los flujos de cada escena se apagan al pasar el protagonismo a la cadena completa.
  const handoff = 1 - progress(frame, W.chain, 20);

  return (
    <IsometricCamera {...camera}>
      <IsometricWorld>
        <City state={state} />
        <WorldLayer name="data">
          <DataFlow path={routes.clienteWeb} since={W.webOn + 30} drawFrames={24} opacity={handoff} />
          <DataFlow path={routes.webApp} since={W.webToApp} drawFrames={34} opacity={handoff} />
          <DataFlow path={routes.inWeb} since={W.channels} drawFrames={30} opacity={handoff} />
          <DataFlow path={routes.inEmail} since={W.channels + 5} drawFrames={30} opacity={handoff} />
          <DataFlow path={routes.inChat} since={W.channels + 10} drawFrames={30} opacity={handoff} />
          <DataFlow path={routes.inSocial} since={W.channels + 15} drawFrames={30} opacity={handoff} />
          <DataFlow path={routes.chain} since={W.chain} drawFrames={50} pulses={5} speed={14} width={4.5} />
        </WorldLayer>
        <WorldLayer name="labels">
          {(["email", "chat", "social"] as const).map((k, i) => (
            <FloatingLabel key={k} at={anchors[k]} text={k} delay={W.channels + 5 * (i + 1)} visible={1 - progress(frame, S.agent.from + 100, 10)} lift={60} />
          ))}
          <FloatingLabel at={anchors.cliente} text="Cliente" delay={W.chain} visible={1 - progress(frame, S.resultado.from + 70, 10)} lift={60} size={26} />
          <FloatingLabel at={anchors.datos} text="Datos" active delay={W.datosOn} visible={1 - progress(frame, S.resultado.from + 70, 10)} size={26} />
        </WorldLayer>
      </IsometricWorld>
    </IsometricCamera>
  );
}
