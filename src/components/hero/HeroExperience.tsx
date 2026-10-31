"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_SPEED, heroStages, stageAt } from "@/data/heroStages";
import { track } from "@/lib/analytics";
import { LogoMark } from "../Logo";
import { ArrowRight } from "../Icon";
import { HeroLaptop } from "./HeroLaptop";
import { HeroStage } from "./HeroStage";
import { HeroPlayback } from "./HeroPlayback";
import { heroStarterScript } from "./heroStarter";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero automático: la laptop reproduce un recorrido por Bunzo Burgers (concepto) y los textos de los lados
 * cambian con él. El tiempo real del video (`currentTime`) es la única fuente de verdad:
 * no hay temporizadores propios, así que si el video se retrasa o se pausa, los textos esperan.
 * El scroll no controla nada: solo sirve para salir del hero. Fuera de la vista, el video se pausa.
 * Piezas: HeroStage (textos), HeroLaptop (laptop, etiquetas y video) y HeroPlayback (pausa).
 * El recorrido se reproduce a HERO_SPEED; los textos siguen leyendo el tiempo del video.
 */
export function HeroExperience() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const wanted = useRef(false); // el hero debería estar reproduciendo (visible e intro terminada)
  const userPaused = useRef(false);

  const time = useCallback(() => video.current?.currentTime ?? 0, []);

  /** Lee el tiempo del video y actualiza la etapa. */
  const sync = useCallback(() => {
    const t = time();
    const i = stageAt(t);
    setStage((prev) => (prev === i ? prev : i));
  }, [time]);

  // Si aún no hay datos suficientes, play() queda en espera y el video arranca solo en cuanto
  // puede; mientras tanto se ve el póster, que es su primer fotograma. Nunca se cambia por otra cosa.
  const play = useCallback(() => {
    if (userPaused.current || !wanted.current) return;
    const v = video.current;
    if (!v) return;
    v.defaultPlaybackRate = HERO_SPEED;
    v.playbackRate = HERO_SPEED;
    v.play().catch(() => retryOnGesture(v));
  }, []);

  const pause = useCallback(() => {
    video.current?.pause();
  }, []);

  // Bucle de sincronización: un requestAnimationFrame mientras algo se reproduce.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      sync();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const v = video.current;
    v?.addEventListener("timeupdate", sync);
    v?.addEventListener("seeked", sync);
    return () => {
      cancelAnimationFrame(raf);
      v?.removeEventListener("timeupdate", sync);
      v?.removeEventListener("seeked", sync);
    };
  }, [sync]);

  // Arranca al terminar la intro de marca; se pausa fuera de la vista o con la pestaña oculta.
  // Con movimiento reducido empieza en pausa: el botón lo pone en marcha.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      userPaused.current = true;
      setPaused(true);
      if (video.current) video.current.dataset.userPaused = "1";
    }
    let visible = true;
    // Si el script en línea ya arrancó el video al terminar la intro, se sigue sin pausas.
    let introDone = !!window.__faryIntroDone || !!window.__faryHeroStarted;
    window.__faryHeroReact = true;
    const update = () => {
      wanted.current = visible && introDone && document.visibilityState === "visible";
      if (wanted.current) play();
      else pause();
    };
    const onIntro = () => {
      introDone = true;
      update();
    };
    window.addEventListener("fary:intro-done", onIntro, { once: true });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    }, { threshold: 0.12 });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("fary:intro-done", onIntro);
      document.removeEventListener("visibilitychange", update);
    };
  }, [play, pause]);

  // Medición: cada etapa numerada que se llega a ver (una vez por etapa y visita).
  const seenStages = useRef(new Set<number>());
  useEffect(() => {
    const s = heroStages[stage];
    if (!s.id || seenStages.current.has(stage)) return;
    seenStages.current.add(stage);
    track("hero_stage_view", { stage: s.id, title: s.title });
  }, [stage]);

  // Entrada del hero (una vez, sin scroll): la laptop ya está en su sitio al terminar la intro
  // y el video arranca en ese mismo instante; solo los textos laterales entran con suavidad.
  useEffect(() => {
    const el = root.current;
    // Si la página cargó tarde y el hero ya está en marcha, no se repite la entrada.
    if (!el || window.__faryHeroStarted || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ paused: !window.__faryIntroDone, defaults: { ease: "expo.out" } });
    tl.from(el.querySelectorAll("[data-hero-in]"), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.05);
    const go = () => tl.play();
    window.addEventListener("fary:intro-done", go, { once: true });
    return () => {
      window.removeEventListener("fary:intro-done", go);
      tl.revert();
    };
  }, []);

  // Salida hacia el portafolio: al empezar a bajar, una transición breve de duración fija
  // (no ligada al scroll) aleja la escena y presenta la siguiente sección. Al volver, se revierte.
  // No toca la secuencia del video, que sigue siendo automática.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ paused: true, defaults: { duration: 0.75, ease: "power3.inOut" } });
      tl.to(q(".stage__grid"), { scale: 0.97, transformOrigin: "50% 40%" }, 0)
        .to(q(".zone--lead .hero-panels, .hero-auto__cta, .zone--aside, .hero-tags, .stage__hint"), { autoAlpha: 0, y: -10, duration: 0.5, ease: "power2.in", stagger: 0.03 }, 0)
        .to(q(".zone--device .laptop"), { y: -20 }, 0)
        .to(q(".stage__ghost"), { autoAlpha: 0.35, duration: 0.6 }, 0)
        .fromTo(q(".hero-exit"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.3);
      ScrollTrigger.create({
        trigger: el,
        start: "top+=40 top",
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });
      return () => tl.revert();
    });
    return () => mm.revert();
  }, []);

  function togglePause() {
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    // El reintento por gesto (retryOnGesture) no debe reanudar un video que la persona pausó.
    if (video.current) {
      if (userPaused.current) video.current.dataset.userPaused = "1";
      else delete video.current.dataset.userPaused;
    }
    if (userPaused.current) pause();
    else play();
  }

  return (
    <section id="inicio" className="story hero-auto" aria-label="Fary Labs: de la idea al producto" ref={root}>
      <div className="stage">
        <LogoMark className="stage__ghost" />
        <div className="stage__grid">
          <div className="zone zone--lead" data-hero-in>
            <HeroStage side="lead" stage={stage} />
            <a href="#contacto" className="btn btn--dark hero-auto__cta">
              Comenzar proyecto <ArrowRight className="btn__arrow" />
            </a>
          </div>

          <HeroLaptop stage={stage} videoRef={video} />

          <div className="zone zone--aside" data-hero-in>
            <HeroPlayback paused={paused} onToggle={togglePause} />
            <HeroStage side="aside" stage={stage} />
          </div>
        </div>
        <p className="hero-exit" aria-hidden="true">
          Ahora mira lo que podemos construir.
        </p>
        <div className="stage__hint" aria-hidden="true">
          <span className="stage__mouse" />
          Scroll
        </div>
      </div>
      {/* Arranque sin esperar al JavaScript de la página (ver heroStarter.ts). */}
      <script dangerouslySetInnerHTML={{ __html: heroStarterScript() }} />
    </section>
  );
}

/**
 * Si el navegador bloquea el arranque automático (p. ej. iPhone en modo de bajo consumo), el video
 * arranca en el primer toque, desplazamiento o tecla de la persona. Una sola vez.
 */
function retryOnGesture(v: HTMLVideoElement) {
  const events = ["touchstart", "pointerdown", "keydown", "wheel", "scroll"] as const;
  const go = () => {
    events.forEach((e) => window.removeEventListener(e, go));
    if (v.paused && !v.dataset.userPaused) v.play().catch(() => undefined);
  };
  events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
}
