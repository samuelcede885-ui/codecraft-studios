import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fary } from "../../theme/fary";
import { anchors, routes, systems } from "../../data/city";
import { demo } from "../../data/reels";
import { progress } from "../../lib/motion";
import { FocusProvider } from "../../lib/focus";
import { City } from "../../components/City";
import { DataFlow } from "../../components/DataFlow";
import { FloatingLabel } from "../../components/FloatingLabel";
import { IsometricCamera, useCameraPath } from "../../components/IsometricCamera";
import { IsometricWorld, WorldLayer } from "../../components/IsometricWorld";
import { KineticTitle } from "../../components/KineticTitle";

/** Demo base (6 s): el agente se enciende, sus datos salen hacia la torre de datos y entra el título. */
export function Demo() {
  const frame = useCurrentFrame();
  const camera = useCameraPath([
    { frame: 0, x: 11.2, y: 5.6, z: 1.6, scale: 1.0, anchorY: 0.5 },
    { frame: demo.durationInFrames, x: 11.4, y: 5.0, z: 1.8, scale: 1.15, anchorY: 0.5 },
  ]);
  const ai = progress(frame, 36, 26);
  return (
    <AbsoluteFill style={{ background: fary.color.negro }}>
      <FocusProvider focus={{ x: 11.6, y: 5.0, radius: 3.6, amount: ai }}>
      <IsometricCamera {...camera}>
        <IsometricWorld>
          <City state={{ ambient: 0.1, systems: { ai, datos: progress(frame, 100, 26) }, office: { lamp: 1, occupied: 1, system: 0 } }} />
          <WorldLayer name="data">
            <DataFlow path={routes.aiDatos} since={62} drawFrames={40} />
          </WorldLayer>
          <WorldLayer name="labels">
            <FloatingLabel at={anchors.ai} text={systems.ai.label} active delay={46} />
          </WorldLayer>
        </IsometricWorld>
      </IsometricCamera>
      </FocusProvider>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0) 32%)" }} />
      <KineticTitle {...demo.title} from={96} />
    </AbsoluteFill>
  );
}
