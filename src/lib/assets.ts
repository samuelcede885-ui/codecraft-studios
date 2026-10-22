import { withBase } from "./paths";

declare global {
  interface Window {
    /** Rutas reescritas por una exportación estática (p. ej. a un almacén de archivos). Vacío en la web normal. */
    __FARY_ASSETS?: Record<string, string>;
  }
}

/** URL final de un archivo de /public: la del mapa inyectado o la ruta con el prefijo de publicación. */
export function assetUrl(path: string) {
  if (typeof window === "undefined") return withBase(path);
  return window.__FARY_ASSETS?.[path] ?? withBase(path);
}
