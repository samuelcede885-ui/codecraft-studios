/**
 * Identidad de motion de Fary Labs.
 * El verde (accent) se reserva para lo activo: zonas encendidas, automatización, datos, CTAs
 * y la palabra clave de cada escena. Nunca como color de fondo general.
 */
export const fary = {
  color: {
    bg: "#080808",
    surface: "#101210",
    secondary: "#171917",
    white: "#F5F5F3",
    muted: "#8D918D",
    accent: "#19FF72",
    warm: "#D7A65A",
  },
  /** Tonos del mundo isométrico, derivados de la paleta (de más oscuro a más claro). */
  world: {
    ground: "#0B0C0B",
    groundLine: "rgba(245,245,243,0.035)",
    road: "#111311",
    roadEdge: "#1B1E1B",
    roadMark: "rgba(141,145,141,0.28)",
    faceTop: "#1C1F1C",
    faceLeft: "#0F110F",
    faceRight: "#151815",
    edge: "rgba(245,245,243,0.07)",
    windowOff: "rgba(245,245,243,0.035)",
    foliage: "#131813",
    foliageTop: "#1A211A",
  },
  video: { width: 1080, height: 1920, fps: 30 },
  /**
   * Zona segura para Reels y TikTok: arriba (cabecera), abajo (descripción y audio) y a la
   * derecha (botones). El texto importante va siempre dentro.
   */
  safe: { top: 250, right: 180, bottom: 440, left: 72 },
  font: {
    display: "Lato, Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  /** Separación entre elementos relacionados (3–6 frames). */
  stagger: 4,
} as const;

export type FaryColor = keyof typeof fary.color;
