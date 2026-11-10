"""Recorta cada producto del menu publico de NOA y lo amplia x4 con Real-ESRGAN (ncnn, CPU)."""
import sys, time, json
import numpy as np, cv2, ncnn
from pathlib import Path

ROOT = Path(__file__).parent
CROPS = {
    # id: (archivo, x0, y0, x1, y1) en pixeles de la captura original 1170x2532
    "choco-lovers":    ("menu-cookies",    105,  480,  495,  905),
    "signature":       ("menu-cookies",    655,  485, 1095,  905),
    "velvet":          ("menu-cookies",    340, 1040,  825, 1465),
    "nutella-bomb":    ("menu-cookies",     50, 1570,  515, 2022),
    "mani-fica":       ("menu-cookies",    680, 1530, 1125, 2025),
    "noa-roll":        ("menu-especiales",  85,  455,  480,  840),
    "pastelito":       ("menu-especiales", 605,  500, 1165,  790),
    "cookie-sandwich": ("menu-especiales",  55, 1090,  500, 1400),
    "cookie-cake":     ("menu-especiales", 615, 1095, 1160, 1405),
    "logo":            ("perfil",           37,  322,  319,  603),
}

net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = 4
net.load_param(str(ROOT / "models/ncnn/models/realesrgan-x4plus.param"))
net.load_model(str(ROOT / "models/ncnn/models/realesrgan-x4plus.bin"))

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

only = sys.argv[1:]
for pid, (src, x0, y0, x1, y1) in CROPS.items():
    if only and pid not in only:
        continue
    t = time.time()
    img = cv2.cvtColor(cv2.imread(str(ROOT / f"src/{src}.png")), cv2.COLOR_BGR2RGB)[y0:y1, x0:x1]
    cv2.imwrite(str(ROOT / f"work/{pid}-crop.png"), cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
    up = upscale(img)
    cv2.imwrite(str(ROOT / f"work/{pid}-x4.png"), cv2.cvtColor(up, cv2.COLOR_RGB2BGR))
    print(pid, img.shape, "->", up.shape, f"{time.time() - t:.0f}s", flush=True)
