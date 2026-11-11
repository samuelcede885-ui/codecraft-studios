/**
 * Build de la versión para compartir como artefacto (modo demostración).
 *
 * Diferencias con el build normal:
 *  - React, ReactDOM, GSAP y ScrollTrigger no se empaquetan: la página los pide
 *    a un CDN y aquí se sustituyen por módulos que leen esos globales.
 *  - VITE_DEMO activa el aviso de "propuesta" y desactiva el envío de pedidos.
 *  - Sale un solo JS y un solo CSS, que artifact/assemble.mjs mete en la página.
 */
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

process.env.VITE_DEMO = '1'
const shim = (name) => fileURLToPath(new URL(`./artifact/shims/${name}.js`, import.meta.url))

export default defineConfig({
  base: './',
  define: { 'import.meta.env.VITE_DEMO': JSON.stringify('1') },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^react\/jsx-runtime$/, replacement: shim('jsx-runtime') },
      { find: /^react\/jsx-dev-runtime$/, replacement: shim('jsx-runtime') },
      { find: /^react-dom\/client$/, replacement: shim('react-dom-client') },
      { find: /^react$/, replacement: shim('react') },
      { find: /^gsap\/ScrollTrigger$/, replacement: shim('scroll-trigger') },
      { find: /^gsap$/, replacement: shim('gsap') },
      { find: /^@gsap\/react$/, replacement: shim('gsap-react') },
      { find: /^lenis$/, replacement: shim('lenis') },
    ],
  },
  build: {
    outDir: 'dist-artifact',
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
    rollupOptions: { input: "artifact/index.html", output: { codeSplitting: false } },
  },
})
