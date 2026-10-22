import type { CSSProperties } from "react";
import { fary } from "../theme/fary";
import { enterStyle, useEnter } from "../lib/motion";
import { Icon } from "./Icon";

export type Channel = "chat" | "email" | "web" | "social" | "calendar" | "sheet" | "notes";

const name: Record<Channel, string> = { chat: "Chat", email: "Email", web: "Web", social: "Social", calendar: "Calendario", sheet: "Hoja de cálculo", notes: "Notas" };

/** Notificación entrante: canal + mensaje. `tone` cálido para el caos manual, verde para el sistema. */
export function NotificationBubble({ channel, text, delay = 0, tone = "warm", style }: { channel: Channel; text: string; delay?: number; tone?: "warm" | "accent"; style?: CSSProperties }) {
  const p = useEnter(delay);
  const c = tone === "warm" ? fary.color.warm : fary.color.accent;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 26px 18px 18px",
        borderRadius: 26,
        background: "rgba(243,243,243,0.96)",
        color: fary.color.black,
        boxShadow: "0 24px 60px -24px rgba(0,0,0,0.9)",
        width: "fit-content",
        ...enterStyle(p),
        ...style,
      }}
    >
      <div style={{ width: 54, height: 54, borderRadius: 16, background: fary.color.black, color: c, display: "grid", placeItems: "center" }}>
        <Icon name={channel} size={30} />
      </div>
      <div>
        <div style={{ font: `600 18px ${fary.font.ui}`, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B6B6B" }}>{name[channel]}</div>
        <div style={{ font: `600 30px/1.2 ${fary.font.ui}`, marginTop: 2 }}>{text}</div>
      </div>
    </div>
  );
}
