"""Exporta los assets web: productos (WebP con alfa en varios anchos), migas, iconos y grano de papel."""
import json, sys, math
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter

WORK = Path(__file__).parent / "work"
OUT = Path(sys.argv[1])            # .../noa-cookies/public/img
MANIFEST = Path(sys.argv[2])       # .../noa-cookies/src/data/images.json
(OUT / "products").mkdir(parents=True, exist_ok=True)
(OUT / "crumbs").mkdir(parents=True, exist_ok=True)

PRODUCTS = ["signature", "choco-lovers", "velvet", "nutella-bomb", "mani-fica",
            "noa-roll", "pastelito", "cookie-sandwich", "cookie-cake"]
WIDTHS = [1200, 800, 480, 160]
manifest = {}

for pid in PRODUCTS:
    im = Image.open(WORK / f"{pid}-cut.png").convert("RGBA")
    sizes = []
    for w in WIDTHS:
        if w > im.width:
            continue
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(OUT / "products" / f"{pid}-{w}.webp", "WEBP", quality=80, method=6)
        sizes.append(w)
    # color medio (para placeholders mientras carga)
    a = np.asarray(im)
    op = a[..., 3] > 200
    mean = a[..., :3][op].mean(0).round().astype(int).tolist()
    manifest[pid] = {"w": im.width, "h": im.height, "widths": sorted(sizes), "tone": "#%02x%02x%02x" % tuple(mean)}
    print(pid, im.size, sizes)

# ---------- migas ----------
FAMILIES = {
    # familia: (origen, cx, cy, tamaño relativo, forma)
    "golden": ("signature",    0.42, 0.74, 0.30, "crumb"),
    "dark":   ("choco-lovers", 0.50, 0.76, 0.34, "crumb"),
    "red":    ("velvet",       0.50, 0.76, 0.30, "crumb"),
    "cream":  ("velvet",       0.50, 0.325, 0.16, "blob"),
    "choco":  ("nutella-bomb", 0.46, 0.33, 0.13, "chunk"),
    "peanut": ("mani-fica",    0.50, 0.335, 0.20, "blob"),
}
S = 256

def shape_mask(rng, kind):
    ss = 4
    n = {"crumb": 13, "chunk": 6, "blob": 16}[kind]
    irr = {"crumb": 0.30, "chunk": 0.22, "blob": 0.14}[kind]
    ang = (np.arange(n) + rng.uniform(-0.35, 0.35, n)) / n * 2 * math.pi + rng.uniform(0, 6.28)
    rad = (1 - irr * rng.random(n)) * S * 0.45
    sx = rng.uniform(0.78, 1.0)                      # ligera elongacion
    pts = np.stack([S/2 + np.cos(ang) * rad, S/2 + np.sin(ang) * rad * sx], 1)
    its = {"crumb": 1, "chunk": 0, "blob": 3}[kind]
    for _ in range(its):                              # Chaikin: redondea esquinas
        q = 0.75 * pts + 0.25 * np.roll(pts, -1, 0)
        r = 0.25 * pts + 0.75 * np.roll(pts, -1, 0)
        pts = np.stack([q, r], 1).reshape(-1, 2)
    m = Image.new("L", (S*ss, S*ss), 0)
    ImageDraw.Draw(m).polygon([tuple(p * ss) for p in pts], fill=255)
    if kind == "crumb":                               # borde irregular de migaja
        arr = np.asarray(m).astype(np.float32)
        noise = cv2.GaussianBlur(rng.random((S*ss, S*ss)).astype(np.float32), (0, 0), 9)
        noise = (noise - noise.mean()) / (noise.std() + 1e-6)
        arr = cv2.GaussianBlur(arr, (0, 0), 10) + noise * 38
        binm = (arr > 128).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(binm, 8)      # sin motas sueltas
        if n > 2:
            binm = (lab == 1 + st[1:, cv2.CC_STAT_AREA].argmax()).astype(np.uint8)
        m = Image.fromarray(binm * 255)
    return np.asarray(m.resize((S, S), Image.LANCZOS)).astype(np.float32) / 255

