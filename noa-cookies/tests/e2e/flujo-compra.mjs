/**
 * Prueba de extremo a extremo del flujo de compra, en escritorio y móvil.
 *
 *   npm run build && npm run preview      (en otra terminal)
 *   npm run test:e2e                      (URL por defecto: http://localhost:4173/)
 *
 * Requiere Playwright (`npm i -D playwright && npx playwright install chromium`).
 * No envía nada: `window.open` se sustituye para capturar el enlace de WhatsApp.
 */
import { createRequire } from 'node:module'

const { chromium } = createRequire(import.meta.url)('playwright')
const URL_ = process.env.URL || 'http://localhost:4173/'
const results = []
const errors = []

const check = (suite, name, pass, detail = '') => {
  results.push({ suite, name, pass: Boolean(pass), detail })
  if (!pass) process.exitCode = 1
}
const text = async (locator) => (await locator.textContent())?.trim() ?? ''

async function open(browser, suite, options) {
  const context = await browser.newContext(options)
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
  await page.waitForTimeout(1500)
  return { context, page }
}

async function flow(browser, suite, options, { mobile }) {
  const { context, page } = await open(browser, suite, options)
  const viewport = page.viewportSize()
  const name = page.locator('.hero-name')
  const cta = page.getByTestId('hero-add')
  const cartTarget = page.locator('[data-cart-target]:visible').last()

  // --- Hero: se entiende y se puede comprar sin desplazarse
  check(suite, 'El hero muestra el primer sabor', (await text(name)) === 'Signature', await text(name))
  check(suite, 'El precio se ve en el hero', (await text(page.locator('.hero-sticker'))).replace(/\s/g, '') === '$4.00')
  const box = await cta.boundingBox()
  check(suite, 'El botón de compra está en pantalla sin hacer scroll', box && box.y + box.height <= viewport.height, JSON.stringify(box))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  check(suite, 'No hay desbordamiento horizontal', overflow <= 0, `${overflow}px`)

  // --- Cambio de sabor: flecha, miniatura, teclado y arrastre
  await page.getByRole('button', { name: 'Sabor siguiente' }).click()
  await page.waitForTimeout(1500)
  check(suite, 'La flecha cambia de sabor', (await text(name)) === 'Choco Lovers', await text(name))
  await page.locator('.hero-thumb[aria-label="Nutella Bomb"]').click()
  await page.waitForTimeout(1500)
  check(suite, 'La miniatura salta a ese sabor', (await text(name)) === 'Nutella Bomb', await text(name))
  await page.locator('.hero-thumb[aria-current="true"]').focus()
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(1500)
  check(suite, 'La flecha derecha del teclado avanza', (await text(name)) === 'Maní-fica', await text(name))

  const stage = await page.locator('.hero-stage').boundingBox()
  const y = stage.y + stage.height * 0.6
  await page.mouse.move(stage.x + stage.width * 0.7, y)
  await page.mouse.down()
  await page.mouse.move(stage.x + stage.width * 0.5, y + 4, { steps: 6 })
  await page.mouse.move(stage.x + stage.width * 0.2, y + 6, { steps: 6 })
  await page.mouse.up()
  await page.waitForTimeout(1600)
  check(suite, 'Arrastrar hacia la izquierda pasa al siguiente (vuelve al primero)', (await text(name)) === 'Signature', await text(name))

  // --- Paso 1: añadir (hero y catálogo, un toque cada uno)
  await cta.click()
  await page.waitForTimeout(1100)
  check(suite, 'Añadir desde el hero actualiza el pedido', /1 producto, \$4\.00/.test(await cartTarget.getAttribute('aria-label')), await cartTarget.getAttribute('aria-label'))
  if (mobile) check(suite, 'Aparece la barra inferior "Ver pedido"', await page.getByTestId('cart-bar').isVisible())

  await page.getByTestId('add-velvet').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await page.getByTestId('add-velvet').click()
  await page.waitForTimeout(900)
  check(suite, 'Un toque en "+" añade desde el catálogo', (await text(page.getByTestId('qty-velvet'))) === '1')
  check(suite, 'El "+" se convierte en contador', (await page.getByTestId('add-velvet').count()) === 0)

  await page.getByTestId('item-noa-roll').getByRole('radio', { name: 'Nutella' }).click()
  await page.getByTestId('add-noa-roll').click()
  await page.waitForTimeout(700)

  // --- Paso 2: revisar el pedido
  await page.locator('[data-cart-target]:visible').last().click()
  await page.waitForTimeout(700)
  const dialog = page.locator('dialog.sheet--side')
  check(suite, 'El pedido se abre como panel sin cambiar de página', await dialog.evaluate((d) => d.open && d.matches(':modal')))
  check(suite, 'Lista los tres productos', (await dialog.locator('.line').count()) === 3)
  check(suite, 'La variante elegida aparece en la línea', (await text(dialog.getByTestId('line-noa-roll:nutella'))).includes('Topping: Nutella'))
  check(suite, 'Subtotal correcto', (await text(dialog.getByTestId('cart-subtotal'))) === '$11.00', await text(dialog.getByTestId('cart-subtotal')))
  await dialog.getByRole('button', { name: 'Una más de Signature' }).click()
  await page.waitForTimeout(200)
  check(suite, 'Cambiar cantidades en el panel recalcula el subtotal', (await text(dialog.getByTestId('cart-subtotal'))) === '$15.00', await text(dialog.getByTestId('cart-subtotal')))

  // --- Paso 3: datos y envío
  await dialog.getByTestId('checkout').click()
  await page.waitForTimeout(500)
  await dialog.getByTestId('send-order').click()
  await page.waitForTimeout(200)
  check(suite, 'Sin datos no se envía y se explican los errores', (await dialog.locator('.field-error').count()) === 2)
  check(suite, 'El foco va al primer campo con error', await page.evaluate(() => document.activeElement?.id === 'name'))
  check(suite, 'Nada se abrió todavía', (await page.evaluate(() => window.__opened.length)) === 0)

  await dialog.locator('#name').fill('Ana Pérez')
  await dialog.locator('#phone').fill('0412 555 0000')
  await dialog.getByRole('radio', { name: 'Delivery' }).check()
  await page.waitForTimeout(300)
  check(suite, 'Elegir delivery muestra el campo de dirección', await dialog.locator('#address').isVisible())
  await dialog.getByTestId('send-order').click()
  await page.waitForTimeout(200)
  check(suite, 'La dirección es obligatoria solo con delivery', (await text(dialog.locator('.field-error'))).includes('dirección'))
  await dialog.locator('#address').fill('Av. Principal de Valle Arriba, edif. Sol, apto 4')
  check(suite, 'El costo de delivery figura como por confirmar', (await text(dialog.locator('.totals'))).includes('Por confirmar'))
  await dialog.getByTestId('send-order').click()
  await page.waitForTimeout(600)

  const opened = await page.evaluate(() => window.__opened)
  check(suite, 'Enviar abre WhatsApp una sola vez', opened.length === 1 && /^https:\/\/(wa\.link|wa\.me)\//.test(opened[0]), opened.join(' '))
  const sent = dialog.getByTestId('sent')
  check(suite, 'Explica que falta enviarlo en WhatsApp (no finge confirmación)', (await text(sent)).includes('no queda hecho hasta que lo envíes'))
  const message = await text(dialog.locator('.sent-text'))
  check(
    suite,
    'El mensaje incluye productos, entrega y datos',
    ['2 × Signature', '1 × Velvet', 'NOA Roll (topping: Nutella)', 'Subtotal: $15.00', 'delivery a Av. Principal', 'Ana Pérez'].every((s) => message.includes(s)),
    message.slice(0, 160),
  )
  check(suite, 'El pedido sigue guardado tras abrir WhatsApp', (await page.evaluate(() => JSON.parse(localStorage.getItem('noa.pedido.v1')).lines.length)) === 3)

  // --- Cerrar con Escape y persistencia al recargar
  await page.keyboard.press('Escape')
  await page.waitForTimeout(700)
  check(suite, 'Escape cierra el panel', !(await dialog.evaluate((d) => d.open)))
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  check(suite, 'El pedido persiste al recargar', /4 productos, \$15\.00/.test(await page.locator('[data-cart-target]:visible').last().getAttribute('aria-label')))

  // --- Ficha de ingredientes
  await page.getByTestId('item-signature').scrollIntoViewIfNeeded()
  const infoButton = page.getByRole('button', { name: 'Ingredientes y alérgenos de Signature' })
  await infoButton.click()
  await page.waitForTimeout(600)
  const info = page.locator('dialog.sheet--card')
  check(suite, 'La ficha abre sin salir del catálogo', (await info.evaluate((d) => d.open)) && (await text(info)).includes('Nueces'))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(600)
  check(suite, 'Al cerrar, el foco vuelve al botón que la abrió', await infoButton.evaluate((el) => el === document.activeElement))

  await context.close()
}

async function reducedMotion(browser) {
  const suite = 'Movimiento reducido'
  const { context, page } = await open(browser, suite, { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  await page.getByRole('button', { name: 'Sabor siguiente' }).click()
  await page.waitForTimeout(250)
  check(suite, 'El sabor cambia de inmediato', (await text(page.locator('.hero-name'))) === 'Choco Lovers')
  const state = await page.evaluate(() => ({
    shown: getComputedStyle(document.querySelector('[data-scene="1"][data-part="cookie"]')).visibility,
    hidden: getComputedStyle(document.querySelector('[data-scene="0"][data-part="cookie"]')).visibility,
    float: getComputedStyle(document.querySelector('.hero-cookie-float')).animationDuration,
    lenis: document.documentElement.classList.contains('lenis'),
    reveal: getComputedStyle(document.querySelector('[data-reveal-item]')).opacity,
  }))
  check(suite, 'Solo la cookie activa es visible', state.shown === 'visible' && state.hidden === 'hidden', JSON.stringify(state))
  check(suite, 'Sin animaciones en bucle ni scroll suave', parseFloat(state.float) < 0.01 && !state.lenis, JSON.stringify(state))
  check(suite, 'El catálogo es visible sin esperar animaciones', state.reveal === '1')
  await page.getByTestId('hero-add').click()
  await page.waitForTimeout(200)
  check(suite, 'Añadir funciona igual', /1 producto/.test(await page.locator('[data-cart-target]:visible').last().getAttribute('aria-label')))
  await context.close()
}

const browser = await chromium.launch()
try {
  await flow(browser, 'Escritorio 1440×900', { viewport: { width: 1440, height: 900 } }, { mobile: false })
  await flow(browser, 'Móvil 390×700', { viewport: { width: 390, height: 700 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, { mobile: true })
  await reducedMotion(browser)
} finally {
  await browser.close()
}
check('General', 'Sin errores en la consola del navegador', errors.length === 0, errors.slice(0, 3).join(' | '))

let last = ''
for (const r of results) {
  if (r.suite !== last) console.log(`\n${r.suite}`)
  last = r.suite
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.pass || !r.detail ? '' : `  →  ${r.detail}`}`)
}
const failed = results.filter((r) => !r.pass).length
console.log(`\n${results.length - failed}/${results.length} comprobaciones superadas`)
