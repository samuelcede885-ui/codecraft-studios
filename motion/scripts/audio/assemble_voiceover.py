"""Coloca cada frase en su tiempo de entrada sobre una pista de 32 s (48 kHz)."""
import json, sys
import numpy as np
import soundfile as sf

src, out, dur, cues = sys.argv[1], sys.argv[2], float(sys.argv[3]), json.loads(sys.argv[4])
SR = 48000
track = np.zeros(int(dur * SR), dtype=np.float32)
for name, start in cues:
    x, sr = sf.read(f"{src}/{name}.wav", dtype="float32")
    if x.ndim > 1:
        x = x.mean(axis=1)
    # 24 kHz → 48 kHz por interpolación (el remuestreo fino lo hace después ffmpeg/soxr si hace falta)
    t_src = np.arange(len(x)) / sr
    t_dst = np.arange(int(len(x) * SR / sr)) / SR
    y = np.interp(t_dst, t_src, x).astype(np.float32)
    # Fundidos de 8 ms para que ningún corte haga clic.
    f = int(0.008 * SR)
    y[:f] *= np.linspace(0, 1, f)
    y[-f:] *= np.linspace(1, 0, f)
    i = int(start * SR)
    end = i + len(y)
    assert end <= len(track), f"{name} se sale del video ({end / SR:.2f}s)"
    track[i:end] += y
    print(f"{name}\t{start:.2f} → {end / SR:.2f}")
sf.write(out, track, SR, subtype="FLOAT")
