import { interpolate } from "remotion";
import { s, scenes } from "../timeline";
import { clamp, easeInOut, Icon, pop, prog, ui, type IconName } from "./kit";
import { STORE } from "./Store";

/**
 * Escena 6 — automatización e IA. Primero el flujo (cliente → tienda → pedido → panel →
 * notificación) y después el asistente que responde con la información del comercio.
 */
const nodes: { label: string; note: string; icon: IconName }[] = [
  { label: "Cliente", note: "Compra o pregunta", icon: "user" },
  { label: "Tienda digital", note: "Catálogo y pago", icon: "store" },
  { label: "Pedido", note: "Se registra solo", icon: "box" },
  { label: "Panel administrativo", note: "Stock y ventas al día", icon: "chart" },
  { label: "Notificación", note: "Aviso al comercio y al cliente", icon: "bell" },
];

const FLOW = s(36.7);
const STEP = s(0.62);
const CHAT = s(40.4);

export function Automation({ frame }: { frame: number }) {
  const { automatizacion } = scenes;
  if (frame < automatizacion.from || frame > automatizacion.to + 12) return null;
  const flowOut = prog(frame, CHAT - 8, 14, easeInOut);
  const leave = prog(frame, automatizacion.to - 6, 14, easeInOut);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      {flowOut < 1 && <Flow frame={frame} out={flowOut} />}
      {frame >= CHAT - 10 && <Chat frame={frame} />}
    </div>
  );
}

function Flow({ frame, out }: { frame: number; out: number }) {
  const top = 600;
  const gap = 150;
  // Pulso de datos que recorre los nodos.
  const head = (frame - FLOW) / STEP;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 1 - out, transform: `translateY(${-60 * out}px) scale(${1 - 0.06 * out})` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {nodes.slice(0, -1).map((_, i) => {
          const y1 = top + i * gap + 46;
          const y2 = top + (i + 1) * gap + 46;
          const k = interpolate(head, [i + 0.4, i + 1], [0, 1], clamp);
          return (
            <g key={i}>
              <line x1={174} y1={y1} x2={174} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
              <line x1={174} y1={y1} x2={174} y2={y1 + (y2 - y1) * k} stroke={ui.azul} strokeWidth={4} />
              {k > 0 && k < 1 && <circle cx={174} cy={y1 + (y2 - y1) * k} r={9} fill={ui.cian} style={{ filter: "drop-shadow(0 0 10px #38DDF5)" }} />}
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const a = pop(frame, FLOW - 10 + i * 4);
        const lit = interpolate(head, [i - 0.1, i + 0.2], [0, 1], clamp);
        return (
          <div key={n.label} style={{ position: "absolute", left: 128, top: top + i * gap, display: "flex", alignItems: "center", gap: 26, opacity: a, transform: `translateX(${(1 - a) * -40}px)` }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 30,
                background: lit > 0.5 ? ui.azul : "rgba(23,28,38,0.92)",
                border: `2px solid rgba(56,221,245,${0.15 + 0.6 * lit})`,
                boxShadow: `0 0 ${40 * lit}px rgba(37,99,235,${0.7 * lit})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={n.icon} size={42} color="#fff" />
            </div>
            <div>
              <div style={{ font: `800 36px ${ui.display}`, color: "#fff" }}>{n.label}</div>
              <div style={{ font: `500 25px ${ui.font}`, color: ui.suave, marginTop: 4 }}>{n.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Line = { at: number; who: "cliente" | "ia" | "typing"; text?: string; until?: number; product?: boolean };
const conversation: Line[] = [
  { at: s(40.7), who: "cliente", text: "¿Hacen delivery a Chacao?" },
  { at: s(41.0), until: s(41.5), who: "typing" },
  { at: s(41.5), who: "ia", text: "Sí. Entregamos en Chacao de 9:00 a 18:00. ¿Te ayudo con tu pedido?" },
  { at: s(42.4), who: "cliente", text: "¿Tienen café molido?" },
  { at: s(42.7), until: s(43.1), who: "typing" },
  { at: s(43.1), who: "ia", text: "Sí, quedan 23 unidades.", product: true },
];

function Chat({ frame }: { frame: number }) {
  const a = prog(frame, CHAT - 10, 16);
  return (
    <div style={{ position: "absolute", left: 92, right: 92, top: 590, opacity: a, transform: `translateY(${(1 - a) * 50}px) perspective(1600px) rotateX(${(1 - a) * 8}deg)` }}>
      <div style={{ borderRadius: 34, background: "rgba(18,22,31,0.94)", border: `1.5px solid ${ui.borde}`, boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(37,99,235,0.18)", overflow: "hidden", fontFamily: ui.font }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 26px", borderBottom: `1px solid ${ui.borde}` }}>
          <span style={{ width: 58, height: 58, borderRadius: 18, background: `linear-gradient(135deg, ${ui.azul}, ${ui.cian})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="spark" size={30} color="#fff" />
          </span>
          <div>
            <div style={{ font: `800 26px ${ui.font}`, color: "#fff" }}>Asistente IA</div>
            <div style={{ fontSize: 19, color: ui.suave, marginTop: 2 }}>{STORE.name} · responde con la información del comercio</div>
          </div>
        </div>
        <div style={{ padding: "22px 24px 26px", minHeight: 520, display: "flex", flexDirection: "column", gap: 16 }}>
          {conversation.map((l, i) => {
            if (frame < l.at || (l.until && frame >= l.until)) return null;
            const p = pop(frame, l.at);
            const mine = l.who === "cliente";
            return (
              <div key={i} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "82%", opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
                {l.who === "typing" ? (
                  <div style={{ display: "flex", gap: 8, padding: "18px 22px", borderRadius: 22, background: "rgba(255,255,255,0.07)" }}>
                    {[0, 1, 2].map((k) => (
                      <span key={k} style={{ width: 11, height: 11, borderRadius: 6, background: ui.suave, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame - l.at) / 4 + k)) }} />
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "16px 22px", borderRadius: 24, borderBottomRightRadius: mine ? 6 : 24, borderBottomLeftRadius: mine ? 24 : 6, background: mine ? "rgba(245,245,243,0.96)" : "rgba(37,99,235,0.16)", border: mine ? "none" : "1.5px solid rgba(56,221,245,0.35)", color: mine ? ui.tinta : "#EAF1FF", font: `500 27px/1.35 ${ui.font}` }}>
                    {l.text}
                    {l.product && (
                      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, padding: 12, borderRadius: 16, background: "rgba(255,255,255,0.08)" }}>
                        <span style={{ width: 48, height: 48, borderRadius: 12, background: ui.azul, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name="bag" size={26} color="#fff" />
                        </span>
                        <span style={{ flex: 1, font: `600 22px ${ui.font}` }}>Café molido 500 g · $6,50</span>
                        <span style={{ font: `700 20px ${ui.font}`, color: ui.cian }}>Comprar</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 18, textAlign: "center", font: `500 21px ${ui.font}`, color: "#8E99AE" }}>Las respuestas salen del catálogo y del panel · el comercio decide cuándo intervenir</div>
    </div>
  );
}
