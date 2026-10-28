import type { ReactNode } from "react";
import { interpolate } from "remotion";
import { project } from "../camera";
import { BIZ, type BizId, drivers } from "../drivers";
import { s, scenes } from "../timeline";
import { SHELL } from "../city/Businesses";
import { STATIONS } from "../city/Explainers";
import { clamp, easeInOut, Icon, pop, prog, ProductArt, ui, type IconName } from "../../Reel02/ui/kit";

/**
 * Interfaces del reel 04. Todo es una demostración conceptual: comercios, productos y datos
 * son de ejemplo; la IA aparece como módulo integrable.
 */

// ── Escena 2: descubrir → ficha → variante → carrito → pedido ────────────────
const C = { list: s(4.2), tapShop: s(5.5), sheet: s(5.9), tapVariant: s(7.9), tapAdd: s(8.6), send: s(9.0), tapSend: s(9.5), done: s(9.75) };

export function ShopFlow({ frame }: { frame: number }) {
  const { compra } = scenes;
  if (frame < compra.from - 2 || frame > s(10.6)) return null;
  const a = prog(frame, compra.from, 14);
  const out = prog(frame, s(10.0), 16, easeInOut);
  return (
    <div style={{ position: "absolute", left: 590, top: 470, width: 330, height: 690, opacity: a * (1 - out), transform: `translateY(${(1 - a) * 50}px) scale(${1 - 0.15 * out}) perspective(1600px) rotateY(-10deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 50, padding: 11, background: "linear-gradient(145deg, #2A303C, #0C0F15 60%)", boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 2px #3A4150, 0 0 60px rgba(37,99,235,0.3)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: ui.claro, color: ui.tinta, fontFamily: ui.font }}>
          {frame < C.sheet + 10 && (
            <Slide frame={frame} from={C.list} to={C.sheet}>
              <Discover frame={frame} />
            </Slide>
          )}
          {frame >= C.sheet - 10 && frame < C.send + 10 && (
            <Slide frame={frame} from={C.sheet} to={C.send}>
              <Sheet frame={frame} />
            </Slide>
          )}
          {frame >= C.send - 10 && (
            <Slide frame={frame} from={C.send} to={s(11)}>
              <Send frame={frame} />
            </Slide>
          )}
          <Tap frame={frame} at={C.tapShop} x={160} y={250} />
          <Tap frame={frame} at={C.tapVariant} x={225} y={470} />
          <Tap frame={frame} at={C.tapAdd} x={155} y={575} />
          <Tap frame={frame} at={C.tapSend} x={155} y={575} />
        </div>
      </div>
      <div style={{ marginTop: 14, textAlign: "center", font: `600 17px ${ui.font}`, letterSpacing: "0.18em", color: "#8E99AE" }}>INTERFAZ DE DEMOSTRACIÓN</div>
    </div>
  );
}

function Slide({ frame, from, to, children }: { frame: number; from: number; to: number; children: ReactNode }) {
  const inP = prog(frame, from - 9, 11, easeInOut);
  const outP = prog(frame, to - 9, 11, easeInOut);
  return <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - inP) * 100 - outP * 30}%)` }}>{children}</div>;
}

function Tap({ frame, at, x, y }: { frame: number; at: number; x: number; y: number }) {
  const p = (frame - at) / 14;
  if (p < -0.4 || p > 1) return null;
  const pre = interpolate(p, [-0.4, 0], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ position: "absolute", width: 48, height: 48, left: -24, top: -24, borderRadius: 30, background: "rgba(37,99,235,0.3)", transform: `scale(${p < 0 ? pre : 1 - 0.2 * p})`, opacity: p < 0 ? pre : 1 - p }} />
      {p >= 0 && <div style={{ position: "absolute", width: 48, height: 48, left: -24, top: -24, borderRadius: 30, border: "3px solid rgba(37,99,235,0.85)", transform: `scale(${1 + 1.4 * p})`, opacity: 1 - p }} />}
    </div>
  );
}

const Head = ({ title, sub }: { title: string; sub?: string }) => (
  <div style={{ padding: "46px 20px 10px" }}>
    <div style={{ font: `900 24px ${ui.display}` }}>{title}</div>
    {sub && <div style={{ fontSize: 14, color: "#5D6678", marginTop: 3 }}>{sub}</div>}
  </div>
);

