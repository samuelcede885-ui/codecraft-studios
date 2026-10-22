import type { CSSProperties } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fary } from "../theme/fary";
import { enterStyle } from "../lib/motion";
import { HighlightWord, type HighlightTiming } from "./HighlightWord";

/** Una línea del título. La que lleva `highlight` es la palabra clave de la escena. */
export type TitleLine = { text: string; highlight?: boolean };

/**
 * Título cinético de 2–4 líneas. Cada palabra entra con opacity, translateY 30 → 0 y
 * scale .96 → 1, escalonada `stagger` frames. La línea destacada usa HighlightWord y arranca
 * cuando terminan las palabras anteriores.
 */
export function KineticTitle({
  lines,
  from = 0,
  stagger = fary.stagger,
  size = 104,
  highlightTiming,
  style,
}: {
  lines: TitleLine[];
  from?: number;
  stagger?: number;
  size?: number;
  highlightTiming?: HighlightTiming;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let index = 0;
  return (
    <div style={{ font: `900 ${size}px/1.02 ${fary.font.display}`, letterSpacing: "-0.035em", color: fary.color.white, ...style }}>
      {lines.slice(0, 4).map((line, li) => {
        if (line.highlight) {
          const start = from + index * stagger + 2;
          index += 1;
          return (
            <div key={li} style={{ marginTop: "0.08em" }}>
              <HighlightWord from={start} timing={highlightTiming}>
                {line.text}
              </HighlightWord>
            </div>
          );
        }
        return (
          <div key={li}>
            {line.text.split(" ").map((word, wi) => {
              const p = spring({ frame: frame - from - index++ * stagger, fps, durationInFrames: 20, config: { damping: 200 } });
              return (
                <span key={wi} style={{ display: "inline-block", marginRight: "0.24em", ...enterStyle(p) }}>
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
