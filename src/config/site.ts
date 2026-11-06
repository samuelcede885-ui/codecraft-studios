// Contacto confirmado por Fary Labs (correo y WhatsApp). Un canal vacío no se publica:
// la web no enlaza a destinos inventados.
export const site = {
  name: "Fary Labs",
  /** Dominio público (p. ej. "https://farylabs.com"). Vacío: no se generan URLs absolutas
   *  (canónicas, sitemap, Open Graph absolutas) hasta que exista. */
  url: "",
  description:
    "Estudio de desarrollo digital y consultoría tecnológica. Sitios web, software a medida y automatización para negocios que quieren avanzar.",
  tagline: "Transformamos ideas en productos digitales.",
  contact: {
    email: "farylabs.ve@gmail.com",
    whatsapp: "584220311117", // formato internacional sin "+" (+58 422-0311117)
    instagram: "", // usuario sin "@", p. ej. "farylabs"
  },
  /** Cursor contextual en escritorio (círculo con VER / PLAY sobre proyectos). false lo desactiva. */
  contextCursor: true,
  nav: [
    { label: "Inicio", mobileLabel: "Inicio", href: "#inicio" },
    { label: "Portafolio", mobileLabel: "Proyectos", href: "#portafolio" },
    { label: "Servicios", mobileLabel: "Servicios", href: "#servicios" },
    { label: "Planes", mobileLabel: "Planes", href: "#planes" },
    { label: "Proceso", mobileLabel: "Proceso", href: "#proceso" },
    { label: "Contacto", mobileLabel: "Contacto", href: "#contacto" },
  ],
} as const;
