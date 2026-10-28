/**
 * REEL 03 — "Dos negocios, dos formas de trabajar". Ejemplo ilustrativo: los dos negocios son
 * ficticios. La locución manda: cada escena dura lo que su frase necesita (30 fps).
 */
export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const scenes = {
  presentacion: { from: 0, to: s(6.2) },
  problema: { from: s(6.2), to: s(15.2) },
  transformacion: { from: s(15.2), to: s(24.3) },
  administracion: { from: s(24.3), to: s(29.2) },
  diferencia: { from: s(29.2), to: s(36.9) },
  cierre: { from: s(36.9), to: s(45.0) },
} as const;

export const DURATION = scenes.cierre.to;

/** Locución: frase y segundo de entrada (scripts/audio/generate_reel03_voice.py usa los mismos). */
export const voice = [
  { id: "v01", at: 0.4, text: "Dos negocios." },
  { id: "v02", at: 2.15, text: "Mismos productos." },
  { id: "v03", at: 3.95, text: "Mismas oportunidades." },
  { id: "v04", at: 6.35, text: "Pero hay una diferencia." },
  { id: "v05", at: 8.5, text: "Uno responde cada mensaje, confirma pedidos manualmente y pierde tiempo organizando sus cuentas." },
  { id: "v06", at: 15.45, text: "El otro tiene Fary Labs." },
  { id: "v07", at: 17.85, text: "Sus clientes pueden comprar desde su tienda digital." },
  { id: "v08", at: 21.65, text: "Sus pedidos llegan a un solo lugar." },
  { id: "v09", at: 24.5, text: "Y puede gestionar inventario, ventas y gastos desde una aplicación." },
  { id: "v10", at: 29.5, text: "¿La diferencia?" },
  { id: "v11", at: 31.05, text: "Uno depende de hacer todo manualmente." },
  { id: "v12", at: 34.1, text: "El otro tiene herramientas para crecer." },
  { id: "v13", at: 37.3, text: "Fary Labs. Digitaliza tu negocio." },
  { id: "v14", at: 40.5, text: "¿Cuál de los dos quieres tener?" },
] as const;

/** Subtítulos (máximo dos líneas), sincronizados con la voz. Inicio y fin en segundos. */
export const subtitles: { from: number; to: number; text: string }[] = [
  { from: 0.4, to: 1.95, text: "Dos negocios." },
  { from: 2.15, to: 3.8, text: "Mismos productos." },
  { from: 3.95, to: 6.0, text: "Mismas oportunidades." },
  { from: 6.35, to: 8.25, text: "Pero hay una diferencia." },
  { from: 8.5, to: 12.2, text: "Uno responde cada mensaje, confirma pedidos manualmente" },
  { from: 12.2, to: 15.05, text: "y pierde tiempo organizando sus cuentas." },
  { from: 15.45, to: 17.6, text: "El otro tiene Fary Labs." },
  { from: 17.85, to: 21.45, text: "Sus clientes pueden comprar desde su tienda digital." },
  { from: 21.65, to: 24.25, text: "Sus pedidos llegan a un solo lugar." },
  { from: 24.5, to: 28.95, text: "Y puede gestionar inventario, ventas y gastos desde una aplicación." },
  { from: 29.5, to: 30.9, text: "¿La diferencia?" },
  { from: 31.05, to: 33.95, text: "Uno depende de hacer todo manualmente." },
  { from: 34.1, to: 36.75, text: "El otro tiene herramientas para crecer." },
  { from: 37.3, to: 40.15, text: "Fary Labs. Digitaliza tu negocio." },
  { from: 40.5, to: 42.7, text: "¿Cuál de los dos quieres tener?" },
];
