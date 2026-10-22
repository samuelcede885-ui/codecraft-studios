/**
 * Identidad de motion de Fary Labs, según el Manual de Marca v1.1:
 * "El contraste es la identidad. Monocromía deliberada."
 * Negro (principal), Carbón (superficies), Grafito (apoyo), Marfil (fondos) y Blanco (contraste).
 * Única excepción de color: la señal (datos, sistemas activos, palabra clave, CTA) es un azul
 * eléctrico con brillo suave; el problema se marca en grafito.
 */
export const fary = {
  color: {
    negro: "#090A0B",
    carbon: "#141517",
    grafito: "#303134",
    marfil: "#F5F5F3",
    blanco: "#FFFFFF",
    /** Texto secundario sobre negro (deriva del grafito, AA en texto grande). */
    muted: "#8C8E92",
    /** Señal: lo activo, lo conectado, la palabra protagonista, el CTA. */
    signal: "#2F7BFF",
  },
  /** Señal en rgba para brillos y transparencias. */
  signalRgb: "47,123,255",
  /** Tonos del mundo isométrico, construidos con la paleta (negro → grafito). */
  world: {
    ground: "#090A0B",
    groundLine: "rgba(245,245,243,0.028)",
    block: "#0D0E10",
    blockEdge: "#17181B",
    road: "#111214",
    roadEdge: "#1B1C1F",
    roadMark: "rgba(140,142,146,0.22)",
    faceTop: "#202125",
    faceLeft: "#121316",
    faceRight: "#18191C",
    edge: "rgba(245,245,243,0.06)",
    windowOff: "rgba(245,245,243,0.03)",
    windowOn: "#E9E7E1",
    foliage: "#141517",
    foliageTop: "#1C1D20",
    floor: "#17181B",
    wall: "#131417",
  },
  video: { width: 1080, height: 1920, fps: 30 },
  /** Zona segura de Reels/TikTok: cabecera, descripción/audio y botones a la derecha. */
  safe: { top: 250, right: 180, bottom: 440, left: 72 },
  /** Titulares Lato en pesos altos; texto e interfaces Inter. */
  font: {
    display: "Lato, Inter, sans-serif",
    ui: "Inter, sans-serif",
  },
  stagger: 4,
} as const;

/** rgba de la señal con la opacidad dada. */
export const signal = (a: number) => `rgba(${fary.signalRgb},${a})`;
