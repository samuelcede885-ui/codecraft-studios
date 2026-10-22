/**
 * Prefijo de la web cuando se publica en una subcarpeta (p. ej. GitHub Pages en
 * usuario.github.io/codecraft-studios). Lo fija la compilación con NEXT_PUBLIC_BASE_PATH;
 * en local y con dominio propio queda vacío.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Antepone el prefijo a una ruta absoluta del sitio ("/proyectos/x", "/#catalogo"). */
export const withBase = (path: string) => (path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path);
