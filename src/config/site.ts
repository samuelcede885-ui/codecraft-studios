// Datos reales de contacto pendientes de confirmar por Fary Labs.
// Mientras estén vacíos, la web no enlaza a destinos inventados:
// el formulario valida y avisa de que el envío aún no está configurado,
// y los canales del cierre se muestran como "próximamente".
export const site = {
  name: "Fary Labs",
  tagline: "Transformamos ideas en productos digitales.",
  contact: {
    email: "", // p. ej. "hola@farylabs.com"
    whatsapp: "", // número en formato internacional sin "+", p. ej. "584121234567"
    instagram: "", // usuario sin "@", p. ej. "farylabs"
  },
  nav: [
    { label: "Inicio", mobileLabel: "Inicio", href: "#inicio" },
    { label: "Servicios", mobileLabel: "Servicios", href: "#servicios" },
    { label: "Portafolio", mobileLabel: "Proyectos", href: "#portafolio" },
    { label: "Proceso", mobileLabel: "Proceso", href: "#proceso" },
    { label: "Contacto", mobileLabel: "Contacto", href: "#contacto" },
  ],
} as const;
