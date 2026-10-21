/**
 * Graba las bobinas (navegación simulada por las pantallas HTML) a video, fotograma a fotograma.
 *
 *   npm run dev                       # la página /grabar solo existe en desarrollo
 *   node scripts/record-reels.mjs [gramercy panel-de-metricas …]
 *
 * Requiere Playwright y ffmpeg (con libx264, libvpx-vp9 y libwebp). Si Playwright no está
 * en el proyecto, indicar su módulo con PLAYWRIGHT_MODULE=/ruta/a/playwright/index.mjs.
 * Escribe en public/projects/<slug>/: preview.mp4/.webm, full.mp4/.webm (gramercy),
 * gallery-*.webp y, si hay recorrido completo, poster.webp (su primer fotograma).
 * Las miniaturas (thumb.webp) son las portadas diseñadas: scripts/record-covers.mjs.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const FPS = 30;
const OUT = join(process.cwd(), "public/projects");

/** Qué produce cada bobina. Tiempos en segundos de la bobina. */
const plans = {
  gramercy: {
    full: true,
    // Preview del catálogo: producto y carrito.
    preview: { from: 6.9, to: 17.3 },
    gallery: [2.4, 10.8, 16.2, 21.4, 26.4],
  },
  "panel-de-metricas": { gallery: [5.6] },
  "asistente-de-reservas": { gallery: [5.6] },
  "norte-estudio": { gallery: [5.0] },
};

const ffmpeg = (...args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

function encode(frames, out, { from, to } = {}) {
  const trim = from === undefined ? [] : ["-ss", String(from), "-to", String(to)];
  const fade =
    from === undefined
      ? []
      : ["-vf", `scale=1280:720:flags=lanczos,fade=t=in:st=0:d=0.3:color=white,fade=t=out:st=${(to - from - 0.3).toFixed(2)}:d=0.3:color=white`];
  const scale = fade.length ? fade : ["-vf", "scale=1280:720:flags=lanczos"];
  const input = ["-framerate", String(FPS), "-i", join(frames, "%05d.jpg"), ...trim];
  ffmpeg(...input, ...scale, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${out}.mp4`);
  ffmpeg(...input, ...scale, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", `${out}.webm`);
}

const still = (png, out, width = 1280) =>
  ffmpeg("-i", png, "-vf", `scale=${width}:-1:flags=lanczos`, "-c:v", "libwebp", "-quality", "82", out);

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

for (const id of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(plans)) {
  const plan = plans[id];
  const dir = join(OUT, id);
  mkdirSync(dir, { recursive: true });
  const frames = mkdtempSync(join(tmpdir(), `reel-${id}-`));

  await page.goto(`${BASE}/grabar?reel=${id}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !!window.__reel, null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  // Fuera el distintivo de desarrollo de Next.js.
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  const duration = await page.evaluate(() => window.__reel.duration());
  const total = Math.round(duration * FPS);
  const seek = (t) =>
    page.evaluate((v) => {
      window.__reel.seek(v, false);
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, t);

  for (let i = 0; i < total; i++) {
    await seek(i / FPS);
    await page.screenshot({ path: join(frames, `${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  console.log(`${id}: ${total} fotogramas (${duration.toFixed(2)} s)`);

  if (plan.full) encode(frames, join(dir, "full"));
  encode(frames, join(dir, "preview"), plan.preview);

  // Imágenes fijas sin cursor: póster (primer fotograma) y galería.
  await page.evaluate(() => (document.querySelector("[data-reel-cursor]").style.visibility = "hidden"));
  const shot = async (t, name, width) => {
    await seek(t);
    const png = join(frames, `${name}.png`);
    await page.screenshot({ path: png });
    still(png, join(dir, `${name}.webp`), width);
  };
  for (const [i, t] of plan.gallery.entries()) await shot(t, `gallery-${i + 1}`);
  if (plan.full) await shot(0, "poster");
  await page.evaluate(() => (document.querySelector("[data-reel-cursor]").style.visibility = ""));

  rmSync(frames, { recursive: true, force: true });
}

await browser.close();
