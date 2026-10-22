import type { Visual } from "@/data/projects";
import { assetUrl } from "@/lib/assets";
import { ProjectVideo } from "./ProjectVideo";

function VisualBlock({ v }: { v: Visual }) {
  switch (v.kind) {
    case "video":
      return (
        <figure className="pj-visual" data-media>
          <ProjectVideo src={v.src} poster={v.poster} label={v.label} />
        </figure>
      );
    case "image":
      return (
        <figure className="pj-visual" data-media>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
          <img src={assetUrl(v.src)} alt={v.alt} width={1280} height={720} loading="lazy" decoding="async" />
        </figure>
      );
    case "flow":
      return (
        <ol className="pj-flow" data-media>
          {v.steps.map((s, i) => (
            <li key={s}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      );
  }
}

/**
 * Visuales grandes de un capítulo: video, imagen o flujo. Con dos o más, en pareja
 * (en móvil, carrusel horizontal). Aparecen con un recorte que se abre (ScrollEffects, [data-media]).
 */
export function ProjectGallery({ visuals }: { visuals: Visual[] }) {
  if (!visuals.length) return null;
  return (
    <div className={`pj-visuals ${visuals.length > 1 ? "is-pair" : ""}`}>
      {visuals.map((v, i) => (
        <VisualBlock key={i} v={v} />
      ))}
    </div>
  );
}
