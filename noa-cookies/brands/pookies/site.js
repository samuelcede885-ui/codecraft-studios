/**
 * Pookies (@pookiesve) — datos del negocio para la vista previa.
 *
 * Todo sale de su perfil público de Instagram y de sus dos menús publicados.
 * Lo que está en `null`, `''` o `[]` es información que la marca no ha dado:
 * la interfaz lo omite o lo marca como "por confirmar" en lugar de inventarlo.
 *
 * Misma forma que src/config/site.js (la marca base); ver build/brand.js.
 */
export const site = {
  name: 'Pookies',
  /** Su bio: "Soft · gooey · freshly baked". */
  slogan: 'Soft · gooey · freshly baked',
  /** Su nombre de perfil: "Pookies | NY Style Cookies Caracas". */
  descriptor: 'NY style cookies',
  lang: 'es',

  shortName: 'Pookies',
  /** El logo es la palabra "Pookies": no se repite en texto a su lado. */
  logoIncludesName: true,
  /** Su menú solo da nombre y precio; esta línea (con sus palabras) acompaña a cada cookie. */
  tagline: 'NY style cookie: soft, gooey, freshly baked.',
  heading: 'Pookies: NY style cookies en Caracas',
  seo: {
    title: 'Pookies | NY style cookies en Caracas',
    description: 'NY style cookies en Caracas: soft, gooey, freshly baked. Elige tus sabores y arma tu pedido con delivery.',
    shareDescription: 'Soft · gooey · freshly baked. Elige tus sabores y arma tu pedido con delivery.',
    locale: 'es_VE',
  },

  url: '',

  /** Es una propuesta que la marca aún no ha visto ni aprobado. */
  preview: true,
  /**
   * Siempre en modo demostración: aviso fijo de "propuesta", sin WhatsApp y sin
   * envío de pedidos. No hay acuerdo con la marca ni número al que escribir.
   */
  demo: true,
  provisionalPhotos: true,

  location: {
    area: null,
    city: 'Caracas',
    country: 'Venezuela',
    address: null,
    mapsUrl: null,
  },

  /** De su bio: "TODOS LOS DÍAS | 12:00pm - 9:30pm…" (el texto seguía, cortado por Instagram). */
  hours: [{ days: 'Todos los días', hours: '12:00 p. m. – 9:30 p. m.' }],

  policies: null,

  social: [{ id: 'instagram', label: 'Instagram', handle: '@pookiesve', url: 'https://www.instagram.com/pookiesve/' }],

  /** Su menú publica los precios en euros y con coma: €5,50. */
  currency: { code: 'EUR', symbol: '€', decimal: ',' },

  ordering: {
    provider: 'whatsapp',
    whatsapp: {
      /** Su bio enlaza a wa.me/584…, pero el número aparece cortado en la captura. */
      number: '',
      shortLink: '',
    },
    api: { ordersEndpoint: '', availabilityEndpoint: '' },
  },

  fulfillment: {
    /** Su bio solo menciona delivery. */
    pickup: { enabled: false, label: 'Pick-up', detail: '' },
    delivery: {
      enabled: true,
      label: 'Delivery',
      fee: null,
      detail: 'El costo del delivery se confirma por WhatsApp según tu zona.',
    },
  },

  /** Tienen una historia destacada "payments", pero no se conoce su contenido. */
  payment: { methods: [] },
}

export default site
