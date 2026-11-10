"""Exporta los assets web: productos (WebP con alfa en varios anchos), migas, logo y grano de papel."""
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

# ---------- logo ----------
lg = np.asarray(Image.open(WORK / "logo-x4.png").convert("RGB")).astype(np.float32)
H, W = lg.shape[:2]
# centro/radio del disco naranja: marchar desde el centro hasta el aro blanco
cx0, cy0 = W / 2, H / 2
def radius_at(cx, cy, ang):
    for r in range(300, 620):
        x, y = int(cx + math.cos(ang) * r), int(cy + math.sin(ang) * r)
        if not (0 <= x < W and 0 <= y < H): return r
        p = lg[y, x]
        if p.min() > 225: return r
    return 620
pts = []
for ang in np.linspace(0, 2*math.pi, 180, endpoint=False):
    r = radius_at(cx0, cy0, ang); pts.append((cx0 + math.cos(ang)*r, cy0 + math.sin(ang)*r))
pts = np.array(pts, np.float32)
(cx, cy), rad = cv2.minEnclosingCircle(pts)
A = np.c_[2*pts[:, 0], 2*pts[:, 1], np.ones(len(pts))]; b = (pts**2).sum(1)
sol = np.linalg.lstsq(A, b, rcond=None)[0]; cx, cy = sol[0], sol[1]; rad = math.sqrt(sol[2] + cx*cx + cy*cy)
print("logo circle", round(cx), round(cy), round(rad))
rad -= 6
ORANGE = np.array([242, 176, 82], np.float32)
dist = np.abs(lg - lg[int(cy), int(cx - rad * 0.8)]).sum(2)
near = np.clip(1 - (dist - 40) / 50, 0, 1)[..., None]           # 1 = pixel del disco naranja
flat = lg * (1 - near) + ORANGE * near
yy, xx = np.mgrid[0:H, 0:W]
alpha = np.clip(rad - np.sqrt((xx - cx)**2 + (yy - cy)**2) + 0.5, 0, 1)
out = np.dstack([flat, alpha * 255]).clip(0, 255).astype(np.uint8)
x0, y0, x1, y1 = int(cx - rad - 1), int(cy - rad - 1), int(cx + rad + 2), int(cy + rad + 2)
logo = Image.fromarray(out, "RGBA").crop((x0, y0, x1, y1))
side = min(logo.size); logo = logo.crop((0, 0, side, side))
for w in (512, 256, 128):
    logo.resize((w, w), Image.LANCZOS).save(OUT / f"logo-noa-{w}.webp", "WEBP", quality=92, method=6)
logo.resize((180, 180), Image.LANCZOS).save(OUT.parent / "apple-touch-icon.png")
logo.resize((64, 64), Image.LANCZOS).save(OUT.parent / "favicon.png")
print("logo ok", logo.size)

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
