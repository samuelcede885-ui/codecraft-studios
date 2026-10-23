/**
 * Planes y precios de Fary Labs. Fuente: propuesta de negocio "CODE CRAFT STUDIO", sección 6
 * (Google Drive). Se muestran como precio de partida ("Desde"): el precio final se confirma
 * tras una conversación inicial. Textos según el Manual de Marca: beneficios concretos, sin
 * promesas absolutas ni plazos sin diagnóstico.
 * Mantenimiento mensual: de $20 (Web Base, la landing) a $50 (el plan más completo), fijado por
 * Fary Labs; sustituye a las tarifas mensuales del documento original.
 */
export type PlanLine = "web" | "app" | "agent" | "packs";

export type Plan = {
  id: string;
  name: string;
  /** Qué es, en pocas palabras. */
  kind: string;
  /** Precio de partida en USD (pago único). */
  price: number;
  /** Mantenimiento mensual opcional en USD. */
  monthly?: number;
  includes: string[];
  forWhom?: string;
  support?: string;
  /** Solo en packs: precio de los servicios por separado. */
  regular?: number;
  /** Tipo sugerido en el formulario de cotización. */
  quoteType: "Web" | "E-commerce" | "App" | "Agente IA" | "Otro";
};

export const planLines: { id: PlanLine; label: string; title: string }[] = [
  { id: "web", label: "Web Craft", title: "Sitios web" },
  { id: "app", label: "App Craft", title: "Aplicaciones" },
  { id: "agent", label: "Agent Craft", title: "Agentes IA" },
  { id: "packs", label: "Packs", title: "Planes combinados" },
];

const support = {
  base: "7 días de soporte tras la entrega",
  medium: "15 días de soporte y una sesión de capacitación",
  premium: "30 días de soporte y un manual en video",
};

export const plans: Record<PlanLine, Plan[]> = {
  web: [
    {
      id: "web-base",
      name: "Web Base",
      kind: "Landing page",
      price: 100,
      monthly: 20,
      includes: ["Una página por bloques: portada, quiénes somos, servicios o productos y testimonios", "Botón directo a WhatsApp o llamada", "Diseño pensado primero para el móvil"],
      forWhom: "Marcas personales, eventos y lanzamientos de un producto.",
      support: support.base,
      quoteType: "Web",
    },
    {
      id: "web-medium",
      name: "Web Medium",
      kind: "Corporativa o catálogo",
      price: 220,
      monthly: 30,
      includes: ["Hasta 5 secciones: inicio, nosotros, servicios, catálogo y contacto", "Formulario conectado a tu correo o a Google Sheets", "SEO local básico y diseño con tu identidad de marca"],
      forWhom: "Academias, clínicas, restaurantes y empresas de servicios.",
      support: support.medium,
      quoteType: "Web",
    },
    {
      id: "web-premium",
      name: "Web Premium",
      kind: "Portal o e-commerce ligero",
      price: 380,
      monthly: 40,
      includes: ["Catálogo dinámico con filtros", "Carrito que envía el pedido detallado por WhatsApp", "Panel para actualizar fotos y precios sin tocar código"],
      forWhom: "Tiendas, importadoras y negocios con mucho inventario.",
      support: support.premium,
      quoteType: "E-commerce",
    },
  ],
  app: [
    {
      id: "app-titanium",
      name: "App Titanium",
      kind: "Gestión básica",
      price: 160,
      monthly: 25,
      includes: ["Hasta 3 vistas: inventario, clientes y directorio", "Acceso con contraseña", "Datos sincronizados con una hoja de cálculo o base de datos"],
      forWhom: "Negocios que quieren dejar el cuaderno de papel.",
      support: support.base,
      quoteType: "App",
    },
    {
      id: "app-platino",
      name: "App Platino",
      kind: "Usuarios y roles",
      price: 320,
      monthly: 35,
      includes: ["Inicio de sesión para administradores y clientes", "Registro de transacciones, comisiones y balances", "Notificaciones internas y carga de comprobantes"],
      forWhom: "Ligas deportivas, academias y equipos de ventas.",
      support: support.medium,
      quoteType: "App",
    },
    {
      id: "app-diamante",
      name: "App Diamante",
      kind: "Ecosistema completo",
      price: 520,
      monthly: 50,
      includes: ["Roles por niveles: administrador, gestor y usuario", "Reportes en PDF y métricas con gráficos", "Reglas dinámicas y automatizaciones"],
      forWhom: "Startups, torneos con varias sedes y operaciones de despacho.",
      support: support.premium,
      quoteType: "App",
    },
  ],
  agent: [
    {
      id: "agent-base",
      name: "Agente Base",
      kind: "Asistente de preguntas frecuentes",
      price: 90,
      monthly: 20,
      includes: ["Asistente integrado en tu web", "Responde con tu información: preguntas frecuentes, horarios, ubicación y políticas", "Mantenimiento con hasta 1.000 conversaciones al mes"],
      forWhom: "Negocios que reciben muchas preguntas repetidas.",
      support: support.base,
      quoteType: "Agente IA",
    },
    {
      id: "agent-pro",
      name: "Agente Pro",
      kind: "Asistente comercial en WhatsApp",
      price: 180,
      monthly: 30,
      includes: ["Conectado a tu WhatsApp Business", "Envía tu catálogo y responde dudas sobre productos o servicios", "Registra nombre, teléfono y pedido y los pasa a tu equipo"],
      forWhom: "Negocios que venden por WhatsApp.",
      support: support.medium,
      quoteType: "Agente IA",
    },
    {
      id: "agent-super-star",
      name: "Agente Super Star",
      kind: "Agenda y seguimiento",
      price: 300,
      monthly: 45,
      includes: ["Consulta disponibilidad y agenda citas en Google Calendar", "Verifica comprobantes de pago básicos", "Envía recordatorios a quien no terminó su compra"],
      forWhom: "Negocios que trabajan con citas o reservas.",
      support: support.premium,
      quoteType: "Agente IA",
    },
  ],
  packs: [
    {
      id: "pack-comercio-agil",
      name: "Pack Comercio Ágil",
      kind: "Web Base + Agente Pro",
      price: 240,
      regular: 280,
      includes: ["Una landing para presentar tu negocio y tus campañas", "Un asistente en WhatsApp que atiende y registra pedidos"],
      forWhom: "Comercios que venden por redes y WhatsApp.",
      quoteType: "Otro",
    },
    {
      id: "pack-gestion-pro",
      name: "Pack Gestión Pro",
      kind: "Web Medium + App Platino",
      price: 480,
      regular: 540,
      includes: ["Una web pública para presentar tu institución", "Una app privada para gestionar usuarios, pagos o torneos"],
      forWhom: "Academias, ligas e instituciones.",
      quoteType: "Otro",
    },
    {
      id: "pack-fary-360",
      name: "Pack Fary 360",
      kind: "Web Premium + App Diamante + Agente Super Star",
      price: 1050,
      regular: 1200,
      includes: ["Portal de ventas o catálogo dinámico", "Sistema interno para tu operación", "Agente que agenda y hace seguimiento a tus clientes"],
      forWhom: "Empresas que quieren digitalizar ventas, operación y atención.",
      quoteType: "Otro",
    },
  ],
};

/** Formato de precio en USD: 1050 → "$1.050". */
export const usd = (n: number) => `$${n.toLocaleString("es-VE")}`;
