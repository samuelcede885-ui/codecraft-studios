import { interpolate } from "remotion";
import { FaryLogo } from "../../../components/FaryLogo";
import { s, scenes } from "../timeline";
import { clamp, easeInOut, easeOut, prog, ui } from "./kit";

/**
 * Escena 8 — cierre. Firma oficial (componente de marca, sin efectos sobre el logo), lema,
 * frase de la locución y llamada a la acción. Termina con el isotipo solo.
 */
const MARK_CX = (92.5 / 790) * 620;
const MARK_CY = (100 / 248) * ((620 * 248) / 790);

export function EndCard({ frame }: { frame: number }) {
  const { cierre } = scenes;
  if (frame < cierre.from + s(0.4)) return null;
  const logo = prog(frame, s(54.6), 26);
  const tagline = prog(frame, s(55.6), 18);
  const voiceLine = prog(frame, s(56.6), 14);
  const cta = prog(frame, s(60.0), 16);
  // El wordmark se recoge al final y queda el isotipo.
  const word = 1 - prog(frame, s(62.2), 20, easeInOut);
  const pulse = interpolate(frame, [s(62.6), s(63.4)], [0, 1], clamp);
  const lift = interpolate(word, [0, 1], [70, 0]);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
      <div style={{ font: `700 24px ${ui.font}`, letterSpacing: "0.28em", color: "#7FA6FF", opacity: voiceLine * word, transform: `translateY(${(1 - voiceLine) * 12}px)`, marginBottom: 54 }}>
        MENOS PROCESOS · MÁS OPORTUNIDADES
      </div>
      <div style={{ position: "relative", opacity: logo, transform: `translateY(${(1 - logo) * 24 + lift}px) scale(${0.96 + 0.04 * logo})`, filter: `blur(${(1 - logo) * 8}px)` }}>
        {/* Isotipo: 0–185 de 790 en el viewBox de la firma; al recogerse el wordmark queda centrado. */}
        <div style={{ position: "relative", transform: `translateX(${(1 - word) * (310 - MARK_CX)}px)` }}>
          {pulse > 0 && <div style={{ position: "absolute", left: MARK_CX - 150, top: MARK_CY - 150, width: 300, height: 300, borderRadius: 300, border: "3px solid rgba(37,99,235,0.8)", transform: `scale(${0.6 + 0.9 * pulse})`, opacity: 1 - pulse }} />}
          <FaryLogo width={620} word={word} />
        </div>
      </div>
      <div style={{ marginTop: 50, textAlign: "center", opacity: tagline * word, transform: `translateY(${(1 - tagline) * 16}px)` }}>
        <div style={{ font: `800 40px/1.25 ${ui.display}`, color: "#fff" }}>Digitalizamos negocios.</div>
        <div style={{ font: `800 40px/1.25 ${ui.display}`, color: "#C6CEDC" }}>Simplificamos el comercio.</div>
      </div>
      <div style={{ marginTop: 56, opacity: cta * word, transform: `translateY(${(1 - interpolate(cta, [0, 1], [0, 1], { ...clamp, easing: easeOut })) * 20}px)` }}>
        <div style={{ padding: "22px 40px", borderRadius: 60, border: `2px solid ${ui.azul}`, background: "rgba(37,99,235,0.14)", boxShadow: "0 0 50px rgba(37,99,235,0.35)", font: `700 32px ${ui.font}`, color: "#fff" }}>
          ¿Quieres formar parte? <span style={{ color: "#7FA6FF" }}>Escríbenos.</span>
        </div>
      </div>
    </div>
  );
}
