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
      "Creamos páginas profesionales, rápidas y claras para presentar tu negocio, vender y facilitar el contacto.",
    detail: "Creamos una web clara para presentar tu negocio y facilitar el contacto.",
    includes: ["Landing pages", "Sitios corporativos", "E-commerce", "Desarrollo web"],
    preview: "home",
  },
  {
    id: "app",
    name: "App Craft",
    kind: "Aplicaciones",
    description:
      "Diseñamos aplicaciones, plataformas y sistemas personalizados para resolver necesidades reales.",
    detail: "Diseñamos una herramienta para organizar la información y simplificar tareas.",
    includes: ["Apps web", "Plataformas", "Sistemas a medida"],
    preview: "dashboard",
  },
  {
    id: "agent",
    name: "Agent Craft",
    kind: "Inteligencia artificial",
    description:
      "Creamos agentes inteligentes y automatizaciones que conectan procesos, información y personas.",
    detail: "Automatizamos procesos definidos para que tu equipo dedique tiempo a tareas de valor.",
    includes: ["Agentes IA", "Asistentes", "Automatización", "Integraciones"],
    preview: "agent",
  },
];
