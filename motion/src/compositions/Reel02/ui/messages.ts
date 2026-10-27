import { s } from "../timeline";

/** Mensajes de clientes que llegan al comercio (escenas 1–2). Frame de llegada y texto. */
export const messages = [
  { at: s(4.6), text: "¿Precio?", side: "left" },
  { at: s(5.4), text: "¿Está disponible?", side: "right" },
  { at: s(7.9), text: "¿Cómo pago?", side: "left" },
  { at: s(8.7), text: "¿Hacen delivery?", side: "right" },
  { at: s(9.5), text: "¿Me envías el catálogo?", side: "left" },
  { at: s(10.2), text: "¿Ya confirmaron mi pago?", side: "right" },
  { at: s(10.8), text: "¿Precio?", side: "left" },
  { at: s(11.3), text: "¿Siguen abiertos?", side: "right" },
  { at: s(11.7), text: "¿Está disponible en talla M?", side: "left" },
] as const;

/** Pedidos pendientes que se acumulan junto al comerciante. */
export const pending = [
  { at: s(8.4), id: "#0142", text: "Esperando confirmación de pago" },
  { at: s(9.6), id: "#0143", text: "Falta dirección de entrega" },
  { at: s(10.9), id: "#0144", text: "Sin responder" },
] as const;

/** 0–1 durante el medio segundo posterior a cada mensaje (vibración del teléfono). */
export function msgPulse(frame: number) {
  for (const m of messages) {
    const age = frame - m.at;
    if (age >= 0 && age < 15) return age / 15;
  }
  return 0;
}

/** Mensajes sin leer acumulados en el frame. */
export const unread = (frame: number) => {
  const base = messages.filter((m) => frame >= m.at).length;
  // Más allá de los mensajes visibles, el contador sigue subiendo (saturación).
  const extra = frame > s(9) ? Math.floor((frame - s(9)) / 4) : 0;
  return base === 0 ? 0 : base * 3 + extra;
};
