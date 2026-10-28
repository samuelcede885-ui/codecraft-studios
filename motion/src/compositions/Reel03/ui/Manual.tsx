import { interpolate } from "remotion";
import { s, scenes } from "../timeline";
import { easeInOut, Icon, pop, prog, ui } from "../../Reel02/ui/kit";
import { shopPoint } from "./Overlays";

/**
 * La tienda SIN Fary Labs: no está abandonada; simplemente todo pasa por las manos del dueño.
 * Mensajes que llegan sin parar (escenas 2–5) y herramientas separadas (escena 4).
 */
const chats = [
  { at: s(6.8), text: "¿Cuánto cuesta?", x: 60, y: 420 },
  { at: s(7.5), text: "¿Está disponible?", x: 150, y: 520 },
  { at: s(8.3), text: "¿Cómo pago?", x: 70, y: 620 },
  { at: s(9.1), text: "¿Hacen entregas?", x: 120, y: 720 },
  { at: s(9.8), text: "¿Me pasas el catálogo?", x: 50, y: 820 },
  { at: s(10.6), text: "¿Ya viste mi pago?", x: 160, y: 470 },
  { at: s(11.3), text: "¿Siguen abiertos?", x: 60, y: 570 },
  { at: s(12.0), text: "¿Cuánto cuesta?", x: 140, y: 670 },
  { at: s(12.7), text: "¿Tienen harina?", x: 70, y: 770 },
];

export function ManualChats({ frame }: { frame: number }) {
  const { problema, transformacion } = scenes;
  const show = prog(frame, problema.from + 10, 10) * (1 - prog(frame, transformacion.from + s(1.2), 14, easeInOut));
  if (show <= 0) return null;
  const door = shopPoint(frame, "manual", 1.0);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: show }}>
      {chats.map((c, i) => {
        if (frame < c.at) return null;
        const a = pop(frame, c.at);
        const age = (frame - c.at) / 30;
        const older = chats.filter((o) => frame >= o.at).length - 1 - i;
        const x = interpolate(a, [0, 1], [door.x - 160, c.x]);
        const y = interpolate(a, [0, 1], [door.y, c.y - age * 6]);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: a * Math.max(0.3, 1 - older * 0.12), transform: `scale(${0.6 + 0.4 * a})`, transformOrigin: "0 50%", filter: older > 4 ? "blur(1.5px)" : undefined }}>
            <ChatNote text={c.text} n={1 + ((i * 3) % 4)} />
          </div>
        );
      })}
    </div>
  );
}

