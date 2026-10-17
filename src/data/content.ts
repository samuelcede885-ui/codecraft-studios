export type ScreenId = "greenade" | "milk" | "syntha" | "depthfield" | "dashboard";

export type StoryStep = {
  screen: ScreenId;
  number: string;
  title: string[];
  description: string;
  points: { icon: IconName; label: string }[];
  /** Pie bajo la laptop: nombre del concepto que se ve en pantalla. */
  caption: string;
  /** Mensaje lateral derecho (sólo en los pasos de la secuencia). */
  message?: string;
};

export type IconName =
  | "target"
  | "pen"
  | "code"
  | "chart"
  | "monitor"
  | "cursor"
  | "cart"
  | "app"
  | "layers"
  | "cloud"
  | "spark"
  | "plug"
  | "bolt"
  | "gauge"
  | "scale"
  | "trend";

/** Paso 0 = hero. Pasos 1–4 = secuencia de la laptop fija. */
export const storySteps: StoryStep[] = [
  {
    screen: "greenade",
    number: "01",
    title: ["Ideas", "que cobran", "vida."],
    description: "Convertimos conceptos en experiencias digitales reales y funcionales.",
    points: [
      { icon: "target", label: "Estrategia" },
      { icon: "pen", label: "Diseño" },
      { icon: "code", label: "Desarrollo" },
      { icon: "chart", label: "Resultados" },
    ],
    caption: "Greenade",
  },
  {
    screen: "milk",
    number: "02",
    title: ["Diseño web", "que impacta."],
    description: "Creamos experiencias digitales modernas, rápidas y enfocadas en resultados.",
    points: [
      { icon: "monitor", label: "Sitios web profesionales" },
      { icon: "cursor", label: "Landing pages que convierten" },
      { icon: "cart", label: "E-commerce a tu medida" },
    ],
    caption: "Simply Milk",
    message: "Experiencias que cuentan historias.",
  },
  {
    screen: "syntha",
    number: "03",
    title: ["Aplicaciones", "a medida."],
    description: "Convertimos tus ideas en aplicaciones funcionales, escalables y fáciles de usar.",
    points: [
      { icon: "app", label: "Apps web personalizadas" },
      { icon: "layers", label: "Plataformas internas" },
      { icon: "cloud", label: "Productos SaaS" },
    ],
    caption: "Syntha-6",
    message: "Interfaces diseñadas para destacar.",
  },
  {
    screen: "depthfield",
    number: "04",
    title: ["Tecnología", "que impulsa."],
    description:
      "Integramos inteligencia artificial y automatizaciones para llevar tu negocio al siguiente nivel.",
    points: [
      { icon: "spark", label: "Automatización con IA" },
      { icon: "plug", label: "Integraciones" },
      { icon: "bolt", label: "Procesos más eficientes" },
    ],
    caption: "Depthfield",
    message: "Creatividad sin límites.",
  },
  {
    screen: "dashboard",
    number: "05",
    title: ["Resultados", "reales."],
    description: "Diseñamos soluciones que generan crecimiento y métricas que importan.",
    points: [
      { icon: "gauge", label: "Rendimiento" },
      { icon: "scale", label: "Escalabilidad" },
      { icon: "trend", label: "ROI medible" },
    ],
    caption: "Panel de métricas",
    message: "Datos que guían cada decisión.",
  },
];

export const services = [
  {
    id: "web",
    name: "Web Craft",
    kind: "Desarrollo web",
    description:
      "Diseño y desarrollo de páginas web profesionales, landing pages, sitios corporativos y tiendas online.",
    tags: ["Landing pages", "Sitios corporativos", "E-commerce"],
  },
  {
    id: "app",
    name: "App Craft",
    kind: "Aplicaciones",
    description:
      "Desarrollo de aplicaciones web, plataformas digitales y sistemas personalizados para empresas.",
    tags: ["Apps web", "Plataformas", "Sistemas a medida"],
  },
  {
    id: "agent",
    name: "Agent Craft",
    kind: "Inteligencia artificial",
    description:
      "Creación de agentes inteligentes, asistentes virtuales, integraciones y automatizaciones empresariales.",
    tags: ["Agentes IA", "Asistentes", "Automatización"],
  },
] as const;

/** Conceptos visuales de referencia: no son trabajos de clientes. */
export const portfolio: {
  screen: ScreenId;
  name: string;
  type: string;
  description: string;
}[] = [
  {
    screen: "greenade",
    name: "Greenade",
    type: "Landing de producto",
    description: "Verde intenso, producto central y tipografía de gran escala.",
  },
  {
    screen: "milk",
    name: "Simply Milk",
    type: "Sitio editorial",
    description: "Composición minimalista con producto protagonista y colores claros.",
  },
  {
    screen: "syntha",
    name: "Syntha-6",
    type: "E-commerce",
    description: "Catálogo de producto con interfaz moderna y presencia en rojo.",
  },
  {
    screen: "depthfield",
    name: "Depthfield",
    type: "Estudio creativo",
    description: "Escena cinematográfica oscura con un círculo rojo y tipografía monumental.",
  },
];

export const processSteps = [
  {
    number: "01",
    name: "Discovery",
    description: "Conocemos tu negocio, sus necesidades y objetivos.",
  },
  {
    number: "02",
    name: "Crafting",
    description: "Diseñamos y desarrollamos la solución.",
  },
  {
    number: "03",
    name: "Handoff",
    description:
      "Entregamos el proyecto, realizamos las pruebas necesarias y ofrecemos soporte según lo contratado.",
  },
] as const;
