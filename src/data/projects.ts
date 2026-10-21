import type { ScreenId } from "./screens";

/**
 * Catálogo de proyectos. Para añadir uno: una entrada aquí y sus archivos en
 * public/projects/<slug>/ (thumb.webp = portada diseñada, preview.mp4/.webm, opcionalmente full.mp4/.webm, gallery-*.webp).
 * Los videos de los conceptos se graban de sus pantallas HTML con scripts/record-reels.mjs.
 *
 * Todos los proyectos actuales son conceptos de Fary Labs (projectType "concept"): no son trabajos
 * de clientes y se marcan siempre como tales. Un trabajo real lleva projectType "client".
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
  /** Trabajo real para un cliente o concepto propio. Un concepto nunca se presenta como cliente. */
  projectType: "client" | "concept";
  year?: string;
  thumbnail: string;
  previewVideo: string;
  fullVideo: string;
  gallery: { src: string; alt: string }[];
  /** Pantalla HTML de respaldo si un video no puede reproducirse. */
  screen: ScreenId;
  /** Filtros del portafolio en los que aparece. */
  filters: FilterId[];
  /** Ficha del proyecto. */
  built: string;
  problem: string;
  services: string[];
  /** Solo tecnologías verificadas en el proyecto real; sin datos, la sección no se muestra. */
  technologies?: string[];
  /** Antes y después con imágenes reales del proyecto; sin ellas, no se muestra la comparación. */
  beforeAfter?: { before: { src: string; alt: string }; after: { src: string; alt: string }; caption?: string };
  /** Case study: el reto, capítulos visuales y lo que permite la solución (sin métricas inventadas). */
  story: {
    challenge: string[];
    chapters: Chapter[];
    result: string[];
  };
};

/** Filtros del portafolio. Los que no tienen proyectos no se muestran. */
export const filters = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Web" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "apps", label: "Aplicaciones" },
  { id: "ia", label: "IA / Automatización" },
  { id: "brand", label: "Brand Experiences" },
] as const;
export type FilterId = Exclude<(typeof filters)[number]["id"], "all">;

/** Visual de un capítulo: video del recorrido, imagen, o pasos de una automatización. */
export type Visual =
  | { kind: "video"; src: string; poster: string; label: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "flow"; steps: string[] };

export type Chapter = {
  key: "experience" | "product" | "conversion" | "system";
  title: string;
  text: string;
  visuals: Visual[];
};

/** Etiqueta de cada capítulo del case study. */
export const chapterLabels: Record<Chapter["key"], string> = {
  experience: "La experiencia",
  product: "El producto",
  conversion: "La conversión",
  system: "El sistema",
};

/** Rutas de los archivos de un proyecto. Sin recorrido largo propio, el video completo es el mismo preview. */
const media = (slug: string, hasFull = false) => ({
  thumbnail: `/projects/${slug}/thumb.webp`,
  previewVideo: `/projects/${slug}/preview.mp4`,
  fullVideo: `/projects/${slug}/${hasFull ? "full" : "preview"}.mp4`,
});