function Discover({ frame }: { frame: number }) {
  const shops: { n: string; k: string; i: IconName }[] = [
    { n: "Bodega Central", k: "Víveres · Abierto", i: "store" },
    { n: "Arepera La Esquina", k: "Restaurante · Abierto", i: "food" },
    { n: "Moda Urbana", k: "Ropa · Abierto", i: "shirt" },
    { n: "TecnoPunto", k: "Tecnología · Abierto", i: "laptop" },
  ];
  return (
    <div>
      <Head title="Descubre" sub="Comercios cerca de ti" />
      {shops.map((x, i) => {
        const a = pop(frame, C.list + 3 + i * 3);
        const hi = i === 0 && frame >= C.tapShop;
        return (
          <div key={x.n} style={{ margin: "0 16px 10px", padding: 12, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", gap: 12, opacity: a, transform: `translateY(${(1 - a) * 14}px)`, boxShadow: hi ? "0 0 0 3px rgba(37,99,235,0.6)" : "0 4px 12px rgba(13,16,24,0.07)" }}>
            <span style={{ width: 50, height: 50, borderRadius: 14, background: i ? "#E7EAF0" : ui.tinta, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={x.i} size={26} color={i ? "#3B4252" : "#fff"} />
            </span>
            <span>
              <div style={{ font: `700 16px ${ui.font}` }}>{x.n}</div>
              <div style={{ fontSize: 13, color: "#6B7486", marginTop: 2 }}>{x.k}</div>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Sheet({ frame }: { frame: number }) {
  const big = frame >= C.tapVariant;
  const added = frame >= C.tapAdd + 2;
  return (
    <div>
      <Head title="Bodega Central" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ProductArt tone="#2563EB" label="CAFÉ" size={200} />
      </div>
      <div style={{ padding: "12px 20px" }}>
        <div style={{ font: `900 22px ${ui.display}` }}>Café molido</div>
        <div style={{ font: `900 26px ${ui.font}`, marginTop: 6 }}>{big ? "$6,50" : "$3,50"}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {["250 g", "500 g"].map((v, i) => {
            const on = (i === 1) === big;
            return (
              <span key={v} style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 14, font: `700 16px ${ui.font}`, background: on ? ui.tinta : "#E7EAF0", color: on ? "#fff" : "#3B4252" }}>
                {v}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 18, height: 54, borderRadius: 18, background: added ? ui.tinta : ui.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, font: `700 17px ${ui.font}` }}>
          <Icon name={added ? "check" : "cart"} size={20} color="#fff" stroke={2.2} />
          {added ? "En tu carrito" : "Añadir al carrito"}
        </div>
      </div>
    </div>
  );
}

function Send({ frame }: { frame: number }) {
  const done = frame >= C.done;
  const c = prog(frame, C.done, 12);
  return (
    <div>
      <Head title="Tu pedido" sub="Bodega Central" />
      <div style={{ margin: "0 16px", padding: 12, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
        <ProductArt tone="#2563EB" label="CAFÉ" size={48} />
        <div style={{ flex: 1, font: `600 15px ${ui.font}` }}>Café molido · 500 g</div>
        <div style={{ font: `800 16px ${ui.font}` }}>$6,50</div>
      </div>
      <div style={{ margin: "14px 16px 0", fontSize: 13, color: "#5D6678" }}>Entrega o retiro · pago a convenir con el comercio</div>
      {done ? (
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span style={{ width: 92, height: 92, borderRadius: 50, background: ui.azul, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * c})`, boxShadow: `0 0 ${40 * c}px rgba(37,99,235,0.8)` }}>
            <Icon name="check" size={50} color="#fff" stroke={3} />
          </span>
          <div style={{ font: `900 22px ${ui.display}` }}>¡Pedido enviado!</div>
        </div>
      ) : (
        <div style={{ margin: "250px 16px 0", height: 54, borderRadius: 18, background: ui.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: `700 17px ${ui.font}` }}>Enviar pedido</div>
      )}
    </div>
  );
}

// ── Escena 3: cada negocio se identifica al terminar de construirse ──────────
const BIZ_ICON: Record<BizId, IconName> = { barberia: "user", arepera: "food", bodega: "store", ropa: "shirt", cafe: "food", tecno: "laptop" };

export function BizLabels({ frame }: { frame: number }) {
  const { ciudad } = scenes;
  if (frame < ciudad.from || frame > ciudad.to + 12) return null;
  const d = drivers(frame);
  const leave = prog(frame, ciudad.to - 8, 14, easeInOut);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      {BIZ.map((b) => {
        // Aparece cuando el negocio termina de construirse.
        const k = Math.min(1, Math.max(0, (d.build(b.id) - 0.9) * 10));
        if (k <= 0) return null;
        const p = project(frame, [b.x, SHELL.h + SHELL.upper + 0.5, b.z]);
        if (p.behind || p.y < 480 || p.y > 1260 || p.x < 120 || p.x > 860) return null;
        return (
          <div key={b.id} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%, -100%) scale(${0.7 + 0.3 * k})`, opacity: k }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 8px", borderRadius: 16, background: "rgba(245,245,243,0.96)", color: ui.tinta, font: `700 21px ${ui.font}`, whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: ui.azul, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={BIZ_ICON[b.id]} size={19} color="#fff" />
              </span>
              {b.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Escena 4: mensajes acumulados en el teléfono de la arepera ────────────────
const msgs = ["¿Hay arepas de queso?", "¿Hacen delivery?", "¿Cuánto es?", "¿Ya salió mi pedido?", "¿Aceptan pago móvil?"];

export function ArepaMessages({ frame }: { frame: number }) {
  const { procesos } = scenes;
  const show = prog(frame, procesos.from + 6, 10) * (1 - prog(frame, s(21.0), 12, easeInOut));
  if (show <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 520, opacity: show }}>
      {msgs.map((m, i) => {
        const a = pop(frame, procesos.from + 10 + i * 9);
        return (
          <div key={i} style={{ marginBottom: 14, marginLeft: (i % 2) * 70, opacity: a, transform: `translateY(${(1 - a) * 18}px) scale(${0.8 + 0.2 * a})`, transformOrigin: "0 50%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 20, borderBottomLeftRadius: 6, background: "rgba(245,245,243,0.97)", color: ui.tinta, font: `600 26px ${ui.font}`, boxShadow: "0 14px 34px rgba(0,0,0,0.5)" }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, background: "#2BB673", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="chat" size={16} color="#fff" stroke={2.4} />
              </span>
              {m}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Escena 5: etiquetas del flujo y panel administrativo ─────────────────────
const stationLabels: { t: string; icon: IconName }[] = [
  { t: "CLIENTE", icon: "user" },
  { t: "TIENDA DIGITAL", icon: "store" },
  { t: "PEDIDO", icon: "box" },
  { t: "INVENTARIO", icon: "list" },
  { t: "PANEL ADMINISTRATIVO", icon: "chart" },
];

export function FlowLabels({ frame }: { frame: number }) {
  const d = drivers(frame);
  if (d.flowShow <= 0.02) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: d.flowShow }}>
      {STATIONS.map((p, i) => {
        const q = project(frame, [p.x, i === 4 ? 1.65 : 0.95, p.z]);
        const lit = Math.min(1, Math.max(0, (d.flow - i + 0.3) * 3));
        const a = pop(frame, s(26.2) + i * 4);
        if (q.behind) return null;
        // Etiqueta al lado con más espacio, siempre dentro de la zona segura (72–900 px, debajo del titular).
        const w = 70 + stationLabels[i].t.length * 15;
        const right = q.x < 540;
        const x = right ? Math.min(900 - w, q.x + 50) : Math.max(72, q.x - 50 - w);
        const y = Math.min(1230, Math.max(600, q.y));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translateY(-50%) scale(${0.8 + 0.2 * a})`, transformOrigin: right ? "0 50%" : "100% 50%", opacity: a }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 14, whiteSpace: "nowrap", font: `800 22px ${ui.display}`, letterSpacing: "0.06em", color: "#fff", background: lit > 0.5 ? ui.azul : "rgba(18,22,31,0.9)", border: `1.5px solid rgba(56,221,245,${0.2 + 0.6 * lit})`, boxShadow: `0 0 ${30 * lit}px rgba(37,99,235,${0.7 * lit})` }}>
              <Icon name={stationLabels[i].icon} size={20} color="#fff" />
              {stationLabels[i].t}
              {i === 3 && d.flow > 3.15 && <span style={{ marginLeft: 6, color: ui.cian }}>−1</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const D = { show: s(30.4), order: s(30.9), stock: s(31.3), sales: s(31.7), ai: s(32.2) };

export function Dashboard({ frame }: { frame: number }) {
  const { conexion } = scenes;
  if (frame < D.show - 4 || frame > conexion.to + 20) return null;
  const a = prog(frame, D.show, 16);
  // La cámara atraviesa el panel al empezar la escena 6.
  const through = prog(frame, conexion.to - 4, 20, easeInOut);
  const flash = (at: number) => interpolate(frame, [at, at + 4, at + 24], [0, 1, 0], clamp);
  const sales = 418.3 + 6.5 * prog(frame, D.sales, 14);
  return (
    <div style={{ position: "absolute", left: 100, top: 520, width: 800, opacity: a * (1 - through), transform: `perspective(1600px) translateY(${(1 - a) * 40}px) scale(${(0.92 + 0.08 * a) * (1 + 1.6 * through)}) rotateX(${(1 - a) * 10}deg)`, filter: `blur(${through * 10}px)` }}>
      <div style={{ borderRadius: 30, padding: 24, background: "linear-gradient(160deg, rgba(30,37,50,0.96), rgba(14,18,26,0.96))", border: "1.5px solid rgba(56,221,245,0.3)", boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 60px rgba(37,99,235,0.3)", color: ui.texto, fontFamily: ui.font }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ font: `800 28px ${ui.font}` }}>Bodega Central · Panel</div>
          <div style={{ fontSize: 18, color: ui.suave }}>Hoy</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
          <Tile title="Ventas" icon="chart" glow={flash(D.sales)}>
            <div style={{ font: `900 38px ${ui.display}` }}>${sales.toFixed(2).replace(".", ",")}</div>
          </Tile>
          <Tile title="Pedidos" icon="list" glow={flash(D.order)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, font: `700 24px ${ui.font}`, opacity: prog(frame, D.order, 8) }}>
              #0412 <span style={{ fontSize: 15, padding: "4px 9px", borderRadius: 8, background: ui.azul, color: "#fff" }}>Nuevo</span>
            </div>
          </Tile>
          <Tile title="Inventario" icon="box" glow={flash(D.stock)}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: 17, color: ui.suave }}>Café 500 g</span>
              <span style={{ font: `900 38px ${ui.display}` }}>{frame >= D.stock + 3 ? 11 : 12}</span>
            </div>
          </Tile>
          <Tile title="Gastos" icon="wallet" glow={0}>
            <div style={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginTop: 12 }}>
              <div style={{ width: "56%", height: "100%", borderRadius: 6, background: "#5B6B8C" }} />
            </div>
          </Tile>
        </div>
        {frame >= D.ai && (
          <div style={{ marginTop: 16, padding: 16, borderRadius: 20, background: "rgba(18,22,31,0.95)", border: "1.5px solid rgba(56,221,245,0.35)", opacity: pop(frame, D.ai) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, font: `700 19px ${ui.font}`, color: "#fff" }}>
              <span style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${ui.azul}, ${ui.cian})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="spark" size={18} color="#fff" />
              </span>
              Asistente IA
              <span style={{ fontSize: 13, padding: "4px 8px", borderRadius: 7, background: "rgba(56,221,245,0.15)", color: ui.cian }}>MÓDULO INTEGRABLE</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12, font: `500 19px ${ui.font}` }}>
              <span style={{ padding: "9px 14px", borderRadius: 14, background: "rgba(245,245,243,0.95)", color: ui.tinta }}>¿Abren el domingo?</span>
              <span style={{ padding: "9px 14px", borderRadius: 14, background: "rgba(37,99,235,0.2)", color: "#EAF1FF", opacity: prog(frame, D.ai + 14, 8) }}>Sí, de 8:00 a 13:00.</span>
            </div>
          </div>
        )}
        <div style={{ marginTop: 14, fontSize: 15, letterSpacing: "0.16em", color: "#8E99AE" }}>PANEL DE DEMOSTRACIÓN · DATOS DE EJEMPLO</div>
      </div>
    </div>
  );
}

function Tile({ title, icon, glow, children }: { title: string; icon: IconName; glow: number; children: ReactNode }) {
  return (
    <div style={{ padding: "16px 18px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: `1.5px solid rgba(${glow > 0 ? "56,221,245" : "255,255,255"},${0.08 + 0.5 * glow})`, boxShadow: `0 0 ${30 * glow}px rgba(37,99,235,${0.5 * glow})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, font: `700 19px ${ui.font}`, color: "#C9D2E2", marginBottom: 10 }}>
        <Icon name={icon} size={20} color="#7FA6FF" /> {title}
      </div>
      {children}
    </div>
  );
}

// ── Escena 6: aviso de visión ────────────────────────────────────────────────
export function VisionTag({ frame }: { frame: number }) {
  const { venezuela } = scenes;
  const a = prog(frame, venezuela.from + 10, 14) * (1 - prog(frame, venezuela.to - 6, 12));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: a }}>
      <span style={{ display: "inline-block", padding: "10px 20px", borderRadius: 30, border: "1.5px solid rgba(56,221,245,0.5)", background: "rgba(8,10,15,0.6)", font: `700 20px ${ui.font}`, letterSpacing: "0.22em", color: "#BFD6FF" }}>VISIÓN EN DESARROLLO</span>
    </div>
  );
}
