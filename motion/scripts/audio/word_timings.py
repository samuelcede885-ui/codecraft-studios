"""
Tiempos por palabra para los subtítulos palabra a palabra (sin alineador externo).

  python3 scripts/audio/word_timings.py public/audio/reel04/reel04-voz.mp3 src/compositions/Reel04/voice.json src/compositions/Reel04/words.json

Para cada frase (segundo de entrada conocido) busca en el audio su final real y las pausas
internas (comas, dos puntos, puntos). Cada tramo entre pausas se reparte entre sus palabras según
su número de letras (las vocales pesan algo más, como las sílabas). Precisión típica: ~0,1 s.
"""
import json
import re
import subprocess
import sys

import numpy as np

SR = 16000
audio, voice_json, out = sys.argv[1], sys.argv[2], sys.argv[3]
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", audio, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768
hop = int(0.01 * SR)
env = np.array([np.sqrt(np.mean(x[i : i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
voiced = env > max(0.012, np.percentile(env, 60) * 0.25)
lines = json.load(open(voice_json))


def weight(w):
    letters = re.sub(r"[^\wáéíóúüñÁÉÍÓÚÜÑ]", "", w)
    return max(1.0, len(letters) + 0.6 * len(re.findall(r"[aeiouáéíóú]", letters.lower())))


words = []
for li, line in enumerate(lines):
    start = line["at"]
    nxt = lines[li + 1]["at"] if li + 1 < len(lines) else len(env) / 100
    a, b = int(start * 100), int(nxt * 100)
    seg = voiced[a:b]
    idx = np.where(seg)[0]
    s0, s1 = a + idx[0], a + idx[-1] + 1
    # Pausas internas: tramos sin voz de 0,12 s o más.
    pauses = []
    run = 0
    for i in range(s0, s1):
        if not voiced[i]:
            run += 1
        else:
            if run >= 12:
                pauses.append((i - run, i))
            run = 0
    toks = line["text"].split()
    # Grupos de palabras separados por puntuación fuerte (coinciden con las pausas, en orden).
    groups, cur = [], []
    for w in toks:
        cur.append(w)
        if re.search(r"[,.:;?!]$", w):
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    # Tramos de voz: si hay tantas pausas como cortes, se usan; si no, se reparte todo junto.
    spans = []
    if len(pauses) >= len(groups) - 1 and len(groups) > 1:
        # Elegir las pausas más largas (tantas como cortes) en orden temporal.
        longest = sorted(sorted(pauses, key=lambda p: p[0] - p[1])[: len(groups) - 1])
        edges = [s0] + [e for p in longest for e in p] + [s1]
        spans = [(edges[2 * k], edges[2 * k + 1]) for k in range(len(groups))]
    else:
        groups = [toks]
        spans = [(s0, s1)]
    for g, (p0, p1) in zip(groups, spans):
        ws = [weight(w) for w in g]
        total = sum(ws)
        t = p0 / 100
        for w, wt in zip(g, ws):
            d = (p1 - p0) / 100 * wt / total
            words.append({"w": w, "t0": round(t, 3), "t1": round(t + d, 3), "line": li})
            t += d
json.dump(words, open(out, "w"), ensure_ascii=False, indent=0)
print(len(words), "palabras")
