import { AbsoluteFill } from "remotion";
import { fary } from "../../theme/fary";
import { routes } from "../../data/city";
import { demo } from "../../data/reels";
import { AudioLayer } from "../../components/AudioLayer";
import { City } from "../../components/City";
import { DataFlow } from "../../components/DataFlow";
import { FloatingLabel } from "../../components/FloatingLabel";
import { IsometricCamera, useCameraPath } from "../../components/IsometricCamera";
import { IsometricWorld, WorldLayer } from "../../components/IsometricWorld";
import { KineticTitle } from "../../components/KineticTitle";
import { SafeArea } from "../../components/SafeArea";

/** Momentos de la demo (frames a 30 fps). */
const T = {
  powerOn: 36, // el edificio del agente IA se enciende
  flow: 62, // la línea de datos sale hacia el CRM
  title: 100, // entra el título
};

/**
 * Demo de 6 s: ciudad nocturna, cámara lenta, el agente IA se enciende, sus datos viajan al
 * CRM y entra "Tu negocio debería TRABAJAR." con la palabra clave resaltada.
 */
export function Demo({ guides = false }: { guides?: boolean }) {
  const camera = useCameraPath([
    { frame: 0, x: 5.3, y: 5.5, scale: 1.0 },
    { frame: demo.durationInFrames, x: 4.3, y: 6.5, scale: 1.14 },
  ]);
  return (
    <AbsoluteFill style={{ background: fary.color.bg }}>
      <IsometricCamera {...camera} anchor={{ x: 0.5, y: 0.4 }}>
        <IsometricWorld>
          <City states={{ ia: { active: true, since: T.powerOn, idle: 0 } }} />
          <WorldLayer name="data">
            <DataFlow path={routes.iaToCrm} since={T.flow} drawFrames={42} />
          </WorldLayer>
          <WorldLayer name="labels">
            <FloatingLabel at={[6.6, 6.6, 3.4]} text="Agente IA" active delay={T.powerOn + 8} lift={60} />
            <FloatingLabel at={[1.7, 6.5, 2.8]} text="CRM" delay={T.flow + 30} lift={60} />
          </WorldLayer>
        </IsometricWorld>
      </IsometricCamera>
      {/* Viñeta: concentra la mirada y oscurece los bordes del mundo. */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 70% at 50% 38%, rgba(8,8,8,0) 45%, rgba(8,8,8,0.92) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,8,8,0) 50%, rgba(8,8,8,0.94) 66%)" }} />
      <SafeArea guides={guides}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <KineticTitle lines={demo.title} from={T.title} size={118} />
        </div>
      </SafeArea>
      {demo.audio && <AudioLayer {...demo.audio} />}
    </AbsoluteFill>
  );
}
