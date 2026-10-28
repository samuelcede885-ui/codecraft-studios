import { interpolate } from "remotion";
import { project } from "../camera";
import { TWIN, FRONT_Z } from "../city/TwinShops";
import { s, scenes, subtitles } from "../timeline";
import { clamp, easeInOut, easeOut, prog, ui } from "../../Reel02/ui/kit";

/** Etiquetas fijas sobre cada tienda: SIN / CON Fary Labs (las mismas durante todo el video). */
export function ShopLabels({ frame }: { frame: number }) {
  const a = prog(frame, s(1.0), 14) * (1 - prog(frame, scenes.cierre.from, 16, easeInOut));
  if (a <= 0) return null;
  const top = TWIN.h + TWIN.upper + 0.45;
  const items = [
    { x: TWIN.xs.manual, text: "SIN FARY LABS", digital: false },
    { x: TWIN.xs.digital, text: "CON FARY LABS", digital: true },
  ];
  return (
    <>
      {items.map((it, i) => {
        const p = project(frame, [it.x, top, TWIN.z + 0.3]);
        if (p.behind) return null;
        const k = interpolate(a, [0, 1], [0, 1], { ...clamp, easing: easeOut });
        // Escenas 2–4: fijas arriba, una por mitad de pantalla (las interfaces van debajo).
        const pin = Math.min(prog(frame, scenes.problema.from - 6, 14, easeInOut), 1 - prog(frame, scenes.diferencia.from, 16, easeInOut));
        const fx = Math.min(i ? 900 - 150 : 1080, Math.max(i ? 0 : 72 + 150, p.x));
        const fy = Math.max(300, Math.min(1250, p.y));
        const x = interpolate(pin, [0, 1], [fx, i ? 790 : 270]);
        const y = interpolate(pin, [0, 1], [fy, 350]);
        return (
          <div key={it.text} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) translateY(${(1 - k) * 16}px)`, opacity: k }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 14,
                whiteSpace: "nowrap",
                font: `900 24px ${ui.display}`,
                letterSpacing: "0.14em",
                color: "#fff",
                background: it.digital ? ui.azul : "rgba(30,26,22,0.88)",
                border: it.digital ? "1.5px solid rgba(56,221,245,0.6)" : "1.5px solid rgba(255,197,138,0.45)",
                boxShadow: it.digital ? "0 0 36px rgba(37,99,235,0.65)" : "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 6, background: it.digital ? ui.cian : ui.calido }} />
              {it.text}
            </div>
          </div>
        );
      })}
    </>
  );
}

/** Subtítulos: máximo dos líneas, sobre la zona de botones y descripción de TikTok / Reels. */
export function Subtitles({ frame }: { frame: number }) {
  const t = frame / 30;
  const cur = subtitles.find((x) => t >= x.from - 0.05 && t < x.to + 0.1);
  if (!cur) return null;
  const a = Math.min(interpolate(t, [cur.from - 0.05, cur.from + 0.15], [0, 1], clamp), interpolate(t, [cur.to - 0.05, cur.to + 0.1], [1, 0], clamp));
  return (
    <div style={{ position: "absolute", left: 72, right: 180, top: 1290, height: 170, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 820,
          textAlign: "center",
          padding: "14px 24px",
          borderRadius: 18,
          background: "rgba(8,10,15,0.72)",
          font: `700 38px/1.25 ${ui.font}`,
          color: "#fff",
          opacity: a,
          transform: `translateY(${(1 - a) * 8}px)`,
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        }}
      >
        {cur.text}
      </div>
    </div>
  );
}

/** Mensajes grandes de la escena 5 (sin cifras ni promesas). */
export function Statements({ frame }: { frame: number }) {
  const lines = [
    { from: s(29.5), to: s(33.6), a: "MISMOS NEGOCIOS.", b: "DIFERENTES PROCESOS." },
    { from: s(33.8), to: s(36.9), a: "MENOS TRABAJO MANUAL.", b: "MÁS TIEMPO PARA CRECER." },
  ];
  return (
    <>
      {lines.map((l) => {
        if (frame < l.from - 2 || frame > l.to + 2) return null;
        const inA = prog(frame, l.from, 14);
        const inB = prog(frame, l.from + 8, 14);
        const out = prog(frame, l.to - 8, 8, easeInOut);
        return (
          <div key={l.a} style={{ position: "absolute", left: 60, right: 60, top: 300, textAlign: "center", opacity: 1 - out, transform: `translateY(${-16 * out}px)` }}>
            <div style={{ font: `900 62px/1.08 ${ui.display}`, color: "#fff", letterSpacing: "0.01em", opacity: inA, transform: `translateY(${(1 - inA) * 24}px)` }}>{l.a}</div>
            <div style={{ font: `900 62px/1.08 ${ui.display}`, color: "#5B8DF7", textShadow: "0 0 30px rgba(37,99,235,0.8)", opacity: inB, transform: `translateY(${(1 - inB) * 24}px)` }}>{l.b}</div>
          </div>
        );
      })}
    </>
  );
}

/** Velo superior para que los textos y las interfaces de arriba se lean sobre la ciudad. */
export function TopVeil({ frame }: { frame: number }) {
  const a = prog(frame, s(0.6), 20) * (1 - prog(frame, scenes.cierre.from + s(1), 20));
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 720, opacity: a, background: "linear-gradient(180deg, rgba(8,10,15,0.85) 0%, rgba(8,10,15,0.5) 45%, rgba(8,10,15,0) 100%)" }} />;
}

/** Aviso: los dos negocios son ficticios (al inicio y al final). */
export function Disclaimer({ frame }: { frame: number }) {
  const a = Math.max(prog(frame, s(0.8), 12) * (1 - prog(frame, s(5.6), 12)), prog(frame, s(42.8), 12));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", opacity: a * 0.9, font: `600 19px ${ui.font}`, letterSpacing: "0.2em", color: "#9AA4B8" }}>
      EJEMPLO ILUSTRATIVO · NEGOCIOS FICTICIOS
    </div>
  );
}

/** Punto en pantalla de la puerta de cada tienda (para anclar líneas de las interfaces). */
export const shopPoint = (frame: number, side: "manual" | "digital", y = 0.8) => project(frame, [TWIN.xs[side], y, FRONT_Z]);
