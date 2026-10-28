import { interpolate } from "remotion";
import { FaryLogo } from "../../../components/FaryLogo";
import { s } from "../timeline";
import { clamp, easeOut, prog, ui } from "../../Reel02/ui/kit";

/**
 * Cierre: firma oficial (sin efectos sobre el logo), lema y llamada a la acción.
 * La "luz sobre el isotipo" es un halo detrás de él, para no alterar la marca.
 */
const W = 600;
const MARK_CX = (92.5 / 790) * W;
const MARK_CY = (100 / 248) * ((W * 248) / 790);

export function EndCard({ frame }: { frame: number }) {
  if (frame < s(41.6)) return null;
  const logo = prog(frame, s(41.8), 26);
  const tag = prog(frame, s(42.6), 16);
  const q1 = prog(frame, s(43.4), 14);
  const q2 = prog(frame, s(44.1), 14);
  const glow = interpolate(frame, [s(45.2), s(46.0), s(47.0)], [0, 1, 0.4], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 260 }}>
      {/* Velo central para que el texto se lea sobre las líneas */}
      <div style={{ position: "absolute", inset: 0, opacity: logo, background: "radial-gradient(60% 34% at 50% 44%, rgba(8,10,15,0.88) 0%, rgba(8,10,15,0.6) 60%, rgba(8,10,15,0) 100%)" }} />
      <div style={{ position: "relative", opacity: logo, transform: `translateY(${(1 - logo) * 24}px) scale(${0.96 + 0.04 * logo})`, filter: `blur(${(1 - logo) * 8}px)` }}>
        <div style={{ position: "absolute", left: MARK_CX - 170, top: MARK_CY - 170, width: 340, height: 340, borderRadius: 340, background: `radial-gradient(circle, rgba(37,99,235,${0.45 * glow}) 0%, rgba(56,221,245,${0.12 * glow}) 45%, rgba(0,0,0,0) 70%)` }} />
        <div style={{ position: "relative" }}>
          <FaryLogo width={W} />
        </div>
      </div>
      <div style={{ marginTop: 44, font: `900 34px ${ui.display}`, letterSpacing: "0.06em", color: "#C6CEDC", textAlign: "center", opacity: tag, transform: `translateY(${(1 - tag) * 14}px)` }}>
        UNA NUEVA EXPERIENCIA
        <br />
        PARA EL COMERCIO.
      </div>
      <div style={{ marginTop: 48, textAlign: "center" }}>
        <div style={{ font: `900 46px ${ui.display}`, color: "#fff", opacity: q1, transform: `translateY(${(1 - interpolate(q1, [0, 1], [0, 1], { ...clamp, easing: easeOut })) * 16}px)` }}>¿TIENES UN NEGOCIO?</div>
        <div style={{ marginTop: 18, display: "inline-block", padding: "18px 34px", borderRadius: 60, background: ui.azul, boxShadow: "0 0 50px rgba(37,99,235,0.55)", font: `900 40px ${ui.display}`, letterSpacing: "0.04em", color: "#fff", opacity: q2, transform: `scale(${0.9 + 0.1 * q2})` }}>
          COMENTA CONECTAR.
        </div>
      </div>
    </div>
  );
}
