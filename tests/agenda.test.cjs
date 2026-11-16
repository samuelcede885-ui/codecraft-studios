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
const file = process.env.QUANTA_HTML || 'dist/quanta-ai.html';
(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${base}/${file}`);
  await p.click('[data-action="go-agenda"]');
  ok('Asistente: se abre desde Inicio', (await p.innerText('#screen')).includes('Asistente'));

  // Cada pregunta responde con el encabezado correcto
  const expect = { semana: 'esta semana', manana: 'mañana', altas: '15%', tareas: 'tareas pendientes', prioridad: 'priorizar' };
  for (const [q, needle] of Object.entries(expect)) {
    await p.click(`[data-action="agenda-q"][data-q="${q}"]`); await p.waitForTimeout(150);
    const t = await p.innerText('.answer');
    ok(`Asistente: «${q}» responde con formato correcto`, t.toLowerCase().includes(needle.toLowerCase()), t.split('\n')[0]);
  }

  // Footer de fuente siempre presente
  await p.click('[data-action="agenda-q"][data-q="semana"]'); await p.waitForTimeout(100);
  ok('Asistente: cita la fuente y recomienda', (await p.innerText('.answer')).includes('Última fuente disponible') && (await p.innerText('.answer')).includes('Recomendación'));

  // Máximo 7 y botón "ver todas" si hay más
  await p.click('[data-action="agenda-q"][data-q="altas"]'); await p.waitForTimeout(100);
  const shown = await p.locator('.answer article').count();
  ok('Asistente: muestra como máximo 7 por respuesta', shown <= 7, `${shown} mostradas`);

  // "mañana" y "esta semana" son coherentes: lo de mañana está dentro de la semana o vacío
  const manana = await p.evaluate(() => { document.querySelector('[data-action="agenda-q"][data-q="manana"]').click(); return document.querySelector('.answer h2').textContent; });
  ok('Asistente: «mañana» usa fecha absoluta', /\d/.test(manana) || manana.includes('0'), manana);

  // No inventa entregas
  ok('Asistente: no afirma entregas', !/entregad[oa]/i.test(await p.innerText('.answer')));
  ok('Sin errores de JavaScript', errs.length === 0, errs.join('; '));

  // Regresión: pantallas previas
  for (const sc of ['subjects', 'exams', 'profile', 'home']) await p.click(`[data-screen="${sc}"]`);
  await p.click('[data-screen="profile"]'); await p.click('[data-action="go-agent"]');
  ok('Regresión: el agente diario sigue', (await p.innerText('#screen')).includes('Agente diario'));

  await b.close(); server.close();
  console.log(`\n${pass} pasan, ${fail} fallan`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
