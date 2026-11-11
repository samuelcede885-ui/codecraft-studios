/**
 * Configuración editable del sitio.
 *
 * Regla: lo que está en `null`, `''` o `[]` es información que NOA todavía no
 * ha confirmado. La interfaz lo omite o lo marca como "por confirmar" en lugar
 * de inventarlo. Al completar un dato aquí, aparece solo en la web.
 */
export const site = {
  name: 'NOA Cookies',
  slogan: 'Because bigger is better',
  descriptor: 'Premium big cookies',
  lang: 'es',

  /** Dominio final, sin barra al final. Se usa para canonical y Open Graph. */
  url: '',

  /** `true` muestra en el footer que es una propuesta aún no aprobada por la marca. */
  preview: true,

  /**
   * Modo demostración. Se activa solo al compilar la versión para compartir
   * (`npm run build:artifact`, que define VITE_DEMO). Muestra un aviso fijo de
   * "propuesta, no es la tienda oficial", no abre WhatsApp y no envía pedidos,
   * para que la página no pueda confundirse con la tienda real de la marca.
   */
  demo: Boolean(import.meta.env?.VITE_DEMO),

  /** `true` avisa que las fotos salen del menú público y no son los originales. */
  provisionalPhotos: true,

  location: {
    area: 'Valle Arriba',
    city: 'Caracas',
    country: 'Venezuela',
    address: null, // p. ej. 'C.C. …, local 12'
    mapsUrl: null,
  },

  /** p. ej. [{ days: 'Lunes a sábado', hours: '9:00 a. m. – 7:00 p. m.' }] */
  hours: null,

  /** p. ej. [{ label: 'Cambios y devoluciones', url: '/politicas' }] */
  policies: null,

  social: [
    { id: 'instagram', label: 'Instagram', handle: '@noacookies', url: 'https://www.instagram.com/noacookies/' },
    { id: 'threads', label: 'Threads', handle: '@noacookies', url: 'https://www.threads.com/@noacookies' },
  ],

  /**
   * El menú de NOA muestra los precios sin símbolo (4.00, 3, 2.5…).
   * Se asume dólares; cambiar aquí si la marca usa otra referencia.
   */
  currency: { code: 'USD', symbol: '$' },

  ordering: {
    /**
     * 'whatsapp': el pedido se arma en la web y se envía por el WhatsApp de NOA.
     * 'api': el pedido se registra en un backend propio (ver src/services/orders.js).
     */
    provider: 'whatsapp',
    whatsapp: {
      /** Número en formato internacional, solo dígitos (p. ej. '584121234567'). */
      number: '',
      /** Enlace público de la bio de Instagram. Se usa mientras no haya número. */
      shortLink: 'https://wa.link/mtx8ts',
    },
    api: {
      /** POST: registra el pedido y devuelve { orderNumber }. */
      ordersEndpoint: '',
      /** GET: devuelve { [productId]: { available: boolean, stock: number|null } }. */
      availabilityEndpoint: '',
    },
  },

  fulfillment: {
    pickup: {
      enabled: true,
      label: 'Pick-up',
      detail: 'Retiras tu pedido en Valle Arriba, Caracas.',
    },
    delivery: {
      enabled: true,
      label: 'Delivery',
      /** Monto fijo en la moneda del sitio, o `null` si se cotiza por zona. */
      fee: null,
      detail: 'El costo del delivery se confirma por WhatsApp según tu zona.',
    },
  },

  payment: {
    /** p. ej. [{ id: 'pago-movil', label: 'Pago Móvil' }, { id: 'zelle', label: 'Zelle' }] */
    methods: [],
  },
}

export default site
