import { interpolate, useCurrentFrame } from "remotion";
import { fary } from "../../../theme/fary";
import { reel01 } from "../../../data/reels";
import { clamp, enterStyle, progress, useEnter } from "../../../lib/motion";
import { Icon, type IconName } from "../../../components/Icon";
import { KineticTitle } from "../../../components/KineticTitle";
import { NotificationBubble } from "../../../components/NotificationBubble";

/** Centro de la persona en pantalla (la cámara la encuadra ahí durante la escena). */
const PERSON = { x: 540, y: 1060 };
const tools: { icon: IconName; x: number; y: number }[] = [
  { icon: "chat", x: 300, y: 905 },
  { icon: "sheet", x: 780, y: 880 },
  { icon: "email", x: 230, y: 1110 },
  { icon: "calendar", x: 830, y: 1100 },
  { icon: "notes", x: 560, y: 820 },
];
const bubbles = [
  { left: 72, top: 560 },
  { left: 300, top: 690 },
  { left: 72, top: 1240 },
  { left: 340, top: 1370 },
];

/** 0:03–0:06 — Todo pasa por la persona: chat, hojas, correo, calendario, notas y consultas. */
export function Problema() {
  const frame = useCurrentFrame();
  const d = reel01.scenes.problema.duration;
  const out = progress(frame, d - 9, 8);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {tools.map((t, i) => (
            <line key={i} x1={t.x} y1={t.y} x2={PERSON.x} y2={PERSON.y - 40} stroke={fary.color.signal} strokeOpacity={0.5 * interpolate(frame, [6 + i * 4, 16 + i * 4], [0, 1], clamp)} strokeWidth={2} strokeDasharray="6 8" />
          ))}
        </svg>
        {tools.map((t, i) => (
          <Tool key={t.icon} {...t} delay={4 + i * 4} />
        ))}
        {reel01.notifications.map((n, i) => (
          <div key={n.text} style={{ position: "absolute", ...bubbles[i] }}>
            <NotificationBubble channel={n.channel} text={n.text} delay={18 + i * 6} />
          </div>
        ))}
      </div>
      <KineticTitle {...reel01.titles.problema} from={6} exitAt={d - 8} />
    </>
  );
}

function Tool({ icon, x, y, delay }: { icon: IconName; x: number; y: number; delay: number }) {
  const frame = useCurrentFrame();
  const p = useEnter(delay);
  const float = Math.sin((frame + delay * 7) / 14) * 6;
  return (
    <div style={{ position: "absolute", left: x - 42, top: y - 42 + float, width: 84, height: 84, borderRadius: 24, background: "rgba(20,21,23,0.95)", border: `1px solid rgba(${fary.signalRgb},0.45)`, display: "grid", placeItems: "center", color: fary.color.signal, ...enterStyle(p) }}>
      <Icon name={icon} size={38} />
    </div>
  );
}
