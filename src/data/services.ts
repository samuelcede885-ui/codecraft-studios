import type { ScreenId } from "./screens";

export type Service = {
  id: "web" | "app" | "agent";
  name: string;
  kind: string;
  description: string;
  /** Texto extra al expandir el servicio. */
  detail: string;
  includes: string[];
  preview: ScreenId;
};

export const services: Service[] = [
  {
    id: "web",
    name: "Web Craft",
    kind: "Desarrollo web",
    description:
      "Diseño y desarrollo de páginas web profesionales, landing pages, sitios corporativos y tiendas online.",
    detail: "Sitios rápidos, claros y pensados para convertir visitas en clientes.",
    includes: ["Landing pages", "Sitios corporativos", "E-commerce", "Desarrollo web"],
    preview: "home",
  },
  {
    id: "app",
    name: "App Craft",
    kind: "Aplicaciones",
    description:
      "Desarrollo de aplicaciones web, plataformas digitales y sistemas personalizados para empresas.",
    detail: "Herramientas a medida que ordenan procesos y crecen con tu negocio.",
    includes: ["Apps web", "Plataformas", "Sistemas a medida"],
    preview: "dashboard",
  },
  {
    id: "agent",
    name: "Agent Craft",
    kind: "Inteligencia artificial",
    description:
      "Creación de agentes inteligentes, asistentes virtuales, integraciones y automatizaciones empresariales.",
    detail: "Agentes que responden, organizan y automatizan las tareas repetitivas.",
    includes: ["Agentes IA", "Asistentes", "Automatización", "Integraciones"],
    preview: "agent",
  },
];

export const processSteps = [
  { number: "01", name: "Discovery", description: "Conocemos el negocio, necesidades y objetivos." },
  { number: "02", name: "Crafting", description: "Diseñamos y desarrollamos la solución." },
  { number: "03", name: "Handoff", description: "Entregamos, probamos y acompañamos el lanzamiento." },
] as const;
