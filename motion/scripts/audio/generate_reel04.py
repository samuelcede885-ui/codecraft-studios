"""
Música y efectos originales del Reel 04 ("Una Venezuela conectada"), sintetizados desde cero con las mismas
herramientas que el Reel 02 (generate_reel02.py). Deterministas.

  python3 scripts/audio/generate_reel04.py public/audio/reel04

Requiere reel04-voz.mp3 en la carpeta (la música se agacha bajo la voz). Genera reel04-music.mp3
y reel04-sfx.mp3. Tiempos según src/compositions/Reel04/timeline.ts y ui/*.tsx.
"""
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_reel02 as g  # noqa: E402

SR = g.SR
DUR = 47.2
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/audio/reel04"
rng = np.random.default_rng(2029)
tvec, note, shape, env, decay, soft_saw, reverb, place = g.tvec, g.note, g.shape, g.env, g.decay, g.soft_saw, g.reverb, g.place

COMPRA, CIUDAD, PROBLEMA, OTRO, ADMIN, DIF, CIERRE, LOGO = 4.0, 11.0, 18.0, 23.6, 26.2, 33.5, 41.4, 41.8
BPM = 104
BEAT = 60 / BPM
BAR = 4 * BEAT


def music():
    n = int(DUR * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    def pad(start, end, notes, gain=0.045, attack=1.0, release=1.2):
        t = tvec(end - start)
        e = env(len(t), attack, release)
        for k, nm in enumerate(notes):
            place(L, soft_saw(note(nm) * 0.997, t) * e * gain, start)
            place(R, soft_saw(note(nm) * 1.003, t) * e * gain, start)

    # Inicio intrigante y compra: re suspendido; la ciudad crece; tensión en los procesos.
    pad(0.0, CIUDAD + 0.3, ["D2", "A2", "D3", "E3", "A3"], 0.04, 0.05)
    pad(CIUDAD, PROBLEMA + 0.3, ["F2", "C3", "F3", "G3", "C4"], 0.045, 0.8)
    pad(PROBLEMA, OTRO + 0.1, ["D2", "A2", "D3", "F3", "A#3"], 0.045, 0.6, 0.3)
    prog = [["F2", "C3", "F3", "A3", "C4"], ["C2", "G2", "C3", "E3", "G3"], ["D2", "A2", "D3", "F3", "A3"], ["A#1", "F2", "A#2", "D3", "F3"]]
    chords = []
    t0 = OTRO
    i = 0
    while t0 < CIERRE:
        chords.append((t0, min(t0 + 2 * BAR + 0.3, CIERRE + 0.4), prog[i % 4]))
        t0 += 2 * BAR
        i += 1
    for st, en, nts in chords:
        pad(st, en, nts, 0.042, 0.35, 0.5)
    pad(CIERRE, DUR, ["F2", "C3", "F3", "A3", "C4", "G4"], 0.05, 0.5, 3.0)

    bright = np.interp(tvec(DUR), [0, COMPRA, CIUDAD, PROBLEMA, OTRO - 0.2, OTRO + 0.6, DIF, CIERRE, DUR], [0.3, 0.45, 0.6, 0.15, 0.05, 0.65, 1.0, 0.85, 0.6])
    L = shape(L, cutoff=650) * (1 - bright) + shape(L, cutoff=4400) * bright
    R = shape(R, cutoff=650) * (1 - bright) + shape(R, cutoff=4400) * bright

    for st, en, nts in [(0.0, CIUDAD + 0.3, ["D2"]), (CIUDAD, PROBLEMA + 0.3, ["F2"]), (PROBLEMA, OTRO, ["D2"])] + chords + [(CIERRE, DUR, ["F2"])]:
        t = tvec(en - st)
        sub = np.sin(2 * np.pi * note(nts[0]) / 2 * t) * env(len(t), 0.4, 0.7) * 0.08
        place(L, sub, st)
        place(R, sub, st)

    # Pulso electrónico profundo desde el primer fotograma (gancho) hasta la ciudad.
    t = 0.0
    while t < CIUDAD:
        tt = tvec(0.3)
        thump = np.sin(2 * np.pi * np.cumsum(np.linspace(70, 40, len(tt))) / SR) * decay(len(tt), 0.09) * 0.3
        place(L, thump, t)
        place(R, thump, t)
        t += 60 / 104 * 2
    # Procesos separados: reloj suave.
    t = PROBLEMA + 0.2
    k = 0
    while t < OTRO - 0.2:
        tt = tvec(0.05)
        tick = shape(rng.standard_normal(len(tt)), high=2500) * decay(len(tt), 0.006) * (0.12 if k % 2 else 0.09)
        place(L, tick * 1.3, t)
        place(R, tick * 0.5, t)
        t += 0.5
        k += 1

    # Ritmo desde "el otro tiene Fary Labs".
    kt = tvec(0.34)
    kick = np.sin(2 * np.pi * np.cumsum(np.linspace(115, 44, len(kt))) / SR) * decay(len(kt), 0.1) * 0.34
    hat = shape(rng.standard_normal(int(0.04 * SR)), high=7500) * decay(int(0.04 * SR), 0.011) * 0.045
    t = OTRO + 0.4
    while t < CIERRE - 0.05:
        lvl = 0.6 if t < ADMIN else 0.85 if t < DIF else 1.0
        place(L, kick * lvl, t)
        place(R, kick * lvl, t)
        if t >= OTRO + BAR:
            place(L, hat * lvl * 0.9, t + BEAT / 2)
            place(R, hat * lvl, t + BEAT / 2)
        if t >= DIF:
            place(L, hat * 0.5, t + BEAT / 4 * 3)
            place(R, hat * 0.6, t + BEAT / 4)
        t += BEAT

    def pluck(freq, gain):
        tt = tvec(0.3)
        return (np.sin(2 * np.pi * freq * tt) + 0.3 * np.sin(4 * np.pi * freq * tt)) * decay(len(tt), 0.09) * gain

    for st, en, nts in chords:
        tones = [note(nm) * 2 for nm in nts[1:]]
        step = BEAT / 4 if st >= DIF else BEAT / 2
        gain = 0.035 if st < DIF else 0.05
        tt = st
        j = 0
        while tt < min(en - 0.05, CIERRE):
            f = tones[[0, 2, 1, 3, 2, 1][j % 6] % len(tones)]
            p = pluck(f, gain)
            pan = 0.6 + 0.3 * np.sin(j * 0.9)  # el lado digital (derecha) brilla más
            place(L, p * (1 - pan) * 1.4, tt)
            place(R, p * pan * 1.4, tt)
            tt += step
            j += 1

    for at, dur in [(CIUDAD - 0.8, 0.8), (OTRO - 0.9, 0.9), (DIF - 1.2, 1.2), (CIERRE - 1.4, 1.4)]:
        tt = tvec(dur)
        rise = shape(rng.standard_normal(len(tt)), cutoff=5000, high=600) * (tt / dur) ** 2 * 0.05
        place(L, rise, at)
        place(R, rise, at)

    L = reverb(L, mix=0.3)
    R = reverb(R, mix=0.3)
    fade = np.ones(n)
    fo = int(2.6 * SR)
    fade[-fo:] = np.linspace(1, 0, fo) ** 1.6
    fade[: int(0.02 * SR)] = np.linspace(0, 1, int(0.02 * SR))
    L, R = L * fade, R * fade
    m = max(np.max(np.abs(L)), np.max(np.abs(R)))
    return L / m * 0.8, R / m * 0.8


def sfx():
    n = int(DUR * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    def put(sig, at, gain=1.0, pan=0.5):
        place(L, sig * gain * (1 - pan), at)
        place(R, sig * gain * pan, at)

    t = tvec(0.45)
    ping = reverb(np.sin(2 * np.pi * 1480 * t) * decay(len(t), 0.07) * 0.5 + np.sin(2 * np.pi * 1975 * t) * decay(len(t), 0.05) * 0.3, 0.9, 0.25)
    t = tvec(0.07)
    tap = np.sin(2 * np.pi * 820 * t) * decay(len(t), 0.016) * 0.6
    t = tvec(0.06)
    tick = shape(rng.standard_normal(len(t)), high=3500) * decay(len(t), 0.004) * 0.45 + np.sin(2 * np.pi * 2600 * t) * decay(len(t), 0.008) * 0.25

    def whoosh(dur, lo=300, hi=2600):
        tt = tvec(dur)
        return shape(rng.standard_normal(len(tt)), cutoff=hi, high=lo) * np.sin(np.pi * tt / dur) ** 2 * 0.5

    def paper():
        tt = tvec(0.18)
        return shape(rng.standard_normal(len(tt)), cutoff=6000, high=1500) * decay(len(tt), 0.05) * 0.25

    t = tvec(0.4)
    connect = reverb(np.sin(2 * np.pi * np.cumsum(np.linspace(560, 1120, len(t))) / SR) * env(len(t), 0.02, 0.22) * decay(len(t), 0.2) * 0.45, 1.2, 0.3)
    t = tvec(1.0)
    chime = sum(np.concatenate([np.zeros(int(d * SR)), np.sin(2 * np.pi * note(nm) * t)[: len(t) - int(d * SR)]]) * decay(len(t), 0.35) for nm, d in [("F5", 0), ("A5", 0.06), ("C6", 0.12)])
    confirm = reverb(chime * 0.22, 1.6, 0.3)
    t = tvec(1.8)
    hit = reverb(np.sin(2 * np.pi * np.cumsum(np.linspace(90, 40, len(t))) / SR) * decay(len(t), 0.4) * 0.6, 2.2, 0.35)
    t = tvec(1.4)
    shimmer = reverb(sum(np.sin(2 * np.pi * note(nm) * t) for nm in ["A5", "E6", "A6"]) * env(len(t), 0.4, 0.8) * 0.05, 1.6, 0.4)
    t = tvec(2.2)
    logo = reverb(np.sin(2 * np.pi * np.cumsum(np.linspace(78, 42, len(t))) / SR) * decay(len(t), 0.55) * 0.55 + sum(np.sin(2 * np.pi * note(nm) * t) for nm in ["F5", "C6", "A6"]) * env(len(t), 0.05, 1.3) * decay(len(t), 0.7) * 0.07, 2.4, 0.35)

    # 1 · Un solo toque
    put(shimmer, 0.0, 0.5)
    put(tap, 1.2, 0.8)
    put(connect, 1.22, 0.6)
    put(whoosh(1.4, 300, 3500), 2.2, 0.4)
    put(whoosh(0.9, 500, 4500), 3.2, 0.35)
    # 2 · La compra (ui/Story.tsx)
    for at in [5.5, 7.9, 8.6, 9.5]:
        put(tap, at, 0.5, 0.7)
    put(tick, 8.65, 0.5, 0.7)
    put(confirm, 9.75, 0.6, 0.7)
    put(whoosh(1.2, 400, 3000), 9.8, 0.35)
    put(hit, 10.95, 0.35)
    # 3 · La ciudad se construye: cada negocio encaja
    put(whoosh(2.0, 150, 1600), 11.4, 0.3)
    for k in range(5):
        put(hit, 11.9 + k * 0.7, 0.18, 0.3 + 0.1 * k)
        put(tick, 12.25 + k * 0.7, 0.4, 0.3 + 0.1 * k)
    # 4 · Procesos separados
    for k in range(5):
        put(ping, 18.4 + k * 0.3, 0.28, 0.25)
    put(paper(), 20.6, 0.9)
    for k in range(4):
        put(paper(), 21.3 + k * 0.25, 0.6, 0.4 + 0.1 * k)
    # 5 · La conexión
    put(hit, 24.0, 0.7)
    put(connect, 24.05, 0.6)
    put(whoosh(1.3, 300, 3000), 24.3, 0.3)
    for k in range(5):
        put(tick, 26.2 + k * 0.82, 0.55, 0.6)
    put(connect, 28.7, 0.4, 0.6)
    for at in [30.9, 31.3, 31.7]:
        put(tick, at, 0.5, 0.6)
    put(ping, 32.2, 0.3, 0.7)
    put(ping, 32.7, 0.25, 0.7)
    put(whoosh(1.6, 200, 2400), 33.3, 0.4)
    # 6 · Venezuela conectada
    for k in range(10):
        put(connect, 34.0 + k * 0.5, 0.16, 0.2 + 0.07 * k)
    # 7 · Cierre
    put(whoosh(2.2, 150, 1600), 41.2, 0.35)
    put(logo, LOGO, 0.8)
    put(ping, 44.1, 0.3)
    put(shimmer, 45.2, 0.6)
    m = max(np.max(np.abs(L)), np.max(np.abs(R)))
    return L / m * 0.7, R / m * 0.7


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    tmp = os.path.join(OUT, "_voz.wav")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", os.path.join(OUT, "reel04-voz.mp3"), "-ar", str(SR), tmp], check=True)
    voice = g.read_wav(tmp)
    os.remove(tmp)
    L, R = music()
    L, R = g.duck(L, R, voice)
    for name, (l, r) in [("music", (L, R)), ("sfx", sfx())]:
        wav = os.path.join(OUT, f"reel04-{name}.wav")
        g.write_wav(wav, l, r)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "256k", wav[:-4] + ".mp3"], check=True)
        os.remove(wav)
    print("audio listo en", OUT)
