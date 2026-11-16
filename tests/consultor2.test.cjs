// Pruebas de los accesos rápidos añadidos y la redacción honesta.
const { chromium } = require('playwright');
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };
let pass = 0, fail = 0;
const ok = (n, c, e = '') => { c ? pass++ : fail++; console.log(`${c ? 'PASA ' : 'FALLA'}  ${n}${e ? ` — ${e}` : ''}`); };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
const file = process.env.QUANTA_HTML || 'private/quanta-ai.html';
(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${base}/${file}`);
  await p.click('[data-action="go-agenda"]');

  await p.click('[data-action="agenda-q"][data-q="examenes"]'); await p.waitForTimeout(150);
  ok('Acceso rápido «Próximos exámenes» responde', /evaluacion|evaluaciones/i.test(await p.innerText('#agenda-answer')));

  await p.click('[data-action="agenda-q"][data-q="checkpoints"]'); await p.waitForTimeout(150);
  let t = await p.innerText('#agenda-answer');
  ok('Acceso rápido «Checkpoints 15%» es honesto si no hay', /checkpoint/i.test(t) && (/15%/.test(t) || /menor peso/.test(t)), t.split('\n')[0]);

  // Redacción: "No figura" en vez de "no existe/no tienes"
  await p.fill('#agenda-input', 'exámenes de arte mañana'); await p.click('#agenda-form button[type="submit"]'); await p.waitForTimeout(150);
  t = await p.innerText('#agenda-answer');
  ok('Redacción honesta: usa «No figura» cuando no hay', /No figura/.test(t) || /No entendí/.test(t), t.split('\n')[0]);

  // Fuente dice datos importados / comprobado
  await p.click('[data-action="agenda-q"][data-q="semana"]'); await p.waitForTimeout(150);
  ok('Fuente indica datos importados y comprobado', /datos importados/i.test(await p.innerText('#agenda-answer')));

  // No afirma haber entrado a Quanta
  ok('No afirma haber consultado Quanta en vivo', !/Quanta \(navegador/.test(await p.innerText('#agenda-answer')) && !/verificado en Quanta/i.test(await p.innerText('#agenda-answer')));
  ok('Sin errores de JavaScript', errs.length === 0, errs.join('; '));

  await b.close(); server.close();
  console.log(`\n${pass} pasan, ${fail} fallan`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
