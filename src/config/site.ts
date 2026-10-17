// Datos reales de contacto pendientes de confirmar por Fary Labs.
// Mientras estén vacíos, la web no enlaza a destinos inventados:
// el formulario valida y avisa de que el envío aún no está configurado.
export const site = {
  name: "Fary Labs",
  tagline: "Transformamos ideas en experiencias digitales extraordinarias.",
  contact: {
    email: "", // p. ej. "hola@farylabs.com"
    whatsapp: "", // número en formato internacional sin "+", p. ej. "5215512345678"
  },
  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Servicios", href: "#servicios" },
    { label: "Portafolio", href: "#portafolio" },
    { label: "Proceso", href: "#proceso" },
    { label: "Contacto", href: "#contacto" },
  ],
} as const;
