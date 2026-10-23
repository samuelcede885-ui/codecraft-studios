"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { getProject, type Project } from "@/data/projects";
import { PLAN_EVENT, QUOTE_EVENT, quoteReferenceFromUrl } from "@/lib/quote";
import { usd, type Plan } from "@/data/plans";
import { track } from "@/lib/analytics";
import { ArrowRight } from "../Icon";
import { QuoteStep } from "./QuoteStep";
import { ProjectReference } from "./ProjectReference";

type Field = "name" | "email" | "type" | "message";
type Status = "idle" | "error" | "pending" | "sent";

const messages: Record<Field, string> = {
  name: "Escribe tu nombre.",
  email: "Escribe un correo válido.",
  type: "Elige qué quieres construir.",
  message: "Cuéntanos un poco más (mínimo 10 caracteres).",
};

const steps: { title: string; fields: Field[] }[] = [
  { title: "Sobre ti", fields: ["name", "email"] },
  { title: "Qué quieres construir", fields: ["type"] },
  { title: "Tu referencia", fields: [] },
  { title: "Tu proyecto", fields: ["message"] },
];

const projectTypes = ["Web", "E-commerce", "App", "Agente IA", "Otro"];
/** Tipo sugerido según el proyecto de referencia (la persona puede cambiarlo). */
const typeFromFilter: Record<string, string> = { ecommerce: "E-commerce", web: "Web", apps: "App", ia: "Agente IA" };
/** Rangos orientativos, alineados con los planes (data/plans.ts). */
const budgets = ["Por definir", "Menos de 200 USD", "200 – 500 USD", "500 – 1.000 USD", "Más de 1.000 USD"];
const timings = ["Sin fecha definida", "Lo antes posible", "En 1 mes", "En 2 – 3 meses", "Más adelante"];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Cotización en 4 pasos (sobre ti, qué quieres construir, tu referencia, tu proyecto).
 * La referencia llega sola desde "Quiero una página como esta" (evento del catálogo o
 * ?proyecto=<slug> desde una ficha): se muestra como "Tu referencia" y nunca hay que volver
 * a elegirla. Todos los campos viven en un único <form>; los pasos solo cambian qué se ve.
 */
