import type { ReelAudio, VoiceMarker } from "../components/AudioLayer";
import type { Eyebrow } from "../components/KineticTitle";
import type { HighlightTone } from "../components/HighlightWord";

export type Scene = { from: number; duration: number };
export type SceneTitle = { lines: string[]; highlight?: string; tone?: HighlightTone; eyebrow?: Eyebrow; subtitle?: string; size?: number };

const steps = ["Web", "App", "AI"];
/** Los efectos quedan por debajo de la locución. */
const SFX_UNDER_VOICE = 0.45;
const sfx = (name: string, frame: number, volume: number) => ({ src: `audio/sfx/${name}.wav`, frame, volume: volume * SFX_UNDER_VOICE });

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
    hook: { lines: ["Si tu negocio", "en Venezuela", "depende de que", "estés ahí…"], highlight: "Venezuela", size: 80 },
    problema: { lines: ["Entonces no tienes", "un SISTEMA."], highlight: "SISTEMA.", size: 84 },
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
    { frame: 9, text: "Si tu negocio depende de que estés ahí para que todo funcione… necesitas algo más que tiempo." },
    { frame: 182, text: "Necesitas un sistema. Y ahí entra Fary Labs." },
    { frame: 279, text: "Creamos páginas web que atraen clientes." },
    { frame: 398, text: "Y que facilitan el contacto, desde cualquier dispositivo." },
    { frame: 515, text: "Aplicaciones que organizan y conectan tu negocio." },
    { frame: 617, text: "Y agentes de inteligencia artificial que automatizan tareas." },
    { frame: 724, text: "Para que tu negocio siga avanzando… incluso cuando tú no estás." },
    { frame: 842, text: "Fary Labs." },
    { frame: 870, text: "Web, apps e IA." },
    { frame: 910, text: "Construyamos el tuyo." },
  ] satisfies VoiceMarker[],
  /**
   * Locución (voz neuronal Kokoro "em_alex", ver scripts/audio/README) y efectos originales
   * sintetizados con scripts/audio/generate_reel01.py, por debajo de la voz. Sin música.
   */
  audio: {
    voiceover: { src: "audio/reel01-voz.wav", volume: 1 },
    sfx: [
      ...[22, 52, 82, 794, 824].map((frame) => sfx("tick", frame, 0.32)),
      ...[108, 114, 120, 126].map((frame) => sfx("ping", frame, 0.5)),
      ...[176, 268, 506, 612, 716, 836].map((frame) => sfx("whoosh", frame, 0.4)),
      ...[202, 210, 222, 234].map((frame) => sfx("connect", frame, 0.45)),
      ...[296, 303, 310, 317, 324, 331].map((frame) => sfx("tick", frame, 0.26)),
      sfx("tap", 418, 0.6),
      sfx("typing-name", 430, 0.5),
      sfx("typing-message", 444, 0.5),
      sfx("tap", 478, 0.6),
      sfx("confirm", 484, 0.5),
      ...[486, 514, 625, 728].map((frame) => sfx("pulse", frame, 0.45)),
      ...[663, 671, 679, 687].map((frame) => sfx("check", frame, 0.42)),
      sfx("logo", 854, 0.75),
      sfx("click", 914, 0.5),
    ],
  } satisfies ReelAudio,
};

export const demo = {
  id: "Demo",
  durationInFrames: 180,
  title: { lines: ["Tu negocio debería", "TRABAJAR."], highlight: "TRABAJAR." } satisfies SceneTitle,
};
