import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { noaHtml } from './build/noa-html.js'

export default defineConfig({
  // Rutas relativas: el sitio funciona igual en la raíz de un dominio o en una subcarpeta.
  base: './',
  plugins: [react(), tailwindcss(), noaHtml()],
  build: { target: 'es2022', assetsInlineLimit: 2048 },
  server: { host: true },
  preview: { host: true },
  test: { environment: 'node', include: ['tests/unit/**/*.test.js'] },
})
