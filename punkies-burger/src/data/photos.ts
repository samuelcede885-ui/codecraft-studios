import manifest from './photo-manifest.json';

/**
 * Registro de fotografías reales de Punkie's.
 * Todas salen del material entregado por el cliente (capturas del Instagram
 * @punkiesburger y collages de marca). Se recortaron para quitar los iconos
 * de Instagram y los marcos/stickers de los collages; las maestras están en
 * /fotos y las versiones web se generan con `npm run fotos`.
 */
export type PhotoId = keyof typeof manifest;

interface PhotoMeta {
  alt: string;
  /** De dónde sale la foto (trazabilidad para el cliente) */
  source: string;
  /** object-position por defecto para recortes con object-fit: cover */
  focus?: string;
}

const META: Record<PhotoId, PhotoMeta> = {
  'clasica-cerca': {
    alt: 'La Clásica de cerca: pan brioche, lechuga, pepinillos, cebolla picada y queso derretido sobre dos carnes smash.',
    source: 'Instagram, 28 jul 2026 (1/2)',
    focus: '50% 62%',
  },
  'clasica-combo': {
    alt: 'La Clásica en bandeja sobre papel Punkie’s, con un vaso de papas fritas detrás.',
    source: 'Instagram, 28 jul 2026 (2/2)',
    focus: '50% 70%',
  },
  'especial-septiembre': {
    alt: 'Hamburguesa smash con papitas al hilo y salsa blanca, sobre papel con el patrón Punkie’s.',
    source: 'Instagram, 9 sep 2026',
    focus: '50% 58%',
  },
  'envuelta-bandeja': {
    alt: 'Manos con guantes negros arman pedidos: una hamburguesa envuelta en papel con tres estrellas sobre la bandeja.',
    source: 'Instagram, 16 mar 2026 (4/4)',
    focus: '50% 40%',
  },
  'bolsa-delivery': {
    alt: 'Bolsa de papel blanca con el logo Punkie’s y tres estrellas sobre el mostrador del local.',
    source: 'Instagram, 30 abr 2026 (3/4)',
    focus: '42% 45%',
  },
  'plancha-guantes': {
    alt: 'Una mano con guante negro sostiene una smash burger con queso derretido sobre la plancha.',
    source: 'Instagram, 30 abr 2026 (2/4)',
    focus: '50% 62%',
  },
  fachada: {
    alt: 'Fachada del local en Chacao con el letrero vertical que repite PUNKIES.',
    source: 'Instagram, 14 dic 2025',
    focus: '45% 40%',
  },
  'dos-smash': {
    alt: 'Dos smash burgers envueltas en papel con estrellas, listas en la bandeja.',
    source: 'Instagram, 16 mar 2026 (5/5)',
    focus: '50% 40%',
  },
  'cajon-de-luz': {
    alt: 'El letrero de luz amarillo de Punkie’s encendido de noche en la calle.',
    source: 'Instagram, 15 nov 2025 (2/2)',
    focus: '55% 35%',
  },
  'choose-your-fighter': {
    alt: 'Integrante del equipo con camisa PUNKIES CHACAO y guantes negros, cargando dos bolsas de panes brioche.',
    source: 'Instagram, 28 dic 2025',
    focus: '50% 45%',
  },
  'papas-vaso': {
    alt: 'Vaso de papas fritas con el logo Punkie’s sobre un asiento oscuro.',
    source: 'Collage de marca (fotograma)',
    focus: '50% 45%',
  },
  'papas-sazonadas': {
    alt: 'Mano con guante negro sirviendo papitas finas sazonadas y doradas.',
    source: 'Collage de marca (fotograma)',
    focus: '50% 50%',
  },
  'pan-brioche': {
    alt: 'Pan brioche dorado de cerca.',
    source: 'Collage de marca (fotograma)',
    focus: '50% 60%',
  },
  punkieversario: {
    alt: 'Vidriera del punkieversario: “365 days flipping burgers” escrito sobre el vidrio, con clientes adentro.',
    source: 'Collage de marca (fotograma)',
    focus: '50% 50%',
  },
  'cocina-guante': {
    alt: 'Mano con guante negro trabajando sobre una bandeja de acero en la cocina.',
    source: 'Collage de marca (fotograma)',
    focus: '50% 50%',
  },
  'papas-logo-rojo': {
    alt: 'Vaso de papas con el logo Punkie’s en rojo, con una hamburguesa desenfocada en primer plano.',
    source: 'Collage de marca',
    focus: '60% 40%',
  },
  'panes-salsas': {
    alt: 'Panes abiertos con ketchup, mostaza y pepinillos, listos para armar.',
    source: 'Collage de marca',
    focus: '50% 50%',
  },
};

export interface Photo extends PhotoMeta {
  id: PhotoId;
  width: number;
  height: number;
  widths: number[];
  lqip: string;
}

export function getPhoto(id: PhotoId): Photo {
  return { id, ...manifest[id], ...META[id] };
}

export function photoSrc(id: PhotoId, width: number) {
  return `${import.meta.env.BASE_URL}img/${id}-${width}.webp`;
}

export function photoSrcSet(id: PhotoId) {
  return manifest[id].widths.map((w) => `${photoSrc(id, w)} ${w}w`).join(', ');
}
