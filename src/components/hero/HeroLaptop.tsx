import type { Ref } from "react";
import { heroStages } from "@/data/heroStages";
import { assetUrl } from "@/lib/assets";
import { LaptopFrame } from "./LaptopFrame";
import { stageState } from "./HeroStage";

/** Versión ligera del recorrido (960 px, 15 fps): a HERO_SPEED = 2 se ve a 30 fps y pesa ~300 KB. */
export const HERO_VIDEO = "/projects/gramercy/hero";
export const HERO_POSTER = "/projects/gramercy/poster.webp";

/**
 * Laptop fija del hero: etiqueta editorial de la etapa encima y, en la pantalla, el video del
 * recorrido. Mientras carga se ve su póster (el primer fotograma), sin saltos.
 */
export function HeroLaptop({ stage, videoRef }: { stage: number; videoRef: Ref<HTMLVideoElement> }) {
  return (
    <div className="zone zone--device">
      <div className="hero-tags" aria-hidden="true">
        {heroStages.map((s, i) =>
          s.tag ? (
            <span key={s.tag} className="hero-tag" data-state={stageState(i, stage)}>
              {s.tag}
            </span>
          ) : null,
        )}
      </div>
      <LaptopFrame>
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          loop
          preload="auto"
          poster={assetUrl(HERO_POSTER)}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* MP4 (H.264) primero: en iPhone se decodifica por hardware y arranca sin tirones;
              la versión WebM queda de respaldo. */}
          <source src={assetUrl(`${HERO_VIDEO}.mp4`)} type="video/mp4" />
          <source src={assetUrl(`${HERO_VIDEO}.webm`)} type="video/webm" />
        </video>
      </LaptopFrame>
    </div>
  );
}
