import type { Ref } from "react";
import type gsap from "gsap";
import { heroStages } from "@/data/heroStages";
import { assetUrl } from "@/lib/assets";
import { Reel } from "../reel/Reel";
import { LaptopFrame } from "./LaptopFrame";
import { stageState } from "./HeroStage";

export const HERO_VIDEO = "/projects/gramercy/full";
export const HERO_POSTER = "/projects/gramercy/poster.webp";

/**
 * Laptop fija del hero: etiqueta editorial de la etapa encima y, en la pantalla, el video del
 * recorrido o, si falla, la bobina HTML en vivo (`source === "reel"`).
 */
export function HeroLaptop({
  stage,
  source,
  videoRef,
  onReelReady,
}: {
  stage: number;
  source: "video" | "reel";
  videoRef: Ref<HTMLVideoElement>;
  onReelReady: (tl: gsap.core.Timeline) => void;
}) {
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
        {source === "video" ? (
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
            <source src={assetUrl(`${HERO_VIDEO}.webm`)} type="video/webm" />
            <source src={assetUrl(`${HERO_VIDEO}.mp4`)} type="video/mp4" />
          </video>
        ) : (
          <Reel id="gramercy" onReady={onReelReady} />
        )}
      </LaptopFrame>
    </div>
  );
}
