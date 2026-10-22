import { useCurrentFrame } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { enterStyle, progress, useEnter } from "../../../lib/motion";
import { BrowserMockup } from "../../../components/BrowserMockup";
import { Chip } from "../../../components/Chip";
import { KineticTitle } from "../../../components/KineticTitle";
import { SiteDesktop } from "../../../screens/Site";

/** 0:09–0:13 — La cámara llega al edificio web; la página se construye de boceto a diseño. */
export function WebPresenta() {
  const frame = useCurrentFrame();
  const d = reel01.scenes.webPresenta.duration;
  const enter = useEnter(14, 22);
  const out = progress(frame, d - 9, 8);
  return (
    <>
      <div style={{ position: "absolute", left: 150, top: 960, ...enterStyle(enter, 60), opacity: enter * (1 - out) }}>
        <BrowserMockup width={780} since={18}>
          <SiteDesktop from={26} scrollAt={86} />
        </BrowserMockup>
      </div>
      <div style={{ position: "absolute", left: fary.safe.left, top: 880, opacity: 1 - out }}>
        <Chip dot delay={10}>Web Craft</Chip>
      </div>
      <KineticTitle {...reel01.titles.webPresenta} from={6} exitAt={d - 8} />
    </>
  );
}
