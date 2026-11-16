// Pruebas del Agente diario y de regresión de las funciones existentes.
// Uso: node scripts/build.mjs && node tests/agent.test.cjs
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
let pass = 0, fail = 0;
const ok = (n, c, e = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASA ' : 'FALLA'}  ${n}${e ? ` — ${e}` : ''}`); };

const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${base}/dist/quanta-ai.html`);

  // Regresión: todas las pantallas existentes cargan
  const screens = ['home', 'subjects', 'exams', 'profile'];
  let regOk = true;
  for (const sc of screens) { await p.click(`[data-screen="${sc}"]`); if (!(await p.locator('#screen h1,#screen .title,#screen .display').count())) regOk = false; }
  await p.click('[data-screen="subjects"]'); await p.click('[data-action="go-all"]');
  ok('Regresión: pantallas y navegación existentes cargan', regOk && (await p.locator('article').count()) > 0);

  // Preparar ahora
  await p.click('[data-screen="profile"]'); await p.click('[data-action="go-agent"]');
  ok('Agente: la vista se abre desde el perfil', (await p.innerText('#screen')).includes('Agente diario'));
  await p.click('[data-action="agent-run"]'); await p.waitForTimeout(400);
  const n1 = await p.locator('#screen article').count();
  ok('Agente: «Preparar ahora» genera borradores', n1 > 0, `${n1} borradores`);

  // Idempotencia
  await p.click('[data-action="agent-run"]'); await p.waitForTimeout(400);
  const n2 = await p.locator('#screen article').count();
  ok('Agente: preparar otra vez no duplica', n1 === n2, `${n1} → ${n2}`);

  // Ver y copiar
  await p.locator('[data-action="agent-view"]').first().click();
  await p.waitForSelector('[data-action="copy-prompt"]');
  ok('Agente: «Ver y copiar» abre el material de Estudiante Pro', (await p.innerText('#sheet')).includes('Estudiante Pro'));
  await p.click('#sheet .close'); await p.waitForTimeout(300);

  // Marcar revisado
  const firstId = await p.locator('[data-action="agent-review"]').first().getAttribute('data-id');
  await p.locator('[data-action="agent-review"]').first().click(); await p.waitForTimeout(300);
  ok('Agente: marca «revisado» y lo recuerda', (await p.innerText('#screen')).includes('Revisado'));

  // Persistencia tras recargar
  await p.reload(); await p.waitForTimeout(400);
  await p.click('[data-screen="profile"]'); await p.click('[data-action="go-agent"]');
  ok('Agente: los borradores persisten al recargar', (await p.locator('#screen article').count()) === n1);
  ok('Agente: el estado «revisado» persiste', (await p.innerText('#screen')).includes('Revisado'));

  // No marca entrega en ninguna parte
  const body = await p.evaluate(() => JSON.stringify(localStorage));
  ok('Agente: nunca marca una tarea como entregada en Quanta', !/submitted|entregad[oa] en Quanta|"delivered"/i.test(body));

  // Las pruebas (evaluaciones) reciben guía de estudio, no respuestas
  await p.click('[data-screen="exams"]');
  const examCount = await p.locator('#screen article').count();
  await p.click('[data-screen="profile"]'); await p.click('[data-action="go-agent"]');
  const txt = await p.innerText('#screen');
  ok('Agente: las pruebas se preparan como guía de estudio', txt.includes('guía de estudio') || examCount === 0);

  // Funciones previas intactas: PIN y Estudiante Pro siguen
  await p.click('[data-screen="profile"]');
  ok('Regresión: el bloqueo con PIN sigue disponible', (await p.locator('[data-action="pin-setup"]').count()) === 1);
  ok('Regresión: Estudiante Pro sigue disponible', (await p.locator('[data-action="prefs"]').count()) === 1);
  ok('Sin errores de JavaScript', errs.length === 0, errs.join('; '));

  await browser.close();
  server.close();
  console.log(`\n${pass} pasan, ${fail} fallan`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
