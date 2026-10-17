export type ProcessStep = { number: string; name: string; description: string };

export const processSteps: ProcessStep[] = [
  { number: "01", name: "Descubrimos", description: "Entendemos el negocio, sus usuarios y objetivos." },
  { number: "02", name: "Diseñamos", description: "Definimos experiencia, estética y funcionamiento." },
  { number: "03", name: "Construimos", description: "Convertimos el diseño en un producto funcional." },
  { number: "04", name: "Lanzamos", description: "Probamos, optimizamos y acompañamos la salida." },
];
