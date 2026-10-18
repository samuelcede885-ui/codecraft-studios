"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/config/site";
import { budgetRanges, contactServices } from "@/data/contact";
import { ArrowRight } from "./Icon";

type Field = "name" | "email" | "service" | "message";
type Status = "idle" | "error" | "sent" | "pending";

const messages: Record<Field, string> = {
  name: "Escribe tu nombre.",
  email: "Escribe un correo válido.",
  service: "Elige un servicio.",
  message: "Cuéntanos un poco más (mínimo 10 caracteres).",
};

/** Contacto editorial: formulario con validación por campo y estados de error y envío. */
export function Contact() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const { email } = site.contact;

  function validate(form: HTMLFormElement) {
    const next: Partial<Record<Field, string>> = {};
    (Object.keys(messages) as Field[]).forEach((f) => {
      const el = form.elements.namedItem(f) as HTMLInputElement | null;
      if (el && !el.checkValidity()) next[f] = messages[f];
    });
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return Object.keys(next).length === 0;
  }

  function summary(form: HTMLFormElement) {
    const d = new FormData(form);
    return {
      subject: `Nuevo proyecto — ${d.get("service")}`,
      body: [
        `Nombre: ${d.get("name")}`,
        `Empresa: ${d.get("company") || "-"}`,
        `Correo: ${d.get("email")}`,
        `Servicio: ${d.get("service")}`,
        `Presupuesto: ${d.get("budget")}`,
        "",
        `${d.get("message")}`,
      ].join("\n"),
    };
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return setStatus("error");
    // Sin destino configurado no se simula un envío.
    if (!email) return setStatus("pending");
    const { subject, body } = summary(form);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  function onWhatsApp(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form!;
    if (!validate(form)) return setStatus("error");
    const { body } = summary(form);
    window.open(whatsappLink(`Hola, Fary Labs. Quiero comenzar un proyecto.\n\n${body}`), "_blank", "noopener");
    setStatus("sent");
  }

  const fieldProps = (f: Field) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `${f}-error` : undefined,
    onInput: () => errors[f] && setErrors((x) => ({ ...x, [f]: undefined })),
  });
  const err = (f: Field) =>
    errors[f] && (
      <span className="field__error" id={`${f}-error`}>
        {errors[f]}
      </span>
    );

  return (
    <section id="contacto" className="section contact" aria-labelledby="contacto-title">
      <div className="container contact__grid">
        <header className="contact__head" data-reveal>
          <h2 id="contacto-title" className="section-title section-title--md">
            Cuéntanos qué quieres construir.
          </h2>
          <p className="contact__text">
            Respondemos con una propuesta clara: qué haremos, en qué fases y por qué sirve a tu negocio.
          </p>
        </header>

        <form className="cform" noValidate onSubmit={onSubmit} aria-label="Cuéntanos tu proyecto" data-reveal>
          <div className="cform__row">
            <label className="cfield">
              <span>Nombre</span>
              <input name="name" required autoComplete="name" {...fieldProps("name")} />
              {err("name")}
            </label>
            <label className="cfield">
              <span>
                Empresa <em>(opcional)</em>
              </span>
              <input name="company" autoComplete="organization" />
            </label>
          </div>
          <div className="cform__row">
            <label className="cfield">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="email" {...fieldProps("email")} />
              {err("email")}
            </label>
            <label className="cfield">
              <span>Servicio</span>
              <select name="service" required defaultValue="" {...fieldProps("service")}>
                <option value="" disabled>
                  Selecciona un servicio
                </option>
                {contactServices.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {err("service")}
            </label>
          </div>
          <label className="cfield">
            <span>Presupuesto aproximado</span>
            <select name="budget" defaultValue={budgetRanges[0]}>
              {budgetRanges.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="cfield">
            <span>Descripción</span>
            <textarea name="message" rows={4} required minLength={10} {...fieldProps("message")} />
            {err("message")}
          </label>

          <div className="cform__foot">
            <button type="submit" className="btn btn--dark">
              Enviar proyecto <ArrowRight className="btn__arrow" />
            </button>
            {site.contact.whatsapp && (
              <button type="button" className="link-arrow cform__wa" onClick={onWhatsApp}>
                O escríbenos por WhatsApp <ArrowRight className="btn__arrow" />
              </button>
            )}
          </div>
          <p className={`cform__status is-${status}`} role="status" aria-live="polite">
            {status === "error" && "Revisa los campos marcados."}
            {status === "pending" &&
              "Gracias. El envío del formulario aún no está configurado: pronto publicaremos nuestros canales de contacto."}
            {status === "sent" && "Listo. Abrimos tu aplicación con la solicitud preparada para enviar."}
          </p>
        </form>
      </div>
    </section>
  );
}
