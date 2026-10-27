/**
 * Pistas del reel 02 (public/audio/reel02/). Música y efectos: síntesis propia
 * (scripts/audio/generate_reel02.py). Voz: locución temporal generada con Kokoro
 * (scripts/audio/generate_reel02_voice.py); se reemplaza por la grabación definitiva
 * dejando el mismo archivo `reel02-voz.mp3` (mismos tiempos de `voice` en timeline.ts).
 */
type Track = { src: string; volume: number };

export const audio: { music?: Track; voice?: Track; effects?: Track } = {
  // La música ya viene agachada bajo la voz (generate_reel02.py); los efectos van en una sola pista.
  music: { src: "audio/reel02/reel02-music.mp3", volume: 0.6 },
  voice: { src: "audio/reel02/reel02-voz.mp3", volume: 1 },
  effects: { src: "audio/reel02/reel02-sfx.mp3", volume: 0.7 },
};
