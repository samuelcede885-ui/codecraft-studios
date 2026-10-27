import { interpolate } from "remotion";
import { project } from "../camera";
import { HERO, city } from "../city/layout";
import { FREEZE, s, scenes } from "../timeline";
import { UNFREEZE } from "../drivers";
import { clamp, easeInOut, Icon, pop, prog, ui } from "./kit";
import { messages, pending, unread } from "./messages";

const frozen = (f: number) => (f < FREEZE ? f : f < UNFREEZE ? FREEZE : f);

/** Escena 1: el comercio y sus vecinos empiezan a recibir mensajes y pedidos. */
export function CityPings({ frame }: { frame: number }) {
  const show = Math.min(prog(frame, s(4.3), 10), 1 - prog(frame, s(5.7), 8));
  if (show <= 0) return null;
  const roof = project(frame, [HERO.x + 0.6, HERO.h + 0.2, HERO.z + HERO.d / 2 + 0.3]);
  const neighbors = city.shops.filter((b) => b.dist > 3 && b.dist < 9).slice(0, 9);
  const count = unread(frame);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: show }}>
      {neighbors.map((b, i) => {
        const p = project(frame, [b.shop!.door[0], 0.75, b.shop!.door[2]]);
        const a = pop(frame, s(4.5) + i * 4);
        if (p.behind || a <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%,-100%) scale(${a})`, transformOrigin: "50% 100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 11px", borderRadius: 14, background: "rgba(245,245,243,0.95)", color: ui.tinta, font: `700 19px ${ui.font}`, boxShadow: "0 8px 22px rgba(0,0,0,0.45)" }}>
              <Icon name="chat" size={18} color={ui.tinta} stroke={2.2} />
              {2 + ((i * 3) % 7)}
            </div>
          </div>
        );
      })}
      {!roof.behind && (
        <div style={{ position: "absolute", left: Math.min(620, Math.max(72, roof.x)), top: Math.max(700, roof.y), transform: "translateY(-100%)" }}>
          {messages.slice(0, 2).map((m, i) => {
            const a = pop(frame, m.at);
            return (
              <div key={i} style={{ marginBottom: 12, opacity: a, transform: `translateY(${(1 - a) * 20}px) scale(${0.9 + 0.1 * a})` }}>
                <Bubble text={m.text} />
              </div>
            );
          })}
          <Badge n={count} />
        </div>
      )}
    </div>
  );
}

function Bubble({ text, tone = "light" }: { text: string; tone?: "light" | "dark" }) {
  const light = tone === "light";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 22px",
        borderRadius: 22,
        borderBottomLeftRadius: 6,
        background: light ? "rgba(245,245,243,0.97)" : "rgba(23,28,38,0.92)",
        color: light ? ui.tinta : ui.texto,
        font: `600 30px ${ui.font}`,
        whiteSpace: "nowrap",
        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        border: light ? "none" : `1.5px solid ${ui.borde}`,
      }}
    >
      <Icon name="chat" size={26} color={light ? "#5D6678" : ui.suave} />
      {text}
    </div>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 30, background: ui.azul, color: "#fff", font: `800 26px ${ui.font}`, boxShadow: "0 0 30px rgba(37,99,235,0.6)" }}>
      <Icon name="bell" size={24} color="#fff" stroke={2.2} />
      {n} sin leer
    </div>
  );
}

/** Escena 2: mensajes que se acumulan alrededor del comerciante y pedidos pendientes. */
export function MerchantMessages({ frame }: { frame: number }) {
  const { problema } = scenes;
  const t = frozen(frame);
  const show = Math.min(prog(frame, problema.from + 4, 10), 1 - prog(frame, UNFREEZE, 14, easeInOut));
  if (show <= 0) return null;
  const phone = project(frame, [HERO.x - 0.07, 0.62, HERO.z - 0.14]);
  const scatter = prog(frame, UNFREEZE, 16, easeInOut);
  const visible = messages.filter((m) => m.at >= s(7.5) || frame < problema.from + 30);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: show }}>
      {visible.map((m, i) => {
        if (frame < m.at) return null;
        const a = pop(t, m.at);
        const age = (t - m.at) / 30;
        const left = m.side === "left";
        // Hueco asignado: dos columnas, de abajo hacia arriba según el orden de llegada.
        const slot = i;
        const tx = left ? 80 + (slot % 3) * 26 : 1000 - (slot % 3) * 26;
        const ty = 1180 - slot * 68 - age * 12;
        const x = interpolate(a, [0, 1], [phone.x, tx]);
        const y = interpolate(a, [0, 1], [phone.y, ty]);
        const old = Math.max(0, visible.filter((v) => frame >= v.at).length - 1 - i);
        const dim = Math.max(0.35, 1 - old * 0.09);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(${left ? "0" : "-100%"}, -50%) scale(${(0.55 + 0.45 * a) * (1 - 0.4 * scatter)})`,
              transformOrigin: left ? "0 50%" : "100% 50%",
              opacity: a * dim * (1 - scatter),
              filter: old > 3 ? `blur(${Math.min(3, (old - 3) * 0.8)}px)` : undefined,
            }}
          >
            <Bubble text={m.text} tone={i % 2 ? "dark" : "light"} />
          </div>
        );
      })}
      {/* Contador sobre el teléfono */}
      {!phone.behind && frame >= s(7.9) && (
        <div style={{ position: "absolute", left: phone.x + 30, top: phone.y - 60, transform: `scale(${pop(t, s(7.9))})` }}>
          <div style={{ minWidth: 64, height: 64, padding: "0 14px", borderRadius: 32, background: ui.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: `800 32px ${ui.font}`, boxShadow: "0 0 34px rgba(37,99,235,0.7)" }}>
            {unread(t)}
          </div>
        </div>
      )}
      {/* Pedidos pendientes */}
      <div style={{ position: "absolute", left: 72, right: 180, top: 1290 }}>
        {pending.map((p, i) => {
          const a = pop(t, p.at);
          if (frame < p.at) return null;
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: i * 18,
                top: -i * 20,
                width: 640,
                opacity: a * (1 - scatter),
                transform: `translateY(${(1 - a) * 40}px)`,
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "20px 24px",
                borderRadius: 20,
                background: "rgba(23,28,38,0.94)",
                border: `1.5px solid ${ui.borde}`,
                boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
                color: ui.texto,
                font: `500 26px ${ui.font}`,
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="box" size={28} color={ui.suave} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `700 26px ${ui.font}` }}>Pedido {p.id}</div>
                <div style={{ color: ui.suave, fontSize: 23, marginTop: 4 }}>{p.text}</div>
              </div>
              <div style={{ font: `700 20px ${ui.font}`, letterSpacing: "0.08em", color: "#C9CFDA", padding: "8px 12px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.16)" }}>PENDIENTE</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Oscurecimiento por saturación y congelado (escala de grises) antes de la línea azul. */
export function StressTint({ frame, stress }: { frame: number; stress: number }) {
  const flash = interpolate(frame, [UNFREEZE - 2, UNFREEZE + 3, UNFREEZE + 16], [0, 1, 0], clamp);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 55% at 50% 52%, rgba(0,0,0,0) 30%, rgba(4,5,8,${0.55 * stress}) 100%)` }} />
      {flash > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 40% at 50% 60%, rgba(37,99,235,${0.35 * flash}), rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />}
    </>
  );
}
