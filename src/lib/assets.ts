declare global {
  interface Window {
    /** Rutas reescritas por una exportación estática (p. ej. a un almacén de archivos). Vacío en la web normal. */
    __FARY_ASSETS?: Record<string, string>;
  }
}

/** URL final de un archivo de /public. Sin mapa inyectado, devuelve la misma ruta. */
export function assetUrl(path: string) {
  if (typeof window === "undefined") return path;
  return window.__FARY_ASSETS?.[path] ?? path;
}
