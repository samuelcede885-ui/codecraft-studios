import { Config } from "@remotion/cli/config";

// Salida para Reels / TikTok: H.264, 30 fps (definidos en cada composición), alta calidad.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
// Si el entorno no puede descargar Chrome Headless Shell, indicar uno local:
// REMOTION_BROWSER=/ruta/al/navegador npx remotion render …
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
