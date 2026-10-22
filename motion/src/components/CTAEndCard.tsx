import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fary } from "../theme/fary";
import { clamp, easeInOut, enterStyle, progress, useEnter } from "../lib/motion";
import { FaryLogo } from "./FaryLogo";
import { Icon } from "./Icon";

const LOGO_W = 620;
/** Distancia del centro del símbolo al centro de la firma completa (proporción del viewBox 790 × 248). */
const MARK_SHIFT = LOGO_W / 2 - (92 / 790) * LOGO_W;

/**
 * Cierre: símbolo oficial, después la firma completa, servicios, subtexto y CTA.
 * Una línea de datos atraviesa la composición y termina en el logo.
 */
export function CTAEndCard({ services, subtext, cta }: { services: string; subtext: string; cta: string }) {
  const frame = useCurrentFrame();
  const line = progress(frame, 0, 26, easeInOut);
  const mark = useEnter(14, 20);
  const word = progress(frame, 28, 18);
  const s1 = useEnter(40);
  const s2 = useEnter(46);
  const s3 = useEnter(54);
  // La línea entra por la izquierda y termina en el centro del símbolo.
  const path = "M -40 1380 C 220 1380, 260 760, 540 760";
  const len = 1100;
  return (
    <AbsoluteFill style={{ background: fary.color.black }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={path} fill="none" stroke={fary.color.accent} strokeWidth={10} strokeOpacity={0.25} strokeDasharray={len} strokeDashoffset={len * (1 - line)} style={{ filter: "blur(8px)" }} />
        <path d={path} fill="none" stroke={fary.color.accent} strokeWidth={3.5} strokeDasharray={len} strokeDashoffset={len * (1 - line)} strokeLinecap="round" />
        <circle cx={540} cy={760} r={interpolate(line, [0.9, 1], [0, 90], clamp)} fill="none" stroke={fary.color.accent} strokeWidth={2} opacity={interpolate(frame, [24, 40], [0.8, 0], clamp)} />
      </svg>
      {/* Una sola pieza: el símbolo entra centrado y se desplaza mientras se revela el wordmark. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 260, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: mark, transform: `translateX(${MARK_SHIFT * (1 - word)}px) scale(${0.9 + 0.1 * mark})` }}>
          <FaryLogo width={LOGO_W} word={word} />
        </div>
      </div>
      <div style={{ position: "absolute", left: fary.safe.left, right: fary.safe.left, top: 980, textAlign: "center" }}>
        <div style={{ ...enterStyle(s1), font: `900 72px ${fary.font.display}`, color: fary.color.white, letterSpacing: "-0.02em" }}>{services}</div>
        <div style={{ ...enterStyle(s2), marginTop: 22, font: `500 34px/1.35 ${fary.font.ui}`, color: fary.color.gray, maxWidth: 760, marginInline: "auto" }}>{subtext}</div>
        <div style={{ ...enterStyle(s3), marginTop: 56, display: "inline-flex", alignItems: "center", gap: 16, padding: "26px 44px", borderRadius: 999, background: fary.color.accent, color: fary.color.black, font: `800 36px ${fary.font.ui}` }}>
          {cta}
          <Icon name="arrow" size={38} stroke={3} />
        </div>
      </div>
    </AbsoluteFill>
  );
}
