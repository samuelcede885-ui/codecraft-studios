"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { storySteps } from "@/data/storySteps";
import { LogoMark } from "../Logo";
import { HeroCopy } from "./Hero";
import { LaptopFrame } from "./LaptopFrame";
import { LaptopScreen } from "./LaptopScreen";
import { StepAside, StepLead, StoryNumber } from "./StoryCopy";
import { StoryProgress } from "./StoryProgress";
import { enterScreen, gm } from "./screenMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const N = storySteps.length;
/** Estados de la escena: 0 = hero, 1…N = pasos de la historia. */
const STATES = N + 1;
/** Distancia de la línea de tiempo entre un paso y el siguiente. */
const GAP = 1.9;
/** Inicio de cada transición hacia el estado k (k = 1…N). */
const starts = Array.from({ length: N }, (_, i) => 0.25 + i * GAP);

/**
 * Hero + historia en una sola escena fijada: la laptop es siempre la misma y está siempre
 * en el mismo sitio; el scroll solo cambia la pantalla y los textos que la rodean.
 */
export function ScrollStory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q<HTMLElement>(".stage")[0];
      const leads = q<HTMLElement>("[data-lead]");
      const asides = q<HTMLElement>("[data-aside]");
      const screens = q<HTMLElement>("[data-screen]");
      const num = q<HTMLElement>(".story-num")[0];
      const numCol = q<HTMLElement>(".story-num__col")[0];
      const dots = q<HTMLElement>("[data-dot]");

      // Estado visible para lectores de pantalla y para el indicador de progreso.
      let current = -1;
      const setActive = (state: number) => {
        if (state === current) return;
        current = state;
        leads.forEach((el, i) => el.toggleAttribute("aria-hidden", i !== state));
        asides.forEach((el, i) => el.toggleAttribute("aria-hidden", i !== state));
        dots.forEach((d, i) => d.classList.toggle("is-on", i === Math.max(0, state - 1)));
      };
      setActive(0);

      const pinLength = () => window.innerHeight * N;
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)", fine: "(pointer: fine)" },
        (ctx) => {
          const { motion, small, fine } = ctx.conditions as Record<string, boolean>;

          // Sin movimiento: misma escena fijada, pero cada paso aparece sin animación.
          if (!motion) {
            const show = (state: number) => {
              gsap.set(leads, { autoAlpha: (i: number) => (i === state ? 1 : 0) });
              gsap.set(asides, { autoAlpha: (i: number) => (i === state ? 1 : 0) });
              const screen = Math.max(0, state - 1);
              gsap.set(screens, { autoAlpha: (i: number) => (i === screen ? 1 : 0) });
              gsap.set(num, { autoAlpha: state > 0 ? 1 : 0 });
              gsap.set(numCol, { yPercent: (-100 / N) * screen });
              setActive(state);
            };
            ScrollTrigger.create({
              trigger: stage,
              start: "top top",
              end: () => `+=${pinLength()}`,
              pin: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => show(Math.min(STATES - 1, Math.floor(self.progress * STATES))),
            });
            return;
          }

          const lift = small ? 16 : 26;

          // Entrada del hero: espera a que termine la intro de marca (Intro.tsx).
          const intro = gsap.timeline({ defaults: { ease: "expo.out" }, paused: !window.__faryIntroDone });
          window.addEventListener("fary:intro-done", () => intro.play(), { once: true });
          intro
            .from(q(".hero-line > span"), { yPercent: 110, duration: 1.05, stagger: 0.08 }, 0.05)
            .from(q(".laptop"), { autoAlpha: 0, y: 18, scale: 0.985, duration: 1.2 }, 0.15)
            .from(gm(screens[0], "birken"), { yPercent: 18, autoAlpha: 0, duration: 0.9 }, 0.45)
            .from(gm(screens[0], "shoe"), { yPercent: -6, autoAlpha: 0, duration: 1, ease: "power3.out" }, 0.55)
            .from(gm(screens[0], "boston"), { yPercent: 18, autoAlpha: 0, duration: 0.9 }, 0.6)
            .from(gm(screens[0], "order"), { y: 8, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, 0.9)
            .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.07 }, 0.45)
            .from(q(".stage__hint, .stage__progress"), { autoAlpha: 0, duration: 0.8 }, 0.9);

          // Línea de tiempo única de la historia, ligada al scroll.
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          const items = (el: Element) => el.querySelectorAll("[data-item]");

          starts.forEach((at, k) => {
            const from = k; // estado que sale
            const to = k + 1; // estado que entra
            tl.to([leads[from], asides[from]], { autoAlpha: 0, y: -lift, duration: 0.35, ease: "power2.in" }, at)
              .set([leads[to], asides[to]], { autoAlpha: 1, y: 0 }, at + 0.32)
              .fromTo(
                [...items(leads[to]), ...items(asides[to])],
                { autoAlpha: 0, y: lift },
                { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.045, ease: "power3.out" },
                at + 0.32,
              );

            if (k === 0) {
              // Del hero al paso 01: la pantalla no cambia; aparece el número.
              tl.fromTo(num, { autoAlpha: 0, y: lift }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, at + 0.3).to(
                q(".stage__hint"),
                { autoAlpha: 0, duration: 0.3 },
                at,
              );
              return;
            }

            // Cambio de pantalla dentro de la máscara: fundido cruzado con una escala mínima.
            const out = screens[k - 1];
            const inn = screens[k];
            tl.to(numCol, { yPercent: (-100 / N) * k, duration: 0.6, ease: "power3.inOut" }, at + 0.05)
              .to(out, { autoAlpha: 0, scale: 0.985, duration: 0.45 }, at + 0.05)
              .fromTo(inn, { autoAlpha: 0, scale: 1.015, y: 6 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "power2.out" }, at + 0.12);
            enterScreen(tl, inn, at + 0.4);
          });
          tl.to({}, { duration: 0.45 }, starts[N - 1] + GAP - 0.45);

          // Capa trasera: la marca deriva muy despacio (nunca la laptop).
          tl.fromTo(q(".stage__ghost"), { yPercent: 0 }, { yPercent: -8, ease: "none", duration: tl.duration() }, 0);

          // Reposo de cada estado: justo antes de la transición siguiente (y el final).
          const rests = [0, ...starts.slice(1).map((t) => t - 0.08), tl.duration()];

          ScrollTrigger.create({
            animation: tl,
            trigger: stage,
            start: "top top",
            end: () => `+=${pinLength()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Con ratón o trackpad cada gesto termina en un paso completo; en táctil, scroll libre.
            snap: fine
              ? {
                  snapTo: (v: number, self?: ScrollTrigger) => {
                    const pts = rests.map((r) => r / tl.duration());
                    return (self?.direction ?? 1) > 0
                      ? (pts.find((p) => p >= v - 0.004) ?? 1)
                      : ([...pts].reverse().find((p) => p <= v + 0.004) ?? 0);
                  },
                  duration: { min: 0.25, max: 0.7 },
                  delay: 0.08,
                  ease: "power2.inOut",
                }
              : undefined,
            onUpdate: () => {
              const t = tl.time();
              setActive(starts.filter((s) => t >= s + 0.3).length);
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="inicio" className="story" aria-label="Fary Labs: de la idea al producto" ref={root}>
      <div className="stage">
        <LogoMark className="stage__ghost" />
        <div className="stage__grid">
          <div className="zone zone--lead">
            <div className="panel panel--hero" data-lead>
              <HeroCopy />
            </div>
            <StoryNumber steps={storySteps} />
            {storySteps.map((s) => (
              <div className="panel panel--step" data-lead key={s.id}>
                <StepLead step={s} />
              </div>
            ))}
          </div>

          <div className="zone zone--device">
            <LaptopFrame>
              <LaptopScreen steps={storySteps} />
            </LaptopFrame>
          </div>

          <div className="zone zone--aside">
            <div className="panel panel--hero" data-aside />
            {storySteps.map((s) => (
              <div className="panel panel--step" data-aside key={s.id}>
                <StepAside step={s} total={N} />
              </div>
            ))}
          </div>
        </div>
        <StoryProgress total={N} />
      </div>
    </section>
  );
}
