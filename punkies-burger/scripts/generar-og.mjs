// Genera public/og-image.jpg (1200×630) y public/apple-touch-icon.png (180×180)
// con la foto real, la firma original y las fuentes del sitio. Uso: node scripts/generar-og.mjs
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require('playwright');
} catch {
  pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const ROOT = path.resolve(import.meta.dirname, '..');
const marks = readFileSync(path.join(ROOT, 'src/components/brand/marks.ts'), 'utf8');
const grab = (name) => {
  const m = marks.match(new RegExp(`${name} = \\{ viewBox: '([^']+)', d: '([^']+)' \\}`));
  return { viewBox: m[1], d: m[2] };
};
const LOGO = grab('LOGO');
const STARS = grab('STARS');
const zero = (vb) => `0 0 ${vb.split(' ').slice(2).join(' ')}`;
// Se incrustan como data URI: una página creada con setContent no puede leer file://
const dataUri = (file, mime) => `data:${mime};base64,${readFileSync(path.join(ROOT, file)).toString('base64')}`;
const font = dataUri('node_modules/@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2', 'font/woff2');
const photo = dataUri('public/img/clasica-cerca-800.webp', 'image/webp');
const svg = (m, color, style = '') =>
  `<svg viewBox="${m.viewBox}" style="${style}"><path fill="${color}" fill-rule="evenodd" d="${m.d}"/></svg>`;

const og = `<!doctype html><html><head><style>
@font-face{font-family:Inter;src:url(${font}) format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#1a0c09;font-family:Inter;overflow:hidden;position:relative}
h1{position:absolute;left:64px;top:150px;color:#f3efc3;font-weight:900;font-size:118px;line-height:.86;letter-spacing:-.045em}
.print{position:absolute;right:70px;top:46px;width:430px;padding:12px;background:#f3efc3;border-radius:4px;transform:rotate(2.5deg)}
.print img{display:block;width:100%;height:520px;object-fit:cover;object-position:50% 62%}
.seal{position:absolute;right:430px;top:30px;width:170px;height:170px;border-radius:50%;background:#f3efc3;transform:rotate(-9deg);box-shadow:0 0 0 6px #1a0c09}
.seal:before{content:'';position:absolute;inset:8px;border:3px solid #1a0c09;border-radius:50%}
.seal svg{position:absolute;left:50%;top:50%;width:64%;transform:translate(-50%,-50%)}
.tag{position:absolute;left:64px;top:70px;display:flex;gap:10px}
p{position:absolute;left:66px;bottom:58px;color:#f3efc3;opacity:.85;font-size:30px;font-weight:500;letter-spacing:-.015em}
</style></head><body>
<div class="tag">${svg(STARS, '#8f2924', 'height:44px')}</div>
<h1>Aplastada.<br>Dorada.<br>Tuya.</h1>
<p>Smash burgers de barrio · Chacao, Caracas</p>
<div class="print"><img src="${photo}"></div>
<div class="seal">${svg(LOGO, '#8f2924')}</div>
</body></html>`;

const icon = `<!doctype html><html><head><style>*{margin:0}body{width:180px;height:180px;background:#f3efc3;position:relative}
.r{position:absolute;inset:10px;border:5px solid #1a0c09;border-radius:50%}
svg{position:absolute;left:50%;top:50%;width:132px;transform:translate(-50%,-50%)}</style></head>
<body><div class="r"></div>${svg(LOGO, '#8f2924')}</body></html>`;

const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(og, { waitUntil: 'load' });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode()));
});
await page.screenshot({ path: path.join(ROOT, 'public/og-image.jpg'), type: 'jpeg', quality: 86 });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(icon);
await page.screenshot({ path: path.join(ROOT, 'public/apple-touch-icon.png') });
await browser.close();
console.log('public/og-image.jpg + public/apple-touch-icon.png');
