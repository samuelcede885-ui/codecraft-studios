/** Cliente único de Supabase compartido por toda la app. */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Mensajes legibles para los errores más comunes de PostgREST/Postgres. */
const FRIENDLY_ERRORS = {
  PGRST116: 'No se encontró el registro o no tienes permiso para modificarlo.',
  42501: 'No tienes permiso para realizar esta acción.',
  23505: 'Ya existe un registro con ese valor (p. ej. el slug ya está en uso).',
  23514: 'Algún valor no es válido (p. ej. un precio negativo o un color mal escrito).',
  23503: 'La categoría indicada no existe en este restaurante.',
  invalid_credentials: 'Email o contraseña incorrectos.',
  email_not_confirmed: 'Confirma tu email antes de iniciar sesión.',
  user_already_exists: 'Ya existe una cuenta con ese email.',
};

/** Auth y Storage no siempre envían `code`; se reconocen por el mensaje. */
function friendlyMessage(error) {
  if (FRIENDLY_ERRORS[error.code]) return FRIENDLY_ERRORS[error.code];
  if (/invalid login credentials/i.test(error.message)) return FRIENDLY_ERRORS.invalid_credentials;
  if (/row-level security/i.test(error.message)) return FRIENDLY_ERRORS[42501];
  return error.message;
}

/** Devuelve `data` o lanza un Error con un mensaje legible (conserva `code` y `cause`). */
export function unwrap({ data, error }) {
  if (error) {
    const err = new Error(friendlyMessage(error), { cause: error });
    err.code = error.code;
    throw err;
  }
  return data;
}

/** Como unwrap, pero falla si la operación no afectó a ninguna fila (RLS la filtró). */
export function unwrapAffected(result) {
  const rows = unwrap(result);
  if (!rows?.length) unwrap({ error: { code: 'PGRST116' } });
  return rows;
}
