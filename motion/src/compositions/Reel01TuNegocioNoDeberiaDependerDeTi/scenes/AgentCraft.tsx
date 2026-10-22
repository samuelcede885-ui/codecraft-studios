import { useCurrentFrame } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { progress } from "../../../lib/motion";
import { Chip } from "../../../components/Chip";
import { KineticTitle } from "../../../components/KineticTitle";
import { StatusCard } from "../../../components/StatusCard";

/** 0:17–0:21 — Llegan mensajes de web, email, chat y social; el agente los resuelve. */
export function AgentCraft() {
  const frame = useCurrentFrame();
  const d = reel01.scenes.agent.duration;
  const out = progress(frame, d - 9, 8);
  return (
    <>
      <div style={{ position: "absolute", left: fary.safe.left, top: 990, opacity: 1 - out }}>
        <Chip dot delay={30}>Agent Craft</Chip>
      </div>
      <div style={{ position: "absolute", left: fary.safe.left, top: 1085, opacity: 1 - out }}>
        <StatusCard title="Agente IA · ahora" items={reel01.agentTasks} delay={40} stagger={8} />
      </div>
      <KineticTitle {...reel01.titles.agent} from={8} exitAt={d - 8} />
    </>
  );
}
