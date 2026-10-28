"""
Locución TEMPORAL del Reel 04 con Kokoro (modelo abierto, local). Sirve para sincronizar el video;
la versión definitiva debería grabarla una persona (o un motor de voz superior) con el mismo guion
y los mismos tiempos de entrada.

  pip install kokoro-onnx soundfile
  python3 scripts/audio/generate_reel04_voice.py <carpeta con kokoro-v1.0.onnx y voices-v1.0.bin> public/audio/reel04

Genera reel04-voz.mp3 (48 kHz, estéreo) con cada frase en su segundo de entrada (timeline.ts → voice).
"""
import os
import subprocess
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

MODELS, OUT = sys.argv[1], sys.argv[2]
DUR = 47.2
SR = 48000

# (id, segundo de entrada, velocidad, texto) — mismos tiempos que src/compositions/Reel04/timeline.ts
LINES = [
    ("w01", 0.3, 0.86, "¿Y si comprar en Venezuela fuera así de fácil?"),
    ("w02", 4.0, 0.88, "Un toque para descubrir una tienda."),
    ("w03", 6.6, 0.88, "Otro para elegir un producto."),
    ("w04", 9.0, 0.88, "Y un pedido que llega directo al negocio."),
    ("w05", 12.0, 0.9, "Ahora imagina esa experiencia en muchos comercios: restaurantes, tiendas y servicios."),
    ("w06", 18.1, 0.9, "Hoy, muchos todavía dependen de mensajes, libretas y procesos separados."),
    ("w07", 23.2, 0.94, "En Fary Labs queremos cambiar eso con tiendas digitales, aplicaciones para administrar ventas e inventario, y automatizaciones que conecten cada paso."),
    ("w08", 33.6, 0.88, "No es una realidad que ya exista en todas partes."),
    ("w09", 37.1, 0.88, "Es una visión que estamos construyendo para el comercio venezolano."),
    ("w10", 42.2, 0.86, "¿Tienes un negocio? Comenta CONECTAR y hablemos."),
]


def trim(x, sr, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    return x[max(0, idx[0] - int(0.03 * sr)) : min(len(x), idx[-1] + int(0.08 * sr))]


def main():
    os.makedirs(OUT, exist_ok=True)
    k = Kokoro(f"{MODELS}/kokoro-v1.0.onnx", f"{MODELS}/voices-v1.0.bin")
    # Voz masculina en español, con un poco de timbre más grave mezclado.
    style = k.get_voice_style("em_alex") * 0.8 + k.get_voice_style("am_onyx") * 0.2
    track = np.zeros(int(DUR * SR), dtype=np.float32)
    for name, start, speed, text in LINES:
        x, sr = k.create(text, voice=style, speed=speed, lang="es")
        x = trim(np.asarray(x, dtype=np.float32), sr)
        t_dst = np.arange(int(len(x) * SR / sr)) / SR
        y = np.interp(t_dst, np.arange(len(x)) / sr, x).astype(np.float32)
        f = int(0.008 * SR)
        y[:f] *= np.linspace(0, 1, f)
        y[-f:] *= np.linspace(1, 0, f)
        i = int(start * SR)
        assert i + len(y) <= len(track), f"{name} se sale del video"
        track[i : i + len(y)] += y
        print(f"{name}\t{start:5.2f} → {(i + len(y)) / SR:5.2f}\t{text}")
    raw = os.path.join(OUT, "reel04-voz-raw.wav")
    sf.write(raw, track, SR, subtype="FLOAT")
    # Cadena de voz: limpia graves, calidez (150 Hz), presencia (3 kHz), control de sibilantes,
    # compresión suave y un ambiente mínimo para que no suene "en seco".
    chain = ",".join(
        [
            "highpass=f=75",
            "equalizer=f=150:t=q:w=1.0:g=3",
            "equalizer=f=420:t=q:w=1.2:g=-2",
            "equalizer=f=3200:t=q:w=1.4:g=2",
            "deesser=i=0.35",
            "acompressor=threshold=0.12:ratio=2.5:attack=8:release=160:makeup=1.6",
            "aecho=0.9:0.25:38|61:0.12|0.08",
            "loudnorm=I=-16:TP=-1.5:LRA=9",
            "aformat=sample_rates=48000:channel_layouts=stereo",
        ]
    )
    out = os.path.join(OUT, "reel04-voz.mp3")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-af", chain, "-t", str(DUR), "-c:a", "libmp3lame", "-b:a", "256k", out], check=True)
    os.remove(raw)
    print("voz lista:", out)


if __name__ == "__main__":
    main()
