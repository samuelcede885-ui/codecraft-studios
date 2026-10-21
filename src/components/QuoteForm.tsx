"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { getProject, projects } from "@/data/projects";
import { QUOTE_EVENT, quoteReferenceFromUrl } from "@/lib/quote";
import { ArrowRight } from "./Icon";

type Field = "name" | "email" | "type" | "message";
type Status = "idle" | "error" | "pending" | "sent";

const messages: Record<Field, string> = {
  name: "Escribe tu nombre.",
  email: "Escribe un correo válido.",
  type: "Elige un tipo de proyecto.",
  message: "Cuéntanos un poco más (mínimo 10 caracteres).",
};

const projectTypes = ["Web Craft — Desarrollo web", "App Craft — Aplicaciones", "Agent Craft — Inteligencia artificial", "Aún no lo sé"];
/** Rangos orientativos para el cliente: Fary Labs debe confirmarlos. */
const budgets = ["Por definir", "Menos de 1.000 USD", "1.000 – 3.000 USD", "3.000 – 8.000 USD", "Más de 8.000 USD"];

/**
 * Formulario de cotización. Recibe el proyecto de referencia desde el catálogo (evento)
 * o desde una ficha de proyecto (?proyecto=<slug> en la URL) y lo muestra con su categoría.
 */
export function QuoteForm() {
  const [ref, setRef] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const { email, whatsapp } = site.contact;
  const project = getProject(ref);

  useEffect(() => {
    const fromUrl = quoteReferenceFromUrl();
    if (getProject(fromUrl)) setRef(fromUrl);
    const onPick = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (getProject(slug)) setRef(slug);
    };
    window.addEventListener(QUOTE_EVENT, onPick);
    return () => window.removeEventListener(QUOTE_EVENT, onPick);
  }, []);

  function validate(form: HTMLFormElement) {
    const next: Partial<Record<Field, string>> = {};
    (Object.keys(messages) as Field[]).forEach((f) => {
      const el = form.elements.namedItem(f) as HTMLInputElement | null;
      if (el && !el.checkValidity()) next[f] = messages[f];
    });
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return !first;
  }

  function summary(form: HTMLFormElement) {
    const d = new FormData(form);
    const refName = project ? `${project.name} (${project.category})` : "Ninguno";
    return [
      `Nombre: ${d.get("name")}`,
      `Empresa: ${d.get("company") || "-"}`,
      `WhatsApp: ${d.get("whatsapp") || "-"}`,
      `Email: ${d.get("email")}`,
      `Tipo de proyecto: ${d.get("type")}`,
      `Proyecto de referencia: ${refName}`,
      `Qué le gustó: ${d.get("liked") || "-"}`,
      `Presupuesto: ${d.get("budget")}`,
      "",
      `${d.get("message")}`,
    ].join("\n");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return setStatus("error");
    // Sin destino configurado no se simula un envío.
    if (!email && !whatsapp) return setStatus("pending");
    const body = summary(form);
    if (email) {
      const subject = `Cotización${project ? ` — referencia ${project.name}` : ""}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
    }
    setStatus("sent");
  }

  const invalid = (f: Field) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `quote-${f}-error` : undefined,
    onInput: () => errors[f] && setErrors((x) => ({ ...x, [f]: undefined })),
  });
  const err = (f: Field) =>
    errors[f] && (
      <span className="field__error" id={`quote-${f}-error`}>
        {errors[f]}
      </span>
    );

  return (
    <form id="cotizacion" className="form quote" noValidate onSubmit={onSubmit} aria-labelledby="quote-title" data-reveal>
      <h3 id="quote-title" className="quote__title">
        Solicita tu cotización
      </h3>
      <div className="form__row">
        <label className="field">
          <span>Nombre</span>
          <input name="name" required autoComplete="name" {...invalid("name")} />
          {err("name")}
        </label>
        <label className="field">
          <span>
            Empresa <em>(opcional)</em>
          </span>
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>
            WhatsApp <em>(opcional)</em>
          </span>
          <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" {...invalid("email")} />
          {err("email")}
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>Tipo de proyecto</span>
          <select name="type" required defaultValue="" {...invalid("type")}>
            <option value="" disabled>
              Selecciona un tipo
            </option>
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {err("type")}
        </label>
        <label className="field">
          <span>Proyecto de referencia</span>
          <select name="reference" value={ref} onChange={(e) => setRef(e.target.value)}>
            <option value="">Ninguno</option>
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          {project && <small className="field__hint">Categoría: {project.category}</small>}
        </label>
      </div>
      <label className="field">
        <span>
          ¿Qué te gustó de esta página? <em>(opcional)</em>
        </span>
        <textarea name="liked" rows={2} />
      </label>
      <label className="field">
        <span>Presupuesto aproximado</span>
        <select name="budget" defaultValue={budgets[0]}>
          {budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Descripción del proyecto</span>
        <textarea name="message" rows={4} required minLength={10} {...invalid("message")} />
        {err("message")}
      </label>

      <div className="form__footer">
        <button type="submit" className="btn btn--light">
          Solicitar cotización <ArrowRight className="btn__arrow" />
        </button>
        <p className={`form__status is-${status}`} role="status" aria-live="polite">
          {status === "error" && "Revisa los campos marcados."}
          {status === "pending" &&
            "Gracias. El envío aún no está configurado: pronto publicaremos nuestros canales de contacto."}
          {status === "sent" && "Listo. Abrimos tu aplicación con la solicitud preparada para enviar."}
        </p>
      </div>
      <p className="quote__note">
        Usaremos este proyecto como referencia de estilo y experiencia para crear una solución original para tu marca.
      </p>
    </form>
  );
}
