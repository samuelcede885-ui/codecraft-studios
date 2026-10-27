"""
Música y efectos originales del Reel 02, sintetizados desde cero (sin muestras ni licencias de
terceros). Determinista: misma salida en cada ejecución.

  python3 scripts/audio/generate_reel02.py public/audio/reel02

Requiere reel02-voz.mp3 en la misma carpeta (la música se agacha bajo la voz).
Genera:
  reel02-music.mp3   electrónica ambiental: pulso suave, bajo controlado, clímax al conectar la ciudad
  reel02-sfx.mp3     efectos discretos colocados en los momentos de la historia (timeline.ts)

Si cambian los tiempos de timeline.ts / ui/*.tsx, actualizar las constantes de abajo.
"""
import os
import sys
import wave

import numpy as np

SR = 48000
DUR = 63.5
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/audio/reel02"
rng = np.random.default_rng(2027)

# ── utilidades (mismas ideas que generate_reel01.py) ─────────────────────────


def tvec(dur):
    return np.arange(int(dur * SR)) / SR


def note(name):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    return 440.0 * 2 ** ((12 * (int(name[-1]) + 1) + names[name[:-1]] - 69) / 12)


def shape(x, cutoff=None, high=None, order=2):
    n = len(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X = np.fft.rfft(x)
    if cutoff:
        X *= 1 / np.sqrt(1 + (f / cutoff) ** (2 * order))
    if high:
        X *= 1 / np.sqrt(1 + (high / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X, n)


def env(n, attack, release):
    e = np.ones(n)
    a = min(n // 2, max(1, int(attack * SR)))
    r = min(n // 2, max(1, int(release * SR)))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r)
    return e


def decay(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def soft_saw(freq, t, harmonics=8, tilt=1.7):
    return sum(np.sin(2 * np.pi * freq * k * t) / k**tilt for k in range(1, harmonics + 1))


def reverb(x, seconds=2.8, mix=0.3, tone=5000):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / (seconds / 5))
    ir = shape(ir, cutoff=tone)
    ir /= np.sqrt(np.sum(ir**2))
    size = len(x) + n
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return (1 - mix) * x + mix * wet * 0.6


def place(track, sig, at):
    i = int(at * SR)
    j = min(len(track), i + len(sig))
    if 0 <= i < len(track):
        track[i:j] += sig[: j - i]


def write_wav(path, L, R):
    data = np.column_stack([np.clip(L, -1, 1), np.clip(R, -1, 1)])
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((data * 32767).astype("<i2").tobytes())


def read_wav(path):
    with wave.open(path, "rb") as w:
        n, ch, sw = w.getnframes(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype="<i2" if sw == 2 else "<i4").astype(np.float64) / (32768 if sw == 2 else 2**31)
    return x.reshape(-1, ch).mean(axis=1)


# ── tiempos (s), según timeline.ts ───────────────────────────────────────────
PROBLEMA, FREEZE, UNFREEZE, VISION, COMPRA, GESTION, AUTO, COMUNIDAD, CIERRE, LOGO = 7.2, 13.1, 14.1, 14.6, 20.4, 29.8, 36.2, 44.4, 54.0, 54.6
BPM = 104
BEAT = 60 / BPM
BAR = 4 * BEAT

# ── música ───────────────────────────────────────────────────────────────────


def music():
    n = int(DUR * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    def pad(start, end, notes, gain=0.05, attack=1.2, release=1.4):
        t = tvec(end - start)
        e = env(len(t), attack, release)
        for k, nm in enumerate(notes):
            f = note(nm)
            g = gain * (1.2 if k == 0 else 1)
            place(L, soft_saw(f * 0.997, t) * e * g, start)
            place(R, soft_saw(f * 1.003, t) * e * g, start)

    # 1–2 · Ciudad y problema: re menor oscuro; la tensión crece con un semitono que roza.
    pad(0.0, 7.6, ["D2", "A2", "D3", "F3", "A3"], 0.045, 2.5)
    pad(7.0, FREEZE + 0.05, ["D2", "A2", "D3", "F3", "A#3"], 0.05, 1.2, 0.15)
    # 3 · Congelado: silencio casi total; al soltarse entra el acorde abierto.
    prog = [["F2", "C3", "F3", "A3", "C4"], ["C2", "G2", "C3", "E3", "G3"], ["D2", "A2", "D3", "F3", "A3"], ["A#1", "F2", "A#2", "D3", "F3"]]
    chords = []
    t0 = UNFREEZE
    i = 0
    while t0 < CIERRE:
        chords.append((t0, min(t0 + 2 * BAR + 0.3, CIERRE + 0.4), prog[i % 4]))
        t0 += 2 * BAR
        i += 1
    for start, end, notes in chords:
        pad(start, end, notes, 0.042, 0.4, 0.6)
    pad(CIERRE, DUR, ["F2", "C3", "F3", "A3", "C4", "G4"], 0.05, 0.6, 3.5)

    # Brillo del pad: cerrado en el problema, se abre desde la visión y al máximo en la comunidad.
    bright = np.interp(tvec(DUR), [0, PROBLEMA, FREEZE, UNFREEZE, COMPRA, COMUNIDAD, CIERRE, DUR], [0.25, 0.1, 0.0, 0.55, 0.7, 1.0, 0.8, 0.6])
    L = shape(L, cutoff=600) * (1 - bright) + shape(L, cutoff=4200) * bright
    R = shape(R, cutoff=600) * (1 - bright) + shape(R, cutoff=4200) * bright

    # Sub bajo controlado: raíz de cada acorde, sin ataque (no tapa la voz).
    for start, end, notes in [(0.0, 7.6, ["D2"]), (7.0, FREEZE, ["D2"])] + chords + [(CIERRE, DUR, ["F2"])]:
        t = tvec(end - start)
        s = np.sin(2 * np.pi * note(notes[0]) / 2 * t) * env(len(t), 0.5, 0.8) * 0.085
        place(L, s, start)
        place(R, s, start)

    # Pulso tecnológico (problema): latido que se acelera con los mensajes.
    beat = 4.4
    gap = 0.62
    while beat < FREEZE - 0.1:
        t = tvec(0.22)
        k = np.sin(2 * np.pi * np.cumsum(np.linspace(90, 48, len(t))) / SR) * decay(len(t), 0.07) * 0.22
        place(L, k, beat)
        place(R, k, beat)
        beat += gap
        gap = max(0.36, gap * 0.97)

    # Ritmo desde la visión: bombo suave, hi-hat y arpegio en semicorcheas apagadas.
    kick_t = tvec(0.34)
    kick = np.sin(2 * np.pi * np.cumsum(np.linspace(115, 44, len(kick_t))) / SR) * decay(len(kick_t), 0.1) * 0.34
    hat = shape(rng.standard_normal(int(0.04 * SR)), high=7500) * decay(int(0.04 * SR), 0.011) * 0.045
    t = UNFREEZE + 2 * BAR
    while t < CIERRE - 0.05:
        lvl = 0.55 if t < AUTO else 0.8 if t < COMUNIDAD else 1.0
        place(L, kick * lvl, t)
        place(R, kick * lvl, t)
        if t >= COMPRA:
            place(L, hat * lvl * 0.9, t + BEAT / 2)
            place(R, hat * lvl, t + BEAT / 2)
        if t >= AUTO:
            place(L, hat * 0.5 * lvl, t + BEAT / 4 * 3)
            place(R, hat * 0.6 * lvl, t + BEAT / 4)
        t += BEAT

    def pluck(freq, gain):
        tt = tvec(0.3)
        return (np.sin(2 * np.pi * freq * tt) + 0.3 * np.sin(4 * np.pi * freq * tt)) * decay(len(tt), 0.09) * gain

    for start, end, notes in chords:
        tones = [note(nm) * 2 for nm in notes[1:]]
        step = BEAT / 4 if start >= AUTO else BEAT / 2
        gain = 0.03 if start < AUTO else 0.04 if start < COMUNIDAD else 0.05
        tt = start
        j = 0
        while tt < min(end - 0.05, CIERRE):
            f = tones[[0, 2, 1, 3, 2, 1][j % 6] % len(tones)] * (2 if start >= COMUNIDAD and j % 4 == 3 else 1)
            p = pluck(f, gain)
            pan = 0.5 + 0.4 * np.sin(j * 0.9)
            place(L, p * (1 - pan) * 1.4, tt)
            place(R, p * pan * 1.4, tt)
            tt += step
            j += 1

    # Subidas (ruido filtrado) antes de la visión, de la comunidad y del cierre.
    for at, dur in [(UNFREEZE - 1.0, 1.0), (COMUNIDAD - 1.6, 1.6), (CIERRE - 1.4, 1.4)]:
        tt = tvec(dur)
        rise = shape(rng.standard_normal(len(tt)), cutoff=5000, high=600) * (tt / dur) ** 2 * 0.05
        place(L, rise, at)
        place(R, rise, at)

    L = reverb(L, mix=0.3)
    R = reverb(R, mix=0.3)
    # Congelado: corte con caída de filtro (todo se detiene) y regreso.
    g = np.interp(tvec(DUR), [FREEZE - 0.1, FREEZE + 0.25, UNFREEZE - 0.05, UNFREEZE + 0.05], [1, 0.12, 0.12, 1])
    L, R = L * g, R * g
    fade = np.ones(n)
    fo = int(3.0 * SR)
    fade[-fo:] = np.linspace(1, 0, fo) ** 1.6
    fade[: int(0.6 * SR)] = np.linspace(0, 1, int(0.6 * SR))
    L, R = L * fade, R * fade
    m = max(np.max(np.abs(L)), np.max(np.abs(R)))
    return L / m * 0.8, R / m * 0.8


def duck(L, R, voice):
    """Agacha la música bajo la voz (~8 dB) con ataque y relajación suaves."""
    v = np.abs(voice[: len(L)])
    v = np.pad(v, (0, max(0, len(L) - len(v))))
    win = int(0.05 * SR)
    lvl = np.convolve(v, np.ones(win) / win, mode="same")
    on = (lvl > 0.02).astype(float)
    # Suavizado: 120 ms de ataque, 450 ms de relajación.
    g = np.empty_like(on)
    a, r = 1 / (0.12 * SR), 1 / (0.45 * SR)
    cur = 0.0
    for i, x in enumerate(on):
        cur += (x - cur) * (a if x > cur else r)
        g[i] = cur
    gain = 1 - 0.6 * g
    return L * gain, R * gain


# ── efectos ──────────────────────────────────────────────────────────────────


def sfx():
    n = int(DUR * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    def put(sig, at, gain=1.0, pan=0.5):
        place(L, sig * gain * (1 - pan) * 2 * 0.5, at)
        place(R, sig * gain * pan * 2 * 0.5, at)

    t = tvec(0.45)
    ping = reverb(np.sin(2 * np.pi * 1480 * t) * decay(len(t), 0.07) * 0.5 + np.sin(2 * np.pi * 1975 * t) * decay(len(t), 0.05) * 0.3, 0.9, 0.25)
    t = tvec(0.07)
    tap = np.sin(2 * np.pi * 820 * t) * decay(len(t), 0.016) * 0.6
    t = tvec(0.06)
    tick = shape(rng.standard_normal(len(t)), high=3500) * decay(len(t), 0.004) * 0.45 + np.sin(2 * np.pi * 2600 * t) * decay(len(t), 0.008) * 0.25

    def whoosh(dur, lo=300, hi=2600):
        tt = tvec(dur)
        return shape(rng.standard_normal(len(tt)), cutoff=hi, high=lo) * np.sin(np.pi * tt / dur) ** 2 * 0.5

    t = tvec(0.4)
    connect = reverb(np.sin(2 * np.pi * np.cumsum(np.linspace(560, 1120, len(t))) / SR) * env(len(t), 0.02, 0.22) * decay(len(t), 0.2) * 0.45, 1.2, 0.3)
    t = tvec(1.0)
    chime = sum(np.concatenate([np.zeros(int(d * SR)), np.sin(2 * np.pi * note(nm) * t)[: len(t) - int(d * SR)]]) * decay(len(t), 0.35) for nm, d in [("F5", 0), ("A5", 0.06), ("C6", 0.12)])
    confirm = reverb(chime * 0.22, 1.6, 0.3)
    t = tvec(2.2)
    boom = np.sin(2 * np.pi * np.cumsum(np.linspace(78, 42, len(t))) / SR) * decay(len(t), 0.55) * 0.55
    shimmer = sum(np.sin(2 * np.pi * note(nm) * t) for nm in ["F5", "C6", "A6"]) * env(len(t), 0.05, 1.3) * decay(len(t), 0.7) * 0.07
    logo = reverb(boom + shimmer, 2.4, 0.35)
    t = tvec(0.9)
    # Congelado: "parada de cinta" (tono que cae) y respiración inversa al soltar.
    stop = np.sin(2 * np.pi * np.cumsum(np.linspace(420, 60, len(t))) / SR) * decay(len(t), 0.3) * 0.25
    impact = reverb(np.sin(2 * np.pi * np.cumsum(np.linspace(140, 50, int(1.2 * SR))) / SR) * decay(int(1.2 * SR), 0.35) * 0.5, 2.0, 0.4)

    # 1 · Ciudad
    put(whoosh(2.2, 200, 1800), 0.2, 0.25)
    put(whoosh(1.2), 5.6, 0.4)
    put(whoosh(0.8, 500, 4000), 6.6, 0.3)
    # Mensajes (escenas 1–2): mismos frames que ui/messages.ts
    for k, at in enumerate([4.6, 5.4, 7.9, 8.7, 9.5, 10.2, 10.8, 11.3, 11.7]):
        put(ping, at, 0.32 + 0.02 * k, 0.3 if k % 2 == 0 else 0.7)
    for at in [8.4, 9.6, 10.9]:
        put(tap, at, 0.35)
    # 3 · Congelado y línea azul
    put(stop, FREEZE, 0.8)
    put(impact, UNFREEZE, 0.8)
    put(connect, UNFREEZE + 0.05, 0.6)
    put(whoosh(1.4, 250, 2200), 15.0, 0.35)
    for k in range(7):
        put(connect, 15.4 + k * 0.55, 0.25, 0.3 + 0.06 * k)
    # 4 · Compra (ui/Store.tsx)
    put(whoosh(0.9, 400, 3500), 20.2, 0.35)
    for at in [21.9, 23.6, 24.9, 26.5, 27.3]:
        put(tap, at, 0.5)
    put(tick, 24.95, 0.6)
    put(confirm, 27.75, 0.7)
    # 5 · Gestión (ui/Admin.tsx)
    put(whoosh(0.7, 500, 4000), 29.8, 0.3)
    for at in [31.0, 31.6, 32.2, 32.8, 33.4]:
        put(tick, at, 0.55)
    put(ping, 34.0, 0.4)
    # 6 · Automatización e IA (ui/Automation.tsx)
    put(whoosh(1.6, 150, 1600), 36.0, 0.3)
    for k in range(5):
        put(tick, 36.7 + k * 0.62, 0.45)
    for at in [40.7, 41.5, 42.4, 43.1]:
        put(tap, at, 0.35)
    # 7 · Comunidad
    put(whoosh(2.0, 200, 2400), 44.3, 0.35)
    for k in range(5):
        put(connect, 45.2 + k * 0.27, 0.18, 0.2 + 0.15 * k)
    # 8 · Cierre
    put(logo, LOGO, 0.8)
    put(ping, 62.6, 0.3)
    m = max(np.max(np.abs(L)), np.max(np.abs(R)))
    return L / m * 0.7, R / m * 0.7


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    voz = os.path.join(OUT, "reel02-voz.mp3")
    tmp = os.path.join(OUT, "_voz.wav")
    import subprocess

    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", voz, "-ar", str(SR), tmp], check=True)
    voice = read_wav(tmp)
    os.remove(tmp)
    L, R = music()
    L, R = duck(L, R, voice)
    for name, (l, r) in [("music", (L, R)), ("sfx", sfx())]:
        wav = os.path.join(OUT, f"reel02-{name}.wav")
        write_wav(wav, l, r)
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "256k", wav[:-4] + ".mp3"], check=True)
        os.remove(wav)
    print("audio listo en", OUT)
