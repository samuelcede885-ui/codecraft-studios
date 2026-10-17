export type ScreenId = "home" | "product" | "cart" | "payment" | "dashboard";

export type StoryStep = {
  screen: ScreenId;
  number: string;
  title: string[];
  description: string;
  points: { icon: IconName; label: string }[];
  /** Pie bajo la laptop: nombre del concepto que se ve en pantalla. */
  caption: string;
  /** Aclaración junto al pie: tipo de pantalla o datos de ejemplo. */
  note: string;
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
    screen: "home",
    number: "01",
    title: ["Ideas", "que cobran", "vida."],
    description: "Convertimos conceptos en experiencias digitales reales y funcionales.",
    points: [
      { icon: "target", label: "Estrategia" },
      { icon: "pen", label: "Diseño" },
      { icon: "code", label: "Desarrollo" },
      { icon: "chart", label: "Resultados" },
    ],
    caption: "Gramercy · Inicio",
    note: "concepto e-commerce",
  },
  {
    screen: "product",
    number: "02",
    title: ["Diseño web", "que impacta."],
    description: "Creamos experiencias digitales modernas, rápidas y enfocadas en resultados.",
    points: [
      { icon: "monitor", label: "Sitios web profesionales" },
      { icon: "cursor", label: "Landing pages que convierten" },
      { icon: "cart", label: "E-commerce a tu medida" },
    ],
    caption: "Gramercy · Producto",
    note: "concepto e-commerce",
    message: "Experiencias que cuentan historias.",
  },
  {
    screen: "cart",
    number: "03",
    title: ["Aplicaciones", "a medida."],
    description: "Convertimos tus ideas en aplicaciones funcionales, escalables y fáciles de usar.",
    points: [
      { icon: "app", label: "Apps web personalizadas" },
      { icon: "layers", label: "Plataformas internas" },
      { icon: "cloud", label: "Productos SaaS" },
    ],
    caption: "Gramercy · Carrito",
    note: "concepto e-commerce",
    message: "Interfaces diseñadas para destacar.",
  },
  {
    screen: "payment",
    number: "04",
    title: ["Tecnología", "que impulsa."],
    description:
      "Integramos inteligencia artificial y automatizaciones para llevar tu negocio al siguiente nivel.",
    points: [
      { icon: "spark", label: "Automatización con IA" },
      { icon: "plug", label: "Integraciones" },
      { icon: "bolt", label: "Procesos más eficientes" },
    ],
    caption: "Gramercy · Pago",
    note: "concepto e-commerce",
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
    note: "datos de ejemplo",
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

/** Pantallas del concepto de e-commerce Gramercy, del escaparate al pago. */
export const portfolio: {
  screen: ScreenId;
  name: string;
  type: string;
  description: string;
}[] = [
  {
    screen: "home",
    name: "Gramercy · Inicio",
    type: "Portada de tienda",
    description: "Producto protagonista con tipografía monumental y llamada a comprar.",
  },
  {
    screen: "product",
    name: "Gramercy · Producto",
    type: "Ficha de producto",
    description: "Precio, envío gratis, stock y métodos de pago en una sola vista.",
  },
  {
    screen: "cart",
    name: "Gramercy · Carrito",
    type: "Carrito",
    description: "Selección de talla, ubicación de entrega y resumen del pedido.",
  },
  {
    screen: "payment",
    name: "Gramercy · Pago",
    type: "Checkout",
    description: "Pago Móvil, Binance o efectivo, adaptados al cliente local.",
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
