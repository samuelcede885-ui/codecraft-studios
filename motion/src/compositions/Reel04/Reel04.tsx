import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { palette } from "../Reel02/city/materials";
import { Scene3D } from "./Scene3D";
import { EndCard } from "./ui/EndCard";
import { ArepaMessages, BizLabels, Dashboard, FlowLabels, ShopFlow, VisionTag } from "./ui/Story";
import { TopVeil } from "./ui/Text";
import { Captions } from "./ui/Captions";
import { SceneLabels } from "./ui/Labels";

/**
 * REEL 04 — "Una Venezuela conectada". Animación explicativa en 3D (Three.js en Remotion):
 * un toque → un pedido → una ciudad de comercios → procesos separados → la conexión →
 * la visión. Interfaces DOM ancladas al 3D con la misma cámara. Visión en desarrollo.
 */
const audio = {
  music: { src: "audio/reel04/reel04-music.mp3", volume: 0.6 },
  voice: { src: "audio/reel04/reel04-voz.mp3", volume: 1 },
  effects: { src: "audio/reel04/reel04-sfx.mp3", volume: 0.7 },
};

export function Reel04() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: palette.fondo }}>
      <Scene3D />
      <TopVeil frame={frame} />
      <ShopFlow frame={frame} />
      <BizLabels frame={frame} />
      <ArepaMessages frame={frame} />
      <FlowLabels frame={frame} />
      <Dashboard frame={frame} />
      <VisionTag frame={frame} />
      <EndCard frame={frame} />
      <SceneLabels frame={frame} />
      <Captions frame={frame} />
      <Audio src={staticFile(audio.music.src)} volume={audio.music.volume} />
      <Audio src={staticFile(audio.voice.src)} volume={audio.voice.volume} />
      <Audio src={staticFile(audio.effects.src)} volume={audio.effects.volume} />
    </AbsoluteFill>
  );
}
