import { Sequence } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { ClockBadge } from "../../../components/ClockBadge";
import { KineticTitle } from "../../../components/KineticTitle";

/** 0:21–0:24 — Plano general con todo conectado; de vuelta en la oficina, ya vacía, a las 12:03 AM. */
export function Resultado() {
  const d = reel01.scenes.resultado.duration;
  return (
    <>
      <KineticTitle {...reel01.titles.sigue} from={6} exitAt={56} />
      <Sequence from={60} layout="none">
        <KineticTitle {...reel01.titles.sinTi} from={4} exitAt={d - 60 - 6} />
      </Sequence>
      <div style={{ position: "absolute", left: fary.safe.left, top: 1330 }}>
        <ClockBadge time={reel01.clock.resultado} delay={74} />
      </div>
    </>
  );
}
