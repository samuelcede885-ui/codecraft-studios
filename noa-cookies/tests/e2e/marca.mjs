/**
 * Prueba de humo de una marca: comprueba que el sitio construido para ella
 * muestra sus datos (nombre, sabores, precios, moneda) y que se puede armar un
 * pedido de principio a fin, en móvil y escritorio.
 *
 *   npm run pookies:build && npm run pookies:preview     (en otra terminal)
 *   npm run pookies:test                                  (= BRAND=pookies URL=http://localhost:4175/)
 *
 * Sirve para cualquier carpeta de brands/ y también para la marca base
 * (BRAND=noa URL=http://localhost:4173/). No envía nada: `window.open` se
 * sustituye para capturar el enlace de WhatsApp.
 */
import { createRequire } from 'node:module'
import { loadBrand, resolveBrand } from '../../build/brand.js'

const { chromium } = createRequire(import.meta.url)('playwright')
const brandId = resolveBrand(process.env.BRAND)
const URL_ = process.env.URL || (brandId === 'noa' ? 'http://localhost:4173/' : 'http://localhost:4175/')
const { site, products, categories, heroProducts, heroThemes } = await loadBrand(brandId)

const results = []
const errors = []
const check = (suite, name, pass, detail = '') => {
  results.push({ suite, name, pass: Boolean(pass), detail })
  if (!pass) process.exitCode = 1
}
const text = async (locator) => (await locator.textContent())?.trim() ?? ''
const squash = (s) => s.replace(/\s/g, '')
const money = (value) => `${site.currency.symbol}${value.toFixed(2).replace('.', site.currency.decimal ?? '.')}`
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`
}

async function run(browser, suite, options) {
  const context = await browser.newContext({ locale: 'es-VE', ...options })
  await context.addInitScript(() => {
    window.__opened = []
    window.open = (url) => {
      window.__opened.push(String(url))
      return { opener: null, closed: false }
    }
  })
  const page = await context.newPage()
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${suite}] ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`[${suite}] ${e.message}`))
  await page.goto(URL_, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  const viewport = page.viewportSize()

  // --- Identidad
  check(suite, 'El título de la página lleva el nombre de la marca', (await page.title()).includes(site.name), await page.title())
  check(suite, 'La cabecera nombra a la marca', (await text(page.locator('.site-brand'))).includes(site.name))
  const demoBar = await page.locator('.demo-bar').count()
  check(suite, site.demo ? 'Se avisa de que es una propuesta, no la tienda oficial' : 'No hay aviso de demostración', site.demo ? demoBar === 1 : demoBar === 0)
  if (site.preview) {
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    check(suite, 'La vista previa no se indexa en buscadores', /noindex/.test(robots ?? ''), robots ?? 'sin etiqueta')
  }

  // --- Hero
  const first = heroProducts[0]
  check(suite, 'El hero abre con el primer sabor de la marca', (await text(page.locator('.hero-name'))) === first.name, await text(page.locator('.hero-name')))
  check(suite, 'El precio del hero usa su moneda', squash(await text(page.locator('.hero-sticker'))) === money(first.price), await text(page.locator('.hero-sticker')))
  check(suite, 'Hay una miniatura por sabor del hero', (await page.locator('.hero-thumb').count()) === heroProducts.length)
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.hero')).backgroundColor)
  check(suite, 'La escena usa el color de la marca', bg === rgb(heroThemes[first.hero.theme].bg), bg)
  const box = await page.getByTestId('hero-add').boundingBox()
  check(suite, 'El botón de compra está en pantalla sin hacer scroll', box && box.y + box.height <= viewport.height, JSON.stringify(box))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check(suite, 'No hay desbordamiento horizontal', overflow <= 0, `${overflow}px`)
  if (heroProducts.length > 1) {
    await page.getByRole('button', { name: 'Sabor siguiente' }).click()
    await page.waitForTimeout(1600)
    check(suite, 'La flecha pasa al siguiente sabor', (await text(page.locator('.hero-name'))) === heroProducts[1].name, await text(page.locator('.hero-name')))
  }

  // --- Catálogo
  check(suite, 'El catálogo tiene todos sus productos', (await page.locator('[data-testid^="item-"]').count()) === products.length, `${await page.locator('[data-testid^="item-"]').count()} de ${products.length}`)
  check(suite, 'El catálogo tiene todas sus categorías', (await page.locator('.shop-group').count()) === categories.length)
  const wrong = []
  for (const p of products) {
    const shown = squash(await text(page.getByTestId(`item-${p.id}`).locator('.price').first()))
    if (shown !== money(p.price)) wrong.push(`${p.name}: ${shown} ≠ ${money(p.price)}`)
  }
  check(suite, 'Cada producto muestra su precio del menú', wrong.length === 0, wrong.join(' · '))
  const broken = await page.evaluate(async () => {
    const images = [...document.querySelectorAll('.shop img')]
    images.forEach((img) => (img.loading = 'eager'))
    await Promise.all(images.map((img) => (img.complete ? null : new Promise((done) => ((img.onload = done), (img.onerror = done))))))
    return images.filter((img) => !img.naturalWidth).map((img) => img.currentSrc || img.src)
  })
  check(suite, 'Todas las fotos del catálogo cargan', broken.length === 0, broken.join(' '))

  // --- Pedido
  const buyable = products.filter((p) => p.available && !p.options)
  const [a, b] = [buyable[0], buyable[buyable.length - 1]]
  for (const p of [a, b]) {
    const add = page.getByTestId(`item-${p.id}`).getByTestId(`add-${p.id}`)
    await add.scrollIntoViewIfNeeded()
    await add.click()
    await page.waitForTimeout(500)
  }
  await page.locator('[data-cart-target]:visible').last().click()
  await page.waitForTimeout(800)
  const dialog = page.locator('dialog.sheet--side')
  const subtotal = a.id === b.id ? a.price * 2 : a.price + b.price
  check(suite, 'El subtotal suma en su moneda', squash(await text(dialog.getByTestId('cart-subtotal'))) === money(subtotal), await text(dialog.getByTestId('cart-subtotal')))
  await dialog.getByTestId('checkout').click()
  await page.waitForTimeout(600)
  const ways = [site.fulfillment.pickup, site.fulfillment.delivery].filter((w) => w.enabled)
  check(suite, 'Las formas de entrega son las de la marca', (await dialog.locator('.segmented-option').count()) === (ways.length > 1 ? ways.length : 0))
  await dialog.locator('#name').fill('Ana Pérez')
  await dialog.locator('#phone').fill('0412 555 0000')
  if (await dialog.locator('#address').count()) await dialog.locator('#address').fill('Av. Principal, edificio Sol, apto 4')
  await dialog.getByTestId('send-order').click()
  await page.waitForTimeout(900)
  const sent = await text(dialog.getByTestId('sent'))
  const opened = await page.evaluate(() => window.__opened)
  check(suite, 'El mensaje del pedido saluda a la marca', sent.includes(`¡Hola, ${site.shortName}!`) || opened.some((u) => decodeURIComponent(u).includes(`¡Hola, ${site.shortName}!`)))
  if (site.demo) {
    check(suite, 'En demostración no se abre WhatsApp ni se envía nada', opened.length === 0 && /no se envió nada/i.test(sent), opened.join(' '))
  }
  await context.close()
}

const browser = await chromium.launch()
await run(browser, 'Móvil', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await run(browser, 'Escritorio', { viewport: { width: 1440, height: 900 } })
await browser.close()
check('General', 'Sin errores en la consola del navegador', errors.length === 0, [...new Set(errors)].join(' | '))

console.log(`\nMarca: ${site.name} (${brandId}) · ${URL_}`)
let suite = ''
for (const r of results) {
  if (r.suite !== suite) console.log(`\n${(suite = r.suite)}`)
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${!r.pass && r.detail ? `  →  ${r.detail}` : ''}`)
}
const passed = results.filter((r) => r.pass).length
console.log(`\n${passed}/${results.length} comprobaciones superadas`)
