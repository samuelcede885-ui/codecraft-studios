/**
 * Identidad de motion de Fary Labs (MASTER_BRIEF §3–4).
 * Blanco y negro son la identidad; el verde es una señal: actividad, automatización, datos,
 * conexiones, progreso, CTA y la palabra clave. El cálido es la luz de la ciudad y el problema.
 */
export const fary = {
  color: {
    black: "#101010",
    white: "#FFFFFF",
    light: "#F3F3F3",
    gray: "#8A8A8A",
    surface: "#171717",
    accent: "#19FF72",
    warm: "#D7A65A",
    ink: "#0B0B0B", // fondo del mundo, un punto por debajo de black para dar profundidad
  },
  /** Tonos del mundo isométrico: neutros, sin teñir de verde. */
  world: {
    ground: "#0C0C0C",
    groundLine: "rgba(255,255,255,0.03)",
    block: "#101010",
    blockEdge: "#191919",
    road: "#131313",
    roadEdge: "#1D1D1D",
    roadMark: "rgba(138,138,138,0.24)",
    faceTop: "#1F1F1F",
    faceLeft: "#121212",
    faceRight: "#181818",
    edge: "rgba(255,255,255,0.06)",
    windowOff: "rgba(255,255,255,0.03)",
    foliage: "#141614",
    foliageTop: "#1B1E1B",
    wood: "#1A1612",
    wall: "#16130F",
  },
  video: { width: 1080, height: 1920, fps: 30 },
  /** Zona segura de Reels/TikTok: cabecera, descripción/audio y botones a la derecha. */
  safe: { top: 250, right: 180, bottom: 440, left: 72 },
  font: {
    display: "Lato, Inter, sans-serif",
    ui: "Inter, sans-serif",
  },
  /** Separación entre elementos relacionados (3–6 frames). */
  stagger: 4,
} as const;
