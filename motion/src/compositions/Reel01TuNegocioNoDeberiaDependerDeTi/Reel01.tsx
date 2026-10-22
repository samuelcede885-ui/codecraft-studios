import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { fary } from "../../theme/fary";
import { reel01 } from "../../data/reels";
import { progress } from "../../lib/motion";
import { AudioLayer } from "../../components/AudioLayer";
import { CTAEndCard } from "../../components/CTAEndCard";
import { SafeAreaGuides } from "../../components/SafeArea";
import { ReelWorld } from "./ReelWorld";
import { AgentCraft } from "./scenes/AgentCraft";
import { AppCraft } from "./scenes/AppCraft";
import { Conecta } from "./scenes/Conecta";
import { Hook } from "./scenes/Hook";
import { Problema } from "./scenes/Problema";
import { Resultado } from "./scenes/Resultado";
import { WebCraft } from "./scenes/WebCraft";

/**
 * REEL 01 — "Tu negocio no debería depender de ti" (28 s).
 * HOOK → PROBLEMA → SISTEMA → DEMO (web, app, agente) → RESULTADO → CTA.
 */
export function Reel01({ guides = false }: { guides?: boolean }) {
  const frame = useCurrentFrame();
  const s = reel01.scenes;
  const end = progress(frame, s.final.from, 12);
  const scenes = [
    [s.hook, <Hook />],
    [s.problema, <Problema />],
    [s.conecta, <Conecta />],
    [s.web, <WebCraft />],
    [s.app, <AppCraft />],
    [s.agent, <AgentCraft />],
    [s.resultado, <Resultado />],
  ] as const;
  return (
    <AbsoluteFill style={{ background: fary.color.ink }}>
      <ReelWorld />
      {/* Legibilidad: el título vive sobre una zona más oscura; los bordes del mundo se apagan. */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,11,11,0.92) 0%, rgba(11,11,11,0.55) 20%, rgba(11,11,11,0) 34%, rgba(11,11,11,0) 72%, rgba(11,11,11,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(130% 75% at 50% 55%, rgba(11,11,11,0) 55%, rgba(11,11,11,0.85) 100%)" }} />
      {scenes.map(([sc, node], i) => (
        <Sequence key={i} from={sc.from} durationInFrames={sc.duration} layout="none">
          {node}
        </Sequence>
      ))}
      <Sequence from={s.final.from} layout="none">
        <AbsoluteFill style={{ opacity: end }}>
          <CTAEndCard {...reel01.end} />
        </AbsoluteFill>
      </Sequence>
      {reel01.audio && <AudioLayer {...reel01.audio} />}
      {guides && <SafeAreaGuides />}
    </AbsoluteFill>
  );
}
