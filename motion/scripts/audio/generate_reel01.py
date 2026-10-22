"""
Audio original del Reel 01: música y efectos sintetizados desde cero (sin muestras ni licencias
de terceros). Determinista: misma salida en cada ejecución.

  python3 scripts/audio/generate_reel01.py public/audio

Genera:
  reel01-music.mp3     pista musical de 32 s, sincronizada con las escenas de data/reels.ts
  sfx/*.wav            efectos cortos (los frames de cada uno están en data/reels.ts → audio.sfx)

Si cambian los tiempos de las escenas o de la escritura del formulario, actualizar las constantes
de abajo y volver a generar.
"""
import os
import subprocess
import sys
import wave

import numpy as np

SR = 44100
FPS = 30
DUR = 32.0
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/audio"
rng = np.random.default_rng(2026)

# ── utilidades ──────────────────────────────────────────────────────────────


def tvec(dur):
    return np.arange(int(dur * SR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def note(name):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    return midi(12 * (int(name[-1]) + 1) + names[name[:-1]])


def shape(x, cutoff=None, high=None, order=2):
    """Filtro suave en frecuencia (paso bajo / paso alto) aplicado con FFT."""
    n = len(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    X = np.fft.rfft(x)
    if cutoff:
        X *= 1 / np.sqrt(1 + (f / cutoff) ** (2 * order))
    if high:
        X *= 1 / np.sqrt(1 + (high / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X, n)


def env(n, attack, release, total=None):
    """Envolvente con ataque y caída lineales (en segundos)."""
    e = np.ones(n)
    a = min(n // 2, max(1, int(attack * SR)))
    r = min(n // 2, max(1, int(release * SR)))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r)
    return e


def decay(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def soft_saw(freq, t, harmonics=7, tilt=1.6):
    return sum(np.sin(2 * np.pi * freq * k * t) / k**tilt for k in range(1, harmonics + 1))


def reverb(x, seconds=2.4, mix=0.3, tone=5000):
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
    if i < len(track):
        track[i:j] += sig[: j - i]


def write_wav(path, x, stereo=None):
    x = np.clip(x, -1, 1)
    data = (x * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2 if stereo is not None else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        if stereo is not None:
            r = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
            data = np.column_stack([data, r]).ravel()
        w.writeframes(data.tobytes())


def normalize(x, peak=0.89):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


# ── tiempos (segundos), según data/reels.ts ─────────────────────────────────
F = lambda frame: frame / FPS  # noqa: E731
FARY, WEB, APP, AGENT, RESULT, FINAL = F(180), F(270), F(510), F(615), F(720), F(840)
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT

# ── música ─────────────────────────────────────────────────────────────────


def music():
    n = int(DUR * SR)
    L = np.zeros(n)
    R = np.zeros(n)

    # Pad: acordes largos que se funden. (inicio, fin, notas)
    chords = [
        (0.0, 3.2, ["A2", "E3", "A3", "C4"]),
        (3.0, 6.2, ["F2", "C3", "F3", "A3"]),
        (6.0, WEB + 0.2, ["C3", "G3", "C4", "E4"]),
    ]
    prog = [["A2", "E3", "A3", "C4"], ["F2", "C3", "A3", "C4"], ["C3", "G3", "C4", "E4"], ["G2", "D3", "G3", "B3"]]
    t0 = WEB
    i = 0
    while t0 < RESULT:
        chords.append((t0, min(t0 + BAR + 0.2, RESULT + 0.3), prog[i % 4]))
        t0 += BAR
        i += 1
    chords += [
        (RESULT, RESULT + 2.2, ["F2", "C3", "F3", "A3"]),
        (RESULT + 2.0, FINAL + 0.2, ["G2", "D3", "G3", "D4"]),
        (FINAL, DUR, ["C2", "G2", "C3", "G3", "D4", "E4"]),
    ]
    for start, end, notes in chords:
        t = tvec(end - start)
        e = env(len(t), 0.9 if start < FARY else 0.5, 1.0)
        for k, nm in enumerate(notes):
            f = note(nm)
            l = soft_saw(f * 0.998, t) * e
            r = soft_saw(f * 1.002, t) * e
            gain = 0.05 if k else 0.065
            place(L, l * gain, start)
            place(R, r * gain, start)

    # Pad más oscuro al principio (problema) y más abierto desde Fary.
    bright = np.interp(tvec(DUR), [0, FARY - 0.5, FARY + 1, RESULT, RESULT + 1, FINAL, DUR], [0.0, 0.0, 1.0, 1.0, 0.3, 0.6, 1.0])
    dark_L, dark_R = shape(L, cutoff=700), shape(R, cutoff=700)
    open_L, open_R = shape(L, cutoff=3200), shape(R, cutoff=3200)
    L = dark_L * (1 - bright) + open_L * bright
    R = dark_R * (1 - bright) + open_R * bright

    # Sub: raíz del acorde, muy suave.
    for start, end, notes in chords:
        t = tvec(end - start)
        s = np.sin(2 * np.pi * note(notes[0]) / 2 * t) * env(len(t), 0.4, 0.6) * 0.07
        place(L, s, start)
        place(R, s, start)

    # Ritmo de la demo (web → app → automatización): bombo suave, hi-hat y arpegio.
    kick_t = tvec(0.32)
    kick = np.sin(2 * np.pi * np.cumsum(np.linspace(110, 42, len(kick_t))) / SR) * decay(len(kick_t), 0.09) * 0.42
    hat = shape(rng.standard_normal(int(0.045 * SR)), high=7000) * decay(int(0.045 * SR), 0.012) * 0.05
    beat = WEB
    k = 0
    while beat < RESULT - 0.01:
        fade_in = min(1.0, (beat - WEB) / (2 * BAR) + 0.35)
        place(L, kick * fade_in, beat)
        place(R, kick * fade_in, beat)
        place(L, hat * fade_in, beat + BEAT / 2)
        place(R, hat * fade_in * 0.8, beat + BEAT / 2)
        beat += BEAT
        k += 1

    # Arpegio pulsado (corcheas) sobre los acordes.
    def pluck(freq, dur=0.42, gain=0.07):
        t = tvec(dur)
        return (np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t)) * decay(len(t), 0.16) * gain

    def arp(start, end, notes, step, gain):
        t = start
        j = 0
        tones = [note(nm) * 2 for nm in notes[1:]] + [note(notes[1]) * 4]
        order = [0, 1, 2, 3, 2, 1]
        while t < end - 0.05:
            f = tones[order[j % len(order)] % len(tones)]
            p = pluck(f, gain=gain)
            pan = 0.5 + 0.35 * np.sin(j * 1.3)
            place(L, p * (1 - pan) * 1.4, t)
            place(R, p * pan * 1.4, t)
            t += step
            j += 1

    arp(FARY + 1.0, WEB, chords[2][2], BEAT, 0.05)  # Fary conecta: se insinúa
    for start, end, notes in chords[3:-3]:
        arp(start, min(end, RESULT), notes, BEAT / 2, 0.06)
    arp(RESULT, FINAL, ["G2", "D3", "G3", "B3"], BEAT, 0.035)  # calma: "mientras descansas"

    # Subida antes de Fary y del cierre (ruido filtrado que crece).
    for at, dur in [(FARY - 1.4, 1.4), (FINAL - 1.2, 1.2)]:
        t = tvec(dur)
        rise = shape(rng.standard_normal(len(t)), cutoff=4000, high=500) * (t / dur) ** 2 * 0.035
        place(L, rise, at)
        place(R, rise[::-1][::-1], at)

    # Espacio y final: reverb, fundido de salida.
    L = reverb(L, mix=0.32)
    R = reverb(R, mix=0.32)
    fade = np.ones(n)
    fo = int(2.4 * SR)
    fade[-fo:] = np.linspace(1, 0, fo) ** 1.5
    fi = int(0.25 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    L, R = L * fade, R * fade
    m = max(np.max(np.abs(L)), np.max(np.abs(R)))
    return L / m * 0.85, R / m * 0.85


# ── efectos ────────────────────────────────────────────────────────────────


def sfx():
    s = {}
    t = tvec(0.06)
    s["tick"] = (shape(rng.standard_normal(len(t)), high=3000) * decay(len(t), 0.004) * 0.5 + np.sin(2 * np.pi * 2400 * t) * decay(len(t), 0.01) * 0.3)
    t = tvec(0.5)
    ping = np.sin(2 * np.pi * 1320 * t) * decay(len(t), 0.09)
    ping2 = np.sin(2 * np.pi * 1760 * t) * decay(len(t), 0.12)
    s["ping"] = reverb(ping * 0.4 + np.concatenate([np.zeros(int(0.07 * SR)), ping2[: len(t) - int(0.07 * SR)]]) * 0.45, 1.2, 0.25)
    t = tvec(0.7)
    noise = rng.standard_normal(len(t))
    bell = np.sin(np.pi * t / 0.7) ** 2
    s["whoosh"] = shape(noise, cutoff=2500, high=300) * bell * 0.5
    t = tvec(0.35)
    glide = np.cumsum(np.linspace(520, 1040, len(t))) / SR
    s["connect"] = reverb(np.sin(2 * np.pi * glide) * env(len(t), 0.02, 0.2) * decay(len(t), 0.18) * 0.45, 1.0, 0.3)
    t = tvec(0.05)
    s["click"] = np.sin(2 * np.pi * 1500 * t) * decay(len(t), 0.008) * 0.5 + shape(rng.standard_normal(len(t)), high=4000) * decay(len(t), 0.003) * 0.3
    t = tvec(0.08)
    s["tap"] = np.sin(2 * np.pi * 760 * t) * decay(len(t), 0.018) * 0.55
    t = tvec(0.9)
    chime = sum(np.concatenate([np.zeros(int(d * SR)), np.sin(2 * np.pi * note(nm) * t)[: len(t) - int(d * SR)]]) * decay(len(t), 0.35) for nm, d in [("C6", 0), ("E6", 0.05), ("G6", 0.1)])
    s["confirm"] = reverb(chime * 0.25, 1.6, 0.3)
    t = tvec(0.18)
    glide = np.cumsum(np.linspace(990, 1320, len(t))) / SR
    s["check"] = np.sin(2 * np.pi * glide) * env(len(t), 0.005, 0.08) * 0.35
    t = tvec(0.6)
    s["pulse"] = reverb(np.sin(2 * np.pi * 220 * t + 2 * np.sin(2 * np.pi * 6 * t)) * np.sin(np.pi * t / 0.6) * 0.3, 1.2, 0.3)
    t = tvec(2.0)
    boom = np.sin(2 * np.pi * np.cumsum(np.linspace(80, 45, len(t))) / SR) * decay(len(t), 0.5) * 0.6
    shimmer = sum(np.sin(2 * np.pi * note(nm) * t) for nm in ["C5", "G5", "E6"]) * env(len(t), 0.05, 1.2) * decay(len(t), 0.6) * 0.08
    s["logo"] = reverb(boom + shimmer, 2.0, 0.35)

    # Escritura en el formulario: una pulsación por letra, en los mismos frames que SiteMobile.
    def typing(text, dur_frames):
        n = len(text)
        frames = [next(f for f in range(dur_frames + 1) if np.floor(f / dur_frames * n + 0.5) >= c) for c in range(1, n + 1)]
        out = np.zeros(int((dur_frames / FPS + 0.2) * SR))
        for i, fr in enumerate(frames):
            k = shape(rng.standard_normal(int(0.03 * SR)), cutoff=5000, high=1800) * decay(int(0.03 * SR), 0.006) * (0.22 + 0.06 * rng.random())
            place(out, k, fr / FPS)
        return out

    s["typing-name"] = typing("Ana", 10)
    s["typing-message"] = typing("¿Tienen disponibilidad el sábado?", 28)
    return s


if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
    L, R = music()
    wav = os.path.join(OUT, "reel01-music.wav")
    write_wav(wav, L, R)
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "192k", os.path.join(OUT, "reel01-music.mp3")], check=True)
    os.remove(wav)
    for name, x in sfx().items():
        write_wav(os.path.join(OUT, "sfx", f"{name}.wav"), normalize(x, 0.8))
    print("audio listo en", OUT)
