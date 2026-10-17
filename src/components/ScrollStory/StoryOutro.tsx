import { ArrowRight } from "../Icon";

/** Cierre de la historia dentro de la misma escena: la laptop se retira y entra el mensaje. */
export function StoryOutro() {
  return (
    <div className="stage__outro" data-outro>
      <h2 className="outro__title">
        <span className="outro__line" data-item>
          Ideas claras.
        </span>
        <span className="outro__line" data-item>
          <span className="outro__mark">Productos que funcionan.</span>
        </span>
      </h2>
      <a href="#contacto" className="btn btn--dark" data-item>
        Comenzar proyecto <ArrowRight className="btn__arrow" />
      </a>
    </div>
  );
}
