"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { services } from "@/data/content";
import { LogoMark } from "./Logo";
import { ArrowRight } from "./Icon";

type Status = { kind: "idle" } | { kind: "error"; message: string } | { kind: "pending" } | { kind: "sent" };

const { email, whatsapp } = site.contact;

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus({ kind: "error", message: "Revisa los campos marcados." });
      return;
    }
    const data = new FormData(form);
    if (!email) {
      // Sin destino configurado no se simula un envío.
      setStatus({ kind: "pending" });
      return;
    }
    const body = [
      `Nombre: ${data.get("name")}`,
      `Empresa: ${data.get("company") || "-"}`,
      `Correo: ${data.get("email")}`,
      `Servicio: ${data.get("service")}`,
      "",
      `${data.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      `Nuevo proyecto — ${data.get("service")}`,
    )}&body=${encodeURIComponent(body)}`;
    setStatus({ kind: "sent" });
  }

  return (
    <section id="contacto" className="contact" aria-labelledby="contacto-title">
      <div className="container contact__intro">
        <div data-reveal>
          <span className="contact__rule" aria-hidden="true" />
          <h2 id="contacto-title" className="contact__title">
            ¿Listo para crear
            <br />
            lo próximo?
          </h2>
          <p className="contact__sub">Hablemos de tu idea y llevémosla a un producto digital real.</p>
          <a href="#formulario" className="btn btn--light">
            Comenzar proyecto <ArrowRight className="btn__arrow" />
          </a>
        </div>
        <div className="contact__visual" aria-hidden="true">
          <LogoMark className="contact__mark" />
        </div>
      </div>

      <div className="container contact__body">
        <div className="contact__aside" data-reveal>
          <h3>Cuéntanos tu proyecto</h3>
          <p>Respondemos con una propuesta clara de alcance, tiempos y siguientes pasos.</p>
          <ul className="contact__channels">
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {whatsapp && (
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Escríbenos por WhatsApp
                </a>
              </li>
            )}
            {!email && !whatsapp && <li className="contact__pending">Correo y WhatsApp: próximamente.</li>}
          </ul>
        </div>

        <form id="formulario" className="form" noValidate onSubmit={onSubmit} data-reveal>
          <div className="form__row">
            <label className="field">
              <span>Nombre</span>
              <input name="name" required autoComplete="name" />
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
              <span>Correo electrónico</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="field">
              <span>Servicio</span>
              <select name="service" required defaultValue="">
                <option value="" disabled>
                  Selecciona un servicio
                </option>
                {services.map((s) => (
                  <option key={s.id} value={`${s.name} — ${s.kind}`}>
                    {s.name} — {s.kind}
                  </option>
                ))}
                <option value="Otro">Otro / aún no lo sé</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>Descripción del proyecto</span>
            <textarea name="message" rows={4} required minLength={10} />
          </label>

          <div className="form__footer">
            <button type="submit" className="btn btn--light">
              Enviar solicitud <ArrowRight className="btn__arrow" />
            </button>
            <p className="form__status" role="status" aria-live="polite">
              {status.kind === "error" && status.message}
              {status.kind === "pending" &&
                "Gracias. El envío del formulario aún no está configurado: pronto publicaremos nuestros canales de contacto."}
              {status.kind === "sent" && "Abrimos tu correo con la solicitud lista para enviar."}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
