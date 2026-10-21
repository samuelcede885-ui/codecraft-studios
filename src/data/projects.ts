import type { ScreenId } from "./screens";

/**
 * Catálogo de proyectos. Para añadir uno: una entrada aquí y sus archivos en
 * public/projects/<slug>/ (thumb.webp = portada diseñada, preview.mp4/.webm, opcionalmente full.mp4/.webm, gallery-*.webp).
 * Los videos de los conceptos se graban de sus pantallas HTML con scripts/record-reels.mjs.
 *
 * Todos los proyectos actuales son conceptos de Fary Labs: no son trabajos de clientes.
 */
export type Project = {
  slug: string;
  name: string;
  category: string;
  /** Una línea para el catálogo. */
  description: string;
  /** Mensaje de la portada (src/components/covers); cada salto de línea es un renglón. */
  headline: string;
  tags: string[];
  featured?: boolean;
  /** Concepto propio o trabajo real; los conceptos se marcan siempre como tales. */
  status: "Concepto";
  year?: string;
  thumbnail: string;
  previewVideo: string;
  fullVideo: string;
  gallery: { src: string; alt: string }[];
  /** Pantalla HTML de respaldo si un video no puede reproducirse. */
  screen: ScreenId;
  /** Ficha del proyecto. */
  built: string;
  problem: string;
  services: string[];
  technologies: string[];
};

/** Rutas de los archivos de un proyecto. Sin recorrido largo propio, el video completo es el mismo preview. */
const media = (slug: string, hasFull = false) => ({
  thumbnail: `/projects/${slug}/thumb.webp`,
  previewVideo: `/projects/${slug}/preview.mp4`,
  fullVideo: `/projects/${slug}/${hasFull ? "full" : "preview"}.mp4`,
});

/** Tecnologías con las que está construido cada concepto en esta web. */
const conceptStack = ["Next.js", "React", "TypeScript", "GSAP"];

export const projects: Project[] = [
  {
    slug: "gramercy",
    name: "Gramercy",
    category: "E-commerce / Fashion",
    description: "Una experiencia completa desde catálogo hasta pago.",
    headline: "Pisa firme.\nCompra fácil.",
    tags: ["E-commerce", "UI/UX", "Checkout"],
    featured: true,
    status: "Concepto",
    ...media("gramercy", true),
    gallery: [
      { src: "/projects/gramercy/gallery-1.webp", alt: "Portada de la tienda Gramercy con el zueco Boston" },
      { src: "/projects/gramercy/gallery-2.webp", alt: "Ficha del producto con precio, stock y botón de compra" },
      { src: "/projects/gramercy/gallery-3.webp", alt: "Carrito con selección de talla y dirección de envío" },
      { src: "/projects/gramercy/gallery-4.webp", alt: "Métodos de pago disponibles en el checkout" },
      { src: "/projects/gramercy/gallery-5.webp", alt: "Panel de métricas de la tienda" },
    ],
    screen: "home",
    built:
      "Una tienda online completa para una marca de calzado: portada, ficha de producto, carrito, pago y un panel de métricas para seguir las ventas.",
    problem:
      "Comprar calzado en línea genera dudas: talla, envío y forma de pago. Cada duda es un paso más donde la compra se pierde.",
    services: ["Web Craft", "Diseño UI/UX", "E-commerce", "Panel de métricas"],
    technologies: conceptStack,
  },
  {
    slug: "panel-de-metricas",
    name: "Panel de métricas",
    category: "Plataforma / Dashboard",
    description: "Ventas, usuarios y conversión en una sola vista.",
    headline: "Tus números,\nen una mirada.",
    tags: ["Dashboard", "Datos"],
    status: "Concepto",
    ...media("panel-de-metricas"),
    gallery: [{ src: "/projects/panel-de-metricas/gallery-1.webp", alt: "Panel con ventas, usuarios, productos y conversión" }],
    screen: "dashboard",
    built: "Un panel que reúne ventas, usuarios y conversión con gráficas simples y una lectura en segundos.",
    problem: "Los datos del negocio están repartidos entre varias herramientas y revisarlos lleva tiempo.",
    services: ["App Craft", "Visualización de datos"],
    technologies: conceptStack,
  },
  {
    slug: "asistente-de-reservas",
    name: "Asistente de reservas",
    category: "Agente IA / Automatización",
    description: "Responde consultas, propone horarios y confirma reservas.",
    headline: "Pregunta.\nAgenda.\nConfirma.",
    tags: ["Agente IA", "Automatización"],
    status: "Concepto",
    ...media("asistente-de-reservas"),
    gallery: [{ src: "/projects/asistente-de-reservas/gallery-1.webp", alt: "Conversación del asistente y pasos de la automatización" }],
    screen: "agent",
    built: "Un asistente que contesta, ofrece horarios disponibles, actualiza el calendario y envía la confirmación.",
    problem: "Responder mensajes para agendar citas ocupa horas del equipo y deja clientes esperando.",
    services: ["Agent Craft", "Integraciones"],
    technologies: [...conceptStack, "Integración con calendario"],
  },
  {
    slug: "norte-estudio",
    name: "Norte Estudio",
    category: "Sitio corporativo / Arquitectura",
    description: "Una portada editorial para un estudio de arquitectura.",
    headline: "Espacio, luz\ny estructura.",
    tags: ["Sitio corporativo", "Editorial"],
    status: "Concepto",
    ...media("norte-estudio"),
    gallery: [{ src: "/projects/norte-estudio/gallery-1.webp", alt: "Portada editorial de Norte Estudio" }],
    screen: "studio",
    built: "Una portada editorial con tipografía grande, mucho aire y el proyecto como protagonista. La marca Norte Estudio es ficticia.",
    problem: "Un estudio con buen trabajo necesita una web que lo presente con la misma calidad.",
    services: ["Web Craft", "Dirección de arte"],
    technologies: conceptStack,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Enlace al formulario de cotización con el proyecto como referencia. */
export const quoteHref = (slug: string) => `/?proyecto=${slug}#cotizacion`;
