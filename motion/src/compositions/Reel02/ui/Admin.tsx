import type { ReactNode } from "react";
import { interpolate } from "remotion";
import { project } from "../camera";
import { HERO } from "../city/layout";
import { s, scenes } from "../timeline";
import { clamp, easeInOut, Icon, pop, prog, ui, type IconName } from "./kit";
import { STORE } from "./Store";

/**
 * Escena 5 — gestión centralizada. El pedido entra al edificio y los módulos reaccionan en
 * cadena: pedidos, inventario, ventas, reportes y la tienda web. Datos de ejemplo.
 */
const T = {
  order: s(30.0),
  orders: s(31.0),
  stock: s(31.6),
  sales: s(32.2),
  reports: s(32.8),
  web: s(33.4),
  mobile: s(34.0),
};

/** Ancho de cada módulo: deja libre el centro, donde se ve el edificio. */
const CW = 390;

type Mod = { id: string; title: string; icon: IconName; x: number; y: number; floor: number };
const mods: Mod[] = [
  { id: "pedidos", title: "Pedidos", icon: "list", x: 52, y: 590, floor: 2.35 },
  { id: "inventario", title: "Inventario", icon: "box", x: 638, y: 590, floor: 2.2 },
  { id: "ventas", title: "Ventas", icon: "chart", x: 52, y: 830, floor: 1.95 },
  { id: "gastos", title: "Gastos", icon: "wallet", x: 638, y: 830, floor: 1.8 },
  { id: "reportes", title: "Reportes", icon: "chart", x: 52, y: 1070, floor: 1.6 },
  { id: "web", title: "Tienda web", icon: "globe", x: 638, y: 1070, floor: 1.5 },
];

export function Admin({ frame }: { frame: number }) {
  const { gestion } = scenes;
  if (frame < gestion.from - 2 || frame > gestion.to + 16) return null;
  const leave = prog(frame, gestion.to - 4, 16, easeInOut);
  const center = project(frame, [HERO.x, HERO.h + 0.6, HERO.z]);
  // El pedido confirmado vuela hacia el edificio.
  const fly = prog(frame, gestion.from, 20, easeInOut);
  const chip = 1 - prog(frame, T.orders - 4, 8);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {mods.map((m, i) => {
          const a = prog(frame, gestion.from + 8 + i * 3, 16);
          const p = project(frame, [HERO.x + (i % 2 ? 0.6 : -0.6), m.floor, HERO.z + 0.2]);
          const tx = m.x + (i % 2 ? 0 : CW);
          const ty = m.y + 100;
          return <line key={m.id} x1={p.x} y1={p.y} x2={interpolate(a, [0, 1], [p.x, tx])} y2={interpolate(a, [0, 1], [p.y, ty])} stroke="rgba(56,221,245,0.55)" strokeWidth={2} strokeDasharray="6 8" />;
        })}
      </svg>
      {mods.map((m, i) => {
        const a = pop(frame, gestion.from + 8 + i * 3);
        const fx = center.x - (m.x + CW / 2);
        const fy = center.y - (m.y + 100);
        return (
          <div
            key={m.id}
            style={{
              position: "absolute",
              left: m.x,
              top: m.y,
              width: CW,
              height: 206,
              opacity: Math.min(1, a * 1.4),
              transform: `perspective(1400px) translate(${(1 - a) * fx}px, ${(1 - a) * fy}px) scale(${0.3 + 0.7 * a}) rotateY(${(i % 2 ? -1 : 1) * 10}deg) rotateX(6deg)`,
            }}
          >
            <Module m={m} frame={frame} />
          </div>
        );
      })}
      {/* Pedido en vuelo */}
      {chip > 0 && (
        <div style={{ position: "absolute", left: interpolate(fly, [0, 1], [310, center.x]), top: interpolate(fly, [0, 1], [900, center.y]), transform: `translate(-50%,-50%) scale(${1 - 0.5 * fly})`, opacity: chip }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 18, background: ui.azul, color: "#fff", font: `700 24px ${ui.font}`, boxShadow: "0 0 40px rgba(37,99,235,0.8)" }}>
            <Icon name="box" size={24} color="#fff" /> Pedido #0145
          </div>
        </div>
      )}
      {/* Mismo sistema en el móvil */}
      <MobileNotice frame={frame} />
      <div style={{ position: "absolute", left: 72, top: 1300, font: `600 19px ${ui.font}`, letterSpacing: "0.2em", color: "#8E99AE", opacity: prog(frame, gestion.from + 30, 12) }}>
        PANEL WEB Y APP MÓVIL · DATOS DE EJEMPLO
      </div>
    </div>
  );
}

