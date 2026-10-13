/**
 * Configuración de Supabase.
 * Dashboard → Project Settings → API. La "anon key" es pública por diseño:
 * la seguridad la imponen las políticas RLS de la base de datos.
 */
export const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
export const SUPABASE_ANON_KEY = 'TU-ANON-KEY';

/** Bucket de Storage creado en la migración. */
export const ASSETS_BUCKET = 'restaurant-assets';
