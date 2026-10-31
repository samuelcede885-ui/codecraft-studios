/**
 * Graba el recorrido del hero sobre Bunzo Burgers (concepto ficticio de Fary Labs), en tiempo
 * real, con las mismas etapas de src/data/heroStages.ts (28,2 s):
 *   0–3 apertura · 3–7,6 marca · 7,6–12,6 hamburguesa capa por capa · 12,6–17,6 menú y "Pedir"
 *   17,6–22,4 destacados · 22,4–28,2 shakes, catering, sucursales y cierre.
 *
 *   # la demo servida en local (repo samuelcede885-ui/bunzo-demo) o su URL publicada
 *   BUNZO_URL=http://localhost:4100/ xvfb-run -a -s "-screen 0 1440x810x24" node scripts/record-hero-bunzo.mjs
 *
 * Chromium con ventana (kiosco) en un display virtual, capturado con ffmpeg (x11grab). Escribe en
 * public/projects/bunzo/: hero.mp4/.webm (960 px, 20 fps, para la laptop), full.mp4/.webm
 * (1280 px, 30 fps) y poster.webp (primer fotograma). Requiere Playwright y ffmpeg.
 */
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const URL = process.env.BUNZO_URL ?? "https://samuelcede885-ui.github.io/bunzo-demo/";
const OUT = join(process.cwd(), "public/projects/bunzo");
const TMP = mkdtempSync(join(tmpdir(), "bunzo-"));
// Tamaño de una laptop (16:9, como la pantalla del hero): el texto se ve a escala real.
const W = 1440;
const H = 810;
const DUR = 28.2;
mkdirSync(OUT, { recursive: true });

const ctx = await chromium.launchPersistentContext(join(TMP, "profile"), {
  executablePath: process.env.CHROME_PATH || undefined,
  headless: false,
  viewport: null,
  ignoreDefaultArgs: ["--enable-automation"],
  args: ["--kiosk", "--window-position=0,0", `--window-size=${W},${H}`, "--hide-scrollbars", "--disable-infobars"],
});
const p = ctx.pages()[0] ?? (await ctx.newPage());
await p.goto(URL, { waitUntil: "load" });
await p.waitForTimeout(3500); // intro y fuentes
await p.mouse.move(W * 0.62, H * 0.55);

// Posiciones de cada sección (para que el recorrido no dependa de alturas fijas).
const at = await p.evaluate(() => {
  const top = (sel) => Math.round(document.querySelector(sel).getBoundingClientRect().top + scrollY);
  return { ing: top("#ingredientes"), menu: top("#menu"), feat: top("#destacados"), extras: top("#extras"), catering: top("#catering"), locales: top("#locales"), pedir: top("#pedir") };
});

// Recorrido por claves (segundo → scroll Y). Como navega una persona: se detiene en cada sección
// hasta que terminan sus animaciones de entrada, y al final va al cierre como al tocar "Pedir".
const half = at.feat + Math.round((at.extras - at.feat) * 0.48);
const keys = [
  [0, 0],
  [4.2, 0],
  [7.6, at.ing - 40],
  [11.9, at.menu - 110],
  [12.6, at.menu + 30],
  [17.4, at.menu + 30],
  [18.2, at.feat],
  [22.2, half],
  [23.6, at.pedir],
  [28.2, at.pedir],
];

const ff = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "x11grab", "-framerate", "30", "-draw_mouse", "0", "-video_size", `${W}x${H}`, "-i", `${process.env.DISPLAY}.0+0,0`, "-c:v", "libx264", "-preset", "ultrafast", "-crf", "12", "-pix_fmt", "yuv444p", join(TMP, "cap.mkv")], { stdio: ["pipe", "inherit", "inherit"] });
await p.waitForTimeout(1200);
const t0 = Date.now();
await p.evaluate((ks) => {
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  const start = performance.now();
  const step = () => {
    const t = (performance.now() - start) / 1000;
    let i = 0;
    while (i < ks.length - 2 && ks[i + 1][0] <= t) i++;
    const [ta, ya] = ks[i];
    const [tb, yb] = ks[i + 1];
    const k = Math.min(1, Math.max(0, (t - ta) / (tb - ta)));
    window.scrollTo(0, ya + (yb - ya) * ease(k));
    if (t < ks[ks.length - 1][0]) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}, keys);
// Menú: cambia de categoría y pasa por "Pedir" (como lo haría alguien navegando).
const clickTab = async (index, sec) => {
  await p.waitForTimeout(Math.max(0, t0 + sec * 1000 - Date.now()));
  const tab = p.locator("#menu [role=tab]").nth(index);
  const box = await tab.boundingBox().catch(() => null);
  if (box) {
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
    await p.mouse.down();
    await p.mouse.up();
  }
};
// Pestañas del menú: 0 hamburguesas · 1 papas y acompañantes (la de shakes anima su tarjeta
// estrechándola y se ve mal en pausa: no se usa).
await clickTab(1, 13.8);
await clickTab(0, 15.9);
await p.waitForTimeout(Math.max(0, t0 + DUR * 1000 + 300 - Date.now()));
ff.stdin.write("q");
await new Promise((r) => ff.on("exit", r));
await ctx.close();

// Inicio real: el primer fotograma capturado tras t0 (≈ 1,2 s de margen al arrancar ffmpeg).
const cap = join(TMP, "cap.mkv");
const trim = ["-ss", "1.2", "-t", String(DUR)];
const ffmpeg = (...a) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...a], { stdio: "inherit" });
ffmpeg(...trim, "-i", cap, "-vf", "scale=1280:720:flags=lanczos", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, "full.mp4"));
ffmpeg(...trim, "-i", cap, "-vf", "scale=1280:720:flags=lanczos", "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-cpu-used", "4", join(OUT, "full.webm"));
// 20 fps: a HERO_SPEED = 1,5 se ve a 30 fps.
const light = ["-vf", "scale=960:540:flags=lanczos,fps=20", "-an"];
ffmpeg(...trim, "-i", cap, ...light, "-c:v", "libx264", "-preset", "slow", "-crf", "34", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, "hero.mp4"));
ffmpeg(...trim, "-i", cap, ...light, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "46", "-row-mt", "1", "-cpu-used", "4", join(OUT, "hero.webm"));
ffmpeg("-ss", "1.25", "-i", cap, "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libwebp", "-quality", "82", join(OUT, "poster.webp"));
rmSync(TMP, { recursive: true, force: true });
console.log("listo:", OUT, at);
