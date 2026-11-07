// Prueba de punta a punta del sitio (escritorio + móvil) con Playwright.
// Uso: npm run build && npx vite preview --port 4173 &  →  npm run e2e
// Variables: BASE_URL (por defecto http://localhost:4173/), SHOTS (carpeta para capturas, opcional)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const { chromium } = playwright;

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const SHOTS = process.env.SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(['PASS', name]);
  } catch (e) {
    results.push(['FAIL', name, String(e?.message ?? e).split('\n')[0]]);
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const shot = async (page, name) => SHOTS && page.screenshot({ path: path.join(SHOTS, `${name}.png`) });

const browser = await chromium.launch();

/* ── Escritorio ───────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && !/maps|google|ERR_FAILED/i.test(m.text()) && errors.push(m.text()));
  await page.route(/google\.com|gstatic|googleapis/, (r) => r.abort());
  await page.goto(BASE, { waitUntil: 'networkidle' });

  await check('Escritorio: carga sin errores y el h1 es “Aplastada. Dorada. Tuya.”', async () => {
    const h1 = (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim();
    assert(h1 === 'Aplastada. Dorada. Tuya.', `h1 = "${h1}"`);
    assert(errors.length === 0, `errores: ${errors.join(' | ')}`);
  });

  await check('Escritorio: sin desbordamiento horizontal', async () => {
    const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(o <= 0, `desborda ${o}px`);
  });

  await check('Escritorio: el logo del header es el SVG original completo (no texto)', async () => {
    const box = await page.locator('header a[aria-label^="Punkie"] svg').boundingBox();
    assert(box && box.width > 100 && box.height >= 36, JSON.stringify(box));
  });

  const cartBtn = page.locator('header button[aria-label^="Ver tu pedido"]');

  await check('Añadir producto sin opciones: aviso + contador', async () => {
    await page.getByRole('button', { name: 'Añadir Papas sazonadas al pedido' }).click();
    await page.getByText('Papas sazonadas está en tu pedido.').waitFor({ timeout: 3000 });
    const label = await cartBtn.getAttribute('aria-label');
    assert(label.includes('1 producto'), label);
  });

  await check('Ficha de producto: opciones, cantidad y añadir', async () => {
    await page.getByRole('button', { name: 'Elegir opciones de La Clásica' }).click();
    const dialog = page.getByRole('dialog', { name: 'La Clásica' });
    await dialog.waitFor();
    await page.waitForTimeout(400);
    await shot(page, 'desk-ficha');
    const focusedInside = await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'));
    assert(focusedInside, 'el foco no está dentro del diálogo');
    await dialog.getByText('En combo').click();
    await dialog.getByRole('button', { name: 'Sumar uno' }).click();
    assert((await dialog.locator('output').innerText()) === '2', 'cantidad no es 2');
    await dialog.getByRole('button', { name: /Añadir al pedido/ }).click();
    await dialog.waitFor({ state: 'detached' });
    const label = await cartBtn.getAttribute('aria-label');
    assert(label.includes('3 productos'), label);
  });

  await check('Escape cierra la ficha y devuelve el foco', async () => {
    const opener = page.getByRole('button', { name: "La Punkie's", exact: true });
    await opener.click();
    await page.getByRole('dialog').waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    const name = await page.evaluate(() => document.activeElement?.textContent?.trim());
    assert(name === "La Punkie's", `foco en "${name}"`);
  });

  await check('Carrito: líneas, subtotal honesto, cambiar cantidad y quitar', async () => {
    await cartBtn.click();
    const drawer = page.getByRole('dialog', { name: 'Tu pedido' });
    await drawer.waitFor();
    await page.waitForTimeout(450);
    await shot(page, 'desk-carrito');
    const items = drawer.getByRole('list', { name: 'Productos en tu pedido' }).getByRole('listitem');
    assert((await items.count()) === 2, `líneas: ${await items.count()}`);
    assert(await drawer.getByText('Por confirmar', { exact: true }).isVisible(), 'subtotal no dice "Por confirmar"');
    await items.filter({ hasText: 'Papas sazonadas' }).getByRole('button', { name: 'Sumar uno' }).click();
    assert((await items.filter({ hasText: 'Papas sazonadas' }).locator('output').innerText()) === '2', 'cantidad papas');
    await drawer.getByRole('button', { name: 'Quitar La Clásica (En combo) del pedido' }).click();
    assert((await items.count()) === 1, 'no se quitó la línea');
  });

  await check('Checkout: validación con errores accesibles', async () => {
    const drawer = page.getByRole('dialog');
    await drawer.getByRole('button', { name: 'Continuar' }).click();
    await drawer.getByRole('button', { name: 'Revisar pedido' }).click();
    const invalid = await drawer.locator('[aria-invalid="true"]').count();
    assert(invalid >= 3, `campos inválidos: ${invalid}`);
    const focused = await page.evaluate(() => document.activeElement?.id);
    assert(focused === 'f-name', `foco en ${focused}`);
    await shot(page, 'desk-checkout-errores');
  });

  await check('Checkout: datos válidos → confirmar', async () => {
    const drawer = page.getByRole('dialog');
    await drawer.getByLabel('Nombre').fill('Ana Prueba');
    await drawer.getByLabel('Teléfono').fill('0414 123 4567');
    await drawer.getByLabel('Dirección de entrega').fill('Av. Principal de Chacao, Edif. Sol, piso 3');
    await drawer.getByLabel('Observaciones (opcional)').fill('Sin cebolla');
    await drawer.getByRole('button', { name: 'Revisar pedido' }).click();
    await page.getByRole('dialog', { name: 'Confirmar' }).waitFor();
    assert(await drawer.getByText('Ana Prueba').isVisible(), 'resumen sin nombre');
  });

  await check('Sin canal configurado: no se finge el envío ni existe enlace a WhatsApp', async () => {
    const drawer = page.getByRole('dialog');
    assert(await drawer.getByText('Tu pedido todavía no se ha enviado.').isVisible(), 'falta aviso');
    assert((await page.locator('a[href*="wa.me"]').count()) === 0, 'hay un enlace a wa.me');
    await shot(page, 'desk-confirmar');
  });

  await check('Copiar pedido: el texto copiado es el pedido real', async () => {
    const drawer = page.getByRole('dialog');
    await drawer.getByRole('button', { name: 'Copiar pedido' }).click();
    await drawer.getByRole('button', { name: 'Pedido copiado' }).waitFor({ timeout: 3000 });
    const text = await page.evaluate(() => navigator.clipboard.readText());
    assert(text.includes('• 2 × Papas sazonadas — precio por confirmar'), text);
    assert(text.includes('Entrega: Delivery') && text.includes('Observaciones: Sin cebolla'), text);
  });

  await check('El pedido persiste al recargar', async () => {
    await page.keyboard.press('Escape');
    await page.reload({ waitUntil: 'networkidle' });
    const label = await cartBtn.getAttribute('aria-label');
    assert(label.includes('2 productos'), label);
  });

  await check('Modo revisión (?revision) marca los datos pendientes', async () => {
    await page.goto(`${BASE}?revision`, { waitUntil: 'networkidle' });
    const n = await page.locator('[data-pendiente]').count();
    const style = await page.locator('[data-pendiente]').first().evaluate((el) => getComputedStyle(el).outlineStyle);
    assert(n >= 8 && style === 'dashed', `pendientes: ${n}, outline: ${style}`);
  });

  await check('Teclado: el primer Tab enfoca “Saltar al menú”', async () => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    const t = await page.evaluate(() => document.activeElement?.textContent?.trim());
    assert(t === 'Saltar al menú', `foco: ${t}`);
  });

  await ctx.close();
}

/* ── Móvil ────────────────────────────────────────────────── */
for (const width of [390, 360]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.route(/google\.com|gstatic|googleapis/, (r) => r.abort());
  await page.goto(BASE, { waitUntil: 'networkidle' });

  await check(`Móvil ${width}px: sin desbordamiento horizontal ni textos cortados en h1/h2`, async () => {
    const r = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const cut = [...document.querySelectorAll('h1, h2, h3')].filter((h) => h.scrollWidth > h.clientWidth + 1).map((h) => h.textContent.trim().slice(0, 30));
      return { over, cut };
    });
    assert(r.over <= 0 && r.cut.length === 0, JSON.stringify(r));
  });

  await check(`Móvil ${width}px: objetivos táctiles ≥ 40px`, async () => {
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, a.inline-flex, a[class*="min-h"]')]
        .filter((el) => el.offsetParent !== null)
        // botones "stretched": su ::after cubre toda la tarjeta, el objetivo real es la tarjeta
        .filter((el) => !String(el.className).includes('after:absolute'))
        .map((el) => ({ t: (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 30), r: el.getBoundingClientRect() }))
        .filter((x) => x.r.width > 0 && (x.r.height < 40 || x.r.width < 40))
        .map((x) => `${x.t} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`),
    );
    assert(small.length === 0, small.join(', '));
  });

  if (width === 390) {
    await check('Móvil: menú hamburguesa navega y se cierra', async () => {
      await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
      const dlg = page.getByRole('dialog', { name: 'Menú de navegación' });
      await dlg.waitFor();
      await page.waitForTimeout(350);
      await shot(page, 'mob-menu');
      await dlg.getByRole('link', { name: 'Ubicación' }).click();
      await dlg.waitFor({ state: 'detached' });
      await page.waitForTimeout(900);
      const top = await page.evaluate(() => document.getElementById('ubicacion').getBoundingClientRect().top);
      assert(top < 200 && top > -50, `top ${top}`);
    });

    await check('Móvil: barra “Ver pedido” y ficha como hoja inferior', async () => {
      await page.evaluate(() => document.getElementById('menu').scrollIntoView());
      await page.getByRole('button', { name: 'Añadir Papas sazonadas al pedido' }).click();
      const bar = page.getByRole('button', { name: /Ver pedido/ }).last();
      await bar.waitFor();
      await page.waitForTimeout(400);
      await shot(page, 'mob-barra-pedido');
      await page.getByRole('button', { name: 'Elegir opciones de Cheeseburger' }).click();
      const dlg = page.getByRole('dialog', { name: 'Cheeseburger' });
      await dlg.waitFor();
      await page.waitForTimeout(450);
      const b = await dlg.boundingBox();
      assert(b.y + b.height <= 800 + 1 && b.width <= 390, JSON.stringify(b));
      await shot(page, 'mob-ficha');
      await dlg.getByRole('button', { name: /Añadir al pedido/ }).click();
      await page.getByRole('button', { name: /Ver pedido/ }).last().click();
      await page.getByRole('dialog', { name: 'Tu pedido' }).waitFor();
      await page.waitForTimeout(450);
      await shot(page, 'mob-carrito');
    });
  }
  await ctx.close();
}

