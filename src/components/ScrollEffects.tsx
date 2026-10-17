"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Apariciones discretas de las secciones posteriores a la secuencia principal. */
export function ScrollEffects() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "expo.out", overwrite: true }),
      });

      gsap.fromTo(
        ".process__line-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".process__track", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        },
      );

      gsap.to(".contact__mark", {
        yPercent: -8,
        rotate: -4,
        ease: "none",
        scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: true },
      });

      // Los recursos (fuentes) cambian alturas: recalcular pins y triggers.
      // Si se entró con un ancla (#contacto…), el salto inicial ocurrió antes
      // de crear el espacio del pin: repetirlo con el layout definitivo.
      document.fonts?.ready.then(() => {
        ScrollTrigger.refresh();
        const target = window.location.hash && document.querySelector(window.location.hash);
        if (target) target.scrollIntoView();
      });
    });

    return () => mm.revert();
  });

  return null;
}
