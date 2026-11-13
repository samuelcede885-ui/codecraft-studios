"""Fotos provisionales de una marca a partir de capturas de su menú público.

    python3 pipeline.py <marca.json> <paso> --root <carpeta de trabajo> [opciones] [ids…]

Pasos:
    recortes  Solo recorta (rápido): sirve para comprobar las cajas del JSON.
    upscale   Recorta cada producto y lo amplía ×4 con Real-ESRGAN (ncnn, CPU).
    matte     Quita el fondo (rembg, isnet-general-use) y limpia el halo del borde.
    export    WebP con transparencia en varios anchos, migas del hero, grano de
              papel y el manifiesto images.json. Requiere --out y --manifest.

La carpeta de trabajo (--root) contiene:
    src/     las capturas originales, con los nombres que cita el JSON
    models/  realesrgan-x4plus.param y realesrgan-x4plus.bin (o --models <dir>)
    work/    intermedios (se crea sola)

El JSON de la marca:
    crops     { id: [archivo, x0, y0, x1, y1] }  cajas en píxeles de la captura
    products  [id, …]                            orden de exportación
    widths    [1200, 800, 480, 160]
    crumbs    { familia: [id, cx, cy, tamaño, forma] }
              ventana de textura dentro del recorte (0–1) y forma: crumb, chunk o blob
    circulo   true si el menú ya muestra cada foto dentro de un círculo: el paso
              matte conserva el círculo en vez de recortar el producto
    letreros  { id: [[x0, y0, x1, y1], …] }      opcional: cajas de la captura con
              rótulos blancos escritos sobre el producto, que se borran
"""
import argparse
import io
import json
import math
import time
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageCms, ImageDraw

parser = argparse.ArgumentParser(description="Fotos provisionales de una marca")
parser.add_argument("config")
parser.add_argument("step", choices=["recortes", "upscale", "matte", "export"])
parser.add_argument("ids", nargs="*")
parser.add_argument("--root", required=True)
parser.add_argument("--models")
parser.add_argument("--out")
parser.add_argument("--manifest")
args = parser.parse_args()

CFG = json.loads(Path(args.config).read_text())
ROOT = Path(args.root)
WORK = ROOT / "work"
WORK.mkdir(parents=True, exist_ok=True)
MODELS = Path(args.models) if args.models else ROOT / "models"
only = set(args.ids)


def read_crop(pid):
    """Recorte en sRGB. Las capturas de iPhone vienen en Display P3: si la imagen
    trae perfil de color se convierte, o los tonos saldrían apagados."""
    src, x0, y0, x1, y1 = CFG["crops"][pid]
    try:
        im = Image.open(ROOT / "src" / src)
    except OSError:
        raise SystemExit(f"No se pudo leer src/{src}")
    icc = im.info.get("icc_profile")
    im = im.convert("RGB")
    if icc:
        im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), ImageCms.createProfile("sRGB"),
                                       renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC, outputMode="RGB")
    img = np.asarray(im)[y0:y1, x0:x1]
    boxes = CFG.get("letreros", {}).get(pid)
    return remove_lettering(img, boxes, x0, y0) if boxes else img


def remove_lettering(img, boxes, x0, y0):
    """Borra rótulos blancos escritos sobre la foto (p. ej. el nombre del sabor en
    una publicación). `boxes` son cajas en píxeles de la captura; dentro de ellas
    se localizan los trazos blancos y se rellenan con la textura de alrededor."""
    mask = np.zeros(img.shape[:2], np.uint8)
    h, w = mask.shape
    for bx0, by0, bx1, by1 in boxes:
        ys, xs = slice(max(0, by0 - y0), min(h, by1 - y0)), slice(max(0, bx0 - x0), min(w, bx1 - x0))
        region = img[ys, xs].astype(np.int16)
        low, high = region.min(axis=2), region.max(axis=2)
        mask[ys, xs] = ((low > 200) & (high - low < 36)).astype(np.uint8) * 255
    mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    return cv2.inpaint(np.ascontiguousarray(img), mask, 5, cv2.INPAINT_TELEA)


