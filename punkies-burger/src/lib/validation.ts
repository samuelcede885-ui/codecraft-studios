import type { OrderMode } from '../config/site';

export interface CheckoutForm {
  mode: OrderMode;
  name: string;
  phone: string;
  address: string;
  reference: string;
  notes: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export const NOTES_MAX = 300;

/** Acepta 0414 123 4567, 04141234567, +58 414 1234567, 0212 123 4567 o un número internacional con +. */
export function isValidPhone(input: string) {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+') && !digits.startsWith('58')) return digits.length >= 8 && digits.length <= 15;
  if (digits.startsWith('58')) return digits.length === 12 && /^58[24]/.test(digits);
  if (digits.startsWith('0')) return digits.length === 11 && /^0[24]/.test(digits);
  return digits.length === 10 && /^[24]/.test(digits);
}

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (form.name.trim().length < 2) errors.name = 'Escribe tu nombre para saber de quién es el pedido.';
  if (!form.phone.trim()) errors.phone = 'Escribe un teléfono para confirmar el pedido.';
  else if (!isValidPhone(form.phone)) errors.phone = 'Revisa el teléfono. Ejemplo: 0414 123 4567.';
  if (form.mode === 'delivery' && form.address.trim().length < 8)
    errors.address = 'Escribe la dirección de entrega: calle, edificio o casa y zona.';
  if (form.notes.length > NOTES_MAX) errors.notes = `Las observaciones admiten hasta ${NOTES_MAX} caracteres.`;
  return errors;
}
