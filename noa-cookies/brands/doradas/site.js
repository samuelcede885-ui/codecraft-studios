/**
 * Doradas (@doradas.sweets) — datos del negocio para la vista previa.
 *
 * Todo sale de su perfil público de Instagram y de su menú publicado en
 * historias destacadas. Lo que está en `null`, `''` o `[]` es información que
 * la marca no ha dado: la interfaz lo omite o lo marca como "por confirmar".
 *
 * Misma forma que src/config/site.js (la marca base); ver build/brand.js.
 */
export const site = {
  name: 'Doradas',
  /** El texto bajo su logo: "fina galletería y algo más". */
  slogan: 'Fina galletería y algo más',
  /** Su nombre de perfil: "dorada's | galletas y mas…". */
  descriptor: 'Galletas y más',
  lang: 'es',

  shortName: 'Doradas',
  /** El logo es la palabra "doradas": no se repite en texto a su lado. */
  logoIncludesName: true,
  /** Su bio: "fina galletería ubicada en caracas". */
  tagline: 'Fina galletería ubicada en Caracas.',
  heading: 'Doradas: fina galletería en Caracas',
  seo: {
    title: 'Doradas | Fina galletería en Caracas',
    description: 'Fina galletería en Caracas: galletas estilo Nueva York y boxes para compartir. Delivery o pick-up.',
    shareDescription: 'Fina galletería y algo más. Galletas estilo Nueva York y boxes para compartir.',
    locale: 'es_VE',
  },

  url: '',

  /** Es una propuesta que la marca aún no ha visto ni aprobado. */
  preview: true,
  /** Siempre en modo demostración: aviso fijo, sin WhatsApp y sin envío de pedidos. */
  demo: true,
  provisionalPhotos: true,

  location: {
    area: null,
    city: 'Caracas',
    country: 'Venezuela',
    address: null,
    mapsUrl: null,
  },

  /** Su perfil no publica horario. */
  hours: null,

  policies: null,

  social: [{ id: 'instagram', label: 'Instagram', handle: '@doradas.sweets', url: 'https://www.instagram.com/doradas.sweets/' }],

  /** Su menú no publica precios: cada producto queda "por confirmar". */
  currency: { code: 'USD', symbol: '$', decimal: '.' },

  ordering: {
    provider: 'whatsapp',
    whatsapp: {
      number: '',
      /** El enlace de su bio. */
      shortLink: 'https://wa.link/mrps6b',
    },
    api: { ordersEndpoint: '', availabilityEndpoint: '' },
  },

  fulfillment: {
    /** Su bio: "trabajamos con delivery o pick up". */
    pickup: { enabled: true, label: 'Pick-up', detail: 'El punto de retiro en Caracas se confirma por WhatsApp.' },
    delivery: {
      enabled: true,
      label: 'Delivery',
      fee: null,
      detail: 'El costo del delivery se confirma por WhatsApp según tu zona.',
    },
  },

  payment: { methods: [] },
}

export default site