# ---------------------------------------------------------------- recortes
def step_recortes():
    for pid in CFG["crops"]:
        if only and pid not in only:
            continue
        img = read_crop(pid)
        cv2.imwrite(str(WORK / f"{pid}-crop.png"), cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
        print(pid, img.shape[1], "x", img.shape[0])


# ---------------------------------------------------------------- upscale
def step_upscale():
    import ncnn

    net = ncnn.Net()
    net.opt.use_vulkan_compute = False
    net.opt.num_threads = 4
    net.load_param(str(MODELS / "realesrgan-x4plus.param"))
    net.load_model(str(MODELS / "realesrgan-x4plus.bin"))

    def run(patch_rgb):
        h, w = patch_rgb.shape[:2]
        mat = ncnn.Mat.from_pixels(np.ascontiguousarray(patch_rgb), ncnn.Mat.PixelType.PIXEL_RGB, w, h)
        mat.substract_mean_normalize([], [1 / 255.0] * 3)
        ex = net.create_extractor()
        ex.input("data", mat)
        _, out = ex.extract("output")
        return np.clip(np.array(out).transpose(1, 2, 0) * 255.0, 0, 255)

    def upscale(rgb, tile=160, pad=12, scale=4):
        h, w = rgb.shape[:2]
        src = cv2.copyMakeBorder(rgb, pad, pad, pad, pad, cv2.BORDER_REFLECT_101)
        out = np.zeros((h * scale, w * scale, 3), np.float32)
        for y in range(0, h, tile):
            for x in range(0, w, tile):
                th, tw = min(tile, h - y), min(tile, w - x)
                res = run(src[y:y + th + 2 * pad, x:x + tw + 2 * pad])
                out[y * scale:(y + th) * scale, x * scale:(x + tw) * scale] = \
                    res[pad * scale:(pad + th) * scale, pad * scale:(pad + tw) * scale]
        return out.astype(np.uint8)

    for pid in CFG["crops"]:
        if only and pid not in only:
            continue
        t = time.time()
        img = read_crop(pid)
        cv2.imwrite(str(WORK / f"{pid}-crop.png"), cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
        up = upscale(img)
        cv2.imwrite(str(WORK / f"{pid}-x4.png"), cv2.cvtColor(up, cv2.COLOR_RGB2BGR))
        print(pid, img.shape, "->", up.shape, f"{time.time() - t:.0f}s", flush=True)


# ---------------------------------------------------------------- matte
def step_matte():
    if not CFG.get("circulo"):
        from rembg import new_session, remove

        sess = new_session("isnet-general-use")

    def clean(pid):
        img = Image.open(WORK / f"{pid}-x4.png").convert("RGB")
        rgb = np.asarray(img).astype(np.float32)
        m = np.asarray(remove(img, session=sess, only_mask=True)).astype(np.float32) / 255.0

        # 1) silueta firme: curva + quedarse con los componentes grandes
        a = np.clip((m - 0.5) / 0.3 + 0.5, 0, 1)
        binm = (a > 0.5).astype(np.uint8)
        n, lab, stats, _ = cv2.connectedComponentsWithStats(binm, 8)
        keep = np.zeros_like(binm)
        if n > 1:
            big = stats[1:, cv2.CC_STAT_AREA].max()
            for i in range(1, n):
                if stats[i, cv2.CC_STAT_AREA] > 0.03 * big:
                    keep[lab == i] = 1
        # rellenar huecos interiores (el relleno claro no debe quedar transparente)
        inv = 1 - keep
        n2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv, 4)
        h, w = keep.shape
        for i in range(1, n2):
            x, y, bw, bh = st2[i, :4]
            touches = x == 0 or y == 0 or x + bw == w or y + bh == h
            if not touches:
                keep[lab2 == i] = 1
        a = np.where(keep == 1, a, 0)
        a = np.maximum(a, cv2.erode(keep.astype(np.float32), np.ones((3, 3), np.uint8)))

        # 2) contraer ~3 px (a escala x4) para eliminar el halo del fondo y suavizar
        a = cv2.erode(a, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        a = cv2.GaussianBlur(a, (0, 0), 1.6)

        # 3) descontaminar el borde: usar el color del pixel interior mas cercano
        interior = (a > 0.97).astype(np.uint8)
        _, labels = cv2.distanceTransformWithLabels(1 - interior, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
        ys, xs = np.nonzero(interior)
        lut = np.zeros((labels.max() + 1, 2), np.int32)
        lut[labels[ys, xs]] = np.stack([ys, xs], 1)
        ny, nx = lut[labels][..., 0], lut[labels][..., 1]
        edge = (a <= 0.97)[..., None]
        rgb = np.where(edge, rgb[ny, nx], rgb)

        out = np.dstack([rgb, a * 255]).clip(0, 255).astype(np.uint8)
        ys, xs = np.nonzero(a > 0.02)
        pad = 8
        y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, h)
        x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, w)
        out = out[y0:y1, x0:x1]
        Image.fromarray(out, "RGBA").save(WORK / f"{pid}-cut.png")
        print(pid, out.shape, flush=True)

    def circle(pid):
        """Menús que ya presentan cada foto en un círculo: se conserva el círculo
        entero (con su fondo) y solo se vuelve transparente lo de fuera."""
        img = Image.open(WORK / f"{pid}-x4.png").convert("RGB")
        w, h = img.size
        ss = 4
        r = min(w, h) / 2 - 10  # unos píxeles hacia dentro: fuera queda el blanco del menú
        m = Image.new("L", (w * ss, h * ss), 0)
        ImageDraw.Draw(m).ellipse([(w / 2 - r) * ss, (h / 2 - r) * ss, (w / 2 + r) * ss, (h / 2 + r) * ss], fill=255)
        m = m.resize((w, h), Image.LANCZOS)
        out = img.copy()
        out.putalpha(m)
        box = (round(w / 2 - r) - 2, round(h / 2 - r) - 2, round(w / 2 + r) + 2, round(h / 2 + r) + 2)
        out = out.crop(box)
        out.save(WORK / f"{pid}-cut.png")
        print(pid, out.size, "(círculo)", flush=True)

    for pid in CFG["products"]:
        if only and pid not in only:
            continue
        circle(pid) if CFG.get("circulo") else clean(pid)


# ---------------------------------------------------------------- export
def step_export():
    if not args.out or not args.manifest:
        raise SystemExit("export necesita --out <public/img> y --manifest <images.json>")
    out_dir = Path(args.out)
    (out_dir / "products").mkdir(parents=True, exist_ok=True)
    (out_dir / "crumbs").mkdir(parents=True, exist_ok=True)
    manifest = {}

    for pid in CFG["products"]:
        im = Image.open(WORK / f"{pid}-cut.png").convert("RGBA")
        sizes = []
        # Si el recorte no llega al ancho mayor, su versión grande es la nativa.
        for w in sorted({min(w, im.width) for w in CFG["widths"]}, reverse=True):
            h = round(im.height * w / im.width)
            r = im.resize((w, h), Image.LANCZOS)
            r.save(out_dir / "products" / f"{pid}-{w}.webp", "WEBP", quality=80, method=6)
            sizes.append(w)
        # color medio (para placeholders mientras carga)
        a = np.asarray(im)
        op = a[..., 3] > 200
        mean = a[..., :3][op].mean(0).round().astype(int).tolist()
        manifest[pid] = {"w": im.width, "h": im.height, "widths": sorted(sizes), "tone": "#%02x%02x%02x" % tuple(mean)}
        print(pid, im.size, sizes)

    # ---------- migas ----------
    families = CFG["crumbs"]
    S = 256

    def shape_mask(rng, kind):
        ss = 4
        n = {"crumb": 13, "chunk": 6, "blob": 16}[kind]
        irr = {"crumb": 0.30, "chunk": 0.22, "blob": 0.14}[kind]
        ang = (np.arange(n) + rng.uniform(-0.35, 0.35, n)) / n * 2 * math.pi + rng.uniform(0, 6.28)
        rad = (1 - irr * rng.random(n)) * S * 0.45
        sx = rng.uniform(0.78, 1.0)                      # ligera elongacion
        pts = np.stack([S / 2 + np.cos(ang) * rad, S / 2 + np.sin(ang) * rad * sx], 1)
        its = {"crumb": 1, "chunk": 0, "blob": 3}[kind]
        for _ in range(its):                              # Chaikin: redondea esquinas
            q = 0.75 * pts + 0.25 * np.roll(pts, -1, 0)
            r = 0.25 * pts + 0.75 * np.roll(pts, -1, 0)
            pts = np.stack([q, r], 1).reshape(-1, 2)
        m = Image.new("L", (S * ss, S * ss), 0)
        ImageDraw.Draw(m).polygon([tuple(p * ss) for p in pts], fill=255)
        if kind == "crumb":                               # borde irregular de migaja
            arr = np.asarray(m).astype(np.float32)
            noise = cv2.GaussianBlur(rng.random((S * ss, S * ss)).astype(np.float32), (0, 0), 9)
            noise = (noise - noise.mean()) / (noise.std() + 1e-6)
            arr = cv2.GaussianBlur(arr, (0, 0), 10) + noise * 38
            binm = (arr > 128).astype(np.uint8)
            n, lab, st, _ = cv2.connectedComponentsWithStats(binm, 8)      # sin motas sueltas
            if n > 2:
                binm = (lab == 1 + st[1:, cv2.CC_STAT_AREA].argmax()).astype(np.uint8)
            m = Image.fromarray(binm * 255)
        return np.asarray(m.resize((S, S), Image.LANCZOS)).astype(np.float32) / 255

    def make(fam, k, rng):
        pid, cx, cy, s, kind = families[fam]
        src = Image.open(WORK / f"{pid}-cut.png").convert("RGB")
        w, h = src.size
        half = int(w * s / 2)
        win = int(half * rng.uniform(0.75, 1.0))
        ox = int(w * cx + rng.uniform(-1, 1) * (half - win))
        oy = int(h * cy + rng.uniform(-1, 1) * (half - win))
        tex = src.crop((ox - win, oy - win, ox + win, oy + win)).rotate(rng.choice([0, 90, 180, 270]))
        tex = np.asarray(tex.resize((S, S), Image.LANCZOS)).astype(np.float32)
        a = shape_mask(rng, kind)
        # volumen: bisel iluminado desde arriba-izquierda
        d = cv2.distanceTransform((a > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
        d = d / (d.max() + 1e-6)
        gy, gx = np.gradient(cv2.GaussianBlur(d, (0, 0), 3))
        norm = np.sqrt(gx ** 2 + gy ** 2) + 1e-6
        lam = (gx / norm) * 0.6 + (gy / norm) * 0.8        # normal exterior . luz
        band = {"crumb": 0.5, "chunk": 0.75, "blob": 0.9}[kind]
        rim = np.clip(1 - d / band, 0, 1)
        gain = {"crumb": 0.30, "chunk": 0.42, "blob": 0.34}[kind]
        yy, xx = np.mgrid[0:S, 0:S] / S
        bright = 1 + rim * lam * gain + (0.5 - (xx * 0.4 + yy * 0.6)) * 0.22
        if kind == "chunk":                                # facetas de chocolate troceado
            th = rng.uniform(0, math.pi)
            side = (xx - 0.5) * math.cos(th) + (yy - 0.5) * math.sin(th) + rng.uniform(-0.08, 0.08)
            facet = np.where(side < 0, 1.55, 0.92)
            ridge = np.exp(-(side / 0.012) ** 2) * 0.9
            bright = bright * facet + ridge
            tex = tex * 0.55 + np.array([92, 52, 30], np.float32) * 0.45
        rgb = np.clip(tex * bright[..., None], 0, 255)
        out = np.dstack([rgb, a * 255]).astype(np.uint8)
        im = Image.fromarray(out, "RGBA")
        im.save(out_dir / "crumbs" / f"{fam}-{k}.webp", "WEBP", quality=80, method=6)
        # version desenfocada (profundidad de campo) para el primer plano
        pad = Image.new("RGBA", (S + 64, S + 64), (0, 0, 0, 0))
        pad.paste(im, (32, 32))
        pm = np.asarray(pad).astype(np.float32)
        al = pm[..., 3:4] / 255
        prem = cv2.GaussianBlur(pm[..., :3] * al, (0, 0), 9)
        alb = cv2.GaussianBlur(al, (0, 0), 9)
        alb3 = alb[..., None] if alb.ndim == 2 else alb
        rgbb = np.where(alb3 > 1e-3, prem / np.maximum(alb3, 1e-3), 0)
        blur = np.dstack([rgbb, alb3 * 255]).clip(0, 255).astype(np.uint8)
        Image.fromarray(blur, "RGBA").resize((160, 160), Image.LANCZOS).save(
            out_dir / "crumbs" / f"{fam}-{k}-blur.webp", "WEBP", quality=70, method=6)

    rng = np.random.default_rng(7)
    for fam in families:
        for k in (1, 2, 3):
            make(fam, k, rng)
    print("crumbs ok")

    # ---------- grano de papel ----------
    g = np.random.default_rng(3).normal(0, 1, (180, 180)).astype(np.float32)
    g = cv2.GaussianBlur(g, (0, 0), 0.6)
    g = (g - g.min()) / (g.max() - g.min())
    dark = (g < 0.5)
    alpha = (np.abs(g - 0.5) * 2) ** 1.4 * 60
    tile = np.dstack([np.where(dark, 20, 255)] * 3 + [alpha]).astype(np.uint8)
    Image.fromarray(tile, "RGBA").save(out_dir / "grain.png", optimize=True)

    Path(args.manifest).write_text(json.dumps(manifest, indent=2) + "\n")
    print("manifest ok")


{"recortes": step_recortes, "upscale": step_upscale, "matte": step_matte, "export": step_export}[args.step]()
