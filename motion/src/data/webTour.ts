import capture from "./webTourCapture.json";

export type TourChapter = { id: string; at: number; eyebrow: string; title: string; text: string };

/** Textos de cada sección del recorrido. Los tiempos salen de la grabación (webTourCapture.json). */
const copy: Record<string, Omit<TourChapter, "id" | "at">> = {
  intro: { eyebrow: "Recorrido", title: "Nuestra web, de principio a fin.", text: "Así se ve y así funciona en una computadora." },
  hero: { eyebrow: "Inicio", title: "Ideas que cobran vida.", text: "La laptop muestra un recorrido real y los textos cambian al ritmo del video." },
  featured: { eyebrow: "Proyecto destacado", title: "G-Talent", text: "Trabajo real para un cliente, con su video y su historia." },
  catalog: { eyebrow: "Portafolio", title: "Pasa el cursor, mira el proyecto.", text: "Cada ficha reproduce un adelanto en movimiento." },
  filters: { eyebrow: "Filtros", title: "Encuentra lo que buscas.", text: "Webs, aplicaciones, e-commerce o IA en un clic." },
  inspire: { eyebrow: "Inspírame", title: "Un showreel a pantalla completa.", text: "Recorre los proyectos por ti, uno tras otro." },
  case: { eyebrow: "Caso de estudio", title: "Cada proyecto, contado.", text: "El reto, la solución y sus pantallas." },
  build: { eyebrow: "¿Qué quieres construir?", title: "Empieza por tu objetivo.", text: "Ideas ordenadas por lo que quieres lograr." },
  services: { eyebrow: "Servicios", title: "Web, Apps y Agentes IA.", text: "Qué hacemos, explicado sin tecnicismos." },
  plans: { eyebrow: "Planes", title: "Precios de partida claros.", text: "Planes por línea de servicio y packs combinados." },
  process: { eyebrow: "Proceso", title: "Así trabajamos contigo.", text: "Entendemos, diseñamos, construimos y lanzamos." },
  quote: { eyebrow: "Cotización", title: "Tu proyecto en 4 pasos.", text: "Elige un plan y el formulario llega con él ya seleccionado." },
};

const marks = capture.marks.filter((m) => m.id !== "end");

export const webTour = {
  id: "WebTour",
  chapters: marks.map((m) => ({ id: m.id, at: m.t, ...copy[m.id] })) as TourChapter[],
  /** Fin de la grabación útil (s); después entra el cierre de marca. */
  videoEnd: capture.marks.find((m) => m.id === "end")!.t,
  endTitle: "Ideas que cobran vida.",
  endLine: "Web · Apps · Agentes IA",
  /** Duración total: grabación + 4 s de cierre. */
  durationInFrames: Math.round((capture.marks.find((m) => m.id === "end")!.t + 4) * 30),
};
