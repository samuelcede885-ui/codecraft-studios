import type { ReelAudio } from "../components/AudioLayer";
import type { TitleLine } from "../components/KineticTitle";

/** Datos de cada pieza: duración, textos y audio. Las composiciones leen de aquí. */
export type ReelData = {
  id: string;
  durationInFrames: number;
  title: TitleLine[];
  audio?: ReelAudio;
};

export const demo: ReelData = {
  id: "Demo",
  durationInFrames: 180,
  title: [{ text: "Tu negocio debería" }, { text: "TRABAJAR.", highlight: true }],
  // Sin audio: la música y la voz se añadirán con archivos propios o con licencia.
  audio: undefined,
};

export const reels = { demo };