export const projects: Project[] = [
  {
    slug: "gramercy",
    name: "Gramercy",
    category: "E-commerce / Fashion",
    description: "Una experiencia completa desde catálogo hasta pago.",
    headline: "Pisa firme.\nCompra fácil.",
    tags: ["E-commerce", "UI/UX", "Checkout"],
    featured: true,
    projectType: "concept",
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
    filters: ["ecommerce", "web"],
    story: {
      challenge: [
        "Comprar calzado en línea genera dudas: talla, envío y forma de pago. Cada duda es un paso más donde la compra se pierde.",
        "La tienda tenía que verse como una campaña y, a la vez, llevar al cliente hasta el pago sin rodeos.",
      ],
      chapters: [
        {
          key: "experience",
          title: "Una portada que se siente como campaña.",
          text: "El producto es protagonista desde el primer segundo y el recorrido completo se entiende sin instrucciones.",
          visuals: [{ kind: "video", src: "/projects/gramercy/full", poster: "/projects/gramercy/poster.webp", label: "Recorrido completo por Gramercy" }],
        },
        {
          key: "product",
          title: "Todo lo que hace falta para decidir.",
          text: "Precio, stock, envío y descripción en una sola vista, con el botón de compra siempre a mano.",
          visuals: [{ kind: "image", src: "/projects/gramercy/gallery-2.webp", alt: "Ficha del producto con precio, stock y botón de compra" }],
        },
        {
          key: "conversion",
          title: "Del carrito al pago, en pocos pasos.",
          text: "Talla, dirección y método de pago en pantallas cortas y claras.",
          visuals: [
            { kind: "image", src: "/projects/gramercy/gallery-3.webp", alt: "Carrito con selección de talla y dirección de envío" },
            { kind: "image", src: "/projects/gramercy/gallery-4.webp", alt: "Métodos de pago disponibles en el checkout" },
          ],
        },
        {
          key: "system",
          title: "Las ventas, en un panel.",
          text: "Ventas, usuarios y conversión reunidos para seguir la tienda día a día. Datos de ejemplo.",
          visuals: [{ kind: "image", src: "/projects/gramercy/gallery-5.webp", alt: "Panel de métricas de la tienda" }],
        },
      ],
      result: [
        "Con esta solución, una marca puede presentar su producto con la fuerza de una campaña, guiar cada compra paso a paso y seguir sus ventas desde un solo lugar.",
      ],
    },
  },
  {
    slug: "panel-de-metricas",
    name: "Panel de métricas",
    category: "Plataforma / Dashboard",
    description: "Ventas, usuarios y conversión en una sola vista.",
    headline: "Tus números,\nen una mirada.",
    tags: ["Dashboard", "Datos"],
    projectType: "concept",
    ...media("panel-de-metricas"),
    gallery: [{ src: "/projects/panel-de-metricas/gallery-1.webp", alt: "Panel con ventas, usuarios, productos y conversión" }],
    screen: "dashboard",
    built: "Un panel que reúne ventas, usuarios y conversión con gráficas simples y una lectura en segundos.",
    problem: "Los datos del negocio están repartidos entre varias herramientas y revisarlos lleva tiempo.",
    services: ["App Craft", "Visualización de datos"],
    filters: ["apps"],
    story: {
      challenge: [
        "Los datos del negocio están repartidos entre varias herramientas y revisarlos lleva tiempo.",
        "Hacía falta una sola vista que se entienda en segundos, sin hojas de cálculo.",
      ],
      chapters: [
        {
          key: "experience",
          title: "Una lectura en segundos.",
          text: "Ventas, usuarios, productos y conversión aparecen ordenados por importancia.",
          visuals: [{ kind: "video", src: "/projects/panel-de-metricas/preview", poster: "/projects/panel-de-metricas/gallery-1.webp", label: "Recorrido por el panel de métricas" }],
        },
        {
          key: "product",
          title: "Gráficas simples, datos claros.",
          text: "Cada tarjeta responde a una pregunta del negocio. Las cifras son datos de ejemplo.",
          visuals: [{ kind: "image", src: "/projects/panel-de-metricas/gallery-1.webp", alt: "Panel con ventas, usuarios, productos y conversión" }],
        },
      ],
      result: [
        "El equipo puede revisar el estado del negocio de un vistazo y decidir con la información a mano, sin saltar entre herramientas.",
      ],
    },
  },
  {
    slug: "asistente-de-reservas",
    name: "Asistente de reservas",
    category: "Agente IA / Automatización",
    description: "Responde consultas, propone horarios y confirma reservas.",
    headline: "Pregunta.\nAgenda.\nConfirma.",
    tags: ["Agente IA", "Automatización"],
    projectType: "concept",
    ...media("asistente-de-reservas"),
    gallery: [{ src: "/projects/asistente-de-reservas/gallery-1.webp", alt: "Conversación del asistente y pasos de la automatización" }],
    screen: "agent",
    built: "Un asistente que contesta, ofrece horarios disponibles, actualiza el calendario y envía la confirmación.",
    problem: "Responder mensajes para agendar citas ocupa horas del equipo y deja clientes esperando.",
    services: ["Agent Craft", "Integraciones"],
    filters: ["ia"],
    story: {
      challenge: [
        "Responder mensajes para agendar citas ocupa horas del equipo y deja clientes esperando.",
        "El reto era atender cada consulta al momento sin perder el tono cercano de la marca.",
      ],
      chapters: [
        {
          key: "experience",
          title: "Una conversación que termina en reserva.",
          text: "El asistente responde, ofrece horarios disponibles y confirma, todo en el mismo chat.",
          visuals: [{ kind: "video", src: "/projects/asistente-de-reservas/preview", poster: "/projects/asistente-de-reservas/gallery-1.webp", label: "Conversación con el asistente de reservas" }],
        },
        {
          key: "product",
          title: "Claro para quien escribe.",
          text: "Mensajes cortos, opciones concretas y una confirmación al final.",
          visuals: [{ kind: "image", src: "/projects/asistente-de-reservas/gallery-1.webp", alt: "Conversación del asistente y pasos de la automatización" }],
        },
        {
          key: "system",
          title: "Lo que pasa detrás.",
          text: "Cada reserva actualiza el calendario y envía la confirmación sin trabajo manual.",
          visuals: [{ kind: "flow", steps: ["Consulta recibida", "Horario reservado", "Calendario actualizado", "Confirmación enviada"] }],
        },
      ],
      result: [
        "El negocio puede atender consultas a cualquier hora y dedicar el tiempo del equipo a lo que necesita una persona.",
      ],
    },
  },
  {
    slug: "norte-estudio",
    name: "Norte Estudio",
    category: "Sitio corporativo / Arquitectura",
    description: "Una portada editorial para un estudio de arquitectura.",
    headline: "Espacio, luz\ny estructura.",
    tags: ["Sitio corporativo", "Editorial"],
    projectType: "concept",
    ...media("norte-estudio"),
    gallery: [{ src: "/projects/norte-estudio/gallery-1.webp", alt: "Portada editorial de Norte Estudio" }],
    screen: "studio",
    built: "Una portada editorial con tipografía grande, mucho aire y el proyecto como protagonista. La marca Norte Estudio es ficticia.",
    problem: "Un estudio con buen trabajo necesita una web que lo presente con la misma calidad.",
    services: ["Web Craft", "Dirección de arte"],
    filters: ["web", "brand"],
    story: {
      challenge: [
        "Un estudio con buen trabajo necesita una web que lo presente con la misma calidad.",
        "Norte Estudio es una marca ficticia: este concepto explora cómo dar a cada obra el protagonismo de una revista.",
      ],
      chapters: [
        {
          key: "experience",
          title: "Arquitectura que se habita.",
          text: "Tipografía grande, mucho aire y la obra como protagonista.",
          visuals: [{ kind: "video", src: "/projects/norte-estudio/preview", poster: "/projects/norte-estudio/gallery-1.webp", label: "Recorrido por la portada de Norte Estudio" }],
        },
        {
          key: "product",
          title: "Una portada editorial.",
          text: "Cada proyecto se presenta como en una publicación de arquitectura.",
          visuals: [{ kind: "image", src: "/projects/norte-estudio/gallery-1.webp", alt: "Portada editorial de Norte Estudio" }],
        },
      ],
      result: [
        "El estudio puede mostrar su obra con el cuidado de una publicación y dejar que los proyectos hablen por sí mismos.",
      ],
    },
  },
];

/** Aviso obligatorio en los conceptos (nunca en trabajos de clientes). */
export const CONCEPT_NOTE = "Concepto de diseño de Fary Labs. No es un trabajo de cliente.";

/** Etiqueta corta para portadas y fichas. */
export const typeLabel = (p: Project) => (p.projectType === "concept" ? "Concepto" : "Cliente");

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Enlace al formulario de cotización con el proyecto como referencia. */
export const quoteHref = (slug: string) => `/?proyecto=${slug}#cotizacion`;