def make(fam, k, rng):
    pid, cx, cy, s, kind = FAMILIES[fam]
    src = Image.open(WORK / f"{pid}-cut.png").convert("RGB")
    w, h = src.size
    half = int(w * s / 2)
    win = int(half * rng.uniform(0.75, 1.0))
    ox = int(w*cx + rng.uniform(-1, 1) * (half - win)); oy = int(h*cy + rng.uniform(-1, 1) * (half - win))
    tex = src.crop((ox - win, oy - win, ox + win, oy + win)).rotate(rng.choice([0, 90, 180, 270]))
    tex = np.asarray(tex.resize((S, S), Image.LANCZOS)).astype(np.float32)
    a = shape_mask(rng, kind)
    # volumen: bisel iluminado desde arriba-izquierda
    d = cv2.distanceTransform((a > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    d = d / (d.max() + 1e-6)
    gy, gx = np.gradient(cv2.GaussianBlur(d, (0, 0), 3))
    norm = np.sqrt(gx**2 + gy**2) + 1e-6
    lam = (gx / norm) * 0.6 + (gy / norm) * 0.8        # normal exterior . luz
    band = {"crumb": 0.5, "chunk": 0.75, "blob": 0.9}[kind]
    rim = np.clip(1 - d / band, 0, 1)
    gain = {"crumb": 0.30, "chunk": 0.42, "blob": 0.34}[kind]
    yy, xx = np.mgrid[0:S, 0:S] / S
    bright = 1 + rim * lam * gain + (0.5 - (xx*0.4 + yy*0.6)) * 0.22
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
    im.save(OUT / "crumbs" / f"{fam}-{k}.webp", "WEBP", quality=80, method=6)
    # version desenfocada (profundidad de campo) para el primer plano
    pad = Image.new("RGBA", (S + 64, S + 64), (0, 0, 0, 0)); pad.paste(im, (32, 32))
    pm = np.asarray(pad).astype(np.float32); al = pm[..., 3:4] / 255
    prem = cv2.GaussianBlur(pm[..., :3] * al, (0, 0), 9); alb = cv2.GaussianBlur(al, (0, 0), 9)
    alb3 = alb[..., None] if alb.ndim == 2 else alb
    rgbb = np.where(alb3 > 1e-3, prem / np.maximum(alb3, 1e-3), 0)
    blur = np.dstack([rgbb, alb3 * 255]).clip(0, 255).astype(np.uint8)
    Image.fromarray(blur, "RGBA").resize((160, 160), Image.LANCZOS).save(OUT / "crumbs" / f"{fam}-{k}-blur.webp", "WEBP", quality=70, method=6)

rng = np.random.default_rng(7)
for fam in FAMILIES:
    for k in (1, 2, 3):
        make(fam, k, rng)
print("crumbs ok")

# ---------- iconos del sitio ----------
# El sitio no usa el logotipo de la marca: favicon e icono de inicio muestran
# la primera cookie del menu sobre Midnight Navy.
NAVY = (17, 41, 81, 255)
cookie = Image.open(WORK / f"{PRODUCTS[0]}-cut.png").convert("RGBA")

def icon(size, round_bg):
    ss = size * 4
    canvas = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    if round_bg:
        ImageDraw.Draw(canvas).ellipse([0, 0, ss - 1, ss - 1], fill=NAVY)
    else:
        canvas.paste(NAVY, [0, 0, ss, ss])
    box = int(ss * 0.74)
    scale = box / max(cookie.size)
    c = cookie.resize((round(cookie.width * scale), round(cookie.height * scale)), Image.LANCZOS)
    canvas.alpha_composite(c, ((ss - c.width) // 2, (ss - c.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)

icon(180, round_bg=False).convert("RGB").save(OUT.parent / "apple-touch-icon.png")
icon(64, round_bg=True).save(OUT.parent / "favicon.png")
print("iconos ok")

# ---------- grano de papel ----------
g = np.random.default_rng(3).normal(0, 1, (180, 180)).astype(np.float32)
g = cv2.GaussianBlur(g, (0, 0), 0.6)
g = (g - g.min()) / (g.max() - g.min())
dark = (g < 0.5)
alpha = (np.abs(g - 0.5) * 2) ** 1.4 * 60
tile = np.dstack([np.where(dark, 20, 255)] * 3 + [alpha]).astype(np.uint8)
Image.fromarray(tile, "RGBA").save(OUT / "grain.png", optimize=True)

MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
print("manifest ok")
