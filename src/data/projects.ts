import type { ScreenId } from "./screens";

export type CaseSection = { title: "Problema" | "Solución" | "Resultado"; text: string; screen?: ScreenId };

export type Project = {
  id: string;
  name: string;
  category: string;
  /** Solo si se conoce. */
  year?: string;
  line: string;
  screen: ScreenId;
  /** Ficha del caso de estudio. Todos son conceptos propios mientras no haya trabajos de clientes. */
  facts: { client: string; service: string; industry: string; year?: string };
  sections: CaseSection[];
};

const CONCEPT = "Concepto de Fary Labs";

export const projects: Project[] = [
  {
    id: "gramercy",
    name: "Gramercy",
    category: "E-commerce / Product design",
    line: "Una experiencia completa desde catálogo hasta pago.",
    screen: "home",
    facts: { client: CONCEPT, service: "Web Craft", industry: "Moda y calzado" },
    sections: [
      {
        title: "Problema",
        text: "Comprar calzado en línea genera dudas: talla, envío y forma de pago. Cada duda es un paso más donde la compra se pierde.",
        screen: "product",
      },
      {
        title: "Solución",
        text: "Un recorrido corto y visual: el producto protagonista, la talla y la cantidad a la vista y un carrito que resume todo antes de pagar.",
        screen: "cart",
      },
      {
        title: "Resultado",
        text: "Un flujo completo de catálogo, producto, carrito y pago, listo para validarse con usuarios reales. Es un concepto: aún no tiene métricas de uso.",
        screen: "payment",
      },
    ],
  },
  {
    id: "panel",
    name: "Panel de métricas",
    category: "Plataforma / Dashboard",
    line: "Ventas, usuarios y conversión en una sola vista.",
    screen: "dashboard",
    facts: { client: CONCEPT, service: "App Craft", industry: "Comercio en línea" },
    sections: [
      { title: "Problema", text: "Los datos del negocio están repartidos entre varias herramientas y revisarlos lleva tiempo." },
      { title: "Solución", text: "Un panel que reúne ventas, usuarios y conversión con gráficas simples y una lectura en segundos." },
      { title: "Resultado", text: "Un concepto de interfaz para decidir con datos. Las cifras que muestra son de ejemplo." },
    ],
  },
  {
    id: "asistente",
    name: "Asistente de reservas",
    category: "Agente IA / Automatización",
    line: "Responde consultas, propone horarios y confirma reservas.",
    screen: "agent",
    facts: { client: CONCEPT, service: "Agent Craft", industry: "Servicios" },
    sections: [
      { title: "Problema", text: "Responder mensajes para agendar citas ocupa horas del equipo y deja clientes esperando." },
      { title: "Solución", text: "Un asistente que contesta, ofrece horarios disponibles, actualiza el calendario y envía la confirmación." },
      { title: "Resultado", text: "Un concepto de automatización que muestra el flujo completo de una reserva. Datos de ejemplo." },
    ],
  },
  {
    id: "norte",
    name: "Norte Estudio",
    category: "Sitio corporativo",
    line: "Una portada editorial para un estudio de arquitectura.",
    screen: "studio",
    facts: { client: CONCEPT, service: "Web Craft", industry: "Arquitectura" },
    sections: [
      { title: "Problema", text: "Un estudio con buen trabajo necesita una web que lo presente con la misma calidad." },
      { title: "Solución", text: "Una portada editorial con tipografía grande, mucho aire y el proyecto como protagonista." },
      { title: "Resultado", text: "Un concepto de sitio corporativo. La marca Norte Estudio es ficticia." },
    ],
  },
];
