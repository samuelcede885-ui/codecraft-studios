import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { clamp, easeInOut, enterStyle, progress, useEnter } from "../lib/motion";
import { Icon } from "../components/Icon";

/**
 * La web de un negocio genérico ("Tu negocio"), sin marcas reales, en la estética de Fary Labs:
 * marfil, negro, titulares grandes y orden editorial.
 */
const ink = fary.color.negro;
const paper = fary.color.marfil;
const soft = "#E6E5E1";

/** Bloque que pasa de boceto (gris) a diseño final según `built` (0–1). */
function Built({ built, children, style }: { built: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: "relative", ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 14, background: soft, opacity: 1 - built }} />
      <div style={{ opacity: built, transform: `translateY(${(1 - built) * 14}px)` }}>{children}</div>
    </div>
  );
}

/**
 * Escritorio (1280 × 800). `from`: inicio de la construcción por secciones (boceto → diseño).
 * `scrollAt`: frame en el que baja al catálogo y al contacto.
 */
export function SiteDesktop({ from = 0, scrollAt = Infinity, startBuilt = false }: { from?: number; scrollAt?: number; startBuilt?: boolean }) {
  const frame = useCurrentFrame();
  const b = (i: number) => (startBuilt ? 1 : progress(frame, from + i * 7, 14));
  const scroll = progress(frame, scrollAt, 26, easeInOut) * 470;
  return (
    <div style={{ width: 1280, height: 800, overflow: "hidden", background: paper, color: ink, font: `500 20px ${fary.font.ui}` }}>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        <Built built={b(0)} style={{ margin: "26px 64px 0", height: 44 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
            <div style={{ font: `900 28px ${fary.font.display}` }}>Tu negocio</div>
            <div style={{ display: "flex", gap: 34, color: "#55575C", fontSize: 18 }}>
              <span>Catálogo</span>
              <span>Servicios</span>
              <span>Contacto</span>
            </div>
          </div>
        </Built>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 44, margin: "56px 64px 0", height: 420 }}>
          <Built built={b(1)}>
            <div style={{ font: `600 15px ${fary.font.ui}`, letterSpacing: "0.26em", color: "#6E7075" }}>BIENVENIDO</div>
            <div style={{ font: `900 80px/0.98 ${fary.font.display}`, letterSpacing: "-0.035em", marginTop: 16 }}>Todo lo que ofreces, en un lugar.</div>
            <div style={{ marginTop: 18, color: "#55575C", fontSize: 21, lineHeight: 1.45, maxWidth: 520 }}>Conoce lo que hacemos y escríbenos cuando quieras.</div>
            <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 30px", borderRadius: 999, background: ink, color: paper, fontWeight: 700 }}>
              Escríbenos <Icon name="arrow" size={22} stroke={2.6} />
            </div>
          </Built>
          <Built built={b(2)} style={{ height: 420 }}>
            <div style={{ height: 420, borderRadius: 26, background: `linear-gradient(150deg, ${fary.color.carbon}, ${fary.color.grafito})`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 36, right: 36, bottom: 36, padding: "18px 22px", borderRadius: 16, background: "rgba(245,245,243,0.1)", color: paper, fontSize: 18 }}>Atención de lunes a sábado</div>
            </div>
          </Built>
        </div>
        <div style={{ margin: "64px 64px 0" }}>
          <Built built={b(3)} style={{ height: 34 }}>
            <div style={{ font: `900 40px ${fary.font.display}` }}>Catálogo</div>
          </Built>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 22 }}>
            {["Servicio inicial", "Plan completo", "A medida"].map((t, i) => (
              <Built key={t} built={b(4 + i * 0.5)} style={{ height: 250 }}>
                <div style={{ height: 250, borderRadius: 20, background: "#FFFFFF", padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ height: 120, borderRadius: 14, background: i === 1 ? fary.color.grafito : soft }} />
                  <div style={{ fontWeight: 700, fontSize: 22 }}>{t}</div>
                  <div style={{ color: "#6E7075", fontSize: 17 }}>Ver detalles</div>
                </div>
              </Built>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Toque en pantalla táctil: círculo que se expande. */
function Tap({ x, y, at }: { x: number; y: number; at: number }) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 8, at, at + 12], [0, 1, 2], clamp);
  if (t <= 0 || t >= 2) return null;
  const pressing = t <= 1;
  return (
    <div style={{ position: "absolute", left: x - 26, top: y - 26, width: 52, height: 52, borderRadius: 52, background: pressing ? "rgba(9,10,11,0.25)" : "transparent", border: `3px solid rgba(9,10,11,${pressing ? 0.5 : 2 - t})`, transform: `scale(${pressing ? 0.8 + 0.2 * t : t})` }} />
  );
}

