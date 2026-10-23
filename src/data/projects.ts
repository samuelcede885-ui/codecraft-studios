import { withBase } from "@/lib/paths";

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
 * Los conceptos de Fary Labs (projectType "concept") no son trabajos de clientes y se marcan siempre
 * como tales. Un trabajo real lleva projectType "client" (hoy, G-Talent, la web del GABA y Fariseos League).
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
  { id: "personal", label: "Webs personales" },
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
    slug: "g-talent",
    name: "G-Talent",
    category: "Landing / Formación online",
    industry: "Educación online",
    description: "Landing de venta para una certificación profesional en IA con Claude.",
    headline: "Tu talento también\nse entrena.",
    featured: true,
    projectType: "client",
    ...media("g-talent", true),
    gallery: [
      { src: "/projects/g-talent/gallery-1.webp", alt: "Portada de la certificación: Aprende Claude. Aplica. Avanza." },
      { src: "/projects/g-talent/gallery-2.webp", alt: "Sección sobre Claude con la interfaz en una laptop" },
      { src: "/projects/g-talent/gallery-3.webp", alt: "Lo que aprenderás: cuatro habilidades de la certificación" },
      { src: "/projects/g-talent/gallery-4.webp", alt: "Temario por módulos con duración y número de lecciones" },
      { src: "/projects/g-talent/gallery-5.webp", alt: "Certificado de la certificación y botón para reservar cupo" },
    ],
    solution:
      "Una landing de venta para la Certificación Profesional en Agentes de IA y Automatización con Claude: intro animada con la marca, portada con la propuesta, sección sobre Claude, temario por módulos, certificado y oferta con la reserva de cupo.",
    services: ["Web Craft", "Diseño UI/UX"],
    technologies: ["HTML", "CSS", "JavaScript"],
    filters: ["web"],
    challenge: [
      "Una certificación con varios módulos, certificado y bonos reúne mucha información. Presentada de golpe, quien llega se pierde antes de inscribirse.",
      "La página tenía que explicar el programa con claridad, transmitir la marca G-Talent y llevar a reservar un cupo.",
    ],
    chapters: [
      {
        key: "experience",
        title: "La marca entra primero.",
        text: "Una intro con el logo de G-Talent abre paso a una portada directa: qué se aprende y para qué.",
        visuals: [{ kind: "video", src: "/projects/g-talent/full", poster: "/projects/g-talent/poster.webp", label: "Recorrido por la landing de G-Talent" }],
      },
      {
        key: "product",
        title: "El programa, en orden.",
        text: "Qué es Claude, qué habilidades se entrenan y cada módulo con su duración y sus lecciones.",
        visuals: [
          { kind: "image", src: "/projects/g-talent/gallery-2.webp", alt: "Sección sobre Claude con la interfaz en una laptop" },
          { kind: "image", src: "/projects/g-talent/gallery-4.webp", alt: "Temario por módulos con duración y número de lecciones" },
        ],
      },
      {
        key: "conversion",
        title: "Todo lleva a reservar.",
        text: "El certificado y la oferta cierran el recorrido, con el botón de reserva siempre a la vista.",
        visuals: [{ kind: "image", src: "/projects/g-talent/gallery-5.webp", alt: "Certificado de la certificación y botón para reservar cupo" }],
      },
    ],
    result: [
      "G-Talent cuenta con una página que presenta el programa completo en un recorrido ordenado y guía a cada visitante hacia la reserva de su cupo.",
    ],
  },
  {
    slug: "gaba",
    name: "GABA, el freno del cerebro",
    category: "Web personal / Divulgación",
    industry: "Educación universitaria",
    description: "Web educativa y animada sobre el GABA para estudiantes de la UNIMET.",
    headline: "Ciencia que\nse entiende.",
    projectType: "client",
    publicUrl: "https://samuelcede885-ui.github.io/backward/",
    ...media("gaba", true),
    gallery: [
      { src: "/projects/gaba/gallery-1.webp", alt: "Portada: GABA, el freno del cerebro, con la molécula en 3D" },
      { src: "/projects/gaba/gallery-2.webp", alt: "Ruta metabólica animada de la derivación del GABA" },
      { src: "/projects/gaba/gallery-3.webp", alt: "Mapa del encéfalo con las regiones con más neuronas GABAérgicas" },
      { src: "/projects/gaba/gallery-4.webp", alt: "Simulación de la sinapsis GABAérgica con su registro de potencial" },
      { src: "/projects/gaba/gallery-5.webp", alt: "Control de actividad GABAérgica con el registro de membrana" },
    ],
    solution:
      "Una web de una sola página que explica el GABA con un modelo 3D de la molécula, la ruta metabólica animada, un mapa del encéfalo, una simulación de la sinapsis y un control para ver qué pasa con el déficit y el exceso.",
    services: ["Web Craft", "Diseño UI/UX"],
    technologies: ["HTML", "CSS", "JavaScript", "SVG", "Canvas 2D"],
    filters: ["personal", "web"],
    challenge: [
      "Un trabajo universitario de neurociencia suele quedarse en diapositivas y texto denso.",
      "El reto era explicar cómo actúa el GABA de forma visual e interactiva, con sus fuentes citadas y sin perder rigor.",
    ],
    chapters: [
      {
        key: "experience",
        title: "Una portada con carácter.",
        text: "Tipografía de cartel, papel kraft y la molécula girando: el tema se presenta como una revista, no como un apunte.",
        visuals: [{ kind: "video", src: "/projects/gaba/full", poster: "/projects/gaba/poster.webp", label: "Recorrido por la web del GABA" }],
      },
      {
        key: "product",
        title: "Cada concepto, dibujado.",
        text: "La ruta metabólica se anima paso a paso y el mapa del encéfalo explica cada región al tocarla.",
        visuals: [
          { kind: "image", src: "/projects/gaba/gallery-2.webp", alt: "Ruta metabólica animada de la derivación del GABA" },
          { kind: "image", src: "/projects/gaba/gallery-3.webp", alt: "Mapa del encéfalo con las regiones con más neuronas GABAérgicas" },
        ],
      },
      {
        key: "system",
        title: "Simulaciones que se pueden tocar.",
        text: "Se dispara la sinapsis, se añade una benzodiacepina o se mueve el nivel de GABA y la neurona responde en pantalla.",
        visuals: [
          { kind: "image", src: "/projects/gaba/gallery-4.webp", alt: "Simulación de la sinapsis GABAérgica con su registro de potencial" },
          { kind: "image", src: "/projects/gaba/gallery-5.webp", alt: "Control de actividad GABAérgica con el registro de membrana" },
        ],
      },
    ],
    result: [
      "Las estudiantes cuentan con una web publicada que explica el GABA paso a paso y que cualquiera puede abrir desde el navegador, sin instalar nada.",
    ],
  },
  {
    slug: "fariseos-league",
    name: "Fariseos League",
    category: "App web / Liga deportiva",
    industry: "Deporte amateur",
    description: "La app de la liga: jugadores, estadísticas, equipos y partidos, desde el móvil.",
    headline: "Tu liga,\nen el bolsillo.",
    projectType: "client",
    publicUrl: "https://fariseosleague.com",
    ...media("fariseos-league", true),
    gallery: [
      { src: "/projects/fariseos-league/gallery-1.webp", alt: "Directorio de jugadores, ficha de un jugador y estadísticas avanzadas" },
      { src: "/projects/fariseos-league/gallery-2.webp", alt: "Clasificación de equipos, formación en el campo y resultados de partidos" },
      { src: "/projects/fariseos-league/gallery-3.webp", alt: "Menú de la liga, valor de mercado con logros y progresión del jugador" },
    ],
    solution:
      "Una app web para la liga: directorio de jugadores con buscador y filtros, fichas con estadísticas, valor de mercado y logros, y fichas de equipo con formación, plantilla, partidos y racha. Incluye clasificación, calendario, reglas y mercado.",
    services: ["App Craft", "Diseño UI/UX"],
    filters: ["apps"],
    challenge: [
      "En una liga entre amigos, los resultados, las estadísticas y las fichas suelen quedarse repartidos en chats y hojas de cálculo.",
      "El reto era darle a la liga una app propia, fácil de consultar desde el móvil, con la información de cada jugador y de cada equipo.",
    ],
    chapters: [
      {
        key: "experience",
        title: "La liga, en una app.",
        text: "Jugadores, partidos, clasificación y equipos a un toque, con la estética de una liga profesional.",
        visuals: [{ kind: "video", src: "/projects/fariseos-league/full", poster: "/projects/fariseos-league/poster.webp", label: "Recorrido por la app de Fariseos League" }],
      },
      {
        key: "product",
        title: "Cada jugador, con su ficha.",
        text: "Buscador y filtros por posición y equipo, carta del jugador, estadísticas por partido, valor de mercado y logros.",
        visuals: [
          { kind: "image", src: "/projects/fariseos-league/gallery-1.webp", alt: "Directorio de jugadores, ficha de un jugador y estadísticas avanzadas" },
          { kind: "image", src: "/projects/fariseos-league/gallery-3.webp", alt: "Menú de la liga, valor de mercado con logros y progresión del jugador" },
        ],
      },
      {
        key: "system",
        title: "Los equipos, al día.",
        text: "Clasificación, formación en el campo, plantilla, partidos jugados y racha de cada equipo.",
        visuals: [{ kind: "image", src: "/projects/fariseos-league/gallery-2.webp", alt: "Clasificación de equipos, formación en el campo y resultados de partidos" }],
      },
    ],
    result: [
      "La liga tiene una app pública donde jugadores y equipos consultan fichas, estadísticas, clasificación y partidos desde el móvil.",
    ],
  },
  {
    slug: "gramercy",
    name: "Gramercy",
    category: "E-commerce / Fashion",
    industry: "Moda y calzado",
    description: "Una experiencia completa desde catálogo hasta pago.",
    headline: "Pisa firme.\nCompra fácil.",
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
export const quoteHref = (slug: string) => withBase(`/?proyecto=${slug}#cotizacion`);
