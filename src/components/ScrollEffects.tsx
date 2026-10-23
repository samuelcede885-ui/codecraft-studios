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
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "expo.out", overwrite: true }),
      });

      // Imágenes del case study: un recorte que se abre, con opacidad y un desplazamiento corto.
      if (document.querySelector("[data-media]")) gsap.set("[data-media]", { autoAlpha: 0, y: 24, clipPath: "inset(14% 0% 0% 0% round 12px)" });
      ScrollTrigger.batch("[data-media]", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0% round 12px)",
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            overwrite: true,
            clearProps: "clipPath",
          }),
      });

      // Línea del proceso: horizontal en escritorio, vertical en móvil y tablet.
      if (document.querySelector(".process__line-fill")) {
        const vertical = window.matchMedia("(max-width: 1023px)").matches;
        gsap.fromTo(
          ".process__line-fill",
          vertical ? { scaleY: 0, scaleX: 1 } : { scaleX: 0, scaleY: 1 },
          {
            ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
            ease: "none",
            scrollTrigger: { trigger: ".process__track", start: "top 75%", end: vertical ? "bottom 70%" : "bottom 55%", scrub: 0.6 },
          },
        );
      }
    });

    // Las fuentes cambian alturas: recalcular triggers. Si se entró con un ancla
    // (#cotizacion desde una ficha de proyecto…), repetir el salto con el layout definitivo.
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      const target = window.location.hash && document.querySelector(window.location.hash);
      if (target) target.scrollIntoView();
      clearHash();
    });

    // Los enlaces del menú (#planes, #portafolio…) desplazan sin dejar el ancla en la dirección:
    // así, al recargar o volver a entrar, la página empieza en el hero y no en esa sección.
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a[href^="#"]')) setTimeout(clearHash, 0);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      mm.revert();
    };
  });

  return null;
}

/** Quita el ancla de la dirección sin moverse ni tocar el estado del router. */
function clearHash() {
  if (window.location.hash) history.replaceState(history.state, "", window.location.pathname + window.location.search);
}
