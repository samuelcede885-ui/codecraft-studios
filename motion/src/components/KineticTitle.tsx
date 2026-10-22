import type { CSSProperties } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fary } from "../theme/fary";
import { easeIn, enterStyle, progress } from "../lib/motion";
import { HighlightWord, type HighlightTone } from "./HighlightWord";

export type Eyebrow = string | { steps: string[]; current: number };

export type KineticTitleProps = {
  /** 2–4 líneas. */
  lines: string[];
  /** Palabra protagonista (una sola por escena). Se busca tal cual dentro de las líneas. */
  highlight?: string;
  tone?: HighlightTone;
  eyebrow?: Eyebrow;
  alignment?: "left" | "center";
  /** Posición vertical del bloque: arriba (bajo la cabecera de la app), centro o abajo. */
  position?: "top" | "center" | "bottom";
  maxWidth?: number;
  size?: number;
  /** Frame de entrada y de salida (relativos a la secuencia). */
  from?: number;
  exitAt?: number;
  stagger?: number;
  style?: CSSProperties;
};

/**
 * Título cinético. Cada palabra entra con opacity 0 → 1, translateY 30 → 0 y scale .96 → 1,
 * escalonada `stagger` frames; la protagonista usa HighlightWord. La salida es más breve.
 */
export function KineticTitle({
  lines,
  highlight,
  tone = "accent",
  eyebrow,
  alignment = "center",
  position = "top",
  maxWidth = 936,
  size = 96,
  from = 0,
  exitAt = Infinity,
  stagger = fary.stagger,
  style,
}: KineticTitleProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = progress(frame, exitAt, 8, easeIn);
  if (out >= 1) return null;
  let index = eyebrow ? 1 : 0;
  const place: CSSProperties =
    position === "top" ? { top: fary.safe.top + 10 } : position === "bottom" ? { bottom: fary.safe.bottom } : { top: "50%", transform: "translateY(-50%)" };
  const eyeP = spring({ frame: frame - from, fps, durationInFrames: 18, config: { damping: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: fary.safe.left,
        right: alignment === "center" ? fary.safe.left : fary.safe.right,
        display: "flex",
        flexDirection: "column",
        alignItems: alignment === "center" ? "center" : "flex-start",
        textAlign: alignment,
        opacity: 1 - out,
        translate: `0 ${-14 * out}px`,
        ...place,
        ...style,
      }}
    >
      {eyebrow && (
        <div style={{ ...enterStyle(eyeP, 16), marginBottom: 22, font: `600 24px ${fary.font.ui}`, letterSpacing: "0.32em", textTransform: "uppercase" }}>
          {typeof eyebrow === "string" ? (
            <span style={{ color: fary.color.accent }}>{eyebrow}</span>
          ) : (
            eyebrow.steps.map((s, i) => (
              <span key={s} style={{ color: i === eyebrow.current ? fary.color.accent : "rgba(255,255,255,0.4)" }}>
                {i > 0 && <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 0.5em" }}>·</span>}
                {s}
              </span>
            ))
          )}
        </div>
      )}
      <div style={{ maxWidth, font: `900 ${size}px/1.04 ${fary.font.display}`, letterSpacing: "-0.03em", color: fary.color.white, textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
        {lines.slice(0, 4).map((line, li) => (
          <div key={li}>
            {tokens(line, highlight).map((tok, wi) => {
              const delay = from + index++ * stagger;
              if (tok.highlight) {
                return (
                  <span key={wi} style={{ marginRight: "0.2em", textShadow: "none" }}>
                    <HighlightWord from={delay + 2} tone={tone}>
                      {tok.text}
                    </HighlightWord>
                  </span>
                );
              }
              const p = spring({ frame: frame - delay, fps, durationInFrames: 20, config: { damping: 200 } });
              return (
                <span key={wi} style={{ display: "inline-block", marginRight: "0.22em", ...enterStyle(p) }}>
                  {tok.text}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Palabras de una línea; la protagonista (puede tener varias palabras) queda como un solo token. */
function tokens(line: string, highlight?: string) {
  const words = (t: string) => t.split(" ").filter(Boolean).map((text) => ({ text, highlight: false }));
  if (!highlight || !line.includes(highlight)) return words(line);
  const [before, after] = [line.slice(0, line.indexOf(highlight)), line.slice(line.indexOf(highlight) + highlight.length)];
  return [...words(before), { text: highlight, highlight: true }, ...words(after)];
}
