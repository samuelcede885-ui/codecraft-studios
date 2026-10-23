# Audio del Reel 01

- `generate_reel01.py` — efectos originales sintetizados (y la música, que ya no se usa en el reel).
- `tts_kokoro.py` — genera la locución por pasajes continuos con Kokoro v1.0 (local): mezcla
  80 % `em_alex` + 20 % `am_onyx`; después, un semitono más grave con rubberband (formantes
  preservados): `rubberband=pitch=0.94:formant=preserved`.
- `assemble_voiceover.py` — coloca las frases en su tiempo sobre una pista de 32 s.

Locución (resultado en `public/audio/reel01-voz.wav`; guion y tiempos en `data/reels.ts` → `voiceover`):

```bash
python3 -m venv .tts && .tts/bin/pip install kokoro-onnx soundfile
# modelos: github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0): kokoro-v1.0.onnx, voices-v1.0.bin
.tts/bin/python scripts/audio/tts_kokoro.py <modelos> <salida> '[["A","Si tu negocio…",1.0], …]'
.tts/bin/python scripts/audio/assemble_voiceover.py <salida> voz.wav 32.0 '[["A-low",0.40],["B-low",9.60],["C-low",17.20],["D-low",28.40]]'
# masterización: highpass 80 Hz, EQ (−2 dB a 250 Hz, +2 dB a 3,5 kHz, +1 dB sobre 10 kHz),
# compresión 2:1 y loudnorm a −16 LUFS / −1,5 dBTP en dos pasadas (ffmpeg).
```
