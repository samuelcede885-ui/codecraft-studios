import { useCurrentFrame } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { enterStyle, progress, useEnter } from "../../../lib/motion";
import { BrowserMockup } from "../../../components/BrowserMockup";
import { Chip } from "../../../components/Chip";
import { KineticTitle } from "../../../components/KineticTitle";
import { WebsiteFlow } from "../../../screens/WebsiteFlow";

/** 0:09–0:13 — La cámara llega al edificio web, su pantalla se enciende y un cliente reserva. */
export function WebCraft() {
  const frame = useCurrentFrame();
  const d = reel01.scenes.web.duration;
  const enter = useEnter(16, 22);
  const out = progress(frame, d - 9, 8);
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 930, ...enterStyle(enter, 60), opacity: enter * (1 - out) }}>
        <BrowserMockup width={820} since={22}>
          <WebsiteFlow from={22} />
        </BrowserMockup>
      </div>
      <div style={{ position: "absolute", left: fary.safe.left, top: 830, opacity: 1 - out }}>
        <Chip dot delay={12}>Web Craft</Chip>
      </div>
      <KineticTitle {...reel01.titles.web} from={8} exitAt={d - 8} />
    </>
  );
}
