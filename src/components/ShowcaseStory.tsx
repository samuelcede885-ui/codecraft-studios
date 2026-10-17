"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { storySteps, type StoryStep } from "@/data/content";
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
        Concepto {step.number} · {step.caption}
      </span>
      <p className="step-msg__text" data-item>
        {step.message}
      </p>
    </div>
  );
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
            end: () => `+=${window.innerHeight * (total - 1) * 0.9}`,
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
            .fromTo(
              screens[i],
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
              at,
            )
            .fromTo(screens[i].firstElementChild, { scale: 1.14 }, { scale: 1, duration: 1.1, ease: "power2.out" }, at)
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
        }
        tl.to({}, { duration: 0.6 });

        // Marca de fondo con deriva lenta (capa trasera, no la laptop).
        tl.fromTo(q(".stage__ghost"), { yPercent: 0, rotate: 0 }, { yPercent: -12, rotate: -6, ease: "none", duration: tl.duration() }, 0);

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
              <Laptop>
                {storySteps.map((s, i) => (
                  <div className="screen-layer" data-screen data-step={i} key={s.screen}>
                    <div className="screen-layer__inner">
                      <Screen id={s.screen} uid={`story-${i}`} />
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
                      {s.caption} · concepto visual
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
                  <Screen id={s.screen} uid={`static-${i}`} />
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
