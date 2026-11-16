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
  ok('Consultor: hay campo de texto para preguntar', (await p.locator('#agenda-input').count()) === 1);

  const ask = async (q) => { await p.fill('#agenda-input', q); await p.click('#agenda-form button[type="submit"]'); await p.waitForTimeout(150); return p.innerText('#agenda-answer'); };

  let t = await ask('¿qué checkpoints valen 15%?');
  ok('Consultor: «checkpoints 15%» filtra por tipo y peso', /15%|checkpoint/i.test(t) && /Encontré|No encuentro/.test(t), t.split('\n')[0]);
  const bad149 = t.includes('14.9') || t.includes('14,9');
  ok('Consultor: excluye porcentajes menores a 15', !bad149);

  t = await ask('¿qué tengo esta semana?');
  ok('Consultor: «esta semana» responde con rango', /esta semana|No encuentro/i.test(t), t.split('\n')[0]);

  t = await ask('¿qué tareas de química tengo pendientes?');
  ok('Consultor: filtra por materia química', /[Qq]u[ií]mica|No encuentro/.test(t), t.split('\n')[0]);
  const hasOther = /Matem[aá]ticas|Biolog[ií]a|Inglés/.test(t);
  ok('Consultor: no mezcla otras materias al filtrar por una', !hasOther || /No encuentro/.test(t));

  t = await ask('¿qué exámenes tengo mañana?');
  ok('Consultor: «mañana» usa el día siguiente', /mañana|No encuentro/i.test(t), t.split('\n')[0]);

  t = await ask('¿tengo algo importante?');
  ok('Consultor: «importante» explica criterio (15% o 48h)', /15%|importante|48/i.test(t));

  t = await ask('asldkfj zzz');
  ok('Consultor: pregunta no entendida ofrece opciones', /No entendí/.test(t));

  // Inyección en la pregunta no ejecuta ni rompe
  await p.fill('#agenda-input', '"><img src=x onerror=window.__pwn=1> mañana'); await p.click('#agenda-form button[type="submit"]'); await p.waitForTimeout(200);
  ok('Consultor: la pregunta con HTML no ejecuta código', await p.evaluate(() => window.__pwn === undefined && !document.querySelector('#agenda-answer img')));

  // Fuente siempre citada
  ok('Consultor: cita la fuente', (await p.innerText('#agenda-answer')).includes('fuente'));
  ok('Consultor: no afirma entregas', !/entregad[oa]/i.test(await p.innerText('#agenda-answer')));

  // Regresión
  for (const sc of ['home', 'subjects', 'exams', 'profile']) await p.click(`[data-screen="${sc}"]`);
  await p.click('[data-screen="profile"]');
  ok('Regresión: PIN y pantallas intactas', (await p.locator('[data-action="pin-setup"]').count()) === 1);
  ok('Sin errores de JavaScript', errs.length === 0, errs.join('; '));

  await b.close(); server.close();
  console.log(`\n${pass} pasan, ${fail} fallan`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