/** Notificación de chat genérica (sin logotipos de terceros). */
function ChatNote({ text, n }: { text: string; n: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderRadius: 20, borderBottomLeftRadius: 6, background: "rgba(245,245,243,0.97)", color: ui.tinta, font: `600 26px ${ui.font}`, whiteSpace: "nowrap", boxShadow: "0 14px 34px rgba(0,0,0,0.5)" }}>
      <span style={{ position: "relative", width: 34, height: 34, borderRadius: 17, background: "#2BB673", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="chat" size={18} color="#fff" stroke={2.4} />
        <span style={{ position: "absolute", top: -6, right: -8, minWidth: 20, height: 20, borderRadius: 10, background: "#0D1018", color: "#fff", font: `800 13px ${ui.font}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      </span>
      {text}
    </div>
  );
}

/** Escena 4 (corte): herramientas separadas que el dueño va alternando una tras otra. */
export function ManualTools({ frame }: { frame: number }) {
  const { administracion } = scenes;
  const show = prog(frame, administracion.from - 4, 14) * (1 - prog(frame, administracion.to - 6, 12, easeInOut));
  if (show <= 0) return null;
  // Herramienta activa: cambia cada 0,6 s (el dueño salta de una a otra).
  const active = Math.floor((frame - administracion.from) / 18) % 4;
  const tools = [
    { x: 40, y: 410, r: -4, el: <Sheet /> },
    { x: 230, y: 610, r: 5, el: <Notebook /> },
    { x: 30, y: 760, r: -6, el: <Sticky text={"Pedido de Carlos\n¿pagó?"} /> },
    { x: 330, y: 420, r: 7, el: <Calc /> },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: show }}>
      {tools.map((tl, i) => {
        const a = pop(frame, administracion.from + i * 4);
        const on = i === active;
        return (
          <div key={i} style={{ position: "absolute", left: tl.x, top: tl.y, transform: `rotate(${tl.r}deg) scale(${(0.7 + 0.3 * a) * (on ? 1.06 : 0.96)})`, opacity: a * (on ? 1 : 0.62), zIndex: on ? 2 : 1, filter: on ? "drop-shadow(0 0 22px rgba(255,197,138,0.45))" : undefined }}>
            {tl.el}
          </div>
        );
      })}
    </div>
  );
}

function Sheet() {
  const rows = [
    ["Fecha", "Pedido", "Monto"],
    ["27/10", "Ana", "9,80"],
    ["27/10", "Luis", "¿?"],
    ["28/10", "Carlos", "12,40"],
    ["28/10", "—", ""],
  ];
  return (
    <div style={{ width: 300, borderRadius: 12, overflow: "hidden", background: "#F7F7F5", boxShadow: "0 18px 40px rgba(0,0,0,0.55)", font: `500 17px ${ui.font}`, color: "#2A2F38" }}>
      <div style={{ padding: "8px 12px", background: "#DCDDD8", font: `700 15px ${ui.font}` }}>ventas_octubre.xlsx</div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 70px", borderTop: "1px solid #D5D6D2", fontWeight: i ? 500 : 700 }}>
          {r.map((c, k) => (
            <span key={k} style={{ padding: "6px 10px", borderLeft: k ? "1px solid #D5D6D2" : "none" }}>
              {c}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Notebook() {
  const lines = ["Ventas de hoy", "Harina x3 — 3,90", "Café — 6,50 (fiado)", "Pagar proveedor"];
  return (
    <div style={{ width: 250, padding: "16px 18px", borderRadius: 10, background: "#EFE8D8", boxShadow: "0 18px 40px rgba(0,0,0,0.55)", font: `italic 500 19px/1.7 ${ui.font}`, color: "#3A342C", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 31px, rgba(80,90,110,0.25) 31px 32px)" }}>
      {lines.map((l, i) => (
        <div key={i} style={{ fontWeight: i ? 500 : 700 }}>
          {l}
        </div>
      ))}
    </div>
  );
}

function Sticky({ text }: { text: string }) {
  return <div style={{ width: 190, padding: 16, background: "#E8DFC8", boxShadow: "0 14px 30px rgba(0,0,0,0.5)", font: `italic 600 21px/1.35 ${ui.font}`, color: "#3A342C", whiteSpace: "pre-line" }}>{text}</div>;
}

function Calc() {
  return (
    <div style={{ width: 150, padding: 12, borderRadius: 16, background: "#23272F", boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
      <div style={{ height: 44, borderRadius: 8, background: "#B9C2A8", color: "#1C2016", font: `700 24px ${ui.font}`, textAlign: "right", padding: "6px 10px" }}>612,4</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 10 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ height: 20, borderRadius: 5, background: i % 4 === 3 ? "#5A606C" : "#3A3F49" }} />
        ))}
      </div>
    </div>
  );
}

/** Escena 5: alrededor de la tienda manual, tareas sueltas que siguen en curso (sin cifras). */
export function ManualScatter({ frame }: { frame: number }) {
  const { diferencia } = scenes;
  const show = prog(frame, diferencia.from + 10, 14) * (1 - prog(frame, diferencia.to - 6, 12, easeInOut));
  if (show <= 0) return null;
  const p = shopPoint(frame, "manual", 1.6);
  const items: { icon: Parameters<typeof Icon>[0]["name"]; text: string; dx: number; dy: number }[] = [
    { icon: "chat", text: "Responder", dx: -200, dy: -150 },
    { icon: "list", text: "Anotar pedido", dx: -40, dy: -230 },
    { icon: "wallet", text: "Cuadrar caja", dx: -230, dy: -40 },
    { icon: "box", text: "Contar stock", dx: -60, dy: -110 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: show }}>
      {items.map((it, i) => {
        const wob = Math.sin(frame / 9 + i * 1.7) * 4;
        const a = pop(frame, diferencia.from + 12 + i * 5);
        return (
          <div key={it.text} style={{ position: "absolute", left: Math.max(60, p.x + it.dx), top: p.y + it.dy + wob, opacity: a, transform: `scale(${0.7 + 0.3 * a})` }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 14, background: "rgba(30,26,22,0.9)", border: "1.5px dashed rgba(255,197,138,0.5)", color: "#F2E6D6", font: `600 20px ${ui.font}`, whiteSpace: "nowrap" }}>
              <Icon name={it.icon} size={18} color={ui.calido} />
              {it.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}


