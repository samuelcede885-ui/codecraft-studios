import { Audio, Sequence, staticFile } from "remotion";

export type AudioTrack = { src: string; volume?: number };
export type SoundEffect = AudioTrack & { frame: number };
export type VoiceMarker = { frame: number; text: string };
export type ReelAudio = { voiceover?: AudioTrack; music?: AudioTrack; sfx?: SoundEffect[] };

/**
 * Voz, música y efectos. Los archivos van en public/audio/ y deben ser propios o con licencia.
 * Sin pistas no se renderiza nada (el preview es mudo por diseño).
 */
export function AudioLayer({ voiceover, music, sfx = [] }: ReelAudio) {
  return (
    <>
      {music && <Audio src={staticFile(music.src)} volume={music.volume ?? 0.3} />}
      {voiceover && <Audio src={staticFile(voiceover.src)} volume={voiceover.volume ?? 1} />}
      {sfx.map((s, i) => (
        <Sequence key={i} from={s.frame} layout="none">
          <Audio src={staticFile(s.src)} volume={s.volume ?? 0.5} />
        </Sequence>
      ))}
    </>
  );
}
