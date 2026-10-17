import { Logo } from "./Logo";
import { ArrowRight } from "./Icon";
import { Footer } from "./Footer";

/** Cierre de la web: fondo negro, firma blanca y la última invitación. */
export function FinalCTA() {
  return (
    <section id="cierre" className="final" aria-labelledby="final-title">
      <div className="container final__intro" data-reveal>
        <Logo className="logo--light final__logo" />
        <h2 id="final-title" className="final__title">
          Hagamos algo que valga la pena recordar.
        </h2>
        <p className="final__sub">Cuéntanos tu idea y construyamos lo próximo.</p>
        <a href="#contacto" className="btn btn--light">
          Comenzar proyecto <ArrowRight className="btn__arrow" />
        </a>
      </div>
      <Footer />
    </section>
  );
}
