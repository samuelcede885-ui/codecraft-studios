import type { ScreenId } from "./screens";

export type StoryStep = {
  id: string;
  /** Etapa de la historia: idea → diseño → conversión → tecnología → resultados. */
  phase: string;
  screen: ScreenId;
  title: string;
  description: string;
  /** Metadata tras "0X / 05 —", p. ej. "Gramercy / Inicio". */
  label: string;
};

/** Secuencia de la laptop fija. El hero va antes y comparte la primera pantalla. */
export const storySteps: StoryStep[] = [
  {
    id: "01",
    phase: "Concepto",
    screen: "home",
    title: "Ideas que cobran vida.",
    description: "Convertimos conceptos en experiencias digitales claras y memorables.",
    label: "Gramercy / Inicio",
  },
  {
    id: "02",
    phase: "Producto",
    screen: "product",
    title: "Diseño que convierte.",
    description: "Producto protagonista, información clara y una experiencia creada para facilitar la decisión.",
    label: "Gramercy / Producto",
  },
  {
    id: "03",
    phase: "Conversión",
    screen: "cart",
    title: "Interfaces creadas para vender.",
    description: "Una experiencia de compra sencilla, rápida y sin fricción.",
    label: "Gramercy / Carrito",
  },
  {
    id: "04",
    phase: "Tecnología",
    screen: "payment",
    title: "Tecnología que hace que todo funcione.",
    description: "Pagos, integraciones y automatización trabajando juntos.",
    label: "Gramercy / Pago",
  },
  {
    id: "05",
    phase: "Resultados",
    screen: "dashboard",
    title: "Datos que impulsan decisiones.",
    description: "Diseñamos soluciones que permiten medir, aprender y crecer.",
    label: "Panel de métricas",
  },
];
