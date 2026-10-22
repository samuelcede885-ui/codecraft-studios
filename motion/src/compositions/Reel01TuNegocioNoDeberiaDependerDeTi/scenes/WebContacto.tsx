import { useCurrentFrame } from "remotion";
import { reel01 } from "../../../data/reels";
import { enterStyle, progress, useEnter } from "../../../lib/motion";
import { BrowserMockup } from "../../../components/BrowserMockup";
import { KineticTitle } from "../../../components/KineticTitle";
import { PhoneMockup } from "../../../components/PhoneMockup";
import { SiteDesktop, SiteMobile } from "../../../screens/Site";

/** 0:13–0:17 — La misma web en escritorio y móvil; un cliente escribe y envía su consulta. */
export function WebContacto() {
  const frame = useCurrentFrame();
  const d = reel01.scenes.webContacto.duration;
  const desk = useEnter(4, 22);
  const phone = useEnter(12, 22);
  const out = progress(frame, d - 9, 8);
  return (
    <>
      <div style={{ position: "absolute", left: 72, top: 790, ...enterStyle(desk, 50), opacity: desk * (1 - out) }}>
        <BrowserMockup width={640}>
          <SiteDesktop startBuilt scrollAt={10} />
        </BrowserMockup>
      </div>
      <div style={{ position: "absolute", left: 600, top: 860, ...enterStyle(phone, 70), opacity: phone * (1 - out) }}>
        <PhoneMockup width={280}>
          <SiteMobile from={14} {...reel01.contact} />
        </PhoneMockup>
      </div>
      <KineticTitle {...reel01.titles.webContacto} from={6} exitAt={d - 8} />
    </>
  );
}
