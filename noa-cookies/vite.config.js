import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { brandDirs, brandSwap, loadBrand, resolveBrand } from './build/brand.js'
import { noaHtml } from './build/noa-html.js'

// La marca se elige con --mode <id> (ver build/brand.js). Sin nada: NOA, en dist/.
export default defineConfig(async ({ mode }) => {
  const brand = resolveBrand(mode)
  const dirs = brandDirs(brand)
  return {
    // Rutas relativas: el sitio funciona igual en la raíz de un dominio o en una subcarpeta.
    base: './',
    publicDir: dirs.publicDir,
    plugins: [brandSwap(brand), react(), tailwindcss(), noaHtml(await loadBrand(brand))],
    build: { target: 'es2022', assetsInlineLimit: 2048, outDir: dirs.outDir },
    server: { host: true },
    preview: { host: true },
    test: { environment: 'node', include: ['tests/unit/**/*.test.js'] },
  }
})
