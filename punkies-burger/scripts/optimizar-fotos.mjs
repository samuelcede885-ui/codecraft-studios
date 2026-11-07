// Genera las versiones web (WebP responsive + placeholder borroso) a partir de las fotos maestras en /fotos.
// Uso: npm run fotos
import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'fotos');
const OUT = path.join(ROOT, 'public', 'img');
const MANIFEST = path.join(ROOT, 'src', 'data', 'photo-manifest.json');
const WIDTHS = [480, 800, 1200];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => f.endsWith('.jpg')).sort();
const manifest = {};

for (const file of files) {
  const id = file.replace(/\.jpg$/, '');
  const input = sharp(path.join(SRC, file));
  const { width, height } = await input.metadata();
  const widths = WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, 1200));
  const unique = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of unique) {
    await sharp(path.join(SRC, file))
      .resize({ width: w })
      .webp({ quality: 76, effort: 6 })
      .toFile(path.join(OUT, `${id}-${w}.webp`));
  }
  const lqip = await sharp(path.join(SRC, file)).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[id] = {
    width,
    height,
    widths: unique,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
  console.log(id, unique.join(','));
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${files.length} fotos → public/img + src/data/photo-manifest.json`);
