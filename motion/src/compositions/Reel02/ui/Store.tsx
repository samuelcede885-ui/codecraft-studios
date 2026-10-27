import type { ReactNode } from "react";
import { interpolate } from "remotion";
import { project } from "../camera";
import { HERO } from "../city/layout";
import { s, scenes } from "../timeline";
import { clamp, easeInOut, easeOut, Icon, pop, prog, ProductArt, ui, type IconName } from "./kit";

/**
 * Escena 4 — compra digital. Teléfono (recorrido del consumidor) y vista web de la misma tienda.
 * Comercio, productos y precios son de ejemplo: la interfaz es conceptual (en desarrollo).
 */
const T = {
  discover: s(20.6),
  tapStore: s(21.9),
  catalog: s(22.3),
  tapProduct: s(23.6),
  product: s(24.0),
  tapAdd: s(24.9),
  checkout: s(25.7),
  tapPay: s(26.5),
  tapConfirm: s(27.3),
  done: s(27.6),
};

export const STORE = { name: "Tienda Ávila", kind: "Víveres y café" };
export const products = [
  { name: "Café molido 500 g", price: "$6,50", tone: "#2563EB", label: "CAFÉ" },
  { name: "Harina de maíz 1 kg", price: "$1,30", tone: "#C79A4B", label: "HARINA" },
  { name: "Queso llanero 1 kg", price: "$5,80", tone: "#8C96A8", label: "QUESO" },
  { name: "Chocolate 70 % 100 g", price: "$3,20", tone: "#3B2A24", label: "CACAO" },
];

const screens = ["discover", "catalog", "product", "checkout", "done"] as const;
const starts = [T.discover, T.catalog, T.product, T.checkout, T.done];

export function Store({ frame }: { frame: number }) {
  const { compra } = scenes;
  if (frame < compra.from - 4 || frame > compra.to + 14) return null;
  // Las interfaces nacen del letrero del comercio y, al final, vuelven al edificio.
  const sign = project(frame, [HERO.x, HERO.h - 0.12, HERO.z + HERO.d / 2]);
  const enter = prog(frame, compra.from - 4, 22, easeOut);
  const leave = prog(frame, compra.to - 6, 18, easeInOut);
  const k = enter * (1 - leave);
  const phoneBox = { x: 96, y: 600, w: 410, h: 840 };
  const fromX = sign.x - (phoneBox.x + phoneBox.w / 2);
  const fromY = sign.y - (phoneBox.y + phoneBox.h / 2);
  const phoneT = `translate(${(1 - k) * fromX}px, ${(1 - k) * fromY}px) scale(${0.15 + 0.85 * k}) rotateY(${8 * k}deg)`;
  const webT = `translate(${(1 - k) * (sign.x - 760)}px, ${(1 - k) * (sign.y - 840)}px) scale(${0.1 + 0.9 * k}) rotateY(${-20 * k}deg) rotateX(${4 * k}deg)`;
  const cart = frame >= T.tapAdd + 4 ? 1 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1800, opacity: Math.min(1, k * 1.6) }}>
      <div style={{ position: "absolute", left: 96, top: 1462, font: `600 20px ${ui.font}`, letterSpacing: "0.22em", color: "#AAB4C6", opacity: prog(frame, compra.from + 18, 12) * (1 - leave) }}>
        INTERFAZ CONCEPTUAL · EN DESARROLLO
      </div>
      {/* Vista web de la tienda */}
      <div style={{ position: "absolute", left: 470, top: 720, width: 560, height: 392, transform: webT, transformOrigin: "50% 50%", filter: `blur(${(1 - k) * 6}px)` }}>
        <WebStore frame={frame} cart={cart} />
      </div>
      {/* Teléfono */}
      <div style={{ position: "absolute", left: phoneBox.x, top: phoneBox.y, width: phoneBox.w, height: phoneBox.h, transform: phoneT, transformOrigin: "50% 50%", filter: `blur(${(1 - k) * 6}px)` }}>
        <Phone>
          {screens.map((name, i) => {
            const a = starts[i];
            const b = starts[i + 1] ?? scenes.compra.to + 60;
            if (frame < a - 12 || frame > b + 12) return null;
            const inP = i === 0 ? 1 : prog(frame, a - 10, 12, easeInOut);
            const outP = prog(frame, b - 10, 12, easeInOut);
            const x = (1 - inP) * 100 - outP * 30;
            return (
              <div key={name} style={{ position: "absolute", inset: 0, transform: `translateX(${x}%)`, opacity: 1 - outP * 0.6 }}>
                {name === "discover" && <Discover frame={frame} />}
                {name === "catalog" && <Catalog frame={frame} cart={cart} />}
                {name === "product" && <Product frame={frame} cart={cart} />}
                {name === "checkout" && <Checkout frame={frame} />}
                {name === "done" && <Done frame={frame} />}
              </div>
            );
          })}
          <Tap frame={frame} at={T.tapStore} x={190} y={360} />
          <Tap frame={frame} at={T.tapProduct} x={95} y={400} />
          <Tap frame={frame} at={T.tapAdd} x={180} y={690} />
          <Tap frame={frame} at={T.tapPay} x={60} y={512} />
          <Tap frame={frame} at={T.tapConfirm} x={180} y={716} />
        </Phone>
      </div>
    </div>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 64, padding: 14, background: "linear-gradient(145deg, #2A303C, #0C0F15 60%)", boxShadow: "0 50px 120px rgba(0,0,0,0.7), 0 0 0 2px #3A4150, 0 0 60px rgba(37,99,235,0.25)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: ui.claro, fontFamily: ui.font, color: ui.tinta }}>
        {children}
        <div style={{ position: "absolute", top: 12, left: "50%", width: 110, height: 30, marginLeft: -55, borderRadius: 20, background: "#07090D" }} />
      </div>
    </div>
  );
}

