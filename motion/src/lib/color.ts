/** Mezcla de colores hex (t = 0 → a, t = 1 → b). */
export function mix(a: string, b: string, t: number) {
  const k = Math.min(1, Math.max(0, t));
  const pa = parse(a);
  const pb = parse(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function parse(hex: string) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
