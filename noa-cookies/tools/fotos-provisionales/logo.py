"""Logo provisional de una marca: lo recorta de una captura, lo amplía y lo traza como vector.

    python3 logo.py <captura> <x0> <y0> <x1> <y1> --models <dir> --out <logo.json> [--canal g] [--umbral 110]

Sirve para logos de un solo color sobre fondo liso (p. ej. la foto de perfil de
Instagram). El resultado es un JSON con el `viewBox` y el `d` de un <path> que se
pinta con `fill-rule="evenodd"`, de modo que puede tomar cualquier color.

Es un trazado aproximado a partir de una captura: se sustituye por el archivo
vectorial de la marca en cuanto esté disponible.
"""
import argparse
import json
from pathlib import Path

import cv2
import ncnn
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument("source")
parser.add_argument("box", nargs=4, type=int)
parser.add_argument("--models", required=True)
parser.add_argument("--out", required=True)
parser.add_argument("--canal", default="g", choices=["r", "g", "b"], help="canal que separa el logo del fondo")
parser.add_argument("--umbral", type=int, default=110)
parser.add_argument("--oscuro", action="store_true", help="el logo es más oscuro que el fondo en ese canal")
parser.add_argument("--preview")
args = parser.parse_args()

x0, y0, x1, y1 = args.box
img = cv2.cvtColor(cv2.imread(args.source), cv2.COLOR_BGR2RGB)[y0:y1, x0:x1]

# Ampliación ×4 con Real-ESRGAN: bordes limpios antes de umbralizar.
net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = 4
net.load_param(str(Path(args.models) / "realesrgan-x4plus.param"))
net.load_model(str(Path(args.models) / "realesrgan-x4plus.bin"))
pad = 12
src = cv2.copyMakeBorder(img, pad, pad, pad, pad, cv2.BORDER_REFLECT_101)
mat = ncnn.Mat.from_pixels(np.ascontiguousarray(src), ncnn.Mat.PixelType.PIXEL_RGB, src.shape[1], src.shape[0])
mat.substract_mean_normalize([], [1 / 255.0] * 3)
ex = net.create_extractor()
ex.input("data", mat)
_, out = ex.extract("output")
up = np.clip(np.array(out).transpose(1, 2, 0) * 255.0, 0, 255)[pad * 4:-pad * 4, pad * 4:-pad * 4]

# Máscara: un canal, suavizado y umbral. Se amplía ×2 más para que el contorno sea fino.
channel = up[..., "rgb".index(args.canal)].astype(np.float32)
channel = cv2.resize(channel, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
channel = cv2.GaussianBlur(channel, (0, 0), 2.2)
mask = ((channel < args.umbral) if args.oscuro else (channel > args.umbral)).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
keep = np.zeros_like(mask)
if n > 1:
    biggest = stats[1:, cv2.CC_STAT_AREA].max()
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > 0.004 * biggest:    # conserva los puntos de las íes
            keep[lab == i] = 1
ys, xs = np.nonzero(keep)
m = 6
keep = keep[max(ys.min() - m, 0):ys.max() + m, max(xs.min() - m, 0):xs.max() + m]

contours, _ = cv2.findContours(keep, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
scale = 8.0                                               # píxeles de máscara por píxel de la captura
parts = []
points = 0
for contour in contours:
    if cv2.contourArea(contour) < 40:
        continue
    approx = cv2.approxPolyDP(contour, 0.9, True)[:, 0, :] / scale
    points += len(approx)
    parts.append("M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in approx) + "Z")
h, w = keep.shape
result = {"viewBox": f"0 0 {w / scale:.2f} {h / scale:.2f}", "width": round(w / scale, 2), "height": round(h / scale, 2), "d": "".join(parts)}
Path(args.out).write_text(json.dumps(result) + "\n")
print(f"{len(parts)} contornos, {points} puntos, {w / scale:.0f}×{h / scale:.0f}, {len(result['d']) / 1024:.1f} KB")
if args.preview:
    cv2.imwrite(args.preview, keep * 255)
