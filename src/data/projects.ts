import type { ScreenId } from "./screens";

export type Project = {
  id: string;
  name: string;
  category: string;
  /** Todos son conceptos mientras no haya trabajos de clientes confirmados. */
  status: "Concepto";
  line: string;
  screen: ScreenId;
  href: string;
  cta: string;
};

/** Caso principal: la tienda que recorre la secuencia de la laptop. */
export const featuredProject: Project = {
  id: "gramercy",
  name: "Gramercy",
  category: "E-commerce",
  status: "Concepto",
  line: "Una experiencia completa desde catálogo hasta pago.",
  screen: "home",
  href: "#inicio",
  cta: "Ver proyecto",
};

export const moreProjects: Project[] = [
  {
    id: "panel",
    name: "Panel de métricas",
    category: "Plataforma",
    status: "Concepto",
    line: "Ventas, usuarios y conversión en una sola vista.",
    screen: "dashboard",
    href: "#contacto",
    cta: "Quiero algo así",
  },
  {
    id: "asistente",
    name: "Asistente de reservas",
    category: "Agente IA",
    status: "Concepto",
    line: "Responde, agenda y confirma cada reserva por sí solo.",
    screen: "agent",
    href: "#contacto",
    cta: "Quiero algo así",
  },
  {
    id: "norte",
    name: "Norte Estudio",
    category: "Sitio corporativo",
    status: "Concepto",
    line: "Una portada editorial para un estudio de arquitectura.",
    screen: "studio",
    href: "#contacto",
    cta: "Quiero algo así",
  },
];
