/**
 * Captura las portadas del catálogo (src/components/covers) a public/projects/<slug>/thumb.webp.
 *
 *   npm run dev                         # la página /grabar solo existe en desarrollo
 *   node scripts/record-covers.mjs [gramercy norte-estudio …]
 *
 * Requiere Playwright y ffmpeg (con libwebp). Si Playwright no está en el proyecto, indicar su
 * módulo con PLAYWRIGHT_MODULE=/ruta/a/playwright/index.mjs.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = join(process.cwd(), "public/projects");
const ids = ["g-talent", "gaba", "gramercy", "panel-de-metricas", "asistente-de-reservas", "norte-estudio"];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const tmp = mkdtempSync(join(tmpdir(), "covers-"));

for (const id of process.argv.slice(2).length ? process.argv.slice(2) : ids) {
  await page.goto(`${BASE}/grabar?cover=${id}`, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-cover-ready]");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => undefined)));
  });
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  const png = join(tmp, `${id}.png`);
  await page.locator(".cover").screenshot({ path: png });
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", png, "-c:v", "libwebp", "-quality", "84", join(OUT, id, "thumb.webp")], {
    stdio: "inherit",
  });
  console.log(`${id}: portada lista`);
}

rmSync(tmp, { recursive: true, force: true });
await browser.close();
