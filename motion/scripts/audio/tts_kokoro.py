"""Genera cada frase de la locución con Kokoro (em_alex, español) y reporta su duración."""
import json, sys
import soundfile as sf
from kokoro_onnx import Kokoro

models, out, spec = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
k = Kokoro(f"{models}/kokoro-v1.0.onnx", f"{models}/voices-v1.0.bin")
for name, text, speed in spec:
    samples, sr = k.create(text, voice="em_alex", speed=speed, lang="es")
    sf.write(f"{out}/{name}.wav", samples, sr)
    print(f"{name}\t{len(samples)/sr:.2f}s\tspeed={speed}\t{text}")
