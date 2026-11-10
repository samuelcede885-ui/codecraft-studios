"""Quita el fondo crema del menu y deja cada producto como recorte RGBA limpio (sin halo)."""
import sys
import numpy as np, cv2
from PIL import Image
from rembg import new_session, remove

IDS = ["choco-lovers", "signature", "velvet", "nutella-bomb", "mani-fica",
       "noa-roll", "pastelito", "cookie-sandwich", "cookie-cake"]
sess = new_session("isnet-general-use")

def clean(pid):
    img = Image.open(f"work/{pid}-x4.png").convert("RGB")
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
    a = np.where(keep == 1, np.maximum(a, 0.0), 0.0)
    a[keep == 1] = np.maximum(a[keep == 1], 0.0)
    a = np.where(keep == 1, a, 0)
    a = np.maximum(a, cv2.erode(keep.astype(np.float32), np.ones((3, 3), np.uint8)))

    # 2) contraer ~3 px (a escala x4) para eliminar el halo crema y suavizar
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
    Image.fromarray(out, "RGBA").save(f"work/{pid}-cut.png")
    print(pid, out.shape, flush=True)

for pid in (sys.argv[1:] or IDS):
    clean(pid)
