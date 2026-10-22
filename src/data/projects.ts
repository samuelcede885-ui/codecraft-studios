/**
 * Catálogo de proyectos. Para añadir uno: una entrada aquí y sus archivos en
 * public/projects/<slug>/ (thumb.webp = portada diseñada, preview.mp4/.webm y, si existe,
 * full.mp4/.webm + poster.webp, gallery-*.webp). Los videos de los conceptos se graban de sus
 * pantallas HTML con scripts/record-reels.mjs y las portadas con scripts/record-covers.mjs.
 *
 * Los campos opcionales tienen respaldo (ver helpers al final): sin campaignCover se usa la
 * miniatura, sin fullVideo el preview, sin preview no hay reproducción y las secciones sin datos
 * (reto, resultado, tecnologías, servicios, galería, antes/después, enlace público) no se muestran.
 *
 * Todos los proyectos actuales son conceptos de Fary Labs (projectType "concept"): no son trabajos
 * de clientes y se marcan siempre como tales. Un trabajo real lleva projectType "client".
 */
export type Project = {
  slug: string;
  name: string;
  category: string;
  /** Sector del proyecto, si aplica. */
  industry?: string;
  /** Trabajo real para un cliente o concepto propio. Un concepto nunca se presenta como cliente. */
  projectType: "client" | "concept";
  /** Portada diseñada (catálogo, referencia del formulario, showreel). */
  thumbnail: string;
  /** Portada de campaña para el destacado y el case study; por defecto, la miniatura. */
  campaignCover?: string;
  /** Primer fotograma del video completo; por defecto, la portada de campaña. */
  poster?: string;
  /** Preview corto (5–10 s) para hover y lightbox; sin él, la ficha solo muestra la portada. */
  previewVideo?: string;
  /** Recorrido completo; por defecto, el preview. */
  fullVideo?: string;
  gallery?: { src: string; alt: string }[];
  /** Una línea para el catálogo. */
  description: string;
  /** Case study: el reto (párrafos cortos), qué se construyó y qué permite (sin métricas inventadas). */
  challenge?: string[];
  solution?: string;
  result?: string[];
  /** Solo tecnologías verificadas en el proyecto real; sin datos, la sección no se muestra. */
  technologies?: string[];
  services?: string[];
  featured?: boolean;
  /** Dirección pública del proyecto publicado (solo trabajos reales en línea). */
  publicUrl?: string;
  year?: string;
  /** Mensaje de la portada (src/components/covers); cada salto de línea es un renglón. */
  headline?: string;
  /** Filtros del portafolio en los que aparece. */
  filters: FilterId[];
  /** Capítulos visuales del case study (experiencia, producto, conversión, sistema). */
  chapters?: Chapter[];
  /** Antes y después con imágenes reales del proyecto; sin ellas, no se muestra la comparación. */
  beforeAfter?: { before: { src: string; alt: string }; after: { src: string; alt: string }; caption?: string };
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

/** Rutas de los archivos de un proyecto. Sin recorrido largo propio, fullVideo queda vacío (usa el preview). */
const media = (slug: string, hasFull = false) => ({
  thumbnail: `/projects/${slug}/thumb.webp`,
  previewVideo: `/projects/${slug}/preview.mp4`,
  ...(hasFull ? { fullVideo: `/projects/${slug}/full.mp4`, poster: `/projects/${slug}/poster.webp` } : {}),
});


export const projects: Project[] = [
  {
    slug: "gramercy",
    name: "Gramercy",
    category: "E-commerce / Fashion",
    industry: "Moda y calzado",
    description: "Una experiencia completa desde catálogo hasta pago.",
    headline: "Pisa firme.\nCompra fácil.",
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
    solution:
      "Una tienda online completa para una marca de calzado: portada, ficha de producto, carrito, pago y un panel de métricas para seguir las ventas.",
    services: ["Web Craft", "Diseño UI/UX", "E-commerce", "Panel de métricas"],
    filters: ["ecommerce", "web"],
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
  {
    slug: "panel-de-metricas",
    name: "Panel de métricas",
    category: "Plataforma / Dashboard",
    description: "Ventas, usuarios y conversión en una sola vista.",
    headline: "Tus números,\nen una mirada.",
    projectType: "concept",
    ...media("panel-de-metricas"),
    gallery: [{ src: "/projects/panel-de-metricas/gallery-1.webp", alt: "Panel con ventas, usuarios, productos y conversión" }],
    solution: "Un panel que reúne ventas, usuarios y conversión con gráficas simples y una lectura en segundos.",
    services: ["App Craft", "Visualización de datos"],
    filters: ["apps"],
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
  {
    slug: "asistente-de-reservas",
    name: "Asistente de reservas",
    category: "Agente IA / Automatización",
    industry: "Servicios con cita previa",
    description: "Responde consultas, propone horarios y confirma reservas.",
    headline: "Pregunta.\nAgenda.\nConfirma.",
    projectType: "concept",
    ...media("asistente-de-reservas"),
    gallery: [{ src: "/projects/asistente-de-reservas/gallery-1.webp", alt: "Conversación del asistente y pasos de la automatización" }],
    solution: "Un asistente que contesta, ofrece horarios disponibles, actualiza el calendario y envía la confirmación.",
    services: ["Agent Craft", "Integraciones"],
    filters: ["ia"],
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
  {
    slug: "norte-estudio",
    name: "Norte Estudio",
    category: "Sitio corporativo / Arquitectura",
    industry: "Arquitectura",
    description: "Una portada editorial para un estudio de arquitectura.",
    headline: "Espacio, luz\ny estructura.",
    projectType: "concept",
    ...media("norte-estudio"),
    gallery: [{ src: "/projects/norte-estudio/gallery-1.webp", alt: "Portada editorial de Norte Estudio" }],
    solution: "Una portada editorial con tipografía grande, mucho aire y el proyecto como protagonista. La marca Norte Estudio es ficticia.",
    services: ["Web Craft", "Dirección de arte"],
    filters: ["web", "brand"],
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
];

/* ── Respaldos de los campos opcionales ── */
export const coverOf = (p: Project) => p.campaignCover ?? p.thumbnail;
export const posterOf = (p: Project) => p.poster ?? coverOf(p);
export const fullVideoOf = (p: Project) => p.fullVideo ?? p.previewVideo;
/** Ruta sin extensión: cada video existe en .webm y .mp4. */
export const videoBase = (src: string) => src.replace(/\.(mp4|webm)$/, "");

/** Aviso obligatorio en los conceptos (nunca en trabajos de clientes). */
export const CONCEPT_NOTE = "Concepto de diseño de Fary Labs. No es un trabajo de cliente.";

/** Etiqueta corta para portadas y fichas. */
export const typeLabel = (p: Project) => (p.projectType === "concept" ? "Concepto" : "Cliente");

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Enlace al formulario de cotización con el proyecto como referencia. */
export const quoteHref = (slug: string) => `/?proyecto=${slug}#cotizacion`;
