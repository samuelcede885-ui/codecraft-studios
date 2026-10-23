/**
 * Graba en tiempo real el recorrido de escritorio por la web (1280 × 800) para la composición WebTour.
 *
 *   # sitio exportado y servido (p. ej. en http://localhost:4000/codecraft-studios)
 *   BASE_URL=http://localhost:4000/codecraft-studios xvfb-run -a -s "-screen 0 1280x800x24" \
 *     node scripts/record-web-tour.mjs
 *
 * Abre Chromium con ventana (modo kiosco) en un display virtual y lo captura con ffmpeg (x11grab).
 * Escribe public/tour/web-desktop.mp4 y src/data/webTourCapture.json (capítulos, clics y cursor).
 * Requiere Playwright (CHROME_PATH para un Chromium local) y ffmpeg.
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync, rmSync, mkdtempSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
const OUT = mkdtempSync(join(tmpdir(), "web-tour-")); const TEST = process.argv[2] === "test";
const B = process.env.BASE_URL ?? "http://localhost:4000/codecraft-studios";
import { spawn } from "node:child_process";
const ctx = await chromium.launchPersistentContext(OUT + "/profile", { executablePath: process.env.CHROME_PATH || undefined, headless: false, viewport: null, ignoreDefaultArgs: ["--enable-automation"], args: ["--kiosk", "--window-position=0,0", "--window-size=1280,800", "--autoplay-policy=no-user-gesture-required", "--hide-scrollbars", "--disable-infobars"] });
const b = ctx;
const p = ctx.pages()[0] ?? (await ctx.newPage());
let t0 = null;
const marks = [];
const now = () => Date.now() / 1000;
const mark = (id) => { marks.push({ id, t: now() }); console.log("mark", id); };
const W = (ms) => p.waitForTimeout(ms);
// Movimiento de ratón suave (el cursor contextual de la web lo sigue).
let mx = 640, my = 400;
const cur = []; const clicks = [];
async function move(x, y, steps = 25) {
  const x0 = mx, y0 = my;
  for (let i = 1; i <= steps; i++) { const k = i / steps, e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; const cx = x0 + (x - x0) * e, cy = y0 + (y - y0) * e; await p.mouse.move(cx, cy); cur.push([+(now() - t0).toFixed(3), Math.round(cx), Math.round(cy)]); await W(14); }
  mx = x; my = y;
}
async function press() { clicks.push(+(now() - t0).toFixed(3)); await p.mouse.down(); await p.mouse.up(); }
async function moveTo(sel, steps = 25) { const r = await p.locator(sel).first().boundingBox(); if (r) await move(r.x + r.width / 2, r.y + r.height / 2, steps); }
async function wheel(total, step = 90, gap = 16) { for (let d = 0; Math.abs(d) < Math.abs(total); d += step * Math.sign(total)) { await p.mouse.wheel(0, step * Math.sign(total)); await W(gap); } }
async function scrollToSel(sel, block = "start", offset = 0) {
  const y = await p.evaluate(([s, o]) => { const e = document.querySelector(s); return e.getBoundingClientRect().top + o; }, [sel, offset]);
  await wheel(y, 80, 18); await W(700);
}
await p.goto("about:blank"); await p.evaluate(() => { document.body.style.background = "#F5F5F3"; });
await W(800);
const ff = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "x11grab", "-framerate", "30", "-draw_mouse", "0", "-video_size", "1280x800", "-i", process.env.DISPLAY + ".0+0,0", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "12", "-pix_fmt", "yuv444p", OUT + "/cap.mkv"], { stdio: ["pipe", "inherit", "inherit"] });
await W(1500); t0 = now(); mark("intro");
await p.goto(B + "/", { waitUntil: "domcontentloaded" });
await move(900, 500, 5);
if (TEST) { await W(6000); }
else {
  await W(1800); mark("hero");
  await W(9500);
  await move(1100, 300, 40); await W(2500);
  mark("featured"); await scrollToSel("#portafolio", "start", 260); await moveTo(".featured video", 30); await W(4000);
  mark("catalog"); await scrollToSel("#catalogo", "start", -20); await W(800);
  await moveTo(".tile__media >> nth=0", 30); await W(2600);
  await moveTo(".tile__media >> nth=1", 25); await W(2600);
  mark("filters");
  await moveTo('.chip >> text="Aplicaciones"', 25); await press(); await W(1500);
  await moveTo('.chip >> text="Webs personales"', 20); await press(); await W(1500);
  await moveTo('.chip >> text="Todos"', 20); await press(); await W(1300);
  mark("inspire");
  await p.evaluate(() => document.querySelector(".catalog__inspire").scrollIntoView({ block: "center" })); await W(900);
  await moveTo(".catalog__inspire", 25); await press(); await W(9000);
  await p.keyboard.press("Escape"); await W(900);
  mark("case");
  await p.evaluate(() => document.querySelector(".catalog").scrollIntoView()); await W(600);
  await p.goto(B + "/proyectos/fariseos-league", { waitUntil: "domcontentloaded" }); await W(2600);
  await wheel(1700, 70, 20); await W(1500); await wheel(1400, 70, 20); await W(1500);
  mark("build");
  await p.goBack({ waitUntil: "domcontentloaded" }); await W(1500); await move(640, 420, 10);
  await scrollToSel("#build-title", "start", -120); await W(1800);
  mark("services"); await scrollToSel("#servicios", "start", -10); await W(600);
  await moveTo(".service__head >> nth=1", 25); await press(); await W(2400);
  mark("plans"); await scrollToSel("#planes", "start", -10); await W(1200);
  for (const n of [1, 2, 3]) { await moveTo(`.plans__tab >> nth=${n}`, 20); await press(); await W(1500); }
  await moveTo(".plans__tab >> nth=0", 20); await press(); await W(1000);
  mark("process"); await scrollToSel("#proceso", "start", 60); await W(3600);
  mark("quote"); await scrollToSel(".plan__cta", "start", -560); await W(500);
  await moveTo(".plan__cta >> nth=0", 25); await press(); await W(2600);
  await moveTo("[name=name]", 20); await press(); await p.keyboard.type("Ana", { delay: 90 });
  await moveTo("[name=email]", 15); await press(); await p.keyboard.type("ana@ejemplo.com", { delay: 60 }); await W(500);
  for (let i = 0; i < 3; i++) { await moveTo(".wizard button[type=submit]", 15); await press(); await W(1300); }
  await W(1200);
}
mark("end"); await W(1000);
await W(600); ff.stdin.write("q"); await new Promise((r) => ff.on("exit", r));
await b.close();
// El primer fotograma oscuro (la intro) marca el inicio: se recorta lo anterior (~0,2 s de carga).
const probe = execFileSync("ffmpeg", ["-loglevel", "error", "-t", "4", "-i", OUT + "/cap.mkv", "-vf", "scale=8:5,format=gray", "-f", "rawvideo", "-"]);
let dark = 0;
for (let i = 0; i * 40 < probe.length; i++) if (probe.subarray(i * 40, i * 40 + 40).reduce((a, v) => a + v, 0) / 40 < 100) { dark = i / 30; break; }
const start = Math.max(0, dark - 0.18);
mkdirSync("public/tour", { recursive: true });
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(start), "-i", OUT + "/cap.mkv", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", "public/tour/web-desktop.mp4"]);
writeFileSync("src/data/webTourCapture.json", JSON.stringify({ marks: marks.map((m) => ({ id: m.id, t: +(m.t - t0).toFixed(3) })), clicks, cursor: cur }));
rmSync(OUT, { recursive: true, force: true });
