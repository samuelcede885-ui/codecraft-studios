/**
 * Testimonios reales de clientes, con permiso para publicarlos (Manual de Marca: "las fotos,
 * testimonios y resultados cuentan con permiso"). Mientras la lista esté vacía, la sección
 * no aparece en producción; en desarrollo se ven placeholders marcados como tales.
 */
export type Testimonial = { quote: string; name: string; company: string };

export const testimonials: Testimonial[] = [];

/** Solo para maquetar en `npm run dev`. Nunca se publican. */
export const testimonialPlaceholders: Testimonial[] = [
  { quote: "Texto del cliente.", name: "Nombre", company: "Empresa" },
  { quote: "Texto del cliente.", name: "Nombre", company: "Empresa" },
  { quote: "Texto del cliente.", name: "Nombre", company: "Empresa" },
];
