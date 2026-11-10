/**
 * Plugin de Vite: completa el HTML a partir de los datos del catálogo.
 *  - Foto inicial del hero dentro del HTML: se pinta sin esperar al JavaScript
 *    y React la sustituye al arrancar (misma URL, sale de caché). Va un poco
 *    más grande que el primer fotograma de React para que siga contando como
 *    el contenido más grande (LCP) y la métrica refleje lo que ve el cliente.
 *  - JSON-LD (Bakery + menú con precios) para buscadores.
 *  - Precarga de la fuente de titulares.
 *  - og:url / canonical / og:image cuando `site.url` está definido.
 *  - `noindex` mientras el sitio sea una propuesta (`site.preview`).
 */
import site from '../src/config/site.js'
import { categories, heroProducts, products } from '../src/data/catalog.js'
import { heroThemes } from '../src/data/themes.js'

/** Debe coincidir con el `sizes` de la cookie en src/components/hero/Hero.jsx. */
const HERO_SIZES = '(max-width: 859px) 80vw, 44vw'

/**
 * Coloca la foto donde la pondrá el hero (mismas proporciones que hero.css) y
 * en la pose inicial de su animación de entrada, para que el relevo no se note.
 */
function boot(first) {
  const { w, h, widths } = first.image
  const fit = Math.min(1, w / h) // ancho de la foto respecto al cuadro
  const drop = ((1 - Math.min(1, h / w)) / 2 + 0.05).toFixed(3) // apoyo inferior + pose de entrada
  const srcset = widths.map((x) => `./img/products/${first.id}-${x}.webp ${x}w`).join(', ')
  const css = `
      .boot{position:relative;overflow:hidden;--h:clamp(560px,100svh,1200px);--stage:calc(var(--h) - 328px);--size:min(86vw,calc(var(--stage)*.66));--top:calc(68px + var(--stage)*.63);height:var(--h)}
      .boot img{position:absolute;left:50%;top:calc(var(--top) + var(--size)*${drop});width:calc(var(--size)*${fit.toFixed(3)});height:auto;transform:translate(-50%,-50%) scale(.86) rotate(12deg)}
      @media (min-width:860px){.boot{--h:clamp(640px,100svh,1200px);--stage:calc(var(--h) - 246px);--size:min(40vw,calc(var(--stage)*.92),640px);--top:calc(88px + var(--stage)*.54)}}
      @media (prefers-reduced-motion:reduce){.boot img{transform:translate(-50%,-50%)}}`
  const html = `<div class="boot" aria-hidden="true" style="background:${heroThemes[first.hero.theme].bg}"><img src="./img/products/${first.id}-800.webp" srcset="${srcset}" sizes="${HERO_SIZES}" width="${w}" height="${h}" alt="" fetchpriority="high" decoding="sync" /></div>`
  return { css, html }
}

function jsonLd() {
  const base = site.url ? `${site.url}/` : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: site.name,
    slogan: site.slogan,
    servesCuisine: ['Cookies', 'Postres'],
    ...(site.url ? { url: site.url } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(site.location.address ? { streetAddress: site.location.address } : {}),
      addressLocality: `${site.location.area}, ${site.location.city}`,
      addressCountry: 'VE',
    },
    sameAs: site.social.map((s) => s.url),
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: categories.map((category) => ({
        '@type': 'MenuSection',
        name: category.name,
        hasMenuItem: products
          .filter((p) => p.category === category.id)
          .map((p) => ({
            '@type': 'MenuItem',
            name: p.name,
            description: p.description,
            image: `${base}img/products/${p.id}-1200.webp`,
            offers: {
              '@type': 'Offer',
              price: p.price.toFixed(2),
              priceCurrency: site.currency.code,
              availability: p.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
          })),
      })),
    },
  }
}

export function noaHtml() {
  return {
    name: 'noa-html',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const first = heroProducts[0]
        const tags = []
        const shell = first ? boot(first) : { css: '', html: '' }
        if (shell.css) tags.push(`<style>${shell.css}\n    </style>`)
        if (site.preview) tags.push('<meta name="robots" content="noindex, nofollow" />')
        // La fuente del titular gigante: se precarga para que no cambie de tamaño al llegar.
        const font = Object.keys(ctx.bundle ?? {}).find((file) => /oswald-latin-wght-normal.*\.woff2$/.test(file))
        if (font) tags.push(`<link rel="preload" as="font" type="font/woff2" href="./${font}" crossorigin />`)
        if (site.url) {
          tags.push(`<link rel="canonical" href="${site.url}/" />`)
          tags.push(`<meta property="og:url" content="${site.url}/" />`)
          tags.push(`<meta property="og:image" content="${site.url}/og.jpg" />`)
        }
        tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd())}</script>`)
        return html.replace('<!-- noa:head -->', tags.join('\n    ')).replace('<!-- noa:boot -->', shell.html)
      },
    },
  }
}
