// Datos reales de contacto pendientes de confirmar por Fary Labs.
// Se rellenan aquí o con variables de entorno al compilar (NEXT_PUBLIC_…).
// Mientras estén vacíos, la web no enlaza a destinos inventados: el formulario valida y avisa
// de que el envío aún no está configurado, los canales aparecen como "próximamente"
// y el botón flotante de WhatsApp no se muestra.
const env = (v: string | undefined) => (v ?? "").trim();

export const site = {
  name: "Fary Labs",
  tagline: "Transformamos ideas en productos digitales.",
  description:
    "Estudio de desarrollo digital y consultoría tecnológica. Sitios web, aplicaciones y automatización con IA para negocios que quieren avanzar.",
  /** Dominio público, p. ej. "https://farylabs.com". Activa canonical, Open Graph absoluto y sitemap. */
  url: env(process.env.NEXT_PUBLIC_SITE_URL),
  contact: {
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL), // p. ej. "hola@farylabs.com"
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP), // formato internacional sin "+", p. ej. "584121234567"
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM), // usuario sin "@"
  },
  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Servicios", href: "#servicios" },
    { label: "Proyectos", href: "#proyectos" },
    { label: "Proceso", href: "#proceso" },
    { label: "Contacto", href: "#contacto" },
  ],
} as const;

export const whatsappLink = (text: string) =>
  site.contact.whatsapp ? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}` : "";
