import { useCurrentFrame } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { enterStyle, progress, useEnter } from "../../../lib/motion";
import { Chip } from "../../../components/Chip";
import { Dashboard } from "../../../components/Dashboard";
import { KineticTitle } from "../../../components/KineticTitle";
import { PhoneMockup } from "../../../components/PhoneMockup";

/** 0:13–0:17 — Los datos viajan de la web a la app: clientes, pedidos, reservas y métricas. */
export function AppCraft() {
  const frame = useCurrentFrame();
  const d = reel01.scenes.app.duration;
  const enter = useEnter(30, 22);
  const out = progress(frame, d - 9, 8);
  return (
    <>
      <div style={{ position: "absolute", left: 530, top: 735, ...enterStyle(enter, 80), opacity: enter * (1 - out) }}>
        <PhoneMockup width={352} since={36}>
          <Dashboard modules={reel01.modules} from={40} />
        </PhoneMockup>
      </div>
      <div style={{ position: "absolute", left: fary.safe.left, top: 1330, opacity: 1 - out }}>
        <Chip dot delay={26}>App Craft</Chip>
      </div>
      <KineticTitle {...reel01.titles.app} from={8} exitAt={d - 8} />
    </>
  );
}
