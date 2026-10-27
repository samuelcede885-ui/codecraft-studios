import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Scene3D } from "./Scene3D";
import { project } from "./camera";
import { mainRoutes } from "./city/layout";
import { palette } from "./city/materials";
import { drivers, routeProgress } from "./drivers";
import { audio } from "./audio";
import { Admin } from "./ui/Admin";
import { Automation } from "./ui/Automation";
import { Community } from "./ui/Community";
import { EndCard } from "./ui/EndCard";
import { HeadlineVeil, Headlines } from "./ui/Headline";
import { CityPings, MerchantMessages, StressTint } from "./ui/Messages";
import { Icon, pop, ui } from "./ui/kit";
import { Store } from "./ui/Store";

/**
 * REEL 02 — "Conectando el comercio venezolano". Una sola ciudad 3D (Three.js) y una sola cámara;
 * las interfaces (DOM) se anclan a la ciudad proyectando puntos 3D con esa misma cámara.
 */
export function Reel02() {
  const frame = useCurrentFrame();
  const d = drivers(frame);
  return (
    <AbsoluteFill style={{ background: palette.fondo }}>
      <AbsoluteFill style={{ filter: d.freeze > 0 ? `grayscale(${0.85 * d.freeze}) brightness(${1 - 0.18 * d.freeze})` : undefined }}>
        <Scene3D />
        <StressTint frame={frame} stress={d.stress} />
        <CityPings frame={frame} />
        <MerchantMessages frame={frame} />
      </AbsoluteFill>
      <HeadlineVeil frame={frame} />
      <ConnectedChips frame={frame} main={d.main} />
      <Store frame={frame} />
      <Admin frame={frame} />
      <Automation frame={frame} />
      <Community frame={frame} />
      <EndCard frame={frame} />
      <Headlines frame={frame} />
      <AudioTracks />
    </AbsoluteFill>
  );
}

/** Escena 3: cada comercio que alcanza la línea azul muestra "Conectado". */
function ConnectedChips({ frame, main }: { frame: number; main: number }) {
  if (main <= 0 || frame > 620) return null;
  return (
    <>
      {mainRoutes.map((r, i) => {
        const p = routeProgress(main, r.start, r.dur);
        if (p < 1) return null;
        const done = r.start * (1 - r.dur) + r.dur;
        const at = frame - Math.round((main - done) * 140);
        const a = pop(frame, at) * Math.max(0, Math.min(1, (612 - frame) / 10));
        const end = r.points[r.points.length - 1];
        const q = project(frame, [end[0], 0.9, end[2]]);
        if (q.behind) return null;
        return (
          <div key={i} style={{ position: "absolute", left: Math.min(830, Math.max(150, q.x)), top: Math.min(1420, Math.max(640, q.y)), transform: `translate(-50%,-100%) scale(${a})`, transformOrigin: "50% 100%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 14, background: ui.azul, color: "#fff", font: `700 19px ${ui.font}`, boxShadow: "0 0 26px rgba(37,99,235,0.7)", whiteSpace: "nowrap" }}>
              <Icon name="check" size={18} color="#fff" stroke={2.6} /> Conectado
            </div>
          </div>
        );
      })}
    </>
  );
}

function AudioTracks() {
  return (
    <>
      {audio.music && <Audio src={staticFile(audio.music.src)} volume={audio.music.volume} />}
      {audio.voice && <Audio src={staticFile(audio.voice.src)} volume={audio.voice.volume} />}
      {audio.effects && <Audio src={staticFile(audio.effects.src)} volume={audio.effects.volume} />}
    </>
  );
}
