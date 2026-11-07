/**
 * Datos operativos de Punkie's Burger.
 *
 * Todo lo que no se pudo verificar en el material entregado (capturas de
 * Instagram + manual de marca) queda en `null` y marcado como PENDIENTE.
 * La web se adapta sola: mientras un dato sea `null`, no se muestra como
 * si existiera. Ver PENDIENTES.md para la lista completa.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface HoursRange {
  days: Weekday[];
  /** Formato 24 h, hora de Caracas */
  open: string;
  close: string;
  label: string;
}

export const site = {
  name: "Punkie's Burger",
  shortName: "Punkie's",
  tagline: 'Smash burgers de barrio, hechas con obsesión.',

  instagram: {
    handle: 'punkiesburger',
    url: 'https://www.instagram.com/punkiesburger/',
  },

  // Verificado: publicación de Instagram del 14 dic 2025 y manual de marca.
  address: {
    street: 'Av. Mohedano, calle José Félix Ribas',
    municipality: 'Chacao',
    city: 'Caracas',
    region: 'Miranda',
    countryCode: 'VE',
    // PENDIENTE: confirmar dirección exacta (número de local / referencia) antes del lanzamiento.
    confirmed: false,
  },

  // Horario de referencia (manual de marca + "abiertos toda la semana", IG 16 mar 2026).
  // PENDIENTE: confirmar antes del lanzamiento; puede cambiar.
  hoursConfirmed: false,
  timeZone: 'America/Caracas',
  hours: [
    { days: [1, 2, 3], open: '12:00', close: '21:00', label: 'Lunes a miércoles' },
    { days: [4, 5, 6, 0], open: '12:00', close: '23:00', label: 'Jueves a domingo' },
  ] satisfies HoursRange[],

  map: {
    // Búsqueda por nombre + dirección: Google Maps ubica el local por su ficha.
    query: "Punkie's Burger, Av. Mohedano, Chacao, Caracas",
    // PENDIENTE: pegar aquí las coordenadas verificadas del local (ej. { lat: 10.49, lng: -66.85 }).
    // No se usan coordenadas inventadas: mientras sea null, el mapa usa la búsqueda.
    coordinates: null as { lat: number; lng: number } | null,
  },

  ordering: {
    // PENDIENTE: número oficial de WhatsApp para pedidos, solo dígitos con código de país
    // (ej. '58414XXXXXXX'). Mientras sea null NO se envía nada por WhatsApp.
    whatsappNumber: null as string | null,
    // PENDIENTE: enlace oficial de delivery ("link en el perfil" de Instagram, IG 30 abr 2026).
    deliveryUrl: null as string | null,
    currency: 'USD',
    // Modalidades verificadas: consumo en el local, pick up y delivery (IG + manual).
    modes: ['delivery', 'retiro'] as const,
  },

  // PENDIENTE: dominio definitivo (para canonical, sitemap y Open Graph absolutos).
  siteUrl: null as string | null,
} as const;

export type OrderMode = (typeof site.ordering.modes)[number];

export const ORDER_MODE_LABEL: Record<OrderMode, string> = {
  delivery: 'Delivery',
  retiro: 'Retiro en el local',
};

export function fullAddress() {
  const a = site.address;
  return `${a.street}, ${a.municipality}, ${a.city}`;
}

export function directionsUrl() {
  const c = site.map.coordinates;
  const destination = c ? `${c.lat},${c.lng}` : site.map.query;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function mapEmbedUrl() {
  const c = site.map.coordinates;
  const q = c ? `${c.lat},${c.lng}` : site.map.query;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=17&hl=es&output=embed`;
}

export function whatsappUrl(message: string) {
  const n = site.ordering.whatsappNumber;
  if (!n) return null;
  return `https://wa.me/${n.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}
