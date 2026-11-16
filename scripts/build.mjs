// Empaqueta la app en un único HTML autónomo (dist/quanta-ai.html).
// Uso: node scripts/build.mjs   (sin dependencias)
// Con datos reales: QUANTA_DATA=private/quanta-data.js node scripts/build.mjs
//   → private/quanta-ai.html (excluido de git, contiene datos personales)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MOCK = join(root, 'src/data/mock.js');
const DATA = process.env.QUANTA_DATA ? resolve(root, process.env.QUANTA_DATA) : null;
const read = (file) => readFileSync(file === MOCK && DATA ? DATA : file, 'utf8');
const seen = new Set();
const order = [];

// Recorre los imports desde main.js y ordena los módulos por dependencia.
function visit(file) {
  if (seen.has(file)) return;
  seen.add(file);
  const src = read(file);
  for (const [, rel] of src.matchAll(/^import[^'"]*['"](.+?)['"];?$/gm)) visit(resolve(dirname(file), rel));
  order.push(file);
}
visit(join(root, 'src/main.js'));

// Cada módulo va en su propio ámbito; sus exports se publican en un registro.
const modules = order.map((file) => {
  const name = file.slice(root.length + 1);
  let src = read(file);
  const exported = [];
  src = src.replace(/^import\s*\{([^}]*)\}\s*from\s*['"](.+?)['"];?$/gm, (_, names, rel) => {
    const dep = resolve(dirname(file), rel).slice(root.length + 1);
    return `const {${names}} = __m[${JSON.stringify(dep)}];`;
  });
  src = src.replace(/^import\s*\*\s*as\s+([A-Za-z_$][\w$]*)\s+from\s*['"](.+?)['"];?$/gm, (_, ns, rel) => {
    const dep = resolve(dirname(file), rel).slice(root.length + 1);
    return `const ${ns} = __m[${JSON.stringify(dep)}];`;
  });
  src = src.replace(/^export\s+(async\s+function|function|const|let)\s+([A-Za-z_$][\w$]*)/gm, (_, kind, id) => {
    exported.push(id);
    return `${kind} ${id}`;
  });
  if (/^\s*(import|export)\s/m.test(src)) throw new Error(`Sintaxis de módulo no soportada en ${name}`);
  return `// ${name}\n__m[${JSON.stringify(name)}] = (() => {\n${src}\nreturn { ${exported.join(', ')} };\n})();`;
});

const css = readFileSync(join(root, 'styles/app.css'), 'utf8');
const body = readFileSync(join(root, 'index.html'), 'utf8').match(/<body>([\s\S]*?)<script/)[1].trim();

const html = `<meta charset="utf-8">
<title>Quanta AI</title>
<meta name="theme-color" content="#2563EB">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${css}
</style>
${body}
<script>
(() => {
const __m = {};
${modules.join('\n\n')}
})();
</script>
`;

const out = DATA ? 'private/quanta-ai.html' : 'dist/quanta-ai.html';
mkdirSync(dirname(join(root, out)), { recursive: true });
writeFileSync(join(root, out), html);
console.log(`${out} · ${order.length} módulos · ${(html.length / 1024).toFixed(1)} KB`);
