import type { IconName } from "@/components/Icon";
import type { ScreenId } from "./screens";

export type StoryStep = {
  id: string;
  /** Etapa de la historia: idea → diseño → conversión → tecnología → resultados. */
  phase: string;
  project: string;
  screen: ScreenId;
  title: string;
  description: string;
  /** Metadata bajo la laptop / columna derecha, p. ej. "GRAMERCY / INICIO". */
  label: string;
  tags: { icon: IconName; label: string }[];
};

/** Secuencia de la laptop fija. El hero va antes y comparte la primera pantalla. */
export const storySteps: StoryStep[] = [
  {
    id: "01",
    phase: "Concepto",
    project: "Gramercy",
    screen: "home",
    title: "Ideas que cobran vida.",
    description: "Convertimos conceptos en experiencias digitales claras y memorables.",
    label: "Gramercy / Inicio",
    tags: [
      { icon: "target", label: "Estrategia" },
      { icon: "pen", label: "Diseño" },
      { icon: "code", label: "Desarrollo" },
    ],
  },
  {
    id: "02",
    phase: "Producto",
    project: "Gramercy",
    screen: "product",
    title: "Diseño que convierte atención en intención.",
    description: "Producto protagonista, información clara y una experiencia creada para facilitar la decisión.",
    label: "Gramercy / Producto",
    tags: [
      { icon: "monitor", label: "Diseño web" },
      { icon: "cursor", label: "Landing pages" },
      { icon: "cart", label: "E-commerce" },
    ],
  },
  {
    id: "03",
    phase: "Conversión",
    project: "Gramercy",
    screen: "cart",
    title: "Interfaces creadas para vender.",
    description: "Una experiencia de compra sencilla, rápida y sin fricción.",
    label: "Gramercy / Carrito",
    tags: [
      { icon: "app", label: "Apps a medida" },
      { icon: "layers", label: "Proceso de compra" },
      { icon: "bolt", label: "Pasos simples" },
    ],
  },
  {
    id: "04",
    phase: "Tecnología",
    project: "Gramercy",
    screen: "payment",
    title: "Todo funciona detrás de la experiencia.",
    description: "Pagos, integraciones y automatización trabajando juntos.",
    label: "Gramercy / Pago",
    tags: [
      { icon: "plug", label: "Integraciones" },
      { icon: "spark", label: "Automatización con IA" },
      { icon: "cloud", label: "Pagos" },
    ],
  },
  {
    id: "05",
    phase: "Resultados",
    project: "Fary",
    screen: "dashboard",
    title: "Datos que guían cada decisión.",
    description: "Diseñamos soluciones que permiten medir, aprender y crecer.",
    label: "Panel de métricas",
    tags: [
      { icon: "gauge", label: "Rendimiento" },
      { icon: "scale", label: "Crecimiento" },
      { icon: "trend", label: "Métricas" },
    ],
  },
];
