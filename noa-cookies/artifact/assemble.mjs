/**
 * Convierte el build de vite.artifact.config.js en la página que se publica
 * como artefacto: un fragmento HTML (sin <html>, <head> ni <body>) con el CSS
 * y el código de la tienda dentro, y las librerías pedidas a un CDN.
 *
 *   npm run build:artifact  →  dist-artifact/propuesta-noa-cookies.html
 *                              dist-artifact/img/…  (fotos; se publican junto a la página)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { boot } from '../build/noa-html.js'
import { heroProducts } from '../src/data/catalog.js'
import { palette } from '../src/data/themes.js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, 'dist-artifact')
const assets = fs.readdirSync(path.join(dist, 'assets'))
const pick = (ext) => {
  const found = assets.filter((file) => file.endsWith(ext))
  if (found.length !== 1) throw new Error(`Se esperaba un solo archivo ${ext} y hay ${found.length}`)
  return fs.readFileSync(path.join(dist, 'assets', found[0]), 'utf8')
}

// Versiones exactas y con más de dos semanas publicadas, desde hosts que el artefacto admite.
const LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
]
const GSAP_REACT = 'https://cdn.jsdelivr.net/npm/@gsap/react@2.1.2/dist/index.min.js'
const FONTS = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Poppins:wght@400;500;600&display=swap'
const BAR = 33 // alto aproximado del aviso de demostración, para la foto inicial

const css = pick('.css').replaceAll('url(../img/', 'url(./img/').replace(/<\/style/gi, '<\\/style')
const js = pick('.js').replace(/<\/script/gi, '<\\/script')
if (/\bimport\s*\(|^\s*import\s/m.test(js)) throw new Error('El código de la tienda no debe importar módulos externos')
const shell = boot(heroProducts[0], BAR)

const page = `<title>Propuesta NOA Cookies</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${FONTS}">
<style>
/* Tienda de una página: una cookie a pantalla completa con su nombre detrás, catálogo en discos de color y pedido en un panel. */
:root {
  --color-noa-orange: ${palette.orange.toLowerCase()};
  --color-navy: ${palette.navy.toLowerCase()};
  --color-butter: ${palette.butter.toLowerCase()};
  --color-choco: ${palette.choco.toLowerCase()};
  --color-dough: ${palette.dough.toLowerCase()};
  --color-danger: #b3261e;
  --font-display: "Oswald", "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
  --font-sans: "Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  color-scheme: light; /* Una sola apariencia: la paleta la fija el manual de marca. */
}
html { background: var(--color-noa-orange); }
body {
  margin: 0;
  background: var(--color-dough);
  color: var(--color-navy);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
/* Las piezas alargadas del catálogo se asoman de su disco a propósito. */
.item-visual[data-wide] .item-img { max-width: none; }
${shell.css.trim()}
</style>
<style>
${css}
</style>
<div id="root">${shell.html}</div>
${LIBS.map((src) => `<script src="${src}"></script>`).join('\n')}
<script>window.react = window.React</script>
<script src="${GSAP_REACT}"></script>
<script type="module">
${js}
</script>
`

const out = path.join(dist, 'propuesta-noa-cookies.html')
fs.writeFileSync(out, page)
// Lo que no se publica: restos del build intermedio.
fs.rmSync(path.join(dist, 'assets'), { recursive: true, force: true })
fs.rmSync(path.join(dist, 'artifact'), { recursive: true, force: true })
for (const extra of ['og.jpg', 'robots.txt', 'favicon.png', 'favicon.svg', 'apple-touch-icon.png']) fs.rmSync(path.join(dist, extra), { force: true })

const images = fs.readdirSync(path.join(dist, 'img'), { recursive: true }).filter((f) => /\.(webp|png)$/.test(f))
console.log(`${path.relative(root, out)}  ${(page.length / 1024).toFixed(0)} KB  +  ${images.length} imágenes`)
