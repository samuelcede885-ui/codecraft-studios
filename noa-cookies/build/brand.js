/**
 * Marcas.
 *
 * El proyecto se vende a varias marcas con el mismo diseño. NOA es la marca
 * base: sus datos viven en `src/`. Cada marca adicional es una carpeta en
 * `brands/<id>/` que sustituye, archivo por archivo, solo lo que cambia:
 *
 *   brands/<id>/site.js        →  src/config/site.js        (datos del negocio)
 *   brands/<id>/catalog.js     →  src/data/catalog.js       (productos y precios)
 *   brands/<id>/themes.js      →  src/data/themes.js        (paleta y escenas del hero)
 *   brands/<id>/BrandMark.jsx  →  src/components/ui/BrandMark.jsx  (logo)
 *   brands/<id>/fonts.js       →  src/brand/fonts.js        (tipografías)
 *   brands/<id>/theme.css      →  src/brand/theme.css       (colores por función)
 *   brands/<id>/public/        →  public/                   (fotos, iconos)
 *
 * La marca se elige con `--mode <id>` (o la variable BRAND):
 *   vite build --mode pookies   →   dist-pookies/
 * Sin nada, se construye NOA en dist/, igual que siempre.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

export const BASE_BRAND = 'noa'

/** Módulos que una marca puede sustituir (ruta desde la raíz del proyecto). */
export const SWAPPABLE = [
  'src/config/site.js',
  'src/data/catalog.js',
  'src/data/themes.js',
  'src/components/ui/BrandMark.jsx',
  'src/brand/fonts.js',
  'src/brand/theme.css',
]

export const listBrands = () =>
  fs.existsSync(path.join(root, 'brands')) ? fs.readdirSync(path.join(root, 'brands')).filter((d) => fs.statSync(path.join(root, 'brands', d)).isDirectory()) : []

/** Marca activa: BRAND o el modo de Vite, si existe su carpeta. En cualquier otro caso, la base. */
export function resolveBrand(mode) {
  const wanted = process.env.BRAND || mode
  return wanted && wanted !== BASE_BRAND && listBrands().includes(wanted) ? wanted : BASE_BRAND
}

/** Ruta real del módulo que usa una marca: el suyo si lo tiene, o el de la base. */
export function brandFile(brand, file) {
  const own = path.join(root, 'brands', brand, path.basename(file))
  return brand !== BASE_BRAND && fs.existsSync(own) ? own : path.join(root, file)
}

/** Carpetas de entrada y salida de cada marca. */
export function brandDirs(brand) {
  return brand === BASE_BRAND
    ? { publicDir: 'public', outDir: 'dist', artifactDir: 'dist-artifact' }
    : { publicDir: `brands/${brand}/public`, outDir: `dist-${brand}`, artifactDir: `dist-artifact-${brand}` }
}

/** Plugin de Vite: cuando un import apunta a un módulo sustituible, entrega el de la marca. */
export function brandSwap(brand) {
  if (brand === BASE_BRAND) return null
  const swaps = new Map(SWAPPABLE.map((file) => [path.join(root, file), brandFile(brand, file)]).filter(([from, to]) => from !== to))
  return {
    name: 'brand-swap',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!importer) return null
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true })
      const target = resolved && swaps.get(resolved.id.split('?')[0])
      return target ?? null
    },
  }
}

/** Datos de la marca para el lado de Node (HTML, JSON-LD, artefacto). */
export async function loadBrand(brand) {
  const load = (file) => import(pathToFileURL(brandFile(brand, file)).href)
  const [site, catalog, themes] = await Promise.all([load('src/config/site.js'), load('src/data/catalog.js'), load('src/data/themes.js')])
  return { id: brand, site: site.default, ...catalog, ...themes }
}
