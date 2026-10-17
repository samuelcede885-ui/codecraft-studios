"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Apariciones discretas de las secciones posteriores a la historia. Todo con transform, opacity y clip-path. */
export function ScrollEffects() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 768px)" },
      (ctx) => {
        const { motion, wide } = ctx.conditions as Record<string, boolean>;

        if (motion) {
          gsap.set("[data-reveal]", { autoAlpha: 0, y: 28 });
          ScrollTrigger.batch("[data-reveal]", {
            start: "top 88%",
            once: true,
            onEnter: (els) =>
              gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "expo.out", overwrite: true }),
          });

          // Imágenes del portafolio: aparecen de abajo hacia arriba.
          gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              },
            );
          });
        }

        // Línea del proceso: horizontal en escritorio, vertical en móvil. Con movimiento
        // reducido queda completa.
        const fill = ".process__line-fill";
        const prop = wide ? "scaleX" : "scaleY";
        if (!motion) {
          gsap.set(fill, { [prop]: 1 });
          return;
        }
        gsap.fromTo(
          fill,
          { [prop]: 0 },
          {
            [prop]: 1,
            ease: "none",
            scrollTrigger: { trigger: ".process__track", start: "top 75%", end: "bottom 60%", scrub: 0.6 },
          },
        );
      },
    );

    // Los recursos (fuentes) cambian alturas: recalcular pins y triggers.
    // Si se entró con un ancla (#contacto…), el salto inicial ocurrió antes
    // de crear el espacio del pin: repetirlo con el layout definitivo.
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      const target = hash && !hash.startsWith("#proyecto-") && document.querySelector(hash);
      if (target) target.scrollIntoView();
    });

    return () => mm.revert();
  });

  return null;
}
