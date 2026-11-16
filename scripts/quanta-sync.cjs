// Recolector de solo lectura del portal de estudiantes de Quanta.
// Uso: Q_USER=correo Q_PASS=contraseña node scripts/quanta-sync.cjs
// Las credenciales se leen solo de variables de entorno y nunca se guardan.
// Los datos se escriben en private/ (excluida de git): contienen datos personales.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://student.somosquanta.com';
const OUT = path.join(__dirname, '..', 'private');
const MAX_PAGES = 60;

(async () => {
  const { Q_USER, Q_PASS } = process.env;
  if (!Q_USER || !Q_PASS) throw new Error('Faltan Q_USER y Q_PASS');
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const responses = [];
  let loggedIn = false;

  // Tras iniciar sesión, solo se permiten lecturas: cualquier POST/PUT/PATCH/DELETE
  // se bloquea para no entregar, editar ni marcar nada en la cuenta.
  await page.route('**/*', (route) => {
    const m = route.request().method();
    if (loggedIn && !['GET', 'HEAD', 'OPTIONS'].includes(m)) {
      console.log('bloqueado', m, route.request().url());
      return route.abort();
    }
    return route.continue();
  });

  page.on('response', async (r) => {
    const type = r.headers()['content-type'] || '';
    if (!type.includes('json') || r.request().method() !== 'GET') return;
    const url = new URL(r.url());
    if (/auth|branding|build-vigente|preferences/.test(url.pathname)) return;
    try { responses.push({ url: url.pathname + url.search, status: r.status(), body: await r.json() }); } catch {}
  });

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#username', { timeout: 30000 });
  await page.fill('#username', Q_USER);
  await page.fill('#password', Q_PASS);
  await page.press('#password', 'Enter');
  await page.waitForTimeout(8000);

  if (page.url().includes('nueva-clave')) {
    console.log('Quanta pide cambiar la contraseña antes de continuar. Cámbiala tú y vuelve a ejecutar.');
    return browser.close();
  }
  if (await page.$('#password')) {
    console.log('No se pudo iniciar sesión: revisa el correo y la contraseña.');
    return browser.close();
  }
  loggedIn = true;
  console.log('Sesión iniciada:', page.url());

  // Recorre las pantallas del portal siguiendo los enlaces internos.
  const queue = [page.url()];
  const visited = new Set();
  const pages = [];
  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3500);
    } catch (e) { console.log('error', url, e.message); continue; }
    const text = (await page.innerText('body')).replace(/\n{2,}/g, '\n');
    const files = await page.$$eval('a[href]', (as) => as
      .filter((a) => /\.(pdf|docx?|pptx?|xlsx?|png|jpe?g)(\?|$)|download|archivo|adjunto/i.test(a.href))
      .map((a) => ({ name: a.innerText.trim(), href: a.href })));
    pages.push({ url, title: await page.title(), text, files });
    console.log('página', visited.size, url);
    const links = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
    for (const l of links) {
      const u = new URL(l);
      if (u.origin === BASE && !/logout|salir|cerrar/i.test(u.pathname)) {
        u.hash = '';
        if (!visited.has(u.href)) queue.push(u.href);
      }
    }
  }

  fs.writeFileSync(path.join(OUT, 'quanta-raw.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), pages, responses }, null, 2));
  console.log(`Listo: ${pages.length} páginas, ${responses.length} respuestas de datos → private/quanta-raw.json`);
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
