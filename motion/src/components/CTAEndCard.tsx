import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fary, signal } from "../theme/fary";
import { clamp, easeInOut, enterStyle, progress, useEnter } from "../lib/motion";
import { FaryLogo } from "./FaryLogo";
import { Icon } from "./Icon";

const LOGO_W = 560;
/** Desplazamiento del símbolo hasta su sitio en la firma (centro del símbolo en el viewBox 790 × 248). */
const MARK_SHIFT = LOGO_W / 2 - (92 / 790) * LOGO_W;

/**
 * Cierre editorial (Manual de Marca): una línea de datos llega al símbolo, se revela la firma
 * completa y aparecen el mensaje, el proceso, el subtexto y el CTA.
 */
export function CTAEndCard({ headline, process, subtext, cta }: { headline: string[]; process: string[]; subtext: string; cta: string }) {
  const frame = useCurrentFrame();
  const line = progress(frame, 0, 26, easeInOut);
  const mark = useEnter(14, 20);
  const word = progress(frame, 30, 18);
  const h = [useEnter(44), useEnter(50)];
  const pr = useEnter(60);
  const sub = useEnter(66);
  const btn = useEnter(74);
  const path = "M -40 250 C 220 250, 300 520, 540 520";
  const len = 700;
  const dash = { strokeDasharray: len, strokeDashoffset: len * (1 - line) };
  const lineOut = 1 - progress(frame, 34, 16);
  return (
    <AbsoluteFill style={{ background: fary.color.negro }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: lineOut }}>
        <path d={path} fill="none" stroke={signal(0.3)} strokeWidth={10} style={{ filter: "blur(8px)" }} {...dash} />
        <path d={path} fill="none" stroke={fary.color.signal} strokeWidth={3} strokeLinecap="round" {...dash} />
        <circle cx={540} cy={520} r={interpolate(line, [0.9, 1], [0, 90], clamp)} fill="none" stroke={fary.color.signal} strokeWidth={2} opacity={interpolate(frame, [24, 42], [0.7, 0], clamp)} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: mark, transform: `translateX(${MARK_SHIFT * (1 - word)}px) scale(${0.9 + 0.1 * mark})` }}>
          <FaryLogo width={LOGO_W} word={word} />
        </div>
      </div>
      <div style={{ position: "absolute", left: fary.safe.left, right: fary.safe.left, top: 720, textAlign: "center" }}>
        {headline.map((l, i) => (
          <div key={l} style={{ ...enterStyle(h[i]), font: `900 70px/1.06 ${fary.font.display}`, letterSpacing: "-0.03em", color: i ? fary.color.muted : fary.color.blanco }}>
            {l}
          </div>
        ))}
        <div style={{ ...enterStyle(pr), marginTop: 40, font: `600 24px ${fary.font.ui}`, letterSpacing: "0.3em", textTransform: "uppercase", color: fary.color.marfil }}>
          {process.map((p, i) => (
            <span key={p}>
              {i > 0 && <span style={{ color: fary.color.grafito, margin: "0 0.6em" }}>/</span>}
              {p}
            </span>
          ))}
        </div>
        <div style={{ ...enterStyle(sub), marginTop: 30, font: `500 34px/1.4 ${fary.font.ui}`, color: fary.color.muted, maxWidth: 760, marginInline: "auto" }}>{subtext}</div>
        <div style={{ ...enterStyle(btn), marginTop: 50, display: "inline-flex", alignItems: "center", gap: 16, padding: "26px 48px", borderRadius: 999, background: fary.color.signal, color: fary.color.blanco, font: `800 38px ${fary.font.ui}` }}>
          {cta}
          <Icon name="arrow" size={38} stroke={3} />
        </div>
      </div>
    </AbsoluteFill>
  );
}
