import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fary } from "../theme/fary";
import { clamp, easeInOut, enterStyle, progress } from "../lib/motion";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";

/** Momentos del recorrido (relativos a `from`): portada → servicio → CTA → acción del usuario. */
export const WEBSITE_BEATS = { scroll: 26, cursor: 46, click: 66, done: 72 };

/**
 * Web genérica de un negocio (1280 × 800, dentro de BrowserMockup). Sin marcas reales:
 * "Tu negocio". La página baja de la portada al servicio, el usuario pulsa el CTA y se confirma.
 */
export function WebsiteFlow({ from = 0 }: { from?: number }) {
  const frame = useCurrentFrame() - from;
  const { fps } = useVideoConfig();
  const b = WEBSITE_BEATS;
  const scroll = progress(frame, b.scroll, 22, easeInOut) * 520;
  const press = interpolate(frame, [b.click, b.click + 10], [0, 1], clamp);
  const done = spring({ frame: frame - b.done, fps, durationInFrames: 18, config: { damping: 200 } });
  const cx = interpolate(frame, [b.cursor, b.click], [1040, 330], { ...clamp, easing: easeInOut });
  const cy = interpolate(frame, [b.cursor, b.click], [760, 598], { ...clamp, easing: easeInOut });
  const ctaActive = interpolate(frame, [b.click, b.click + 4], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: 1280, height: 800, overflow: "hidden", background: fary.color.light, color: fary.color.black, font: `500 20px ${fary.font.ui}` }}>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {/* Portada */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 64px" }}>
          <div style={{ font: `900 28px ${fary.font.display}` }}>Tu negocio</div>
          <div style={{ display: "flex", gap: 36, color: "#555" }}>
            <span>Servicios</span>
            <span>Nosotros</span>
            <span>Contacto</span>
          </div>
        </div>
        <div style={{ padding: "70px 64px 0", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, height: 520 }}>
          <div>
            <div style={{ font: `600 16px ${fary.font.ui}`, letterSpacing: "0.24em", color: "#777" }}>BIENVENIDO</div>
            <div style={{ font: `900 76px/1 ${fary.font.display}`, letterSpacing: "-0.03em", marginTop: 18 }}>Lo que necesitas, sin esperas.</div>
            <div style={{ marginTop: 28, display: "inline-flex", padding: "18px 30px", borderRadius: 999, background: fary.color.black, color: fary.color.white, fontWeight: 700 }}>Ver servicios</div>
          </div>
          <div style={{ borderRadius: 28, background: "linear-gradient(140deg,#1A1A1A,#2C2C2C)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 40, bottom: 40, right: 40, height: 14, borderRadius: 14, background: "rgba(255,255,255,0.15)" }} />
            <div style={{ position: "absolute", left: 40, bottom: 70, width: 220, height: 14, borderRadius: 14, background: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>
        {/* Servicio + CTA */}
        <div style={{ padding: "80px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ font: `600 16px ${fary.font.ui}`, letterSpacing: "0.24em", color: "#777" }}>SERVICIO</div>
            <div style={{ font: `900 54px/1.05 ${fary.font.display}`, marginTop: 14 }}>Consulta inicial</div>
            <div style={{ marginTop: 16, color: "#555", lineHeight: 1.5, maxWidth: 460 }}>Elige día y hora. Te confirmamos al momento.</div>
            <div
              style={{
                marginTop: 34,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "20px 34px",
                borderRadius: 999,
                background: ctaActive > 0 ? fary.color.accent : fary.color.black,
                color: ctaActive > 0 ? fary.color.black : fary.color.white,
                fontWeight: 800,
                transform: `scale(${1 - 0.04 * Math.sin(Math.PI * press)})`,
              }}
            >
              Reservar ahora <Icon name="arrow" size={24} stroke={2.6} />
            </div>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {["Lunes a sábado", "Atención en línea", "Confirmación inmediata"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 24px", borderRadius: 18, background: "#FFF" }}>
                <span style={{ width: 10, height: 10, borderRadius: 10, background: fary.color.black }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Confirmación */}
      <div style={{ position: "absolute", right: 48, bottom: 40, display: "flex", alignItems: "center", gap: 16, padding: "20px 28px", borderRadius: 20, background: fary.color.black, color: fary.color.white, fontWeight: 700, ...enterStyle(done) }}>
        <span style={{ width: 36, height: 36, borderRadius: 36, background: fary.color.accent, color: fary.color.black, display: "grid", placeItems: "center" }}>
          <Icon name="check" size={24} stroke={3} />
        </span>
        Solicitud recibida
      </div>
      <Cursor x={cx} y={cy + 520 - scroll} press={press} opacity={interpolate(frame, [b.cursor - 6, b.cursor], [0, 1], clamp) * (1 - done)} />
    </div>
  );
}
