# Audio del Reel 01

- `generate_reel01.py` — efectos originales sintetizados (y la música, que ya no se usa en el reel).
- `tts_kokoro.py` — genera cada frase de la locución con Kokoro v1.0 (local, voz `em_alex`).
- `assemble_voiceover.py` — coloca las frases en su tiempo sobre una pista de 32 s.

Locución (resultado en `public/audio/reel01-voz.wav`; guion y tiempos en `data/reels.ts` → `voiceover`):

```bash
python3 -m venv .tts && .tts/bin/pip install kokoro-onnx soundfile
# modelos: github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0): kokoro-v1.0.onnx, voices-v1.0.bin
.tts/bin/python scripts/audio/tts_kokoro.py <modelos> <salida> '[["01-intro","Si tu negocio…",1.0], …]'
.tts/bin/python scripts/audio/assemble_voiceover.py <salida> voz.wav 32.0 '[["01-intro",0.30], …]'
# masterización: highpass 80 Hz, EQ (−2 dB a 250 Hz, +2 dB a 3,5 kHz, +1 dB sobre 10 kHz),
# compresión 2:1 y loudnorm a −16 LUFS / −1,5 dBTP en dos pasadas (ffmpeg).
```
