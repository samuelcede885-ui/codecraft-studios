import { Audio, Sequence, staticFile } from "remotion";

export type AudioTrack = { src: string; volume?: number };
export type SoundEffect = AudioTrack & { frame: number };
export type ReelAudio = { voiceover?: AudioTrack; music?: AudioTrack; sfx?: SoundEffect[] };

/**
 * Pistas de audio de un reel: voz, música y efectos. Los archivos van en public/audio/ y deben
 * ser propios o con licencia de uso. Sin pistas, no se renderiza nada.
 */
export function AudioLayer({ voiceover, music, sfx = [] }: ReelAudio) {
  return (
    <>
      {music && <Audio src={staticFile(music.src)} volume={music.volume ?? 0.35} />}
      {voiceover && <Audio src={staticFile(voiceover.src)} volume={voiceover.volume ?? 1} />}
      {sfx.map((s, i) => (
        <Sequence key={i} from={s.frame} layout="none">
          <Audio src={staticFile(s.src)} volume={s.volume ?? 0.6} />
        </Sequence>
      ))}
    </>
  );
}
