/**
 * REEL 02 — "Conectando el comercio venezolano" (visión en desarrollo de Fary Labs).
 * Todo se mide en frames a 30 fps. La locución manda: cada escena dura lo que su frase necesita.
 * Las frases de voz están en `voice` (inicio en segundos); los textos en pantalla, en `titles`.
 */
export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const scenes = {
  ciudad: { from: 0, to: s(7.2) },
  problema: { from: s(7.2), to: s(14.6) },
  vision: { from: s(14.6), to: s(20.4) },
  compra: { from: s(20.4), to: s(29.8) },
  gestion: { from: s(29.8), to: s(36.2) },
  automatizacion: { from: s(36.2), to: s(44.4) },
  comunidad: { from: s(44.4), to: s(54.0) },
  cierre: { from: s(54.0), to: s(63.5) },
} as const;

export const DURATION = scenes.cierre.to;

/** Momento en que la escena se congela antes de la línea azul ("queremos cambiar eso"). */
export const FREEZE = s(13.1);

/** Locución: archivo de cada frase y su segundo de entrada (ver scripts/audio/generate_reel02_voice.py). */
export const voice = [
  { id: "l01", at: 0.6, text: "En Venezuela, miles de negocios venden todos los días." },
  { id: "l02", at: 4.5, text: "Pero muchos todavía dependen de responder mensajes, confirmar pedidos y organizar sus cuentas manualmente." },
  { id: "l03", at: 12.0, text: "En Fary Labs queremos cambiar eso." },
  { id: "l04", at: 15.1, text: "Estamos construyendo una nueva manera de conectar comercios y consumidores." },
  { id: "l05", at: 20.6, text: "Imagina que tu negocio tenga su propia tienda digital, donde tus clientes puedan descubrir productos, comprar o reservar en pocos pasos." },
  { id: "l06", at: 30.0, text: "Y que, desde una sola aplicación, puedas gestionar tus ventas, pedidos, inventario y gastos." },
  { id: "l07", at: 36.3, text: "Con automatizaciones y agentes de inteligencia artificial que te ayuden a ahorrar tiempo y atender mejor a tus clientes." },
  { id: "l08", at: 44.6, text: "Desde tiendas y restaurantes hasta servicios y emprendimientos." },
  { id: "l09", at: 49.3, text: "Nuestra visión es conectar y modernizar el comercio venezolano." },
  { id: "l10", at: 54.8, text: "Fary Labs." },
  { id: "l11", at: 56.6, text: "Menos procesos. Más oportunidades." },
  { id: "l12", at: 60.1, text: "¿Quieres ser parte? Escríbenos." },
] as const;

export type Title = { from: number; to: number; text: string; accent?: string; sub?: string; size?: number; place?: "top" | "center" };

/** Textos en pantalla (frames). `accent` = palabra que se marca con el azul de la señal. */
export const titles: Title[] = [
  { from: s(0.9), to: s(3.9), text: "Venezuela está llena de negocios.", accent: "negocios." },
  { from: s(4.2), to: s(7.0), text: "Pero vender todavía puede ser complicado.", accent: "complicado.", size: 66 },
  { from: s(8.0), to: s(10.2), text: "Demasiados mensajes.", accent: "mensajes." },
  { from: s(10.4), to: s(12.9), text: "Demasiados procesos manuales.", accent: "manuales." },
  { from: s(15.0), to: s(20.2), text: "Estamos construyendo una nueva forma de comerciar.", accent: "comerciar.", sub: "Un ecosistema digital para Venezuela.", size: 70 },
  { from: s(21.0), to: s(25.0), text: "Tu negocio. Tu tienda digital.", accent: "digital." },
  { from: s(25.3), to: s(29.6), text: "Comprar sin conversaciones interminables.", accent: "interminables.", size: 60 },
  { from: s(30.2), to: s(36.0), text: "Todo tu comercio. Un solo sistema.", accent: "sistema." },
  { from: s(36.6), to: s(40.4), text: "Menos tareas manuales.", accent: "manuales." },
  { from: s(40.7), to: s(44.2), text: "Más tiempo para crecer.", accent: "crecer." },
  { from: s(45.0), to: s(49.2), text: "Una comunidad de negocios conectados.", accent: "conectados.", size: 66 },
  { from: s(49.5), to: s(53.8), text: "Una nueva experiencia para Venezuela.", accent: "Venezuela.", size: 66 },
];
