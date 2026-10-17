"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { storySteps, storyTrack, type StoryStep } from "@/data/content";
import { Laptop } from "./Laptop";
import { Screen } from "./screens/Screens";
import { ArrowRight, Icon } from "./Icon";
import { LogoMark } from "./Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const total = storySteps.length;
const pad = (n: number) => String(n).padStart(2, "0");

function StepCopy({ step, compact }: { step: StoryStep; compact?: boolean }) {
  return (
    <div className={`step-copy ${compact ? "step-copy--compact" : ""}`}>
      <span className="step-copy__num" data-item>
        {step.number}
      </span>
      <h2 className="step-copy__title" data-item>
        {step.title.map((line) => (
          <span key={line}>{line} </span>
        ))}
      </h2>
      <p className="step-copy__desc" data-item>
        {step.description}
      </p>
      <ul className="step-copy__points">
        {step.points.map((p) => (
          <li key={p.label} data-item>
            <Icon name={p.icon} className="step-copy__icon" />
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepMessage({ step }: { step: StoryStep }) {
  return (
    <div className="step-msg">
      <span className="step-msg__label" data-item>
        {step.number} · {step.caption}
      </span>
      <p className="step-msg__text" data-item>
        {step.message}
      </p>
    </div>
  );
}

/** Etiquetas de un paso, situadas donde queda cada punto tras el zoom de cámara. */
function Callouts({ step, index }: { step: StoryStep; index: number }) {
  if (!step.callouts) return null;
  const f = step.focus ?? { x: 50, y: 50, scale: 1 };
  return (
    <div className="callouts" data-callouts data-step={index} aria-hidden="true">
      {step.callouts.map((c) => (
        <span
          key={c.label}
          className={`callout callout--${c.side ?? "right"}`}
          style={{ left: `${f.x + f.scale * (c.x - f.x)}%`, top: `${f.y + f.scale * (c.y - f.y)}%` }}
        >
          <span className="callout__dot" />
          <span className="callout__label">{c.label}</span>
        </span>
      ))}
    </div>
  );
}

function formatCount(el: HTMLElement, value: number) {
  const decimals = Number(el.dataset.decimals ?? 0);
  const n = value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  el.textContent = `${el.dataset.prefix ?? ""}${n}${el.dataset.suffix ?? ""}`;
}

function HeroCopy() {
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
        Diseño, desarrollo y automatización para llevar tu negocio al siguiente nivel.
      </p>
      <a href="#contacto" className="btn btn--dark" data-hero-fade>
        Comenzar proyecto <ArrowRight className="btn__arrow" />
      </a>
    </div>
  );
}

export function ShowcaseStory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const left = q<HTMLElement>("[data-left]");
        const right = q<HTMLElement>("[data-right]");
        const screens = q<HTMLElement>("[data-screen]");
        const captions = q<HTMLElement>("[data-caption]");
        const dots = q<HTMLElement>("[data-dot]");
        const counter = q<HTMLElement>("[data-counter]")[0];
        const callouts = q<HTMLElement>("[data-callouts]");
        const calloutsFor = (i: number) => callouts.find((c) => c.dataset.step === String(i));
        const track = q<HTMLElement>(".stage__track")[0];

        // Entrada: fondo inmediato → título por líneas → laptop → resto.
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(q(".hero-line > span"), { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0.1)
          .from(q(".laptop"), { autoAlpha: 0, scale: 0.96, duration: 1.3 }, 0.25)
          .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.08 }, 0.55)
          .from(right[0].querySelectorAll("[data-item]"), { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.06 }, 0.7)
          .from(q(".stage__hint, .stage__progress, .stage__caption"), { autoAlpha: 0, duration: 0.8 }, 0.9);

        // Secuencia: la laptop no se mueve; sólo cambian pantalla y textos.
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: q(".stage")[0],
            start: "top top",
            end: () => `+=${window.innerHeight * (total - 1)}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(q(".stage__hint"), { autoAlpha: 0, duration: 0.3 }, 0);

        for (let i = 1; i < total; i++) {
          const at = `step${i}`;
          tl.addLabel(at, i === 1 ? 0.2 : "+=0.7");
          tl.to([left[i - 1], right[i - 1], captions[i - 1]], { autoAlpha: 0, y: -28, duration: 0.45, ease: "power2.in" }, at)
            // Barrido de pantalla sólo con transform (GPU): capa sube, contenido compensa.
            .fromTo(screens[i], { yPercent: 100, y: 0 }, { yPercent: 0, duration: 1 }, at)
            .fromTo(
              screens[i].firstElementChild,
              { yPercent: -100, y: 0, scale: 1.12 },
              { yPercent: 0, scale: 1, duration: 1 },
              at,
            )
            .to(screens[i - 1].firstElementChild, { scale: 0.92, duration: 1 }, at)
            .set([left[i], right[i], captions[i]], { autoAlpha: 1, y: 0 }, `${at}+=0.42`)
            .fromTo(
              left[i].querySelectorAll("[data-item]"),
              { autoAlpha: 0, y: 32 },
              { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
              `${at}+=0.42`,
            )
            .fromTo(
              right[i].querySelectorAll("[data-item]"),
              { autoAlpha: 0, y: 32 },
              { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" },
              `${at}+=0.5`,
            )
            .fromTo(captions[i], { y: 12 }, { y: 0, duration: 0.4, ease: "power3.out" }, `${at}+=0.42`);

          const prevCallouts = calloutsFor(i - 1);
          if (prevCallouts) tl.to(prevCallouts, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, at);

          // Zoom de cámara hacia lo importante de la pantalla y etiquetas que lo señalan.
          const focus = storySteps[i].focus;
          if (focus) {
            tl.set(screens[i].firstElementChild, { transformOrigin: `${focus.x}% ${focus.y}%` }, at).to(
              screens[i].firstElementChild,
              { scale: focus.scale, duration: 0.7, ease: "power2.inOut" },
              `${at}+=1`,
            );
          }
          const ownCallouts = calloutsFor(i);
          if (ownCallouts) {
            tl.set(ownCallouts, { autoAlpha: 1 }, `${at}+=1.2`).fromTo(
              ownCallouts.querySelectorAll(".callout"),
              { autoAlpha: 0, scale: 0.6 },
              { autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.12, ease: "back.out(2)" },
              `${at}+=1.2`,
            );
          }

          // El panel de métricas cobra vida: cifras desde cero, barras y líneas.
          if (storySteps[i].screen === "dashboard") {
            const nums = [...screens[i].querySelectorAll<HTMLElement>("[data-count]")];
            const proxy = { v: 0 };
            tl.fromTo(
              proxy,
              { v: 0 },
              {
                v: 1,
                duration: 0.9,
                ease: "power2.out",
                onUpdate: () => nums.forEach((el) => formatCount(el, Number(el.dataset.count) * proxy.v)),
              },
              `${at}+=0.5`,
            )
              .fromTo(
                screens[i].querySelectorAll(".sc-dash__bars i"),
                { scaleY: 0 },
                { scaleY: 1, transformOrigin: "50% 100%", duration: 0.6, stagger: 0.03, ease: "power3.out" },
                `${at}+=0.6`,
              )
              .fromTo(
                screens[i].querySelectorAll(".sc-dash__spark polyline"),
                { strokeDasharray: 1, strokeDashoffset: 1 },
                { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" },
                `${at}+=0.6`,
              );
          }
        }
        tl.to({}, { duration: 0.6 });

        // Capas traseras (nunca la laptop): la marca se despide y entra la franja de palabras.
        tl.fromTo(q(".stage__ghost"), { yPercent: 0, rotate: 0 }, { yPercent: -12, rotate: -6, ease: "none", duration: tl.duration() }, 0)
          .to(q(".stage__ghost"), { autoAlpha: 0, duration: 0.6 }, "step1")
          .fromTo(track, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "step1")
          .fromTo(
            track,
            { x: () => window.innerWidth * 0.35 },
            { x: () => -(track.scrollWidth - window.innerWidth * 0.65), ease: "none", duration: tl.duration() - tl.labels.step1 },
            "step1",
          );

        const marks = Object.values(tl.labels);
        tl.eventCallback("onUpdate", () => {
          const t = tl.time();
          let idx = 0;
          marks.forEach((m, i) => {
            if (t >= m + 0.4) idx = i + 1;
          });
          dots.forEach((d, i) => d.classList.toggle("is-on", i === idx));
          if (counter) counter.textContent = pad(idx + 1);
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="inicio" aria-label="Fary Labs" className="story">
      {/* Versión animada */}
      <div ref={root} className="story-motion">
        <div className="stage">
          <LogoMark className="stage__ghost" />
          <div className="stage__track" aria-hidden="true">
            {storyTrack.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="stage__grid">
            <div className="zone zone--left">
              <div className="panel" data-left data-step="0">
                <HeroCopy />
              </div>
              {storySteps.slice(1).map((s, i) => (
                <div className="panel" data-left data-step={i + 1} key={s.number}>
                  <StepCopy step={s} />
                </div>
              ))}
            </div>

            <div className="zone zone--center">
              <Laptop
                overlay={storySteps.map((s, i) => (
                  <Callouts step={s} index={i} key={s.number} />
                ))}
              >
                {storySteps.map((s, i) => (
                  <div className="screen-layer" data-screen data-step={i} key={s.screen}>
                    <div className="screen-layer__inner">
                      <Screen id={s.screen} priority={i === 0} />
                    </div>
                  </div>
                ))}
              </Laptop>
              <div className="stage__caption">
                <span className="stage__counter">
                  <b data-counter>01</b> / {pad(total)}
                </span>
                <span className="stage__captions">
                  {storySteps.map((s, i) => (
                    <span className="stage__caption-item" data-caption data-step={i} key={s.number}>
                      {s.caption} · {s.note}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <div className="zone zone--right">
              <div className="panel" data-right data-step="0">
                <StepCopy step={storySteps[0]} compact />
              </div>
              {storySteps.slice(1).map((s, i) => (
                <div className="panel" data-right data-step={i + 1} key={s.number}>
                  <StepMessage step={s} />
                </div>
              ))}
            </div>
          </div>

          <div className="stage__hint" aria-hidden="true">
            <span className="stage__mouse" />
            Scroll
          </div>
          <div className="stage__progress" aria-hidden="true">
            {storySteps.map((s, i) => (
              <span key={s.number} data-dot className={i === 0 ? "is-on" : undefined} />
            ))}
          </div>
        </div>
      </div>

      {/* Versión sin movimiento (prefers-reduced-motion): todo visible y en orden. */}
      <div className="story-static">
        {storySteps.map((s, i) => (
          <div className="static-frame" key={s.number}>
            <div className="static-frame__copy">{i === 0 ? <HeroCopy /> : <StepCopy step={s} />}</div>
            <Laptop className="static-frame__laptop">
              <div className="screen-layer" data-step="0">
                <div className="screen-layer__inner">
                  <Screen id={s.screen} priority={i === 0} lazy={i > 0} />
                </div>
              </div>
            </Laptop>
            <div className="static-frame__msg">
              {i === 0 ? <StepCopy step={s} compact /> : <StepMessage step={s} />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
