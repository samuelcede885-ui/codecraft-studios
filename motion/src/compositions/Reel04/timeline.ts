/**
 * REEL 04 — "Una Venezuela conectada". Animación explicativa: cada movimiento cuenta algo.
 * Visión en desarrollo de Fary Labs (no una red de comercios que ya funcione). 30 fps.
 */
export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const scenes = {
  toque: { from: 0, to: s(4.0) },
  compra: { from: s(4.0), to: s(11.0) },
  ciudad: { from: s(11.0), to: s(18.0) },
  procesos: { from: s(18.0), to: s(23.6) },
  conexion: { from: s(23.6), to: s(33.5) },
  venezuela: { from: s(33.5), to: s(41.4) },
  cierre: { from: s(41.4), to: s(47.2) },
} as const;

export const DURATION = scenes.cierre.to;

/** Locución (scripts/audio/generate_reel04_voice.py usa los mismos segundos). */
export const voice = [
  { at: 0.3, text: "¿Y si comprar en Venezuela fuera así de fácil?" },
  { at: 4.0, text: "Un toque para descubrir una tienda." },
  { at: 6.6, text: "Otro para elegir un producto." },
  { at: 9.0, text: "Y un pedido que llega directo al negocio." },
  { at: 12.0, text: "Ahora imagina esa experiencia en muchos comercios: restaurantes, tiendas y servicios." },
  { at: 18.1, text: "Hoy, muchos todavía dependen de mensajes, libretas y procesos separados." },
  { at: 23.2, text: "En Fary Labs queremos cambiar eso con tiendas digitales, aplicaciones para administrar ventas e inventario, y automatizaciones que conecten cada paso." },
  { at: 33.6, text: "No es una realidad que ya exista en todas partes." },
  { at: 37.1, text: "Es una visión que estamos construyendo para el comercio venezolano." },
  { at: 42.2, text: "¿Tienes un negocio? Comenta CONECTAR y hablemos." },
] as const;

/**
 * Subtítulos (máx. dos líneas). Las palabras entre *asteriscos* se marcan en azul.
 * Inicio y fin en segundos, ajustados a la voz real.
 */
export const subtitles: { from: number; to: number; text: string }[] = [
  { from: 0.3, to: 3.55, text: "¿Y si comprar en Venezuela fuera así de *fácil*?" },
  { from: 4.0, to: 6.4, text: "Un *toque* para descubrir una tienda." },
  { from: 6.6, to: 8.85, text: "Otro para *elegir* un producto." },
  { from: 9.0, to: 11.75, text: "Y un *pedido* que llega directo al negocio." },
  { from: 12.0, to: 14.5, text: "Ahora imagina esa experiencia en *muchos comercios*:" },
  { from: 14.5, to: 17.75, text: "restaurantes, tiendas y servicios." },
  { from: 18.1, to: 22.85, text: "Hoy, muchos todavía dependen de mensajes, libretas y *procesos separados*." },
  { from: 23.2, to: 26.4, text: "En *Fary Labs* queremos cambiar eso con *tiendas digitales*," },
  { from: 26.4, to: 29.6, text: "aplicaciones para administrar *ventas e inventario*," },
  { from: 29.6, to: 32.7, text: "y automatizaciones que *conecten cada paso*." },
  { from: 33.6, to: 36.9, text: "No es una realidad que ya exista en todas partes." },
  { from: 37.1, to: 41.2, text: "Es una *visión* que estamos construyendo para el comercio venezolano." },
  { from: 42.2, to: 45.6, text: "¿Tienes un negocio? Comenta *CONECTAR* y hablemos." },
];

/** Titulares grandes (arriba). `accent` = palabra en azul. */
export const titles: { from: number; to: number; lines: string[]; accent?: string }[] = [
  { from: s(0.35), to: s(3.85), lines: ["¿Y SI COMPRAR", "FUERA ASÍ DE FÁCIL?"], accent: "FÁCIL?" },
  { from: s(4.1), to: s(6.45), lines: ["DESCUBRE."], accent: "DESCUBRE." },
  { from: s(6.6), to: s(8.9), lines: ["ELIGE."], accent: "ELIGE." },
  { from: s(9.0), to: s(11.3), lines: ["HAZ TU PEDIDO."], accent: "PEDIDO." },
  { from: s(12.2), to: s(14.6), lines: ["UNA CIUDAD."], accent: "CIUDAD." },
  { from: s(14.8), to: s(17.8), lines: ["MILES DE", "POSIBILIDADES."], accent: "POSIBILIDADES." },
  { from: s(19.0), to: s(23.3), lines: ["DEMASIADOS PROCESOS", "SEPARADOS."], accent: "SEPARADOS." },
  { from: s(27.0), to: s(30.2), lines: ["TODO MÁS", "CONECTADO."], accent: "CONECTADO." },
  { from: s(30.4), to: s(33.3), lines: ["TODO MÁS", "SIMPLE."], accent: "SIMPLE." },
  { from: s(33.9), to: s(36.9), lines: ["EL COMERCIO", "VENEZOLANO."], accent: "VENEZOLANO." },
  { from: s(37.1), to: s(41.2), lines: ["MEJOR", "CONECTADO."], accent: "CONECTADO." },
];