/** Momentos del formulario en el móvil, relativos a `from`. */
export const CONTACT_BEATS = { open: 18, name: 26, message: 40, send: 74, sent: 80 };

/**
 * Móvil (390 × 844): la misma web, adaptada. El usuario pulsa "Escríbenos", completa el
 * formulario (escritura determinista, letra a letra) y lo envía.
 */
export function SiteMobile({ from = 0, name, message }: { from?: number; name: string; message: string }) {
  const frame = useCurrentFrame() - from;
  const c = CONTACT_BEATS;
  const form = progress(frame, c.open, 14);
  const typed = (text: string, at: number, dur: number) => text.slice(0, Math.round(interpolate(frame, [at, at + dur], [0, text.length], clamp)));
  const sent = useEnter(from + c.sent, 16);
  return (
    <div style={{ position: "relative", width: 390, height: 844, overflow: "hidden", background: paper, color: ink, font: `500 15px ${fary.font.ui}` }}>
      <div style={{ padding: "64px 22px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ font: `900 20px ${fary.font.display}` }}>Tu negocio</div>
          <div style={{ width: 22, display: "grid", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ height: 2.5, background: ink, borderRadius: 2 }} />
            ))}
          </div>
        </div>
        <div style={{ font: `900 38px/1 ${fary.font.display}`, letterSpacing: "-0.03em", marginTop: 30 }}>Todo lo que ofreces, en un lugar.</div>
        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 999, background: ink, color: paper, fontWeight: 700 }}>
          Escríbenos <Icon name="arrow" size={18} stroke={2.6} />
        </div>
        <div style={{ marginTop: 22, height: 150, borderRadius: 18, background: `linear-gradient(150deg, ${fary.color.carbon}, ${fary.color.grafito})` }} />
      </div>
      {/* Formulario de contacto */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 560, borderRadius: "26px 26px 0 0", background: "#FFFFFF", padding: "26px 22px", boxShadow: "0 -20px 40px -20px rgba(0,0,0,0.25)", transform: `translateY(${(1 - form) * 100}%)` }}>
        <div style={{ font: `900 26px ${fary.font.display}` }}>Escríbenos</div>
        <Field label="Nombre" value={typed(name, c.name, 10)} focus={frame >= c.name && frame < c.message} />
        <Field label="Mensaje" value={typed(message, c.message, 28)} focus={frame >= c.message && frame < c.send} tall />
        <div style={{ marginTop: 20, padding: "16px 0", borderRadius: 14, textAlign: "center", fontWeight: 700, background: frame >= c.send ? fary.color.grafito : ink, color: paper }}>Enviar</div>
      </div>
      <div style={{ position: "absolute", left: 22, right: 22, top: 70, display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 16, background: ink, color: paper, fontWeight: 600, ...enterStyle(sent) }}>
        <span style={{ width: 28, height: 28, borderRadius: 28, background: paper, color: ink, display: "grid", placeItems: "center" }}>
          <Icon name="check" size={18} stroke={3} />
        </span>
        Mensaje enviado
      </div>
      <Tap x={92} y={228} at={c.open - 4} />
      <Tap x={195} y={796} at={c.send} />
    </div>
  );
}

function Field({ label, value, focus, tall = false }: { label: string; value: string; focus: boolean; tall?: boolean }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#6E7075", textTransform: "uppercase" }}>{label}</div>
      <div style={{ marginTop: 8, minHeight: tall ? 96 : 48, padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${focus ? ink : "#D9D8D4"}`, fontSize: 16, lineHeight: 1.4 }}>
        {value}
        {focus && <span style={{ display: "inline-block", width: 2, height: 18, marginLeft: 1, verticalAlign: "-3px", background: ink }} />}
      </div>
    </div>
  );
}