function Card({ m, children, highlight }: { m: Mod; children: ReactNode; highlight: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 24,
        padding: "20px 22px",
        background: "linear-gradient(160deg, rgba(30,37,50,0.94), rgba(16,20,28,0.94))",
        border: `1.5px solid rgba(${highlight > 0 ? "56,221,245" : "255,255,255"},${0.09 + 0.45 * highlight})`,
        boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 ${40 * highlight}px rgba(37,99,235,${0.45 * highlight})`,
        color: ui.texto,
        fontFamily: ui.font,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, font: `700 22px ${ui.font}`, color: "#DDE3EE" }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(37,99,235,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={m.icon} size={22} color="#7FA6FF" />
        </span>
        {m.title}
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

const flash = (f: number, at: number) => interpolate(f, [at, at + 4, at + 26], [0, 1, 0], clamp);

function Module({ m, frame }: { m: Mod; frame: number }) {
  if (m.id === "pedidos") {
    const inP = prog(frame, T.orders, 12);
    const rows = [
      { id: "#0145", who: "Delivery · $8,00", tag: "Nuevo", fresh: true },
      { id: "#0144", who: "Retiro · $12,40", tag: "Listo", fresh: false },
    ];
    return (
      <Card m={m} highlight={flash(frame, T.orders)}>
        {rows.map((r, i) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderTop: i ? "1px solid rgba(255,255,255,0.07)" : "none", opacity: r.fresh ? inP : 1, transform: r.fresh ? `translateX(${(1 - inP) * -30}px)` : `translateY(${(1 - inP) * -44}px)` }}>
            <span style={{ font: `700 21px ${ui.font}` }}>
              {r.id} <span style={{ color: ui.suave, fontWeight: 500, fontSize: 17 }}>{r.who}</span>
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, padding: "5px 10px", borderRadius: 8, background: r.fresh ? ui.azul : "rgba(255,255,255,0.08)", color: "#fff" }}>{r.tag}</span>
          </div>
        ))}
      </Card>
    );
  }
  if (m.id === "inventario") {
    const done = prog(frame, T.stock, 10);
    const n = frame >= T.stock + 4 ? 23 : 24;
    return (
      <Card m={m} highlight={flash(frame, T.stock)}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={{ fontSize: 19, color: ui.suave }}>Café molido 500 g</span>
          <span style={{ font: `900 44px ${ui.display}`, color: done > 0 ? "#fff" : "#DDE3EE" }}>{n}</span>
        </div>
        <div style={{ marginTop: 12, height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ width: `${(n / 40) * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${ui.azul}, ${ui.cian})` }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 16, color: ui.suave }}>{frame >= T.stock + 4 ? "−1 · actualizado al confirmar el pedido" : "Unidades disponibles"}</div>
      </Card>
    );
  }
  if (m.id === "ventas") {
    const k = prog(frame, T.sales, 18);
    const total = 412.8 + 8 * k;
    const pts = [30, 44, 38, 56, 52, 64, 64 + 14 * k];
    return (
      <Card m={m} highlight={flash(frame, T.sales)}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, color: ui.suave }}>Hoy</div>
            <div style={{ font: `900 40px ${ui.display}` }}>${total.toFixed(2).replace(".", ",")}</div>
          </div>
          <svg width={150} height={70} viewBox="0 0 200 80" preserveAspectRatio="none">
            <polyline points={pts.map((v, i) => `${i * 33},${80 - v}`).join(" ")} fill="none" stroke={ui.cian} strokeWidth={3} strokeLinejoin="round" />
            <circle cx={198} cy={80 - pts[6]} r={5} fill={ui.cian} opacity={k} />
          </svg>
        </div>
      </Card>
    );
  }
  if (m.id === "gastos") {
    const rows: [string, number][] = [
      ["Proveedores", 0.62],
      ["Servicios", 0.24],
      ["Envíos", 0.14],
    ];
    return (
      <Card m={m} highlight={0}>
        {rows.map(([label, v]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9, fontSize: 17, color: ui.suave }}>
            <span style={{ width: 104 }}>{label}</span>
            <span style={{ flex: 1, height: 8, borderRadius: 5, background: "rgba(255,255,255,0.08)" }}>
              <span style={{ display: "block", width: `${v * 100 * prog(frame, scenes.gestion.from + 20, 20)}%`, height: "100%", borderRadius: 5, background: "#5B6B8C" }} />
            </span>
          </div>
        ))}
      </Card>
    );
  }
  if (m.id === "reportes") {
    const bars = [0.42, 0.55, 0.48, 0.66, 0.6, 0.72, 0.5 + 0.3 * prog(frame, T.reports, 16)];
    return (
      <Card m={m} highlight={flash(frame, T.reports)}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 100 }}>
          {bars.map((v, i) => (
            <div key={i} style={{ flex: 1, height: `${v * 100}%`, borderRadius: 6, background: i === 6 ? `linear-gradient(180deg, ${ui.cian}, ${ui.azul})` : "rgba(255,255,255,0.14)" }} />
          ))}
        </div>
      </Card>
    );
  }
  // Tienda web
  const on = prog(frame, T.web, 10);
  return (
    <Card m={m} highlight={flash(frame, T.web)}>
      <div style={{ fontSize: 18, color: ui.suave }}>{STORE.name.toLowerCase().replace(" ", "")}.tienda</div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, font: `600 19px ${ui.font}` }}>
        <span style={{ width: 28, height: 28, borderRadius: 15, background: `rgba(37,99,235,${0.3 + 0.7 * on})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={17} color="#fff" stroke={3} />
        </span>
        Stock actualizado en la tienda
      </div>
    </Card>
  );
}

function MobileNotice({ frame }: { frame: number }) {
  const a = pop(frame, T.mobile);
  if (frame < T.mobile) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 180, top: 1350, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 22, background: "rgba(245,245,243,0.97)", color: ui.tinta, fontFamily: ui.font, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
        <span style={{ width: 50, height: 50, borderRadius: 14, background: ui.tinta, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="store" size={26} color="#fff" />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ font: `700 21px ${ui.font}` }}>Nuevo pedido #0145</div>
          <div style={{ fontSize: 17, color: "#5D6678", marginTop: 2 }}>Café molido 500 g · Delivery · $8,00</div>
        </div>
        <span style={{ fontSize: 15, color: "#5D6678" }}>ahora</span>
      </div>
    </div>
  );
}

