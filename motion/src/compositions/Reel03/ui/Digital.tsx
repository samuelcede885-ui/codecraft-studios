import type { ReactNode } from "react";
import { interpolate } from "remotion";
import { s, scenes } from "../timeline";
import { clamp, easeInOut, Icon, pop, prog, ProductArt, ui, type IconName } from "../../Reel02/ui/kit";
import { products } from "../../Reel02/ui/Store";
import { shopPoint } from "./Overlays";

/**
 * La tienda CON Fary Labs: el cliente compra solo desde la tienda digital, el pedido viaja al
 * panel y el dueño ve todo en una aplicación. Comercio, productos y datos son de ejemplo.
 */
export const SHOP = "Bodega Central";
const ORDER = "#0231";
const item = products[1]; // Harina de maíz 1 kg · $1,30

// ── Escena 2: el cliente compra desde su teléfono ───────────────────────────────
const P = { enter: s(6.6), catalog: s(6.8), tapItem: s(8.3), product: s(8.6), tapAdd: s(9.9), cart: s(10.4), tapPay: s(11.5), tapConfirm: s(12.1), done: s(12.4) };

export function CustomerPhone({ frame }: { frame: number }) {
  const { transformacion } = scenes;
  if (frame < P.enter - 2 || frame > transformacion.from + s(1.6)) return null;
  const a = prog(frame, P.enter, 16);
  const leave = prog(frame, transformacion.from + s(0.4), 22, easeInOut);
  const shop = shopPoint(frame, "digital", 1.0);
  const x = 600;
  const y = 390;
  const tx = (shop.x - (x + 160)) * leave;
  const ty = (shop.y - (y + 330)) * leave;
  const screens: [number, number, ReactNode][] = [
    [P.catalog, P.product, <Catalog key="c" frame={frame} />],
    [P.product, P.cart, <Product key="p" frame={frame} />],
    [P.cart, P.done, <Cart key="k" frame={frame} />],
    [P.done, transformacion.from + s(2), <Done key="d" frame={frame} />],
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 320, height: 660, opacity: a * (1 - leave * 0.9), transform: `translate(${tx}px, ${ty + (1 - a) * 60}px) scale(${1 - 0.75 * leave}) perspective(1600px) rotateY(-8deg)`, transformOrigin: "50% 50%" }}>
      <PhoneFrame>
        {screens.map(([from, to, el], i) => {
          if (frame < from - 10 || frame > to + 10) return null;
          const inP = i === 0 ? 1 : prog(frame, from - 9, 11, easeInOut);
          const outP = prog(frame, to - 9, 11, easeInOut);
          return (
            <div key={i} style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - inP) * 100 - outP * 30}%)` }}>
              {el}
            </div>
          );
        })}
        <Tap frame={frame} at={P.tapItem} x={230} y={300} />
        <Tap frame={frame} at={P.tapAdd} x={150} y={560} />
        <Tap frame={frame} at={P.tapPay} x={60} y={350} />
        <Tap frame={frame} at={P.tapConfirm} x={150} y={560} />
      </PhoneFrame>
    </div>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 52, padding: 11, background: "linear-gradient(145deg, #2A303C, #0C0F15 60%)", boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 2px #3A4150, 0 0 60px rgba(37,99,235,0.3)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", background: ui.claro, fontFamily: ui.font, color: ui.tinta }}>
        {children}
        <div style={{ position: "absolute", top: 10, left: "50%", width: 90, height: 24, marginLeft: -45, borderRadius: 16, background: "#07090D" }} />
      </div>
    </div>
  );
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

const Top = ({ title, cart = 0 }: { title: string; cart?: number }) => (
  <div style={{ padding: "44px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ font: `900 21px ${ui.display}` }}>{title}</div>
    <div style={{ position: "relative", width: 38, height: 38, borderRadius: 12, background: "#E7EAF0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="cart" size={20} color={ui.tinta} />
      {cart > 0 && <span style={{ position: "absolute", top: -5, right: -5, width: 20, height: 20, borderRadius: 10, background: ui.azul, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart}</span>}
    </div>
  </div>
);

function Catalog({ frame }: { frame: number }) {
  return (
    <div>
      <Top title={SHOP} />
      <div style={{ margin: "0 18px", padding: "10px 12px", borderRadius: 12, background: "#E7EAF0", color: "#6B7486", fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
        <Icon name="search" size={16} color="#6B7486" /> Buscar productos
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "14px 18px" }}>
        {products.map((p, i) => {
          const a = pop(frame, P.catalog + 2 + i * 3);
          const hi = i === 1 && frame >= P.tapItem;
          return (
            <div key={p.name} style={{ background: "#fff", borderRadius: 16, padding: 8, opacity: a, boxShadow: hi ? "0 0 0 3px rgba(37,99,235,0.6)" : "0 4px 12px rgba(13,16,24,0.07)" }}>
              <ProductArt tone={p.tone} label={p.label} size={116} />
              <div style={{ font: `600 12px ${ui.font}`, marginTop: 6, height: 30 }}>{p.name}</div>
              <div style={{ font: `800 15px ${ui.font}` }}>{p.price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Product({ frame }: { frame: number }) {
  const added = frame >= P.tapAdd + 2;
  return (
    <div>
      <Top title={SHOP} cart={added ? 1 : 0} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ProductArt tone={item.tone} label={item.label} size={230} />
      </div>
      <div style={{ padding: "14px 20px" }}>
        <div style={{ font: `900 23px ${ui.display}` }}>{item.name}</div>
        <div style={{ font: `900 26px ${ui.font}`, marginTop: 8 }}>{item.price}</div>
        <div style={{ marginTop: 24, height: 56, borderRadius: 18, background: added ? ui.tinta : ui.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, font: `700 18px ${ui.font}` }}>
          <Icon name={added ? "check" : "cart"} size={20} color="#fff" stroke={2.2} />
          {added ? "Añadido al carrito" : "Añadir al carrito"}
        </div>
      </div>
    </div>
  );
}

function Cart({ frame }: { frame: number }) {
  const methods = ["Pago móvil", "Transferencia", "Efectivo"];
  const chosen = frame >= P.tapPay;
  return (
    <div>
      <Top title="Tu pedido" cart={1} />
      <div style={{ padding: "0 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 14, background: "#fff" }}>
          <ProductArt tone={item.tone} label={item.label} size={46} />
          <div style={{ flex: 1, font: `600 14px ${ui.font}` }}>{item.name}</div>
          <div style={{ font: `800 15px ${ui.font}` }}>{item.price}</div>
        </div>
        <div style={{ marginTop: 14, font: `700 15px ${ui.font}` }}>Método de pago</div>
        {methods.map((m, i) => (
          <div key={m} style={{ marginTop: 8, padding: "11px 12px", borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", gap: 10, font: `600 14px ${ui.font}`, boxShadow: chosen && i === 0 ? "0 0 0 2.5px rgba(37,99,235,0.7)" : "none" }}>
            <span style={{ width: 18, height: 18, borderRadius: 10, border: `2.5px solid ${chosen && i === 0 ? ui.azul : "#B8BFCC"}` }} />
            {m}
          </div>
        ))}
        <div style={{ marginTop: 8, fontSize: 11, color: "#5D6678" }}>Métodos configurables por cada comercio</div>
        <div style={{ marginTop: 14, height: 54, borderRadius: 18, background: ui.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", font: `700 17px ${ui.font}` }}>
          <span>Hacer pedido</span>
          <span>{item.price}</span>
        </div>
      </div>
    </div>
  );
}

function Done({ frame }: { frame: number }) {
  const c = prog(frame, P.done + 3, 16);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 150, textAlign: "center" }}>
      <svg width="120" height="120" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="66" fill="none" stroke="#E3EAFB" strokeWidth="9" />
        <circle cx="75" cy="75" r="66" fill="none" stroke={ui.azul} strokeWidth="9" strokeLinecap="round" strokeDasharray={415} strokeDashoffset={415 * (1 - c)} transform="rotate(-90 75 75)" />
        <path d="M48 77l18 18 37-40" fill="none" stroke={ui.azul} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - prog(frame, P.done + 12, 10))} />
      </svg>
      <div style={{ font: `900 26px ${ui.display}`, marginTop: 20 }}>¡Pedido enviado!</div>
      <div style={{ color: "#5D6678", fontSize: 15, marginTop: 6 }}>
        {ORDER} · {SHOP}
      </div>
    </div>
  );
}

// ── Escena 3: tienda web + el pedido llega a un solo lugar ────────────────────
export function WebAndFlow({ frame }: { frame: number }) {
  const { transformacion } = scenes;
  if (frame < transformacion.from || frame > transformacion.to + 12) return null;
  const leave = prog(frame, transformacion.to - 6, 14, easeInOut);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      <WebStore frame={frame} />
      <Chain frame={frame} />
    </div>
  );
}

function WebStore({ frame }: { frame: number }) {
  const from = s(17.6);
  const a = prog(frame, from, 18);
  const out = prog(frame, s(21.2), 14, easeInOut);
  if (a <= 0 || out >= 1) return null;
  const add = frame >= s(19.6);
  const sent = prog(frame, s(20.4), 10);
  return (
    <div style={{ position: "absolute", left: 70, top: 400, width: 620, height: 430, opacity: a * (1 - out), transform: `perspective(1600px) rotateY(${12 - 4 * a}deg) translateY(${(1 - a) * 40 - out * 30}px) scale(${1 - 0.1 * out})`, transformOrigin: "0 50%" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 16, overflow: "hidden", background: ui.claro, boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1.5px rgba(255,255,255,0.15), 0 0 50px rgba(37,99,235,0.25)", fontFamily: ui.font, color: ui.tinta }}>
        <div style={{ height: 30, background: "#E2E5EB", display: "flex", alignItems: "center", gap: 7, padding: "0 12px" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: 6, background: "#C3C8D2" }} />
          ))}
          <span style={{ marginLeft: 10, flex: 1, height: 18, borderRadius: 9, background: "#F5F6F8", fontSize: 11, color: "#6B7486", display: "flex", alignItems: "center", paddingLeft: 10 }}>bodegacentral.tienda</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
          <span style={{ font: `900 19px ${ui.display}` }}>{SHOP}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: add ? ui.azul : ui.tinta }}>Carrito ({add ? 1 : 0})</span>
        </div>
        <div style={{ margin: "0 20px", padding: "16px 18px", borderRadius: 12, background: "linear-gradient(120deg, #0D1018, #1F2B44)", color: "#fff" }}>
          <div style={{ font: `900 22px ${ui.display}` }}>Compra en línea, sin esperar respuesta.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: "14px 20px" }}>
          {products.map((p, i) => (
            <div key={p.name} style={{ background: "#fff", borderRadius: 12, padding: 6, boxShadow: i === 1 && add ? "0 0 0 2.5px rgba(37,99,235,0.6)" : "none" }}>
              <ProductArt tone={p.tone} label={p.label} size={118} />
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, height: 28 }}>{p.name}</div>
              <div style={{ fontSize: 13, fontWeight: 800 }}>{p.price}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 14, opacity: sent, transform: `translateY(${(1 - sent) * 12}px)`, padding: "10px 14px", borderRadius: 12, background: ui.azul, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={16} color="#fff" stroke={2.6} /> Pedido {ORDER} enviado a la tienda
        </div>
      </div>
      <div style={{ marginTop: 12, font: `600 18px ${ui.font}`, letterSpacing: "0.18em", color: "#8E99AE" }}>TIENDA WEB · INTERFAZ DE DEMOSTRACIÓN</div>
    </div>
  );
}

const chain: { label: string; icon: IconName }[] = [
  { label: "Cliente", icon: "user" },
  { label: "Tienda web", icon: "globe" },
  { label: "Pedido", icon: "box" },
  { label: "Inventario", icon: "list" },
  { label: "Panel administrativo", icon: "chart" },
];
const CHAIN = s(21.3);
const STEP = 14;

function Chain({ frame }: { frame: number }) {
  if (frame < CHAIN - 6) return null;
  const head = (frame - CHAIN) / STEP;
  const shop = shopPoint(frame, "digital", 2.2);
  const x0 = 150;
  const y0 = 410;
  const gap = 118;
  const last = { x: x0 + 46, y: y0 + (chain.length - 1) * gap + 46 };
  const toShop = interpolate(head, [chain.length - 0.6, chain.length + 0.6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {chain.slice(0, -1).map((_, i) => {
          const ya = y0 + i * gap + 46;
          const yb = y0 + (i + 1) * gap + 46;
          const k = interpolate(head, [i + 0.3, i + 1], [0, 1], clamp);
          return (
            <g key={i}>
              <line x1={x0 + 46} y1={ya} x2={x0 + 46} y2={yb} stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
              <line x1={x0 + 46} y1={ya} x2={x0 + 46} y2={ya + (yb - ya) * k} stroke={ui.azul} strokeWidth={4} />
              {k > 0 && k < 1 && <circle cx={x0 + 46} cy={ya + (yb - ya) * k} r={8} fill={ui.cian} />}
            </g>
          );
        })}
        {/* El pedido termina en la tienda (un solo lugar) */}
        {toShop > 0 && <path d={`M ${last.x} ${last.y} C ${last.x + 200} ${last.y + 40}, ${shop.x - 60} ${shop.y - 160}, ${shop.x} ${shop.y}`} fill="none" stroke={ui.cian} strokeWidth={3} strokeDasharray="1200" strokeDashoffset={1200 * (1 - toShop)} style={{ filter: "drop-shadow(0 0 8px #38DDF5)" }} />}
      </svg>
      {chain.map((n, i) => {
        const a = pop(frame, CHAIN - 6 + i * 3);
        const lit = interpolate(head, [i - 0.1, i + 0.2], [0, 1], clamp);
        return (
          <div key={n.label} style={{ position: "absolute", left: x0, top: y0 + i * gap, display: "flex", alignItems: "center", gap: 22, opacity: a, transform: `translateX(${(1 - a) * -30}px)` }}>
            <div style={{ width: 92, height: 92, borderRadius: 28, background: lit > 0.5 ? ui.azul : "rgba(23,28,38,0.92)", border: `2px solid rgba(56,221,245,${0.15 + 0.6 * lit})`, boxShadow: `0 0 ${40 * lit}px rgba(37,99,235,${0.7 * lit})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={n.icon} size={42} color="#fff" />
            </div>
            <div style={{ font: `900 34px ${ui.display}`, color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,0.7)" }}>{n.label.toUpperCase()}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Escena 4: la aplicación administrativa + asistente IA (módulo integrable) ──
const A = { order: s(24.9), stock: s(25.4), sales: s(25.9), reports: s(26.4), ai: s(27.2) };

export function AdminApp({ frame }: { frame: number }) {
  const { administracion } = scenes;
  if (frame < administracion.from - 6 || frame > administracion.to + 12) return null;
  const a = prog(frame, administracion.from - 6, 18);
  const leave = prog(frame, administracion.to - 6, 14, easeInOut);
  const shop = shopPoint(frame, "digital", 1.2);
  const flash = (at: number) => interpolate(frame, [at, at + 4, at + 24], [0, 1, 0], clamp);
  const n = frame >= A.stock + 3 ? 17 : 18;
  const sales = 612.4 + 1.3 * prog(frame, A.sales, 14);
  return (
    <div style={{ position: "absolute", left: 560, top: 390, width: 400, opacity: a * (1 - leave), transform: `translate(${(1 - a) * (shop.x - 760)}px, ${(1 - a) * (shop.y - 560)}px) scale(${0.4 + 0.6 * a}) perspective(1600px) rotateY(-8deg)` }}>
      <div style={{ borderRadius: 26, padding: 18, background: "linear-gradient(160deg, rgba(30,37,50,0.96), rgba(14,18,26,0.96))", border: "1.5px solid rgba(56,221,245,0.3)", boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 60px rgba(37,99,235,0.3)", color: ui.texto, fontFamily: ui.font }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ font: `800 22px ${ui.font}` }}>{SHOP}</div>
          <div style={{ fontSize: 14, color: ui.suave }}>Hoy</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <Tile title="Ventas" icon="chart" glow={flash(A.sales)}>
            <div style={{ font: `900 28px ${ui.display}` }}>${sales.toFixed(2).replace(".", ",")}</div>
          </Tile>
          <Tile title="Pedidos" icon="list" glow={flash(A.order)}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: `700 17px ${ui.font}`, opacity: prog(frame, A.order, 8) }}>
              {ORDER} <span style={{ fontSize: 12, padding: "3px 7px", borderRadius: 6, background: ui.azul, color: "#fff" }}>Nuevo</span>
            </div>
          </Tile>
          <Tile title="Inventario" icon="box" glow={flash(A.stock)}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: ui.suave }}>Harina 1 kg</span>
              <span style={{ font: `900 28px ${ui.display}` }}>{n}</span>
            </div>
          </Tile>
          <Tile title="Gastos" icon="wallet" glow={0}>
            <div style={{ height: 8, borderRadius: 5, background: "rgba(255,255,255,0.08)", marginTop: 8 }}>
              <div style={{ width: "58%", height: "100%", borderRadius: 5, background: "#5B6B8C" }} />
            </div>
          </Tile>
        </div>
        <Tile title="Reportes" icon="chart" glow={flash(A.reports)} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 64 }}>
            {[0.4, 0.55, 0.48, 0.66, 0.6, 0.72, 0.5 + 0.32 * prog(frame, A.reports, 14)].map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${v * 100}%`, borderRadius: 5, background: i === 6 ? `linear-gradient(180deg, ${ui.cian}, ${ui.azul})` : "rgba(255,255,255,0.14)" }} />
            ))}
          </div>
        </Tile>
      </div>
      <AiChip frame={frame} />
      <div style={{ marginTop: 12, font: `600 16px ${ui.font}`, letterSpacing: "0.16em", color: "#8E99AE" }}>APP ADMINISTRATIVA · DATOS DE EJEMPLO</div>
    </div>
  );
}

function Tile({ title, icon, glow, children, style }: { title: string; icon: IconName; glow: number; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: `1.5px solid rgba(${glow > 0 ? "56,221,245" : "255,255,255"},${0.08 + 0.5 * glow})`, boxShadow: `0 0 ${30 * glow}px rgba(37,99,235,${0.5 * glow})`, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, font: `700 15px ${ui.font}`, color: "#C9D2E2", marginBottom: 8 }}>
        <Icon name={icon} size={16} color="#7FA6FF" /> {title}
      </div>
      {children}
    </div>
  );
}

function AiChip({ frame }: { frame: number }) {
  const a = pop(frame, A.ai);
  if (frame < A.ai) return null;
  const answer = prog(frame, A.ai + 22, 10);
  return (
    <div style={{ marginTop: 12, padding: 14, borderRadius: 20, background: "rgba(18,22,31,0.95)", border: "1.5px solid rgba(56,221,245,0.35)", opacity: a, transform: `translateY(${(1 - a) * 20}px)`, fontFamily: ui.font }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, font: `700 15px ${ui.font}`, color: "#fff" }}>
        <span style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg, ${ui.azul}, ${ui.cian})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="spark" size={16} color="#fff" />
        </span>
        Asistente IA <span style={{ fontSize: 11, padding: "3px 7px", borderRadius: 6, background: "rgba(56,221,245,0.15)", color: ui.cian }}>MÓDULO INTEGRABLE</span>
      </div>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, font: `500 15px ${ui.font}` }}>
        <span style={{ alignSelf: "flex-end", padding: "8px 12px", borderRadius: 14, background: "rgba(245,245,243,0.95)", color: ui.tinta }}>¿Tienen harina de maíz?</span>
        <span style={{ alignSelf: "flex-start", padding: "8px 12px", borderRadius: 14, background: "rgba(37,99,235,0.2)", color: "#EAF1FF", opacity: answer }}>Sí, quedan 17 unidades.</span>
      </div>
    </div>
  );
}

// ── Escena 5: operación centralizada (sistemas conectados a la tienda) ─────────
export function ConnectedSystems({ frame }: { frame: number }) {
  const { diferencia } = scenes;
  const show = prog(frame, diferencia.from + 10, 14) * (1 - prog(frame, diferencia.to - 6, 12, easeInOut));
  if (show <= 0) return null;
  const p = shopPoint(frame, "digital", 1.6);
  const items: { icon: IconName; text: string; dx: number; dy: number }[] = [
    { icon: "globe", text: "Tienda web", dx: 60, dy: -230 },
    { icon: "list", text: "Pedidos", dx: 170, dy: -120 },
    { icon: "box", text: "Inventario", dx: 120, dy: -10 },
    { icon: "chart", text: "App", dx: -20, dy: -170 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: show }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {items.map((it, i) => {
          const k = prog(frame, diferencia.from + 16 + i * 5, 14);
          const x = Math.min(860, p.x + it.dx);
          const y = p.y + it.dy;
          return <line key={it.text} x1={p.x} y1={p.y} x2={p.x + (x - p.x) * k} y2={p.y + (y - p.y) * k} stroke={ui.cian} strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 6px #38DDF5)" }} />;
        })}
      </svg>
      {items.map((it, i) => {
        const a = pop(frame, diferencia.from + 22 + i * 5);
        const x = Math.min(860, p.x + it.dx);
        return (
          <div key={it.text} style={{ position: "absolute", left: x, top: p.y + it.dy, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * a})`, opacity: a }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 14, background: ui.azul, color: "#fff", font: `700 20px ${ui.font}`, whiteSpace: "nowrap", boxShadow: "0 0 26px rgba(37,99,235,0.7)" }}>
              <Icon name={it.icon} size={18} color="#fff" />
              {it.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
