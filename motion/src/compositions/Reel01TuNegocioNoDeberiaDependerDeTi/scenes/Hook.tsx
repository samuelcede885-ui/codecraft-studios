import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { ClockBadge } from "../../../components/ClockBadge";
import { KineticTitle } from "../../../components/KineticTitle";

/** 0:00–0:03 — La ciudad duerme; una sola oficina encendida y alguien trabajando a las 11:47 PM. */
export function Hook() {
  const d = reel01.scenes.hook.duration;
  return (
    <>
      <KineticTitle {...reel01.titles.hook} from={-10} exitAt={d - 8} />
      <div style={{ position: "absolute", left: fary.safe.left, top: 1330, opacity: 1 }}>
        <ClockBadge time={reel01.clock.hook} delay={22} />
      </div>
    </>
  );
}
