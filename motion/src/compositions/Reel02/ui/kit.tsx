import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, spring } from "remotion";
import { palette } from "../city/materials";

/** Tokens de interfaz del reel 02. */
export const ui = {
  ...palette,
  texto: "#E8ECF4",
  suave: "#9AA4B8",
  panel: "rgba(20,25,35,0.86)",
  borde: "rgba(255,255,255,0.09)",
  claro: "#F5F5F3",
  tinta: "#0D1018",
  display: "Lato, Inter, sans-serif",
  font: "Inter, sans-serif",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 entre a y a + dur (frames), con salida suave. */
export const prog = (f: number, a: number, dur: number, ease = easeOut) => interpolate(f, [a, a + dur], [0, 1], { ...clamp, easing: ease });
/** Entra en `a`, sale en `b`. */
export const window01 = (f: number, a: number, b: number, inDur = 12, outDur = 10) => Math.min(prog(f, a, inDur), 1 - prog(f, b - outDur, outDur, easeInOut));
/** Resorte sin rebote para entradas de interfaz. */
export const pop = (f: number, a: number, fps = 30) => spring({ frame: f - a, fps, config: { damping: 18, stiffness: 170, mass: 0.7 } });

export function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: ui.panel,
        border: `1.5px solid ${ui.borde}`,
        borderRadius: 26,
        boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
        color: ui.texto,
        fontFamily: ui.font,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Iconos lineales (24 × 24) dibujados aquí: sin dependencias ni marcas de terceros. */
const paths: Record<string, ReactNode> = {
  chat: <path d="M4 5h16v11H9l-5 4V5z" />,
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 11h10.2L20 7H6.2" />
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </>
  ),
  store: (
    <>
      <path d="M4 9l1.5-5h13L20 9" />
      <path d="M4 9h16v2a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0A2.7 2.7 0 0 1 4 11V9z" />
      <path d="M5.5 13.5V20h13v-6.5" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  box: (
    <>
      <path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" />
      <path d="M4 8l8 4 8-4M12 12v8" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  wallet: (
    <>
      <path d="M4 7h15v12H4z" />
      <path d="M15 12h4v3h-4zM4 7l11-3v3" />
    </>
  ),
  list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.2-4 4-5.6 7.5-5.6s6.3 1.6 7.5 5.6" />
    </>
  ),
  spark: <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" />,
  shirt: <path d="M8 4l4 2 4-2 4 3-2.5 3.5L16 10v10H8V10l-1.5.5L4 7l4-3z" />,
  food: (
    <>
      <path d="M4 13h16a8 8 0 0 1-16 0z" />
      <path d="M9 9c0-2 1.5-2 1.5-4M13 9c0-2 1.5-2 1.5-4" />
    </>
  ),
  laptop: (
    <>
      <path d="M5 6h14v9H5z" />
      <path d="M3 18h18" />
    </>
  ),
  briefcase: (
    <>
      <path d="M4 8h16v11H4z" />
      <path d="M9 8V5h6v3M4 13h16" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 20v-8" />
      <path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </>
  ),
  flow: <path d="M5 12h14M14 7l5 5-5 5" />,
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 24, color = "currentColor", stroke = 1.8 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
      {paths[name]}
    </svg>
  );
}

/** Ilustración simple de producto (sin fotos): un empaque con banda de color. */
export function ProductArt({ tone, label, size = 120 }: { tone: string; label: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <rect width="120" height="120" rx="18" fill="#EEF0F4" />
      <rect x="34" y="18" width="52" height="84" rx="10" fill="#FFFFFF" stroke="#D9DEE7" strokeWidth="2" />
      <rect x="34" y="44" width="52" height="26" fill={tone} />
      <text x="60" y="62" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="11" fill="#FFFFFF">
        {label}
      </text>
      <rect x="44" y="80" width="32" height="5" rx="2.5" fill="#D9DEE7" />
    </svg>
  );
}
