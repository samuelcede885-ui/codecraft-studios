/**
 * Preguntas frecuentes. Las respuestas son un borrador prudente (sin plazos ni precios cerrados,
 * como pide el manual de marca): Fary Labs debe revisarlas y confirmarlas antes de publicar.
 */
export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "¿Cuánto tarda un proyecto?",
    answer:
      "Depende del alcance. Después de una primera conversación te enviamos un plan con fases y fechas estimadas, para que sepas qué recibirás y cuándo.",
  },
  {
    question: "¿Puedo empezar solo con una landing page?",
    answer:
      "Sí. Una landing page es una buena forma de empezar: presenta tu oferta y facilita el contacto. Después puede crecer hacia un sitio completo o una tienda.",
  },
  {
    question: "¿Trabajan con empresas fuera del país?",
    answer:
      "Trabajamos a distancia con reuniones en línea y entregas por etapas. Cuéntanos dónde estás y vemos juntos cómo organizarlo.",
  },
  {
    question: "¿Pueden mejorar una web que ya existe?",
    answer:
      "Sí. Revisamos lo que tienes, te explicamos qué conviene mantener y qué cambiar, y proponemos una mejora por partes o un rediseño.",
  },
  {
    question: "¿Ofrecen mantenimiento?",
    answer:
      "Te acompañamos en la puesta en marcha y te explicamos cómo usar el producto. Si necesitas soporte continuo, lo definimos según tu proyecto.",
  },
  {
    question: "¿Pueden integrar inteligencia artificial?",
    answer:
      "Sí, cuando aporta valor: asistentes que responden consultas, automatización de tareas repetitivas o integraciones entre tus herramientas.",
  },
];
