import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { palette } from "../Reel02/city/materials";
import { Scene3D } from "./Scene3D";
import { AdminApp, ConnectedSystems, CustomerPhone, WebAndFlow } from "./ui/Digital";
import { EndCard } from "./ui/EndCard";
import { ManualChats, ManualScatter, ManualTools } from "./ui/Manual";
import { Disclaimer, ShopLabels, Statements, Subtitles, TopVeil } from "./ui/Overlays";

/**
 * REEL 03 — "Dos negocios, dos formas de trabajar". Dos tiendas idénticas en la misma calle
 * (ciudad 3D del reel 02): a la izquierda todo es manual; a la derecha, Fary Labs.
 * Ejemplo ilustrativo con negocios ficticios. Interfaces DOM ancladas al 3D con la misma cámara.
 */
const audio = {
  music: { src: "audio/reel03/reel03-music.mp3", volume: 0.6 },
  voice: { src: "audio/reel03/reel03-voz.mp3", volume: 1 },
  effects: { src: "audio/reel03/reel03-sfx.mp3", volume: 0.7 },
};

export function Reel03() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: palette.fondo }}>
      <Scene3D />
      <TopVeil frame={frame} />
      <ManualChats frame={frame} />
      <ManualTools frame={frame} />
      <ManualScatter frame={frame} />
      <CustomerPhone frame={frame} />
      <WebAndFlow frame={frame} />
      <AdminApp frame={frame} />
      <ConnectedSystems frame={frame} />
      <ShopLabels frame={frame} />
      <Statements frame={frame} />
      <EndCard frame={frame} />
      <Disclaimer frame={frame} />
      <Subtitles frame={frame} />
      <Audio src={staticFile(audio.music.src)} volume={audio.music.volume} />
      <Audio src={staticFile(audio.voice.src)} volume={audio.voice.volume} />
      <Audio src={staticFile(audio.effects.src)} volume={audio.effects.volume} />
    </AbsoluteFill>
  );
}
