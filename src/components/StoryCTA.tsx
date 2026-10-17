import { ArrowRight } from "./Icon";

/** Cierre de la historia de la laptop: la idea que acabas de ver puede ser la tuya. */
export function StoryCTA() {
  return (
    <section className="story-cta" aria-labelledby="story-cta-title">
      <div className="container story-cta__inner" data-reveal>
        <h2 id="story-cta-title" className="story-cta__title">
          De la idea al producto.
          <br />
          <span>Tu proyecto puede ser el siguiente.</span>
        </h2>
        <a href="#contacto" className="btn btn--dark">
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>
      </div>
    </section>
  );
}
