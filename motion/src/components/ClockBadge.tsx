import type { CSSProperties } from "react";
import { fary } from "../theme/fary";
import { Chip } from "./Chip";

/** Hora de la escena con un pequeño reloj analógico (agujas fijas según la hora). */
export function ClockBadge({ time, delay = 0, style }: { time: string; delay?: number; style?: CSSProperties }) {
  const [h, m] = time.split(/[: ]/).map(Number);
  const hourDeg = ((h % 12) + m / 60) * 30;
  const minDeg = m * 6;
  const hand = (deg: number, len: number) => ({ x2: 14 + len * Math.sin((deg * Math.PI) / 180), y2: 14 - len * Math.cos((deg * Math.PI) / 180) });
  return (
    <Chip
      delay={delay}
      style={style}
      icon={
        <svg width={28} height={28} viewBox="0 0 28 28">
          <circle cx={14} cy={14} r={12} fill="none" stroke={fary.color.signal} strokeWidth={2.5} />
          <line x1={14} y1={14} {...hand(hourDeg, 6)} stroke={fary.color.blanco} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={14} y1={14} {...hand(minDeg, 9)} stroke={fary.color.blanco} strokeWidth={2} strokeLinecap="round" />
        </svg>
      }
    >
      {time}
    </Chip>
  );
}