/* ── Laptop y tablet ──────────────────────────────────────── */
for (const [w, h] of [[1280, 800], [1024, 768], [768, 1024]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.route(/google\.com|gstatic|googleapis/, (r) => r.abort());
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await check(`${w}px: sin desbordamiento horizontal`, async () => {
    const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(o <= 0, `desborda ${o}px`);
  });
  await ctx.close();
}

/* ── Reduced motion ───────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.route(/google\.com|gstatic|googleapis/, (r) => r.abort());
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await check('Reduced motion: fotos visibles sin animar y cinta detenida', async () => {
    const r = await page.evaluate(() => ({
      hidden: [...document.querySelectorAll('.reveal')].filter((el) => getComputedStyle(el).opacity !== '1').length,
      cinta: getComputedStyle(document.querySelector('.cinta-track')).animationName,
      hero: getComputedStyle(document.querySelector('.hero-word')).animationName,
    }));
    assert(r.hidden === 0 && r.cinta === 'none' && r.hero === 'none', JSON.stringify(r));
  });
  await ctx.close();
}

await browser.close();

const pad = Math.max(...results.map((r) => r[1].length));
for (const [status, name, detail] of results) console.log(`${status === 'PASS' ? '✔' : '✘'} ${status}  ${name.padEnd(pad)}${detail ? `  → ${detail}` : ''}`);
const failed = results.filter((r) => r[0] === 'FAIL').length;
console.log(`\n${results.length - failed}/${results.length} comprobaciones OK`);
process.exit(failed ? 1 : 0);
