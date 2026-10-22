import type { ReelAudio, VoiceMarker } from "../components/AudioLayer";
import type { Eyebrow } from "../components/KineticTitle";
import type { HighlightTone } from "../components/HighlightWord";

export type Scene = { from: number; duration: number };
export type SceneTitle = { lines: string[]; highlight?: string; tone?: HighlightTone; eyebrow?: Eyebrow; subtitle?: string; size?: number };

const steps = ["Web", "App", "AI"];

/**
 * REEL 01 — "Tu negocio no debería depender de ti".
 * Narrativa: caos manual → Fary conecta → el negocio funciona como sistema.
 * Voz del Manual de Marca: clara, cercana y precisa; beneficios reales, sin promesas absolutas.
 * La web tiene dos escenas: presentar el negocio y facilitar el contacto.
 */
export const reel01 = {
  id: "Reel01",
  durationInFrames: 960,
  scenes: {
    hook: { from: 0, duration: 90 },
    problema: { from: 90, duration: 90 },
    fary: { from: 180, duration: 90 },
    webPresenta: { from: 270, duration: 120 },
    webContacto: { from: 390, duration: 120 },
    app: { from: 510, duration: 105 },
    agent: { from: 615, duration: 105 },
    resultado: { from: 720, duration: 120 },
    final: { from: 840, duration: 120 },
  } satisfies Record<string, Scene>,
  titles: {
    hook: { lines: ["Si tu negocio depende", "de que estés ahí…"], highlight: "ahí…", tone: "problem", size: 78 },
    problema: { lines: ["Entonces no tienes", "un SISTEMA."], highlight: "SISTEMA.", tone: "problem", size: 84 },
    fary: { lines: ["Lo ordenamos", "y lo CONECTAMOS."], highlight: "CONECTAMOS.", eyebrow: "Fary Labs", size: 88 },
    webPresenta: {
      lines: ["Tu web", "PRESENTA", "tu negocio."],
      highlight: "PRESENTA",
      eyebrow: { steps, current: 0 },
      subtitle: "Páginas profesionales, rápidas y claras.",
      size: 88,
    },
    webContacto: {
      lines: ["Y facilita el", "CONTACTO."],
      highlight: "CONTACTO.",
      eyebrow: { steps, current: 0 },
      subtitle: "Catálogo, servicios y contacto, en móvil y escritorio.",
      size: 88,
    },
    app: {
      lines: ["Tu sistema", "ORGANIZA."],
      highlight: "ORGANIZA.",
      eyebrow: { steps, current: 1 },
      subtitle: "Una herramienta para organizar la información y simplificar tareas.",
    },
    agent: {
      lines: ["Automatizamos", "lo REPETITIVO."],
      highlight: "REPETITIVO.",
      eyebrow: { steps, current: 2 },
      subtitle: "Para que tu equipo dedique tiempo a tareas de valor.",
      size: 88,
    },
    conectado: { lines: ["Todo conectado."] },
    sigue: { lines: ["Mientras descansas,", "tu negocio SIGUE."], highlight: "SIGUE.", size: 88 },
  } satisfies Record<string, SceneTitle>,
  clock: { hook: "11:47 PM", resultado: "12:03 AM" },
  notifications: [
    { channel: "chat", text: "Nueva consulta" },
    { channel: "email", text: "¿Tienen disponibilidad?" },
    { channel: "social", text: "¿Cuánto cuesta?" },
    { channel: "web", text: "Quiero reservar" },
  ] as const,
  contact: { name: "Ana", message: "¿Tienen disponibilidad el sábado?" },
  modules: ["CLIENTES", "PEDIDOS", "RESERVAS", "MÉTRICAS"],
  agentTasks: ["Consulta respondida", "Lead clasificado", "Reserva confirmada", "Seguimiento programado"],
  end: {
    headline: ["Ideas claras.", "Productos que funcionan."],
    process: ["Entender", "Construir", "Acompañar"],
    subtext: "Web, apps y automatización para negocios que quieren avanzar.",
    cta: "Hablemos",
  },
  /** Marcas para grabar la locución (no se sintetiza voz). */
  voiceover: [
    { frame: 0, text: "Si tu negocio depende de que estés ahí," },
    { frame: 90, text: "entonces no tienes un sistema." },
    { frame: 180, text: "En Fary Labs lo ordenamos y lo conectamos." },
    { frame: 270, text: "Creamos una web clara para presentar tu negocio" },
    { frame: 390, text: "y facilitar el contacto, en el móvil y en el escritorio." },
    { frame: 510, text: "Diseñamos herramientas para organizar la información," },
    { frame: 615, text: "y automatizamos lo repetitivo para que tu equipo se dedique a lo importante." },
    { frame: 720, text: "Y mientras descansas, tu negocio sigue." },
    { frame: 840, text: "Fary Labs. Ideas claras, productos que funcionan. Hablemos." },
  ] satisfies VoiceMarker[],
  /** Sin audio hasta tener archivos propios o con licencia. */
  audio: undefined as ReelAudio | undefined,
};

export const demo = {
  id: "Demo",
  durationInFrames: 180,
  title: { lines: ["Tu negocio debería", "TRABAJAR."], highlight: "TRABAJAR." } satisfies SceneTitle,
};
