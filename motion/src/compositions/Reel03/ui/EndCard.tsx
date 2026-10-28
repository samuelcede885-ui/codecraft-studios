import { interpolate } from "remotion";
import { FaryLogo } from "../../../components/FaryLogo";
import { s } from "../timeline";
import { clamp, easeInOut, prog, ui } from "../../Reel02/ui/kit";

/** Cierre: firma oficial (sin efectos sobre el logo), lema y pregunta final; termina en el isotipo. */
const W = 600;
const MARK_CX = (92.5 / 790) * W;
const MARK_CY = (100 / 248) * ((W * 248) / 790);

export function EndCard({ frame }: { frame: number }) {
  if (frame < s(37.0)) return null;
  const logo = prog(frame, s(37.2), 26);
  const tagline = prog(frame, s(38.6), 16);
  const question = prog(frame, s(40.5), 16);
  const word = 1 - prog(frame, s(43.4), 20, easeInOut);
  const pulse = interpolate(frame, [s(43.8), s(44.7)], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 200 }}>
      <div style={{ position: "relative", opacity: logo, transform: `translateY(${(1 - logo) * 24 + (1 - word) * 80}px) scale(${0.96 + 0.04 * logo})`, filter: `blur(${(1 - logo) * 8}px)` }}>
        <div style={{ position: "relative", transform: `translateX(${(1 - word) * (W / 2 - MARK_CX)}px)` }}>
          {pulse > 0 && <div style={{ position: "absolute", left: MARK_CX - 150, top: MARK_CY - 150, width: 300, height: 300, borderRadius: 300, border: "3px solid rgba(37,99,235,0.8)", transform: `scale(${0.6 + 0.9 * pulse})`, opacity: 1 - pulse }} />}
          <FaryLogo width={W} word={word} />
        </div>
      </div>
      <div style={{ marginTop: 46, font: `800 46px ${ui.display}`, color: "#fff", opacity: tagline * word, transform: `translateY(${(1 - tagline) * 16}px)` }}>Digitaliza tu negocio.</div>
      <div style={{ marginTop: 40, opacity: question * word, transform: `translateY(${(1 - question) * 18}px)`, padding: "20px 34px", borderRadius: 60, border: `2px solid ${ui.azul}`, background: "rgba(37,99,235,0.14)", boxShadow: "0 0 50px rgba(37,99,235,0.35)", font: `900 30px ${ui.display}`, letterSpacing: "0.06em", color: "#fff" }}>
        ¿CUÁL DE LOS DOS QUIERES TENER?
      </div>
    </div>
  );
}
