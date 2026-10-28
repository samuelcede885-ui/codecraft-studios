"""
Música y efectos originales del Reel 03 ("Dos negocios"), sintetizados desde cero con las mismas
herramientas que el Reel 02 (generate_reel02.py). Deterministas.

  python3 scripts/audio/generate_reel03.py public/audio/reel03

Requiere reel03-voz.mp3 en la carpeta (la música se agacha bajo la voz). Genera reel03-music.mp3
y reel03-sfx.mp3. Tiempos según src/compositions/Reel03/timeline.ts y ui/*.tsx.
"""
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_reel02 as g  # noqa: E402

SR = g.SR
DUR = 45.0
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/audio/reel03"
rng = np.random.default_rng(2028)
tvec, note, shape, env, decay, soft_saw, reverb, place = g.tvec, g.note, g.shape, g.env, g.decay, g.soft_saw, g.reverb, g.place

PROBLEMA, OTRO, ADMIN, DIF, CIERRE, LOGO = 6.2, 15.2, 24.3, 29.2, 36.9, 37.2
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

    # Gancho: impacto grave y armonía suspendida (dos mundos).
    pad(0.0, PROBLEMA + 0.3, ["D2", "A2", "D3", "E3", "A3"], 0.045, 0.8)
    # Problema: tensión contenida.
    pad(PROBLEMA, OTRO + 0.1, ["D2", "A2", "D3", "F3", "A#3"], 0.045, 0.6, 0.3)
    # "El otro tiene Fary Labs": se abre a fa mayor y entra el ritmo.
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

    bright = np.interp(tvec(DUR), [0, PROBLEMA, OTRO - 0.2, OTRO + 0.6, DIF, CIERRE, DUR], [0.35, 0.1, 0.05, 0.7, 1.0, 0.85, 0.6])
    L = shape(L, cutoff=650) * (1 - bright) + shape(L, cutoff=4400) * bright
    R = shape(R, cutoff=650) * (1 - bright) + shape(R, cutoff=4400) * bright

    for st, en, nts in [(0.0, PROBLEMA + 0.3, ["D2"]), (PROBLEMA, OTRO, ["D2"])] + chords + [(CIERRE, DUR, ["F2"])]:
        t = tvec(en - st)
        sub = np.sin(2 * np.pi * note(nts[0]) / 2 * t) * env(len(t), 0.4, 0.7) * 0.08
        place(L, sub, st)
        place(R, sub, st)

    # Problema: reloj que no para (tic-tac seco, a la izquierda).
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
    t = OTRO + 0.25
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

    for at, dur in [(OTRO - 0.9, 0.9), (DIF - 1.2, 1.2), (CIERRE - 1.4, 1.4)]:
        tt = tvec(dur)
        rise = shape(rng.standard_normal(len(tt)), cutoff=5000, high=600) * (tt / dur) ** 2 * 0.05
        place(L, rise, at)
        place(R, rise, at)

    L = reverb(L, mix=0.3)
    R = reverb(R, mix=0.3)
    fade = np.ones(n)
    fo = int(2.6 * SR)
    fade[-fo:] = np.linspace(1, 0, fo) ** 1.6
    fade[: int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
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

    # 1 · Gancho: golpe grave + la línea de luz
    put(hit, 0.05, 0.9)
    put(shimmer, 0.2, 0.8)
    put(whoosh(1.6, 200, 2000), 1.8, 0.3)
    put(whoosh(1.2), 4.6, 0.3)
    # 2 · Mensajes a la izquierda; toques del cliente a la derecha
    for k, at in enumerate([6.8, 7.5, 8.3, 9.1, 9.8, 10.6, 11.3, 12.0, 12.7]):
        put(ping, at, 0.3 + 0.015 * k, 0.15)
    for at in [8.3, 9.9, 11.5, 12.1]:
        put(tap, at, 0.5, 0.85)
    put(confirm, 12.5, 0.6, 0.8)
    # 3 · El otro tiene Fary Labs
    put(whoosh(1.2, 300, 3000), 15.1, 0.35, 0.7)
    put(tap, 19.6, 0.5, 0.7)
    put(confirm, 20.45, 0.5, 0.7)
    for k in range(5):
        put(tick, 21.3 + k * 14 / 30, 0.5, 0.6)
    put(connect, 23.5, 0.55, 0.7)
    # 4 · Corte arquitectónico: papeles a la izquierda, panel a la derecha
    put(whoosh(1.2, 200, 1800), 23.9, 0.35)
    for k in range(8):
        put(paper(), 24.3 + k * 0.6, 0.6, 0.2)
    for at in [24.9, 25.4, 25.9, 26.4]:
        put(tick, at, 0.55, 0.8)
    put(ping, 27.2, 0.3, 0.8)
    put(ping, 27.95, 0.25, 0.8)
    # 5 · La diferencia
    put(whoosh(1.4, 250, 2400), 29.0, 0.35)
    put(hit, 29.5, 0.45)
    put(hit, 33.8, 0.45)
    for k in range(4):
        put(connect, 30.1 + k * 0.17, 0.2, 0.75)
    # 6 · Cierre
    put(whoosh(2.4, 150, 1600), 36.8, 0.35)
    for k in range(6):
        put(connect, 37.4 + k * 0.45, 0.16, 0.3 + 0.08 * k)
    put(logo, LOGO, 0.8)
    put(ping, 43.8, 0.3)
    m = max(np.max(np.abs(L)), np.max(np.abs(R)))
    return L / m * 0.7, R / m * 0.7


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    tmp = os.path.join(OUT, "_voz.wav")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", os.path.join(OUT, "reel03-voz.mp3"), "-ar", str(SR), tmp], check=True)
    voice = g.read_wav(tmp)
    os.remove(tmp)
    L, R = music()
    L, R = g.duck(L, R, voice)
    for name, (l, r) in [("music", (L, R)), ("sfx", sfx())]:
        wav = os.path.join(OUT, f"reel03-{name}.wav")
        g.write_wav(wav, l, r)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "256k", wav[:-4] + ".mp3"], check=True)
        os.remove(wav)
    print("audio listo en", OUT)
