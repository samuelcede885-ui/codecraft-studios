import { titles, type Title } from "../timeline";
import { clamp, easeInOut, easeOut, ui } from "./kit";
import { interpolate } from "remotion";

/**
 * Titulares cinéticos: cada palabra sube desde una máscara, la palabra clave se marca en azul
 * con un brillo suave y todo sale hacia arriba al terminar. Zona segura superior de Reels.
 */
/** Velo superior: oscurece la ciudad detrás de los titulares (va debajo de las interfaces). */
export function HeadlineVeil({ frame }: { frame: number }) {
  const veil = Math.max(0, ...titles.map((t) => Math.min(interpolate(frame, [t.from - 14, t.from + 4], [0, 1], clamp), interpolate(frame, [t.to, t.to + 20], [1, 0], clamp))));
  if (veil <= 0) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, opacity: veil, background: "linear-gradient(180deg, rgba(8,10,15,0.92) 0%, rgba(8,10,15,0.78) 34%, rgba(8,10,15,0.35) 62%, rgba(8,10,15,0) 100%)" }} />;
}

export function Headlines({ frame }: { frame: number }) {
  return <>{titles.map((t, i) => (frame >= t.from - 2 && frame <= t.to + 2 ? <Headline key={i} t={t} frame={frame} /> : null))}</>;
}

function Headline({ t, frame }: { t: Title; frame: number }) {
  const words = t.text.split(" ");
  const out = interpolate(frame, [t.to - 9, t.to], [0, 1], { ...clamp, easing: easeInOut });
  const size = t.size ?? 74;
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: 270,
        textAlign: "center",
        opacity: 1 - out,
        transform: `translateY(${-24 * out}px)`,
        filter: `blur(${4 * out}px)`,
      }}
    >
      <div style={{ font: `900 ${size}px/1.06 ${ui.display}`, letterSpacing: "-0.015em", color: ui.blanco, textShadow: "0 6px 40px rgba(0,0,0,0.65)" }}>
        {words.map((w, k) => {
          const p = interpolate(frame, [t.from + k * 2.4, t.from + k * 2.4 + 14], [0, 1], { ...clamp, easing: easeOut });
          const accent = t.accent && w === t.accent;
          return (
            <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", padding: "0 0.12em 0.08em" }}>
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - p) * 105}%)`,
                  color: accent ? "#5B8DF7" : undefined,
                  textShadow: accent ? `0 0 ${30 * p}px rgba(37,99,235,0.85), 0 0 ${8 * p}px rgba(56,221,245,0.5)` : undefined,
                }}
              >
                {w}
              </span>
            </span>
          );
        })}
      </div>
      {t.sub && (
        <div
          style={{
            marginTop: 26,
            font: `500 34px/1.3 ${ui.font}`,
            color: "#C6CEDC",
            opacity: interpolate(frame, [t.from + 26, t.from + 42], [0, 1], clamp),
            transform: `translateY(${interpolate(frame, [t.from + 26, t.from + 42], [16, 0], { ...clamp, easing: easeOut })}px)`,
            letterSpacing: "0.01em",
          }}
        >
          {t.sub}
        </div>
      )}
    </div>
  );
}
