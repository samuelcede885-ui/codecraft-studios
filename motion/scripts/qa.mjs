/**
 * QA visual (MASTER_BRIEF §22): renderiza los frames de revisión de una composición y una hoja
 * de contacto. Uso: node scripts/qa.mjs [Composición] [frames,separados,por,coma] [--guides]
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [id = "Reel01", list = "0,60,120,210,330,450,570,690,780,839"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const guides = process.argv.includes("--guides");
const out = path.resolve("out/qa");
mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const composition = await selectComposition({ serveUrl, id, inputProps: { guides }, browserExecutable });
for (const frame of list.split(",").map(Number)) {
  const output = path.join(out, `${id}-${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, inputProps: { guides }, browserExecutable });
  console.log(output);
}
