import { project } from "../camera";
import { city, pins, type Category } from "../city/layout";
import { s, scenes } from "../timeline";
import { easeInOut, Icon, pop, prog, ui, type IconName } from "./kit";

/** Escena 7 — comunidad conectada: tipos de comercio y lo que pasa entre ellos (sin cifras). */
const labels: Record<Category, { text: string; icon: IconName }> = {
  ropa: { text: "Tiendas de ropa", icon: "shirt" },
  restaurante: { text: "Restaurantes", icon: "food" },
  tecnologia: { text: "Tecnología", icon: "laptop" },
  servicios: { text: "Servicios profesionales", icon: "briefcase" },
  emprendimiento: { text: "Emprendimientos locales", icon: "sprout" },
};

/**
 * Coloca las etiquetas dentro de la zona segura y sin pisarse: de arriba abajo, cada una baja
 * lo necesario si choca con la anterior (la línea guía sigue apuntando a su edificio).
 */
function placePins(frame: number) {
  const placed: { pin: (typeof pins)[number]; p: ReturnType<typeof project>; x: number; y: number; w: number }[] = [];
  const list = pins
    .map((pin) => ({ pin, p: project(frame, pin.at) }))
    .filter(({ p }) => !p.behind && p.y > 620 && p.y < 1420)
    .sort((a, b) => a.p.y - b.p.y);
  for (const { pin, p } of list) {
    const w = 104 + labels[pin.category].text.length * 13.2;
    const x = Math.min(900 - w / 2, Math.max(72 + w / 2, p.x));
    let y = p.y - 34;
    for (const q of placed) if (Math.abs(q.x - x) < (q.w + w) / 2 + 12 && Math.abs(q.y - y) < 80) y = q.y + 80;
    placed.push({ pin, p, x, y: Math.min(1420, y), w });
  }
  return placed.map((q) => ({ ...q, y: q.y + 34 }));
}

const events = ["Pedido en camino", "Reserva confirmada", "Nuevo cliente", "Pago registrado", "Cita agendada", "Pedido listo"];

export function Community({ frame }: { frame: number }) {
  const { comunidad } = scenes;
  if (frame < comunidad.from || frame > comunidad.to + 14) return null;
  const leave = prog(frame, comunidad.to - 8, 16, easeInOut);
  const spots = city.shops.filter((b) => b.dist > 4 && b.dist < 20).filter((_, i) => i % 5 === 2).slice(0, 12);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      {/* Lo que pasa entre consumidores y comercios */}
      {spots.map((b, i) => {
        const at = comunidad.from + s(1.4) + i * 14;
        const life = (frame - at) / 50;
        if (life < 0 || life > 1) return null;
        const p = project(frame, [b.x, b.h + 0.2, b.z]);
        if (p.behind || p.x < 180 || p.x > 820 || p.y < 640 || p.y > 1440) return null;
        const a = Math.min(1, life * 6) * Math.min(1, (1 - life) * 5);
        return (
          <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%, -100%) translateY(${-20 * life}px)`, opacity: a }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 14, background: "rgba(18,22,31,0.9)", border: "1.5px solid rgba(56,221,245,0.4)", color: "#DDE6F5", font: `600 19px ${ui.font}`, whiteSpace: "nowrap" }}>
              <Icon name="check" size={18} color={ui.cian} stroke={2.6} />
              {events[i % events.length]}
            </div>
          </div>
        );
      })}
      {/* Tipos de comercio */}
      {placePins(frame).map(({ pin, p, x, y, w }, i) => {
        const a = pop(frame, comunidad.from + s(0.8) + i * 8);
        if (a <= 0.01) return null;
        const l = labels[pin.category];
        return (
          <div key={pin.category} style={{ position: "absolute", left: x - w / 2, top: y, transform: `translateY(-100%) scale(${a})`, transformOrigin: "50% 100%", width: w }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px 12px 12px", borderRadius: 20, background: "rgba(245,245,243,0.96)", color: ui.tinta, font: `700 24px ${ui.font}`, whiteSpace: "nowrap", boxShadow: "0 16px 40px rgba(0,0,0,0.55)" }}>
              <span style={{ width: 44, height: 44, borderRadius: 13, background: ui.azul, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={l.icon} size={24} color="#fff" />
              </span>
              {l.text}
            </div>
            <div style={{ width: 3, height: 34 + (p.y - y), marginLeft: w / 2 + (p.x - x), background: `linear-gradient(${ui.azul}, rgba(37,99,235,0))` }} />
          </div>
        );
      })}
    </div>
  );
}
