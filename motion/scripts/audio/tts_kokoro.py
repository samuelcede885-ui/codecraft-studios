"""Genera la locución por pasajes continuos (mejor entonación) con la mezcla de voz elegida."""
import json, sys
import soundfile as sf
from kokoro_onnx import Kokoro

models, out, spec = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
k = Kokoro(f"{models}/kokoro-v1.0.onnx", f"{models}/voices-v1.0.bin")
style = k.get_voice_style("em_alex") * 0.8 + k.get_voice_style("am_onyx") * 0.2
for name, text, speed in spec:
    x, sr = k.create(text, voice=style, speed=speed, lang="es")
    sf.write(f"{out}/{name}.wav", x, sr)
    print(f"{name}\t{len(x)/sr:.2f}s\t{text}")
