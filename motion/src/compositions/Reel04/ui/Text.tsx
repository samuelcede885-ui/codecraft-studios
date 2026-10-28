import { interpolate } from "remotion";
import { scenes, subtitles, titles } from "../timeline";
import { clamp, easeInOut, easeOut, prog, ui } from "../../Reel02/ui/kit";

/** Velo superior para que los titulares se lean sobre cualquier escena. */
export function TopVeil({ frame }: { frame: number }) {
  const a = 1 - prog(frame, scenes.cierre.from, 20);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 640, opacity: a, background: "linear-gradient(180deg, rgba(8,10,15,0.8) 0%, rgba(8,10,15,0.45) 50%, rgba(8,10,15,0) 100%)" }} />;
}

/** Titulares grandes en mayúsculas; la palabra clave en azul. Entran palabra por palabra. */
export function Titles({ frame }: { frame: number }) {
  return (
    <>
      {titles.map((t, i) => {
        if (frame < t.from - 2 || frame > t.to + 2) return null;
        const out = interpolate(frame, [t.to - 8, t.to], [0, 1], { ...clamp, easing: easeInOut });
        let w = 0;
        return (
          <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 270, textAlign: "center", opacity: 1 - out, transform: `translateY(${-18 * out}px)`, filter: `blur(${3 * out}px)` }}>
            {t.lines.map((line, li) => (
              <div key={li} style={{ font: `900 ${t.lines.join("").length > 26 ? 64 : 76}px/1.04 ${ui.display}`, letterSpacing: "0.01em", color: "#fff", textShadow: "0 6px 40px rgba(0,0,0,0.7)" }}>
                {line.split(" ").map((word, k) => {
                  const p = interpolate(frame, [t.from + w * 2.5, t.from + w * 2.5 + 13], [0, 1], { ...clamp, easing: easeOut });
                  w++;
                  const accent = word === t.accent;
                  return (
                    <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", padding: "0 0.1em 0.06em" }}>
                      <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%)`, color: accent ? "#5B8DF7" : undefined, textShadow: accent ? `0 0 ${28 * p}px rgba(37,99,235,0.85)` : undefined }}>{word}</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

/** Subtítulos: máximo dos líneas, alto contraste, palabras clave (*así*) en azul. */
export function Subtitles({ frame }: { frame: number }) {
  const t = frame / 30;
  const cur = subtitles.find((x) => t >= x.from - 0.05 && t < x.to + 0.08);
  if (!cur) return null;
  const a = Math.min(interpolate(t, [cur.from - 0.05, cur.from + 0.12], [0, 1], clamp), interpolate(t, [cur.to - 0.05, cur.to + 0.08], [1, 0], clamp));
  const parts = cur.text.split("*");
  return (
    <div style={{ position: "absolute", left: 72, right: 180, top: 1270, height: 190, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ maxWidth: 828, textAlign: "center", padding: "14px 24px", borderRadius: 18, background: "rgba(8,10,15,0.74)", font: `800 40px/1.24 ${ui.font}`, color: "#fff", opacity: a, transform: `translateY(${(1 - a) * 8}px)` }}>
        {parts.map((p, i) => (
          <span key={i} style={i % 2 ? { color: "#6E9BFF" } : undefined}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
