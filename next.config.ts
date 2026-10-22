import type { NextConfig } from "next";

/**
 * Con STATIC_EXPORT=true (GitHub Actions → GitHub Pages) se genera un sitio estático en `out/`,
 * con el prefijo de NEXT_PUBLIC_BASE_PATH (p. ej. "/codecraft-studios"). En local no cambia nada.
 */
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(staticExport ? { output: "export", basePath, images: { unoptimized: true } } : {}),
};

export default nextConfig;
