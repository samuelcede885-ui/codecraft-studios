import { ArrowRight } from "./Icon";

/** Cierre de la historia con el mensaje propuesto por el manual de marca, en su composición editorial. */
export function StoryCTA() {
  return (
    <section className="story-cta" aria-labelledby="story-cta-title">
      <div className="container story-cta__inner" data-reveal>
        <h2 id="story-cta-title" className="story-cta__title">
          Ideas claras.
          <br />
          <span className="story-cta__mark">Productos que funcionan.</span>
        </h2>
        <a href="#contacto" className="btn btn--dark">
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>
      </div>
    </section>
  );
}
