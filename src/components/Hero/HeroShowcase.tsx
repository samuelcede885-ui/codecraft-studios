"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HERO_DURATION, heroStages, numberedStages, stageAt } from "@/data/heroStages";
import { LogoMark } from "../Logo";
import { ArrowRight } from "../Icon";
import { LaptopFrame } from "../ScrollStory/LaptopFrame";
import { Reel } from "../reel/Reel";
import { assetUrl } from "@/lib/assets";

const VIDEO = "/projects/gramercy/full";
const POSTER = "/projects/gramercy/poster.webp";
/** Si el video no está listo en este tiempo, la laptop pasa a la bobina HTML en vivo. */
const VIDEO_TIMEOUT = 6000;

type Source = "video" | "reel";

/**
 * Hero automático: la laptop reproduce un recorrido por Gramercy y los textos de los lados
 * cambian con él. El tiempo real del video (`currentTime`) es la única fuente de verdad:
 * no hay temporizadores propios, así que si el video se retrasa o se pausa, los textos esperan.
 * El scroll no controla nada: solo sirve para salir del hero. Fuera de la vista, el video se pausa.
 */
export function HeroShowcase() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reel = useRef<gsap.core.Timeline | null>(null);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const [source, setSource] = useState<Source>("video");
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const sourceRef = useRef<Source>("video");
  const wanted = useRef(false); // el hero debería estar reproduciendo (visible e intro terminada)
  const userPaused = useRef(false);
  sourceRef.current = source;

  const time = useCallback(() => {
    if (sourceRef.current === "reel") return reel.current ? reel.current.time() % HERO_DURATION : 0;
    return video.current?.currentTime ?? 0;
  }, []);

  /** Lee el tiempo y actualiza etapa y barra de progreso (la barra se escribe directo en el DOM). */
  const sync = useCallback(() => {
    const t = time();
    const i = stageAt(t);
    setStage((prev) => (prev === i ? prev : i));
    const s = heroStages[i];
    const n = numberedStages.indexOf(s);
    fills.current.forEach((el, k) => {
      if (!el) return;
      const p = k < n ? 1 : k === n ? Math.min(1, (t - s.start) / (s.end - s.start)) : 0;
      el.style.transform = `scaleX(${p})`;
    });
  }, [time]);

  const play = useCallback(() => {
    if (userPaused.current || !wanted.current) return;
    if (sourceRef.current === "reel") {
      reel.current?.play();
      return;
    }
    video.current?.play().catch((err: DOMException) => {
      // Sin formato compatible o reproducción imposible: la bobina en vivo toma el relevo.
      if (err.name === "NotSupportedError") setSource("reel");
    });
  }, []);

  const pause = useCallback(() => {
    video.current?.pause();
    reel.current?.pause();
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
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = true;
    let introDone = !!window.__faryIntroDone;
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

  // Respaldo: si el video falla o no está listo a tiempo, la bobina HTML ocupa su lugar.
  useEffect(() => {
    const v = video.current;
    if (!v || source !== "video") return;
    const fail = () => setSource("reel");
    const last = v.querySelector("source:last-of-type");
    last?.addEventListener("error", fail);
    v.addEventListener("error", fail);
    const timer = window.setTimeout(() => {
      if (v.readyState < 3) fail();
    }, VIDEO_TIMEOUT);
    const ok = () => window.clearTimeout(timer);
    v.addEventListener("canplay", ok, { once: true });
    return () => {
      window.clearTimeout(timer);
      last?.removeEventListener("error", fail);
      v.removeEventListener("error", fail);
      v.removeEventListener("canplay", ok);
    };
  }, [source]);

  // Entrada del hero (una vez, sin scroll): la laptop aparece en su sitio y no vuelve a moverse.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ paused: !window.__faryIntroDone, defaults: { ease: "expo.out" } });
    tl.from(el.querySelector(".laptop"), { autoAlpha: 0, y: 18, scale: 0.985, duration: 1.2 }, 0.1)
      .from(el.querySelectorAll("[data-hero-in]"), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.25);
    const go = () => tl.play();
    window.addEventListener("fary:intro-done", go, { once: true });
    return () => {
      window.removeEventListener("fary:intro-done", go);
      tl.revert();
    };
  }, []);

  function togglePause() {
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    if (userPaused.current) pause();
    else play();
  }

  const current = heroStages[stage];
  const n = Math.max(1, numberedStages.indexOf(current) + 1);

  return (
    <section id="inicio" className="story hero-auto" aria-label="Fary Labs: de la idea al producto" ref={root}>
      <div className="stage">
        <LogoMark className="stage__ghost" />
        <div className="stage__grid">
          <div className="zone zone--lead" data-hero-in>
            <div className="hero-panels">
              {heroStages.map((s, i) => (
                <div
                  className="hero-panel"
                  key={s.title}
                  data-state={i === stage ? "active" : i < stage ? "past" : "next"}
                  aria-hidden={i === 0 ? undefined : i !== stage}
                >
                  {i === 0 ? (
                    <>
                      <span className="hero-copy__rule" />
                      <h1 className="hero-copy__title">{s.title}</h1>
                      <p className="hero-copy__sub">{s.description}</p>
                    </>
                  ) : (
                    <h2 className="step-lead__title">{s.title}</h2>
                  )}
                </div>
              ))}
            </div>
            <a href="#contacto" className="btn btn--dark hero-auto__cta">
              Comenzar proyecto <ArrowRight className="btn__arrow" />
            </a>
          </div>

          <div className="zone zone--device">
            <LaptopFrame>
              {source === "video" ? (
                <video
                  ref={video}
                  className="hero-video"
                  muted
                  playsInline
                  loop
                  preload="auto"
                  poster={assetUrl(POSTER)}
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <source src={assetUrl(`${VIDEO}.webm`)} type="video/webm" />
                  <source src={assetUrl(`${VIDEO}.mp4`)} type="video/mp4" />
                </video>
              ) : (
                <Reel
                  id="gramercy"
                  onReady={(tl) => {
                    reel.current = tl;
                    if (!wanted.current || userPaused.current) tl.pause();
                  }}
                />
              )}
            </LaptopFrame>
          </div>

          <div className="zone zone--aside" data-hero-in>
            <div className="stage-ind">
              <span className={`stage-ind__num ${stage === 0 ? "is-idle" : ""}`} aria-hidden="true">
                <b>{String(n).padStart(2, "0")}</b> / {String(numberedStages.length).padStart(2, "0")}
              </span>
              <span className="stage-ind__bar" aria-hidden="true">
                {numberedStages.map((s, k) => (
                  <i key={s.id}>
                    <i ref={(el) => void (fills.current[k] = el)} />
                  </i>
                ))}
              </span>
              <button
                type="button"
                className="stage-ind__toggle"
                onClick={togglePause}
                aria-label={paused ? "Reproducir el recorrido" : "Pausar el recorrido"}
                aria-pressed={paused}
              >
                {paused ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13M16 5.5v13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
            <div className="hero-panels">
              {heroStages.map((s, i) => (
                <div
                  className="hero-panel"
                  key={s.title}
                  data-state={i === stage ? "active" : i < stage ? "past" : "next"}
                  aria-hidden={i !== stage}
                >
                  <span className="hero-aside__eyebrow">{i === 0 ? "En pantalla" : s.eyebrow}</span>
                  <p className="hero-aside__desc">
                    {i === 0 ? "Gramercy, un concepto de e-commerce diseñado por Fary Labs." : s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="stage__hint" aria-hidden="true">
          <span className="stage__mouse" />
          Scroll
        </div>
      </div>
    </section>
  );
}
