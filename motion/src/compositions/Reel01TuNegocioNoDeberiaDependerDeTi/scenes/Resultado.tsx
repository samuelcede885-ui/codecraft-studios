import { Sequence } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { ClockBadge } from "../../../components/ClockBadge";
import { KineticTitle } from "../../../components/KineticTitle";

/** 0:24–0:28 — Plano general con todo conectado; de vuelta en la oficina, vacía, a las 12:03 AM. */
export function Resultado() {
  const d = reel01.scenes.resultado.duration;
  return (
    <>
      <KineticTitle {...reel01.titles.conectado} from={6} exitAt={52} />
      <Sequence from={56} layout="none">
        <KineticTitle {...reel01.titles.sigue} from={4} exitAt={d - 56 - 6} />
      </Sequence>
      <div style={{ position: "absolute", left: fary.safe.left, top: 1330 }}>
        <ClockBadge time={reel01.clock.resultado} delay={74} />
      </div>
    </>
  );
}
