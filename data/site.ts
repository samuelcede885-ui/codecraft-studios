// Datos globales del sitio. Cambia aquí el logo, el correo de contacto y la navegación.

export const site = {
  name: "Fary Labs",
  // Cuando tengas el logotipo original, colócalo en /public/brand y pon su ruta aquí
  // (p. ej. "/brand/fary-labs-logo.svg"). Mientras sea null se usa el logo provisional en SVG.
  logoSrc: null as string | null,
  logoSrcOnDark: null as string | null,
  // Pendiente de confirmar: sustituye por el correo real de contacto.
  contactEmail: "hola@farylabs.com",
};

export const contactHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent(
  "Nuevo proyecto con Fary Labs",
)}`;

// `target` es una etiqueta de la línea de tiempo del showcase (hero, s1…s5) o el id de una sección.
export const navItems = [
  { label: "Inicio", target: "hero", href: "#inicio" },
  { label: "Servicios", target: "s1", href: "#inicio" },
  { label: "Proyectos", target: "s2", href: "#inicio" },
  { label: "Proceso", target: "s4", href: "#inicio" },
  { label: "Contacto", target: "contacto", href: "#contacto" },
] as const;

export type NavTarget = (typeof navItems)[number]["target"];
