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
import { StoryOutro } from "./StoryOutro";
import { StoryProgress } from "./StoryProgress";
import { enterScreen, gm } from "./screenMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const N = storySteps.length;
/** Estados de la escena: 0 = hero, 1…N = pasos, N + 1 = cierre ("Ideas claras."). */
const STATES = N + 2;
/** Distancia de la línea de tiempo entre un estado y el siguiente. */
const GAP = 1.9;
/** Inicio de cada transición hacia el estado k (k = 1…N + 1). La última es el cierre. */
const starts = Array.from({ length: N + 1 }, (_, i) => 0.25 + i * GAP);
const OUTRO = starts[N];
/** Fondo de la escena: se oscurece de forma casi imperceptible en cada paso. */
const TINT = [0, 0.012, 0.022, 0.032, 0.024, 0.04, 0];

/**
 * Hero + historia en una sola escena fijada: la laptop es siempre la misma y está siempre
 * en el mismo sitio; el scroll solo cambia la pantalla, los textos, el número y el progreso.
 * Al terminar, la laptop se retira y entra el mensaje de cierre con el CTA.
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
      const laptop = q<HTMLElement>(".zone--device .laptop")[0];
      const outro = q<HTMLElement>("[data-outro]")[0];
      const tint = q<HTMLElement>(".stage__tint")[0];
      const num = q<HTMLElement>(".story-num")[0];
      const numCol = q<HTMLElement>(".story-num__col")[0];
      const dots = q<HTMLElement>("[data-dot]");
      const segs = q<HTMLElement>("[data-seg]");
      const fill = q<HTMLElement>(".story-progress__fill")[0];
      const progress = q<HTMLElement>(".story-progress, .story-bar");

      // Estado visible para lectores de pantalla y para el indicador de progreso.
      let current = -1;
      const setActive = (state: number) => {
        if (state === current) return;
        current = state;
        leads.forEach((el, i) => el.toggleAttribute("aria-hidden", i !== state));
        asides.forEach((el, i) => el.toggleAttribute("aria-hidden", i !== state));
        outro.toggleAttribute("aria-hidden", state !== N + 1);
        outro.toggleAttribute("inert", state !== N + 1);
        const step = Math.min(N, Math.max(0, state)) - 1; // −1 en el hero
        dots.forEach((d, i) => d.classList.toggle("is-on", i === step));
        segs.forEach((d, i) => d.classList.toggle("is-on", i <= step));
        fill.style.transform = `scaleY(${Math.max(0, step) / (N - 1)})`;
      };
      setActive(0);

      // La escena queda fijada 5 pantallas (≈500vh de recorrido).
      const pinLength = () => window.innerHeight * N;
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)", fine: "(pointer: fine)" },
        (ctx) => {
          const { motion, small, fine } = ctx.conditions as Record<string, boolean>;

          // Movimiento reducido: sin scrub ni desplazamientos; cada estado aparece con un fundido simple.
          if (!motion) {
            const fade = { duration: 0.2, overwrite: true };
            const show = (state: number) => {
              if (state === current) return;
              const screen = Math.min(N - 1, Math.max(0, state - 1));
              gsap.to(leads, { autoAlpha: (i: number) => (i === state ? 1 : 0), ...fade });
              gsap.to(asides, { autoAlpha: (i: number) => (i === state ? 1 : 0), ...fade });
              gsap.to(screens, { autoAlpha: (i: number) => (i === screen ? 1 : 0), ...fade });
              gsap.to(num, { autoAlpha: state > 0 && state <= N ? 1 : 0, ...fade });
              gsap.set(numCol, { yPercent: (-100 / N) * screen });
              gsap.to(laptop, { autoAlpha: state === N + 1 ? 0 : 1, ...fade });
              gsap.to(outro, { autoAlpha: state === N + 1 ? 1 : 0, ...fade });
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

          const lift = small ? 18 : 28;
          const drop = small ? 14 : 20;

          // Entrada del hero: espera a que termine la intro de marca (Intro.tsx).
          const intro = gsap.timeline({ defaults: { ease: "expo.out" }, paused: !window.__faryIntroDone });
          window.addEventListener("fary:intro-done", () => intro.play(), { once: true });
          intro
            .from(q(".hero-line > span"), { yPercent: 110, duration: 1.05, stagger: 0.08 }, 0.05)
            .from(laptop, { autoAlpha: 0, y: 18, scale: 0.985, duration: 1.2 }, 0.15)
            .from(gm(screens[0], "birken"), { yPercent: 18, autoAlpha: 0, duration: 0.9 }, 0.45)
            .from(gm(screens[0], "shoe"), { yPercent: -6, autoAlpha: 0, duration: 1, ease: "power3.out" }, 0.55)
            .from(gm(screens[0], "boston"), { yPercent: 18, autoAlpha: 0, duration: 0.9 }, 0.6)
            .from(gm(screens[0], "order"), { y: 8, autoAlpha: 0, duration: 0.6, ease: "power3.out" }, 0.9)
            .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.07 }, 0.45)
            .from(q(".stage__hint, .story-progress, .story-bar"), { autoAlpha: 0, duration: 0.8 }, 0.9);

          // Línea de tiempo única de la historia, ligada al scroll.
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          const items = (el: Element) => el.querySelectorAll("[data-item]");
          const textIn = (targets: Element[], at: number) =>
            tl.fromTo(
              targets,
              { autoAlpha: 0, y: lift },
              { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
              at,
            );

          starts.forEach((at, k) => {
            const isOutro = k === N;
            // Sale el estado k: textos hacia arriba.
            tl.to([leads[k], asides[k]], { autoAlpha: 0, y: -drop, duration: 0.35, ease: "power2.in" }, at);
            tl.to(tint, { opacity: TINT[k + 1], duration: 0.8, ease: "none" }, at);

            if (isOutro) {
              // Cierre: la laptop se retira (escala y fundido) y entra el mensaje.
              tl.to(num, { autoAlpha: 0, y: -drop, duration: 0.35, ease: "power2.in" }, at)
                .to(progress, { autoAlpha: 0, duration: 0.35 }, at)
                .to(laptop, { scale: 0.94, autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, at + 0.05)
                .set(outro, { autoAlpha: 1 }, at + 0.35);
              textIn([...items(outro)], at + 0.4);
              return;
            }

            // Entra el estado k + 1.
            tl.set([leads[k + 1], asides[k + 1]], { autoAlpha: 1, y: 0 }, at + 0.32);
            textIn([...items(leads[k + 1]), ...items(asides[k + 1])], at + 0.32);

            if (k === 0) {
              // Del hero al paso 01: la pantalla no cambia; aparece el número y el zueco respira.
              tl.fromTo(num, { autoAlpha: 0, y: lift }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, at + 0.3)
                .to(q(".stage__hint"), { autoAlpha: 0, duration: 0.3 }, at)
                .to(gm(screens[0], "shoe"), { yPercent: -2.5, scale: 1.02, duration: 1.3, ease: "sine.inOut" }, at + 0.2);
              return;
            }

            // Número tipo contador y cambio de pantalla dentro de la máscara.
            const out = screens[k - 1];
            const inn = screens[k];
            tl.to(numCol, { yPercent: (-100 / N) * k, duration: 0.6, ease: "power3.inOut" }, at + 0.05)
              .to(out, { autoAlpha: 0, scale: 0.985, y: -10, duration: 0.45 }, at + 0.05)
              .fromTo(
                inn,
                { autoAlpha: 0, scale: 1.015, y: 12 },
                { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "power2.out" },
                at + 0.12,
              );
            enterScreen(tl, inn, at + 0.4);
          });
          tl.to({}, { duration: 0.5 }, OUTRO + GAP - 0.5);

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
        <span className="stage__tint" aria-hidden="true" />
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
            {/* Hueco del cierre: mantiene la correspondencia índice ↔ estado. */}
            <div className="panel panel--step" data-lead />
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
            <div className="panel panel--step" data-aside />
          </div>
        </div>
        <StoryOutro />
        <StoryProgress steps={storySteps} />
      </div>
    </section>
  );
}
