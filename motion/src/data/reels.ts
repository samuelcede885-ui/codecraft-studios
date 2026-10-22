import type { ReelAudio, VoiceMarker } from "../components/AudioLayer";
import type { Eyebrow } from "../components/KineticTitle";
import type { HighlightTone } from "../components/HighlightWord";

export type Scene = { from: number; duration: number };
export type SceneTitle = { lines: string[]; highlight?: string; tone?: HighlightTone; eyebrow?: Eyebrow; size?: number };

/**
 * REEL 01 — "Tu negocio no debería depender de ti" (MASTER_BRIEF §15).
 * Narrativa: caos manual → Fary conecta → el negocio funciona como sistema.
 * Tono del resaltado: cálido para el problema, verde para el sistema y el resultado.
 */
export const reel01 = {
  id: "Reel01",
  durationInFrames: 840,
  scenes: {
    hook: { from: 0, duration: 90 },
    problema: { from: 90, duration: 90 },
    conecta: { from: 180, duration: 90 },
    web: { from: 270, duration: 120 },
    app: { from: 390, duration: 120 },
    agent: { from: 510, duration: 120 },
    resultado: { from: 630, duration: 120 },
    final: { from: 750, duration: 90 },
  } satisfies Record<string, Scene>,
  titles: {
    hook: { lines: ["Si tu negocio depende", "de que estés ahí…"], highlight: "ahí…", tone: "warm", size: 84 },
    problema: { lines: ["Entonces no tienes", "un SISTEMA."], highlight: "SISTEMA.", tone: "warm", size: 88 },
    conecta: { lines: ["Lo conectamos."], highlight: "conectamos.", eyebrow: "Fary Labs" },
    web: { lines: ["Tu web", "ATRAE."], highlight: "ATRAE.", eyebrow: { steps: ["Web", "App", "AI"], current: 0 } },
    app: { lines: ["Tu sistema", "ORGANIZA."], highlight: "ORGANIZA.", eyebrow: { steps: ["Web", "App", "AI"], current: 1 } },
    agent: { lines: ["La IA", "RESPONDE."], highlight: "RESPONDE.", eyebrow: { steps: ["Web", "App", "AI"], current: 2 } },
    sigue: { lines: ["Tu negocio sigue."] },
    sinTi: { lines: ["Incluso", "SIN TI."], highlight: "SIN TI." },
  } satisfies Record<string, SceneTitle>,
  clock: { hook: "11:47 PM", resultado: "12:03 AM" },
  notifications: [
    { channel: "chat", text: "Nueva consulta" },
    { channel: "email", text: "¿Tienen disponibilidad?" },
    { channel: "social", text: "¿Cuánto cuesta?" },
    { channel: "web", text: "Quiero reservar" },
  ] as const,
  modules: ["CLIENTES", "PEDIDOS", "RESERVAS", "MÉTRICAS"],
  agentTasks: ["Consulta respondida", "Lead clasificado", "Reserva confirmada", "Seguimiento programado"],
  end: {
    services: "Web. Apps. AI.",
    subtext: "Diseñamos sistemas digitales que hacen avanzar negocios.",
    cta: "Construyamos el tuyo",
  },
  /** Marcas para grabar la locución (no se sintetiza voz). */
  voiceover: [
    { frame: 0, text: "Si tu negocio depende de que estés ahí," },
    { frame: 90, text: "entonces no tienes un sistema." },
    { frame: 180, text: "En Fary conectamos tu web, tus aplicaciones y la inteligencia artificial." },
    { frame: 270, text: "Tu web atrae." },
    { frame: 390, text: "Tu sistema organiza." },
    { frame: 510, text: "La inteligencia artificial responde." },
    { frame: 630, text: "Y mientras tú no estás, tu negocio sigue funcionando." },
    { frame: 750, text: "Fary Labs. Web. Apps. AI." },
  ] satisfies VoiceMarker[],
  /** Sin audio hasta tener archivos propios o con licencia (UI click, pulse, confirmation, whoosh, hum). */
  audio: undefined as ReelAudio | undefined,
};

export const demo = {
  id: "Demo",
  durationInFrames: 180,
  title: { lines: ["Tu negocio debería", "TRABAJAR."], highlight: "TRABAJAR." } satisfies SceneTitle,
};
