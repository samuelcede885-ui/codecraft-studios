import { fary } from "../theme/fary";
import { iso, pts, rect } from "../lib/iso";
import { DigitalPerson } from "./DigitalPerson";

/**
 * Oficina en corte (sin las paredes frontales) para ver el negocio "por dentro".
 * `lamp` enciende la luz cálida; `occupied` muestra a la persona trabajando;
 * `system` enciende el monitor en marfil (el sistema trabaja solo).
 */
export function OfficeRoom({
  x,
  y,
  w = 2.6,
  d = 2.6,
  lamp = 1,
  occupied = 1,
  system = 0,
}: {
  x: number;
  y: number;
  w?: number;
  d?: number;
  lamp?: number;
  occupied?: number;
  system?: number;
}) {
  const H = 1.7;
  const P = iso;
  // Paredes traseras: la del fondo (y = y) y la lateral (x = x).
  const back = pts([P(x, y, 0), P(x + w, y, 0), P(x + w, y, H), P(x, y, H)]);
  const side = pts([P(x, y, 0), P(x, y + d, 0), P(x, y + d, H), P(x, y, H)]);
  const win = pts([P(x + w * 0.55, y, 0.75), P(x + w * 0.9, y, 0.75), P(x + w * 0.9, y, 1.4), P(x + w * 0.55, y, 1.4)]);
  // Escritorio (caja baja) con monitor encima.
  const dx = x + w * 0.3;
  const dy = y + d * 0.3;
  const dw = w * 0.5;
  const dd = d * 0.32;
  const dh = 0.45;
  const desk = {
    top: rect(dx, dy, dw, dd, dh),
    right: pts([P(dx + dw, dy, 0), P(dx + dw, dy + dd, 0), P(dx + dw, dy + dd, dh), P(dx + dw, dy, dh)]),
    front: pts([P(dx, dy + dd, 0), P(dx + dw, dy + dd, 0), P(dx + dw, dy + dd, dh), P(dx, dy + dd, dh)]),
  };
  const mon = pts([P(dx + dw * 0.2, dy + 0.12, dh + 0.08), P(dx + dw * 0.75, dy + 0.12, dh + 0.08), P(dx + dw * 0.75, dy + 0.12, dh + 0.5), P(dx + dw * 0.2, dy + 0.12, dh + 0.5)]);
  const lampPt = P(x + w * 0.5, y + d * 0.5, H + 0.2);
  const floorC = P(x + w / 2, y + d / 2, 0);
  // Reloj circular sobre la pared lateral (plano x = x): marca 11:47.
  const cy0 = y + d * 0.4;
  const cz0 = 1.22;
  const clockFace = pts(Array.from({ length: 28 }, (_, i) => P(x, cy0 + 0.17 * Math.cos((i / 28) * Math.PI * 2), cz0 + 0.2 * Math.sin((i / 28) * Math.PI * 2))));
  const hand = (deg: number, len: number) => P(x, cy0 + len * Math.sin((deg * Math.PI) / 180) * 0.85, cz0 + len * Math.cos((deg * Math.PI) / 180));
  const clockHands = pts([hand(-30 + 47 * 0.5, 0.1), P(x, cy0, cz0), hand(47 * 6, 0.15)]);
  return (
    <g data-office>
      <polygon points={rect(x, y, w, d)} fill={fary.world.floor} />
      <ellipse cx={floorC.x} cy={floorC.y} rx={w * 120} ry={d * 60} fill="url(#halo-lamp)" opacity={0.55 * lamp} />
      <polygon points={back} fill={fary.world.wall} />
      <polygon points={side} fill="#0F1012" />
      <polygon points={back} fill={fary.color.marfil} opacity={0.05 * lamp} />
      <polygon points={win} fill="#07090C" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
      {/* Reloj de pared, dibujado en el plano de la pared lateral. */}
      <polygon points={clockFace} fill={fary.color.marfil} opacity={0.25 + 0.6 * lamp} />
      <polyline points={clockHands} fill="none" stroke={fary.color.grafito} strokeWidth={3} strokeLinecap="round" />
      {/* Escritorio y monitor. */}
      <polygon points={desk.right} fill="#1E1F23" />
      <polygon points={desk.front} fill="#18191C" />
      <polygon points={desk.top} fill="#2A2B2F" />
      <polygon points={mon} fill="#0B0B0B" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      <polygon points={mon} fill={fary.color.marfil} opacity={0.22 * lamp * (1 - system)} />
      <polygon points={mon} fill={fary.color.signal} opacity={0.55 * system} />
      <polygon points={mon} fill={fary.color.signal} opacity={0.35 * system} filter="url(#glow)" />
      {/* Hojas sobre la mesa: el trabajo manual. */}
      <polygon points={rect(dx + dw * 0.08, dy + dd * 0.45, 0.32, 0.22, dh + 0.01)} fill={fary.color.marfil} opacity={0.7 * lamp} />
      <polygon points={rect(dx + dw * 0.55, dy + dd * 0.5, 0.26, 0.2, dh + 0.01)} fill={fary.color.marfil} opacity={0.5 * lamp} />
      <DigitalPerson x={dx + dw * 0.48} y={dy + dd + 0.35} seated opacity={occupied} tone={fary.color.marfil} />
      {/* Lámpara colgante. */}
      <line x1={lampPt.x} y1={lampPt.y - 160} x2={lampPt.x} y2={lampPt.y} stroke="#2A2A2A" strokeWidth={3} />
      <circle cx={lampPt.x} cy={lampPt.y} r={34} fill={fary.color.marfil} opacity={0.32 * lamp} filter="url(#glow)" />
      <circle cx={lampPt.x} cy={lampPt.y} r={9} fill={fary.color.blanco} opacity={0.25 + 0.75 * lamp} />
      <polyline points={pts([P(x + w, y, 0), P(x + w, y, H)])} stroke={fary.world.edge} strokeWidth={2} />
      <polyline points={pts([P(x, y + d, 0), P(x, y + d, H)])} stroke={fary.world.edge} strokeWidth={2} />
    </g>
  );
}
