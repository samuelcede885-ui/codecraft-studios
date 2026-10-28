import { interpolate } from "remotion";
import words from "../words.json";
import { project } from "../camera";
import { clamp, easeOut, Icon, ui, type IconName } from "../../Reel02/ui/kit";

/**
 * Subtítulos palabra a palabra (estilo explicativo): frases cortas que se arman mientras se
 * dicen; la palabra actual en blanco y negrita, las anteriores en gris; las palabras clave dentro
 * de una caja de selección azul con tiradores y un ícono. Tiempos: words.json
 * (scripts/audio/word_timings.py sobre la voz real).
 */
type Word = { w: string; t0: number; t1: number; line: number };
type Chunk = { words: Word[]; from: number; to: number };

const KEYS: Record<string, IconName> = {
  "fácil": "spark",
  toque: "flow",
  elegir: "cart",
  pedido: "box",
  comercios: "store",
  separados: "list",
  "Fary Labs": "spark",
  digitales: "globe",
  inventario: "box",
  conecten: "flow",
  "visión": "spark",
  CONECTAR: "chat",
};
const bare = (w: string) => w.replace(/[¿?¡!.,:;]/g, "");

/** Une "Fary Labs" en una sola palabra y arma frases de hasta 4 palabras (corta en puntuación). */
function chunks(): Chunk[] {
  const list: Word[] = [];
  const src = words as Word[];
  for (let i = 0; i < src.length; i++) {
    if (src[i].w === "Fary" && src[i + 1]?.w.startsWith("Labs")) {
      list.push({ w: `Fary ${src[i + 1].w}`, t0: src[i].t0, t1: src[i + 1].t1, line: src[i].line });
      i++;
    } else list.push(src[i]);
  }
  const out: Chunk[] = [];
  let cur: Word[] = [];
  list.forEach((w, i) => {
    cur.push(w);
    const next = list[i + 1];
    if (cur.length >= 4 || /[,.:;?!]$/.test(w.w) || !next || next.line !== w.line) {
      out.push({ words: cur, from: cur[0].t0, to: 0 });
      cur = [];
    }
  });
  out.forEach((c, i) => {
    const last = c.words[c.words.length - 1];
    const next = out[i + 1];
    c.to = next && next.from - last.t1 < 0.9 ? next.from - 0.02 : last.t1 + 0.45;
  });
  return out;
}
const CHUNKS = chunks();

export function Captions({ frame }: { frame: number }) {
  const t = frame / 30;
  const c = CHUNKS.find((x) => t >= x.from - 0.05 && t < x.to);
  if (!c) return null;
  const out = interpolate(t, [c.to - 0.12, c.to], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 300, display: "flex", justifyContent: "center", opacity: out }}>
      <div style={{ maxWidth: 860, textAlign: "center", font: `500 54px/1.28 ${ui.font}`, color: "#7C869A", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
        {c.words.map((w, i) => {
          if (t < w.t0 - 0.03) return null;
          const p = interpolate(t, [w.t0 - 0.03, w.t0 + 0.12], [0, 1], { ...clamp, easing: easeOut });
          const isLast = i === c.words.length - 1 || t < c.words[i + 1].t0 - 0.03;
          const key = KEYS[bare(w.w)];
          return (
            <span key={i} style={{ display: "inline-block", margin: "0 0.16em", opacity: p, transform: `translateY(${(1 - p) * 10}px)`, color: isLast || key ? "#FFFFFF" : undefined, fontWeight: isLast || key ? 800 : 500 }}>
              {key ? <Keyword word={w.w} icon={key} p={interpolate(t, [w.t0, w.t0 + 0.25], [0, 1], clamp)} /> : w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Palabra clave: caja de selección azul con tiradores en las esquinas y un ícono delante. */
function Keyword({ word, icon, p }: { word: string; icon: IconName; p: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ display: "inline-flex", transform: `scale(${0.6 + 0.4 * p})`, opacity: p }}>
        <Icon name={icon} size={34} color={ui.cian} stroke={2.4} />
      </span>
      <span style={{ position: "relative", padding: "0 10px", background: `rgba(37,99,235,${0.22 * p})`, outline: `2px solid rgba(91,141,247,${p})`, outlineOffset: 0, borderRadius: 2 }}>
        {word}
        {[
          { left: -6, top: -6 },
          { right: -6, bottom: -6 },
        ].map((pos, k) => (
          <span key={k} style={{ position: "absolute", ...pos, width: 12, height: 12, borderRadius: 6, background: "#fff", border: "2.5px solid #5B8DF7", opacity: p, transform: `scale(${p})` }} />
        ))}
      </span>
    </span>
  );
}

/**
 * Rótulo técnico (como "CRISTAL" / "CABLES" en la referencia): texto en versalitas con una línea
 * guía hasta el punto 3D que señala.
 */
export function Callout({ frame, at, text, a, dx = 0, dy = -140, lit = 0 }: { frame: number; at: [number, number, number]; text: string; a: number; dx?: number; dy?: number; lit?: number }) {
  if (a <= 0.01) return null;
  const p = project(frame, at);
  if (p.behind) return null;
  // Mitad del ancho aproximado del texto: el rótulo nunca se sale de la zona segura.
  const half = text.length * 13 + 10;
  const lx = Math.min(900 - half, Math.max(72 + half, p.x + dx));
  // Nunca sobre la franja de subtítulos de arriba.
  const ly = Math.max(470, p.y + dy);
  const len = Math.hypot(lx - p.x, ly - p.y) * a;
  const ang = Math.atan2(ly - p.y, lx - p.x);
  return (
    <>
      <div style={{ position: "absolute", left: p.x, top: p.y, width: len, height: 2, background: `rgba(255,255,255,${0.75 * a})`, transformOrigin: "0 50%", transform: `rotate(${ang}rad)` }} />
      <div style={{ position: "absolute", left: p.x - 5, top: p.y - 5, width: 10, height: 10, borderRadius: 6, background: lit > 0.5 ? ui.cian : "#fff", opacity: a, boxShadow: lit > 0.5 ? "0 0 14px #38DDF5" : undefined }} />
      <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(-50%, ${dy < 0 ? "-100%" : "0"}) translateY(${dy < 0 ? -6 : 6}px)`, opacity: a, whiteSpace: "nowrap", font: `800 32px ${ui.font}`, letterSpacing: "0.18em", color: lit > 0.5 ? "#BFE9FF" : "#FFFFFF", textShadow: lit > 0.5 ? "0 0 18px rgba(56,221,245,0.9)" : "0 2px 12px rgba(0,0,0,0.8)" }}>
        {text}
      </div>
    </>
  );
}