/** Indicador de toque: círculo que se expande. */
function Tap({ frame, at, x, y }: { frame: number; at: number; x: number; y: number }) {
  const p = (frame - at) / 14;
  if (p < -0.4 || p > 1) return null;
  const pre = interpolate(p, [-0.4, 0], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      <div style={{ position: "absolute", width: 56, height: 56, left: -28, top: -28, borderRadius: 40, background: "rgba(37,99,235,0.28)", transform: `scale(${p < 0 ? pre : 1 - 0.2 * p})`, opacity: p < 0 ? pre : 1 - p }} />
      {p >= 0 && <div style={{ position: "absolute", width: 56, height: 56, left: -28, top: -28, borderRadius: 40, border: "3px solid rgba(37,99,235,0.8)", transform: `scale(${1 + 1.4 * p})`, opacity: 1 - p }} />}
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 30px 0", font: `700 17px ${ui.font}` }}>
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5 }}>
        <span style={{ width: 18, height: 10, borderRadius: 3, background: ui.tinta }} />
        <span style={{ width: 22, height: 10, borderRadius: 3, border: `2px solid ${ui.tinta}` }} />
      </span>
    </div>
  );
}

function Discover({ frame }: { frame: number }) {
  const shops: { name: string; kind: string; icon: IconName; open: boolean }[] = [
    { name: STORE.name, kind: STORE.kind, icon: "store", open: true },
    { name: "Café del Centro", kind: "Restaurante", icon: "food", open: true },
    { name: "Moda Urbana", kind: "Ropa", icon: "shirt", open: true },
    { name: "TecnoPunto", kind: "Tecnología", icon: "laptop", open: false },
  ];
  const tapped = frame >= T.tapStore;
  return (
    <div>
      <StatusBar />
      <div style={{ padding: "8px 26px" }}>
        <div style={{ font: `900 34px ${ui.display}` }}>Descubre</div>
        <div style={{ color: "#5D6678", fontSize: 17, marginTop: 4 }}>Comercios cerca de ti</div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 16, background: "#E7EAF0", color: "#6B7486", fontSize: 17 }}>
          <Icon name="search" size={20} color="#6B7486" /> Busca comercios o productos
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {["Todos", "Comida", "Ropa", "Tecnología"].map((c, i) => (
            <span key={c} style={{ padding: "8px 13px", borderRadius: 20, fontSize: 15, fontWeight: 600, background: i === 0 ? ui.tinta : "#E7EAF0", color: i === 0 ? "#fff" : "#3B4252" }}>
              {c}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          {shops.map((sh, i) => {
            const a = pop(frame, T.discover + 4 + i * 4);
            const hi = i === 0 && tapped;
            return (
              <div key={sh.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, marginBottom: 12, borderRadius: 20, background: "#fff", boxShadow: hi ? "0 0 0 3px rgba(37,99,235,0.6)" : "0 6px 16px rgba(13,16,24,0.07)", opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
                <div style={{ width: 62, height: 62, borderRadius: 16, background: i === 0 ? ui.tinta : "#E7EAF0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={sh.icon} size={30} color={i === 0 ? "#fff" : "#3B4252"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `700 19px ${ui.font}` }}>{sh.name}</div>
                  <div style={{ color: "#6B7486", fontSize: 15, marginTop: 3 }}>{sh.kind}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: sh.open ? ui.azul : "#8B93A3" }}>{sh.open ? "Abierto" : "Cerrado"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StoreHeader({ cart }: { cart: number }) {
  return (
    <div style={{ padding: "4px 22px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ font: `900 26px ${ui.display}` }}>{STORE.name}</div>
        <div style={{ color: "#6B7486", fontSize: 14, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="truck" size={16} color="#6B7486" /> Delivery y retiro en tienda
        </div>
      </div>
      <div style={{ position: "relative", width: 48, height: 48, borderRadius: 14, background: "#E7EAF0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="cart" size={24} color={ui.tinta} />
        {cart > 0 && <span style={{ position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: 12, background: ui.azul, color: "#fff", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart}</span>}
      </div>
    </div>
  );
}

function Catalog({ frame, cart }: { frame: number; cart: number }) {
  return (
    <div>
      <StatusBar />
      <StoreHeader cart={cart} />
      <div style={{ margin: "0 22px", height: 120, borderRadius: 22, background: "linear-gradient(120deg, #0D1018, #1F2B44)", color: "#fff", padding: "20px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ font: `900 22px ${ui.display}` }}>Lo de siempre,</div>
        <div style={{ font: `900 22px ${ui.display}`, color: "#7FA6FF" }}>ahora en línea.</div>
        <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: 80, background: "radial-gradient(circle, rgba(56,221,245,0.35), rgba(0,0,0,0))" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "18px 22px" }}>
        {products.map((p, i) => {
          const a = pop(frame, T.catalog + 2 + i * 3);
          const hi = i === 0 && frame >= T.tapProduct;
          return (
            <div key={p.name} style={{ background: "#fff", borderRadius: 20, padding: 10, boxShadow: hi ? "0 0 0 3px rgba(37,99,235,0.6)" : "0 6px 16px rgba(13,16,24,0.07)", opacity: a, transform: `scale(${0.9 + 0.1 * a})` }}>
              <ProductArt tone={p.tone} label={p.label} size={146} />
              <div style={{ font: `600 15px ${ui.font}`, marginTop: 8, lineHeight: 1.2, height: 36 }}>{p.name}</div>
              <div style={{ font: `800 18px ${ui.font}`, marginTop: 4 }}>{p.price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Product({ frame, cart }: { frame: number; cart: number }) {
  const p = products[0];
  const added = frame >= T.tapAdd + 2;
  const toast = prog(frame, T.tapAdd + 4, 8) * (1 - prog(frame, T.checkout - 8, 6));
  return (
    <div>
      <StatusBar />
      <StoreHeader cart={cart} />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <ProductArt tone={p.tone} label={p.label} size={300} />
      </div>
      <div style={{ padding: "18px 26px" }}>
        <div style={{ font: `900 28px ${ui.display}` }}>{p.name}</div>
        <div style={{ color: "#5D6678", fontSize: 16, marginTop: 6 }}>Tostado artesanal, molienda media.</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
          <div style={{ font: `900 32px ${ui.font}` }}>{p.price}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 16px", borderRadius: 16, background: "#E7EAF0", font: `700 20px ${ui.font}` }}>
            <span>−</span>1<span>+</span>
          </div>
        </div>
        <div style={{ marginTop: 26, height: 66, borderRadius: 20, background: added ? "#0D1018" : ui.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, font: `700 21px ${ui.font}`, transform: `scale(${frame >= T.tapAdd && frame < T.tapAdd + 5 ? 0.97 : 1})` }}>
          <Icon name={added ? "check" : "cart"} size={24} color="#fff" stroke={2.2} />
          {added ? "Añadido al carrito" : "Añadir al carrito"}
        </div>
      </div>
      <div style={{ position: "absolute", left: 26, right: 26, top: 70, opacity: toast, transform: `translateY(${(1 - toast) * -20}px)`, padding: "14px 18px", borderRadius: 16, background: ui.tinta, color: "#fff", font: `600 16px ${ui.font}`, display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="check" size={20} color="#7FA6FF" stroke={2.4} /> Café molido 500 g · en tu carrito
      </div>
    </div>
  );
}

function Checkout({ frame }: { frame: number }) {
  const methods = ["Pago móvil", "Transferencia", "Efectivo en divisas", "Tarjeta"];
  const chosen = frame >= T.tapPay ? 0 : -1;
  return (
    <div>
      <StatusBar />
      <div style={{ padding: "4px 24px" }}>
        <div style={{ font: `900 28px ${ui.display}` }}>Tu pedido</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, padding: 12, borderRadius: 18, background: "#fff" }}>
          <ProductArt tone={products[0].tone} label={products[0].label} size={56} />
          <div style={{ flex: 1, font: `600 16px ${ui.font}` }}>Café molido 500 g<div style={{ color: "#6B7486", fontWeight: 500, fontSize: 14 }}>Cantidad: 1</div></div>
          <div style={{ font: `800 17px ${ui.font}` }}>$6,50</div>
        </div>
        <div style={{ display: "flex", marginTop: 14, padding: 5, borderRadius: 16, background: "#E7EAF0", font: `700 16px ${ui.font}` }}>
          <div style={{ flex: 1, textAlign: "center", padding: 10, borderRadius: 12, background: "#fff" }}>Delivery</div>
          <div style={{ flex: 1, textAlign: "center", padding: 10, color: "#6B7486" }}>Retiro</div>
        </div>
        <div style={{ marginTop: 18, font: `700 17px ${ui.font}` }}>Método de pago</div>
        {methods.map((m, i) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 9, padding: "12px 14px", borderRadius: 14, background: "#fff", boxShadow: chosen === i ? "0 0 0 2.5px rgba(37,99,235,0.7)" : "none", font: `600 16px ${ui.font}` }}>
            <span style={{ width: 22, height: 22, borderRadius: 12, border: `2.5px solid ${chosen === i ? ui.azul : "#B8BFCC"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {chosen === i && <span style={{ width: 10, height: 10, borderRadius: 6, background: ui.azul }} />}
            </span>
            {m}
          </div>
        ))}
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5D6678" }}>
          <span style={{ padding: "4px 9px", borderRadius: 8, background: "#E3EAFB", color: ui.azul, fontWeight: 700 }}>Integraciones previstas</span>
          Métodos configurables por cada comercio
        </div>
        <div style={{ marginTop: 16, height: 62, borderRadius: 20, background: ui.azul, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", font: `700 19px ${ui.font}`, transform: `scale(${frame >= T.tapConfirm && frame < T.tapConfirm + 5 ? 0.97 : 1})` }}>
          <span>Confirmar pedido</span>
          <span>$8,00</span>
        </div>
      </div>
    </div>
  );
}

function Done({ frame }: { frame: number }) {
  const c = prog(frame, T.done + 4, 18);
  const steps = ["Pedido recibido", "Preparando", "En camino"];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 150, textAlign: "center" }}>
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="66" fill="none" stroke="#E3EAFB" strokeWidth="8" />
        <circle cx="75" cy="75" r="66" fill="none" stroke={ui.azul} strokeWidth="8" strokeLinecap="round" strokeDasharray={415} strokeDashoffset={415 * (1 - c)} transform="rotate(-90 75 75)" />
        <path d="M48 77l18 18 37-40" fill="none" stroke={ui.azul} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - prog(frame, T.done + 14, 12))} />
      </svg>
      <div style={{ font: `900 32px ${ui.display}`, marginTop: 26 }}>¡Pedido recibido!</div>
      <div style={{ color: "#5D6678", fontSize: 17, marginTop: 8 }}>#0145 · {STORE.name}</div>
      <div style={{ color: "#5D6678", fontSize: 16, marginTop: 6, padding: "0 40px" }}>Te avisaremos cuando esté en camino.</div>
      <div style={{ marginTop: 34, width: 300, textAlign: "left" }}>
        {steps.map((st, i) => {
          const on = i === 0 ? prog(frame, T.done + 24, 8) : 0;
          return (
            <div key={st} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, font: `600 17px ${ui.font}`, color: i === 0 ? ui.tinta : "#8B93A3" }}>
              <span style={{ width: 26, height: 26, borderRadius: 14, background: i === 0 ? `rgba(37,99,235,${on})` : "#E7EAF0", border: i === 0 ? "none" : "2px solid #C9CFDA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i === 0 && <Icon name="check" size={16} color="#fff" stroke={3} />}
              </span>
              {st}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Vista web (escritorio) de la misma tienda, sincronizada con el carrito del teléfono. */
function WebStore({ frame, cart }: { frame: number; cart: number }) {
  const order = prog(frame, T.done + 8, 10);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 18, overflow: "hidden", background: ui.claro, boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,255,255,0.15)", fontFamily: ui.font, color: ui.tinta }}>
      <div style={{ height: 30, background: "#E2E5EB", display: "flex", alignItems: "center", gap: 7, padding: "0 12px" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: 6, background: "#C3C8D2" }} />
        ))}
        <span style={{ marginLeft: 12, flex: 1, height: 18, borderRadius: 9, background: "#F5F6F8" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px" }}>
        <span style={{ font: `900 18px ${ui.display}` }}>{STORE.name}</span>
        <span style={{ display: "flex", gap: 14, fontSize: 12, color: "#5D6678" }}>
          <span>Catálogo</span>
          <span>Ofertas</span>
          <span style={{ fontWeight: 700, color: cart ? ui.azul : ui.tinta }}>Carrito ({cart})</span>
        </span>
      </div>
      <div style={{ margin: "0 20px", padding: "18px 20px", borderRadius: 14, background: "linear-gradient(120deg, #0D1018, #1F2B44)", color: "#fff" }}>
        <div style={{ font: `900 22px ${ui.display}` }}>Lo de siempre, ahora en línea.</div>
        <div style={{ fontSize: 12, color: "#AFC2EA", marginTop: 6 }}>Compra o reserva en pocos pasos.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: "14px 20px" }}>
        {products.map((p) => (
          <div key={p.name} style={{ background: "#fff", borderRadius: 12, padding: 6 }}>
            <ProductArt tone={p.tone} label={p.label} size={104} />
            <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4, height: 26 }}>{p.name}</div>
            <div style={{ fontSize: 12, fontWeight: 800 }}>{p.price}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 16, opacity: order, transform: `translateY(${(1 - order) * 14}px)`, padding: "10px 14px", borderRadius: 12, background: ui.azul, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="bell" size={16} color="#fff" stroke={2.2} /> Nuevo pedido #0145 · $8,00
      </div>
    </div>
  );
}
