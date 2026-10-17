import { ArrowRight } from "../Icon";

/** Mensaje principal. Comparte escena con la laptop: es el estado inicial de la historia. */
export function HeroCopy() {
  return (
    <div className="hero-copy">
      <span className="hero-copy__rule" data-hero-fade />
      <h1 className="hero-copy__title">
        <span className="hero-line">
          <span>Transformamos</span>
        </span>{" "}
        <span className="hero-line">
          <span>ideas en productos</span>
        </span>{" "}
        <span className="hero-line">
          <span>digitales.</span>
        </span>
      </h1>
      <p className="hero-copy__sub" data-hero-fade>
        Diseño, desarrollo y automatización para que la tecnología impulse tu negocio.
      </p>
      <a href="#contacto" className="btn btn--dark hero-copy__cta" data-hero-fade>
        Comenzar proyecto <ArrowRight className="btn__arrow" />
      </a>
    </div>
  );
}
