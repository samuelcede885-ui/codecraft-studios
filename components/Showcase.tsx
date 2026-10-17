"use client";

import { useRef, type MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Mouse } from "lucide-react";
import Laptop from "./Laptop";
import { ScreenLayer } from "./screens";
import { hero, scenes, type Feature } from "@/data/scenes";
import { scrollToTarget, setActiveSection, setTargetResolver } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Ritmo de la línea de tiempo (en unidades de timeline, no en segundos).
const HERO_HOLD = 0.4;
const STEP = 1; // duración de cada transición
const HOLD = 1; // pausa en cada escena
const TAIL = 1; // pausa final antes de liberar el pin

function FeatureList({ items }: { items: Feature[] }) {
  return (
    <ul className="feature-list">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} data-line>
          <Icon className="size-[1.05rem] shrink-0" strokeWidth={1.8} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

function ctaClick(e: MouseEvent<HTMLAnchorElement>) {
  if (scrollToTarget("contacto")) e.preventDefault();
}

export default function Showcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023.98px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          const q = gsap.utils.selector(root);
          const screens = q<HTMLElement>("[data-screen]");
          const lefts = q<HTMLElement>("[data-copy-left]");
          const rights = q<HTMLElement>("[data-copy-right]");
          const glows = q<HTMLElement>("[data-glow]");
          const floors = q<HTMLElement>("[data-floor]");
          const laptop = q<HTMLElement>("[data-laptop]")[0];
          const cue = q<HTMLElement>("[data-cue]");
          const lines = (layer: HTMLElement) => layer.querySelectorAll<HTMLElement>("[data-line]");
          const shift = reduce ? 0 : desktop ? 36 : 22;

          // Estado inicial explícito: solo el hero y la primera pantalla visibles.
          gsap.set(screens, { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });
          gsap.set([...glows, ...floors], { autoAlpha: (i: number) => (i % scenes.length === 0 ? 1 : 0) });
          [...lefts, ...rights].forEach((layer) => {
            const visible = layer.dataset.step === "0";
            gsap.set(lines(layer), { autoAlpha: visible ? 1 : 0 });
          });

          const tl = gsap.timeline({
            defaults: { duration: STEP, ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${window.innerHeight * (desktop ? 5.4 : 4.4)}`,
              pin: true,
              scrub: reduce ? true : 0.9,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const t = self.progress * tl.duration();
                const labels = Object.entries(tl.labels).sort((a, b) => a[1] - b[1]);
                let current = "hero";
                for (const [name, time] of labels) if (t + STEP / 2 >= time) current = name;
                setActiveSection(current);
              },
              onLeave: () => setActiveSection("contacto"),
            },
          });

          const copyOut = (step: number, at: number) => {
            const els = [lefts[step], rights[step]].flatMap((l) => [...lines(l)]);
            tl.to(els, { autoAlpha: 0, y: -shift, duration: 0.45, stagger: 0.03, ease: "power2.in" }, at);
          };
          const copyIn = (step: number, at: number) => {
            const els = [lefts[step], rights[step]].flatMap((l) => [...lines(l)]);
            tl.fromTo(
              els,
              { autoAlpha: 0, y: shift },
              { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", immediateRender: false },
              at,
            );
          };
          const lighting = (from: number, to: number, at: number) => {
            tl.to([glows[from], floors[from]], { autoAlpha: 0 }, at).fromTo(
              [glows[to], floors[to]],
              { autoAlpha: 0 },
              { autoAlpha: 1, immediateRender: false },
              at,
            );
          };

          const screenIn = (from: number, to: number, at: number) => {
            const prev = screens[from];
            const next = screens[to];
            const kind = reduce ? "plain" : next.dataset.transition;
            const hidePrev = () => tl.to(prev, { autoAlpha: 0, duration: 0.01 }, at + STEP);
            const ir = { immediateRender: false };

            switch (kind) {
              case "rise":
                tl.to(prev, { autoAlpha: 0, yPercent: -5, scale: 0.97 }, at).fromTo(
                  next,
                  { autoAlpha: 0, yPercent: 7, scale: 1.05 },
                  { autoAlpha: 1, yPercent: 0, scale: 1, ...ir },
                  at,
                );
                break;
              case "wipe": // revelado lateral: la nueva pantalla barre de derecha a izquierda
                tl.fromTo(
                  next,
                  { autoAlpha: 1, clipPath: "inset(0% 0% 0% 100%)" },
                  { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", ...ir },
                  at,
                ).to(prev, { xPercent: -10, ease: "power3.inOut" }, at);
                hidePrev();
                break;
              case "fade":
                tl.to(prev, { autoAlpha: 0, duration: STEP * 0.9 }, at).fromTo(
                  next,
                  { autoAlpha: 0, scale: 1.07 },
                  { autoAlpha: 1, scale: 1, duration: STEP * 1.1, ease: "power1.out", ...ir },
                  at + STEP * 0.1,
                );
                break;
              case "mask": // máscara que revela de abajo arriba
                tl.fromTo(
                  next,
                  { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
                  { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", ...ir },
                  at,
                ).to(prev, { yPercent: -8, ease: "power3.inOut" }, at);
                hidePrev();
                break;
              default:
                tl.to(prev, { autoAlpha: 0 }, at).fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1, ...ir }, at);
            }

            // Movimiento interno de los elementos de la nueva pantalla (solo escritorio).
            if (desktop && !reduce) {
              const floaters = next.querySelectorAll("[data-float]");
              if (floaters.length) {
                tl.fromTo(
                  floaters,
                  { y: 26, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" },
                  at + STEP * 0.15,
                );
              }
            }
          };

          // Hero → escena 01: el texto inicial se va, la laptop se asienta y aparece la escena 01.
          tl.addLabel("hero", 0);
          let t = HERO_HOLD;
          copyOut(0, t);
          tl.to(cue, { autoAlpha: 0, duration: 0.4 }, t);
          if (!reduce) tl.fromTo(laptop, { y: 18, scale: 0.97 }, { y: 0, scale: 1 }, t);
          copyIn(1, t + 0.45);
          t += STEP;
          tl.addLabel(scenes[0].id, t);

          // Escenas 02–05: la laptop no se mueve, solo cambian pantalla, textos e iluminación.
          for (let i = 1; i < scenes.length; i++) {
            t += HOLD;
            copyOut(i, t);
            screenIn(i - 1, i, t);
            lighting(i - 1, i, t);
            copyIn(i + 1, t + 0.45);
            t += STEP;
            tl.addLabel(scenes[i].id, t);
          }
          tl.to({}, { duration: TAIL }, t);

          const st = tl.scrollTrigger!;
          setTargetResolver((target) => {
            const time = tl.labels[target];
            if (time === undefined) return null;
            return st.start + (st.end - st.start) * (time / tl.duration());
          });

          // Decodifica las capturas reales (si las hay) antes de que se crucen en pantalla.
          const imgs = q<HTMLImageElement>("[data-screen] img");
          Promise.all(imgs.map((img) => img.decode().catch(() => undefined))).then(() => ScrollTrigger.refresh());

          return () => setTargetResolver(null);
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="inicio" ref={root} className="stage" aria-label="Fary Labs: proyectos y servicios">
      {/* Fondo: luz gris suave + tinte del acento de cada proyecto */}
      <div className="stage-bg" aria-hidden="true">
        <svg viewBox="0 0 48 40" className="stage-mark">
          <path d="M0 0h13l13 20-13 20H0l13-20z" />
          <path d="M18 0h13l13 20-13 20H18l13-20z" />
        </svg>
        {scenes.map((s, i) => (
          <span
            key={s.id}
            data-glow
            data-initial={i === 0 ? undefined : "hidden"}
            className="stage-glow"
            style={{ "--accent": s.accent } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="stage-grid">
        {/* Columna izquierda (arriba en móvil) */}
        <div className="slot slot-left">
          <div className="copy-layer" data-copy-left data-step="0">
            <span className="rule" data-line />
            <h1 className="hero-title" data-line>
              {hero.title}
            </h1>
            <p className="copy-desc max-lg:hidden" data-line>
              {hero.description}
            </p>
            <a href="#contacto" onClick={ctaClick} className="btn-dark mt-2 max-lg:hidden" data-line>
              {hero.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          {scenes.map((s, i) => (
            <div key={s.id} className="copy-layer" data-copy-left data-step={i + 1} data-initial="hidden">
              <span className="eyebrow" data-line>
                <span>{s.number}</span>
                <span className="rule" />
                <span className="eyebrow-project">
                  {s.project}
                  {s.isDemo && <span className="demo-tag">Demo</span>}
                </span>
              </span>
              <h2 className="scene-title" data-line>
                {s.title}
              </h2>
              {s.description && (
                <p className="copy-desc max-sm:hidden" data-line>
                  {s.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Laptop única, fija en el centro */}
        <div className="slot slot-device">
          {scenes.map((s, i) => (
            <span
              key={s.id}
              data-floor
              data-initial={i === 0 ? undefined : "hidden"}
              className="device-floor"
              style={{ "--accent": s.accent } as React.CSSProperties}
              aria-hidden="true"
            />
          ))}
          <Laptop>
            {scenes.map((s, i) => (
              <ScreenLayer key={s.id} scene={s} index={i} />
            ))}
          </Laptop>
        </div>

        {/* Columna derecha (abajo en móvil) */}
        <div className="slot slot-right">
          <div className="copy-layer" data-copy-right data-step="0">
            <div className="max-lg:hidden">
              <h2 className="side-title" data-line>
                {hero.sideTitle}
              </h2>
              <FeatureList items={hero.sideFeatures} />
            </div>
            <a href="#contacto" onClick={ctaClick} className="btn-dark lg:hidden" data-line>
              {hero.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
          {scenes.map((s, i) => (
            <div key={s.id} className="copy-layer" data-copy-right data-step={i + 1} data-initial="hidden">
              <FeatureList items={s.features} />
              {s.cta && (
                <a href="#contacto" onClick={ctaClick} className="btn-dark mt-1" data-line>
                  {s.cta.label} <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-cue" data-cue aria-hidden="true">
        <Mouse className="size-5" strokeWidth={1.6} />
        <span className="scroll-cue-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
