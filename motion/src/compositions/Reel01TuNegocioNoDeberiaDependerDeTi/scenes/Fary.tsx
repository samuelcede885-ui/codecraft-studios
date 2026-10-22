import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { clamp, easeInOut, enterStyle, progress, ramp, useEnter } from "../../../lib/motion";
import { FaryMark } from "../../../components/FaryLogo";
import { KineticTitle } from "../../../components/KineticTitle";
import { SystemNode } from "../../../components/SystemNode";

const HUB = { x: 540, y: 1000 };
const nodes = [
  { label: "WEB", x: 250, y: 1300, at: 30 },
  { label: "APP", x: 540, y: 1390, at: 42 },
  { label: "AI", x: 830, y: 1300, at: 54 },
];

/** 0:06–0:09 — Baja la intensidad; el símbolo de Fary aparece como nodo y conecta WEB, APP y AI. */
export function Fary() {
  const frame = useCurrentFrame();
  const d = reel01.scenes.fary.duration;
  const dim = ramp(frame, 0, 14, d - 10, 10);
  const hub = useEnter(8, 20);
  const out = progress(frame, d - 9, 8);
  return (
    <>
      <AbsoluteFill style={{ background: fary.color.negro, opacity: 0.72 * dim }} />
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {nodes.map((n) => {
            const len = Math.hypot(n.x - HUB.x, n.y - HUB.y);
            const draw = interpolate(frame, [n.at - 14, n.at], [0, 1], { ...clamp, easing: easeInOut });
            return (
              <g key={n.label}>
                <line x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} stroke={fary.color.signal} strokeWidth={10} strokeOpacity={0.22} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} style={{ filter: "blur(6px)" }} />
                <line x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} stroke={fary.color.signal} strokeWidth={3.5} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", left: HUB.x - 95, top: HUB.y - 95, ...enterStyle(hub) }}>
          <SystemNode size={190} active={progress(frame, 22, 16)}>
            <FaryMark size={84} />
          </SystemNode>
        </div>
        {nodes.map((n) => (
          <Node key={n.label} {...n} />
        ))}
      </AbsoluteFill>
      <KineticTitle {...reel01.titles.fary} from={10} exitAt={d - 8} />
    </>
  );
}

function Node({ label, x, y, at }: { label: string; x: number; y: number; at: number }) {
  const frame = useCurrentFrame();
  const p = useEnter(at - 4, 16);
  return (
    <div style={{ position: "absolute", left: x - 70, top: y - 70, ...enterStyle(p) }}>
      <SystemNode size={140} active={progress(frame, at, 12)}>
        <span style={{ font: `800 34px ${fary.font.ui}`, letterSpacing: "0.08em" }}>{label}</span>
      </SystemNode>
    </div>
  );
}
