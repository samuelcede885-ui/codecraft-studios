/** Autenticación del dueño del restaurante (email + contraseña). */
import { supabase, unwrap } from './supabase.js';

/** @returns {Promise<import('@supabase/supabase-js').User|null>} */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export async function signIn(email, password) {
  return unwrap(await supabase.auth.signInWithPassword({ email, password })).user;
}

/** Si el proyecto exige confirmar el email, `session` vendrá vacía. */
export async function signUp(email, password) {
  return unwrap(await supabase.auth.signUp({ email, password }));
}

export async function signOut() {
  unwrap(await supabase.auth.signOut());
}