export function QuoteWizard() {
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState("");
  const [type, setType] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [picking, setPicking] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const { email, whatsapp } = site.contact;
  const project = getProject(ref);
  const moved = useRef(false);
  const started = useRef(false);

  function applyReference(p: Project | undefined) {
    if (!p) return;
    setRef(p.slug);
    setPicking(false);
    // Sugerir el tipo si la persona aún no eligió uno.
    setType((t) => t || typeFromFilter[p.filters[0]] || "");
  }

  useEffect(() => {
    applyReference(getProject(quoteReferenceFromUrl()));
    const onPick = (e: Event) => applyReference(getProject((e as CustomEvent<string>).detail));
    window.addEventListener(QUOTE_EVENT, onPick);
    // Plan elegido en "Planes": se muestra en el paso 2 y fija el tipo de proyecto.
    const onPlan = (e: Event) => {
      const p = (e as CustomEvent<Plan>).detail;
      setPlan(p);
      setType(p.quoteType);
      setErrors((x) => ({ ...x, type: undefined }));
    };
    window.addEventListener(PLAN_EVENT, onPlan);
    return () => {
      window.removeEventListener(QUOTE_EVENT, onPick);
      window.removeEventListener(PLAN_EVENT, onPlan);
    };
  }, []);

  // Al cambiar de paso, el foco va al título del paso (no al cargar la página).
  useEffect(() => {
    if (moved.current) heading.current?.focus({ preventScroll: true });
  }, [step]);

  function isValid(name: Field) {
    const el = form.current?.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;
    return el instanceof RadioNodeList ? !!el.value : el ? el.checkValidity() : true;
  }

  function validate(fields: Field[]) {
    const next: Partial<Record<Field, string>> = {};
    fields.forEach((name) => {
      if (!isValid(name)) next[name] = messages[name];
    });
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      const el = form.current?.elements.namedItem(first);
      (el instanceof RadioNodeList ? (el[0] as HTMLElement) : (el as HTMLElement | null))?.focus();
    }
    return !first;
  }

  function go(to: number) {
    if (to > step && !validate(steps[step].fields)) return setStatus("error");
    setStatus("idle");
    if (to > step) track("quote_step_completed", { step: step + 1, name: steps[step].title, project: ref || undefined });
    moved.current = true;
    setStep(to);
    // Si el inicio del formulario quedó arriba, volver a él para ver el paso entero.
    if ((form.current?.getBoundingClientRect().top ?? 0) < 0) form.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function summary(d: FormData) {
    return [
      `Nombre: ${d.get("name")}`,
      `Empresa: ${d.get("company") || "-"}`,
      `Email: ${d.get("email")}`,
      `WhatsApp: ${d.get("whatsapp") || "-"}`,
      `Quiere construir: ${d.get("type")}`,
      `Plan: ${plan ? `${plan.name} (desde ${usd(plan.price)})` : "-"}`,
      `Referencia: ${project ? `${project.name} (${project.category}) [${project.slug}]` : "Ninguna"}`,
      `Qué le gustó: ${d.getAll("liked").join(", ") || "-"}`,
      `Presupuesto: ${d.get("budget")}`,
      `Fecha ideal: ${d.get("timing")}`,
      "",
      `${d.get("message")}`,
    ].join("\n");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) return go(step + 1);
    // Revalidar todo por si algo cambió al volver atrás: se vuelve al primer paso con errores.
    const bad = steps.findIndex((st) => st.fields.some((f) => !isValid(f)));
    if (bad >= 0) {
      setStep(bad);
      requestAnimationFrame(() => validate(steps[bad].fields));
      return setStatus("error");
    }
    track("quote_step_completed", { step: steps.length, name: steps[steps.length - 1].title, project: ref || undefined });
    const channel = email ? "email" : whatsapp ? "whatsapp" : "pending";
    track("quote_submitted", { project: ref || undefined, type, plan: plan?.id, channel });
    // Sin destino configurado no se simula un envío.
    if (!email && !whatsapp) return setStatus("pending");
    const body = summary(new FormData(e.currentTarget));
    if (email) {
      const subject = `Proyecto${project ? ` — referencia ${project.name}` : ""}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      track("whatsapp_clicked", { from: "quote" });
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
    }
    setStatus("sent");
  }

  const invalid = (f: Field) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `quote-${f}-error` : undefined,
    onInput: () => {
      if (!errors[f]) return;
      setErrors((x) => ({ ...x, [f]: undefined }));
      setStatus("idle");
    },
  });
  const err = (f: Field) =>
    errors[f] && (
      <span className="field__error" id={`quote-${f}-error`}>
        {errors[f]}
      </span>
    );

  return (
    <form
      ref={form}
      id="cotizacion"
      className="form quote wizard"
      noValidate
      onSubmit={onSubmit}
      onFocus={() => {
        if (started.current) return;
        started.current = true;
        track("quote_started", { project: ref || undefined });
      }} aria-labelledby="quote-title" data-reveal>
      <div className="wizard__top">
        <h3 id="quote-title" className="quote__title">
          Cuéntanos tu proyecto
        </h3>
        {project && (
          <p className="wizard__ref">
            <span>Tu referencia</span> <b>{project.name}</b> · {project.category}
          </p>
        )}
      </div>

      {/* Progreso: número, nombre del paso y barra. */}
      <div className="wizard__progress">
        <span className="wizard__count" aria-live="polite">
          <b>{pad(step + 1)}</b> / {pad(steps.length)}
          <span className="sr-only">: {steps[step].title}</span>
        </span>
        <ol className="wizard__steps" aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s.title} className={i === step ? "is-now" : i < step ? "is-done" : ""}>
              {s.title}
            </li>
          ))}
        </ol>
        <span className="wizard__bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${(step + 1) / steps.length})` }} />
        </span>
      </div>

      {/* Referencia para el envío (projectId, projectName, projectCategory). */}
      <input type="hidden" name="projectId" value={project?.slug ?? ""} />
      <input type="hidden" name="projectName" value={project?.name ?? ""} />
      <input type="hidden" name="projectCategory" value={project?.category ?? ""} />

      <QuoteStep index={0} title={steps[0].title} active={step === 0} headingRef={heading}>
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
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" {...invalid("email")} />
            {err("email")}
          </label>
          <label className="field">
            <span>
              WhatsApp <em>(opcional)</em>
            </span>
            <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" />
          </label>
        </div>
      </QuoteStep>

      <QuoteStep index={1} title={steps[1].title} active={step === 1} headingRef={heading}>
        <div className="choices" role="radiogroup" aria-describedby={errors.type ? "quote-type-error" : undefined}>
          {projectTypes.map((t) => (
            <label key={t} className="choice">
              <input
                type="radio"
                name="type"
                value={t}
                required
                checked={type === t}
                onChange={() => {
                  setType(t);
                  setErrors((x) => ({ ...x, type: undefined }));
                }}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
        {err("type")}
        {plan && (
          <p className="wizard__plan">
            Plan elegido: <b>{plan.name}</b> · desde {usd(plan.price)}
            <button type="button" onClick={() => setPlan(null)}>
              Quitar
            </button>
          </p>
        )}
      </QuoteStep>

      <QuoteStep index={2} title={steps[2].title} active={step === 2} headingRef={heading}>
        <ProjectReference project={project} picking={picking} onPick={setPicking} onSelect={(p) => (p ? applyReference(p) : (setRef(""), setPicking(false)))} />
      </QuoteStep>

      <QuoteStep index={3} title={steps[3].title} active={step === 3} headingRef={heading}>
        <div className="form__row">
          <label className="field">
            <span>Presupuesto aproximado</span>
            <select name="budget" defaultValue={budgets[0]}>
              {budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Fecha ideal</span>
            <select name="timing" defaultValue={timings[0]}>
              {timings.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>Descripción</span>
          <textarea name="message" rows={4} required minLength={10} {...invalid("message")} />
          {err("message")}
        </label>
      </QuoteStep>

      <div className="form__footer">
        {step > 0 && (
          <button type="button" className="wizard__back" onClick={() => go(step - 1)}>
            ← Atrás
          </button>
        )}
        <button type="submit" className="btn btn--light">
          {step < steps.length - 1 ? "Siguiente" : "Enviar proyecto"} <ArrowRight className="btn__arrow" />
        </button>
        <p className={`form__status is-${status}`} role="status" aria-live="polite">
          {status === "error" && "Revisa los campos marcados."}
          {status === "pending" &&
            "Gracias. El envío aún no está configurado: pronto publicaremos nuestros canales de contacto."}
          {status === "sent" && "Listo. Abrimos tu aplicación con la solicitud preparada para enviar."}
        </p>
      </div>
      {project && (
        <p className="quote__note">
          Usaremos {project.name} como referencia de estilo y experiencia para crear una solución original para tu marca.
        </p>
      )}
    </form>
  );
}
