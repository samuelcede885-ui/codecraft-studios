import type { ScreenId } from "./screens";

export type Service = {
  id: "web" | "app" | "agent";
  name: string;
  kind: string;
  description: string;
  includes: string[];
  /** Pantalla que se muestra en grande al abrir el servicio. */
  preview: ScreenId;
};

export const services: Service[] = [
  {
    id: "web",
    name: "Web Craft",
    kind: "Desarrollo web",
    description:
      "Creamos webs profesionales, rápidas y claras para presentar tu negocio, vender y facilitar el contacto.",
    includes: ["Landing pages", "Sitios corporativos", "E-commerce", "Desarrollo web"],
    preview: "home",
  },
  {
    id: "app",
    name: "App Craft",
    kind: "Aplicaciones",
    description:
      "Diseñamos aplicaciones, plataformas y sistemas personalizados para resolver necesidades reales de negocio.",
    includes: ["Apps web", "Plataformas", "Sistemas a medida", "Dashboards"],
    preview: "dashboard",
  },
  {
    id: "agent",
    name: "Agent Craft",
    kind: "Inteligencia artificial",
    description:
      "Creamos agentes inteligentes y automatizaciones que conectan procesos, información y personas.",
    includes: ["Agentes IA", "Asistentes", "Automatización", "Integraciones"],
    preview: "agent",
  },
];
