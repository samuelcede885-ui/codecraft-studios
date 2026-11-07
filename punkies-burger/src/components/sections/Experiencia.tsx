import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { PhotoId } from '../../data/photos';
import { Photo } from '../ui/Photo';
import { Ticket } from '../brand/Brand';
import { useReveal } from '../../hooks/useReveal';
import { cx } from '../../lib/cx';

interface Print {
  id: PhotoId;
  /** Posición y tamaño dentro de la escena */
  className: string;
  aspect: string;
  rotate: string;
  /** Profundidad para el parallax (0 = fijo) */
  depth: number;
  focus?: string;
  sizes: string;
}

interface Step {
  n: string;
  title: string;
  text: string;
  prints: Print[];
  ticket?: string[];
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'La plancha',
    text: 'La carne se aplasta contra la plancha caliente hasta que el borde se tuesta.',
    prints: [
      { id: 'envuelta-bandeja', className: 'right-0 top-0 w-[74%]', aspect: 'aspect-[4/3.6]', rotate: '-1.8deg', depth: 0.5, focus: '52% 86%', sizes: '(min-width: 1024px) 40vw, 74vw' },
      { id: 'cocina-guante', className: 'bottom-0 left-0 w-[46%]', aspect: 'aspect-[4/3]', rotate: '4deg', depth: 1.2, sizes: '(min-width: 1024px) 25vw, 46vw' },
    ],
  },
  {
    n: '02',
    title: 'El queso',
    text: 'Queso derretido sobre la carne. En La Clásica, además: pepinillos, cebolla, lechuga, mostaza y ketchup.',
    prints: [
      { id: 'plancha-guantes', className: 'left-0 top-0 w-[70%]', aspect: 'aspect-[4/4.4]', rotate: '1.6deg', depth: 0.5, sizes: '(min-width: 1024px) 38vw, 70vw' },
      { id: 'panes-salsas', className: 'bottom-[2%] right-0 w-[42%]', aspect: 'aspect-square', rotate: '-4.5deg', depth: 1.3, sizes: '(min-width: 1024px) 23vw, 42vw' },
    ],
  },
  {
    n: '03',
    title: 'El pan',
    text: 'Pan brioche, suave y dorado, para cerrarla.',
    prints: [
      { id: 'pan-brioche', className: 'left-[4%] top-[10%] w-[92%]', aspect: 'aspect-[16/10]', rotate: '-1.2deg', depth: 0.7, sizes: '(min-width: 1024px) 50vw, 92vw' },
    ],
  },
  {
    n: '04',
    title: 'Listo',
    text: 'Envuelta en papel con tres estrellas. Para comer aquí, retirar en el local o pedir por delivery.',
    prints: [
      { id: 'dos-smash', className: 'right-[2%] top-0 w-[76%]', aspect: 'aspect-[4/3.7]', rotate: '2deg', depth: 0.5, focus: '50% 38%', sizes: '(min-width: 1024px) 42vw, 76vw' },
    ],
    ticket: ['Orden Nº 0365', '365 days flipping burgers', 'Av. Mohedano · Chacao · CCS'],
  },
];

const vars = (v: Record<string, string | number>) => v as CSSProperties;

export function Experiencia() {
  const root = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLSpanElement>(null);
  const scenesWrap = useRef<HTMLDivElement>(null);

  // Paso activo (todas las pantallas, también con reduced-motion)
  useEffect(() => {
    const scenes = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-scene]') ?? []);
    if (!('IntersectionObserver' in window) || !scenes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.scene));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    scenes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [root]);

  // Coreografía GSAP ScrollTrigger: solo escritorio y sin reduced-motion. Se carga bajo demanda.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    let cancelled = false;
    let revert: (() => void) | undefined;

    const setup = async () => {
      revert?.();
      revert = undefined;
      if (!mq.matches || !root.current) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        root.current!.querySelectorAll<HTMLElement>('[data-scene]').forEach((scene) => {
          scene.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
            const d = Number(el.dataset.depth) || 0;
            gsap.fromTo(
              el,
              { yPercent: 7 * d },
              { yPercent: -7 * d, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 0.7 } },
            );
          });
        });
        if (bar.current && scenesWrap.current) {
          gsap.fromTo(
            bar.current,
            { scaleY: 0 },
            { scaleY: 1, ease: 'none', scrollTrigger: { trigger: scenesWrap.current, start: 'top 50%', end: 'bottom 50%', scrub: true } },
          );
        }
      }, root.current);
      document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
      revert = () => ctx.revert();
    };

    setup();
    mq.addEventListener('change', setup);
    return () => {
      cancelled = true;
      mq.removeEventListener('change', setup);
      revert?.();
    };
  }, [root]);

  return (
    <section ref={root} id="experiencia" aria-labelledby="exp-title" className="relative px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <h2 id="exp-title" className="font-black-display text-[clamp(3.6rem,12.5vw,8.6rem)] text-crema">
              Smash.
              <br />
              Queso.
              <br />
              Repetir.
            </h2>
            <nav aria-label="Pasos de la preparación" className="mt-12 hidden lg:block">
              <div className="relative pl-6">
                <span className="absolute left-0 top-1 h-[calc(100%-8px)] w-[3px] rounded-full bg-crema/15" aria-hidden="true" />
                <span ref={bar} className="absolute left-0 top-1 h-[calc(100%-8px)] w-[3px] origin-top rounded-full bg-rojo" aria-hidden="true" />
                <ol className="space-y-2.5">
                  {STEPS.map((s, i) => (
                    <li key={s.n}>
                      <a
                        href={`#paso-${s.n}`}
                        aria-current={active === i ? 'step' : undefined}
                        className={cx(
                          'flex items-baseline gap-4 py-1 text-[1.65rem] font-extrabold tracking-[-0.03em] transition-colors duration-300',
                          active === i ? 'text-crema' : 'text-crema/40 hover:text-crema/75',
                        )}
                      >
                        <span className={cx('font-mono text-[13px] font-bold tracking-normal', active === i ? 'text-amarillo' : '')}>{s.n}</span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          </div>
        </div>

        <div ref={scenesWrap} className="space-y-24 lg:col-span-7 lg:space-y-[16vh] lg:pt-[6vh]">
          {STEPS.map((s, i) => (
            <article key={s.n} id={`paso-${s.n}`} data-scene={i} aria-labelledby={`paso-${s.n}-t`} className="scroll-mt-28">
              <div className={cx('relative w-full', s.prints.length > 1 ? 'aspect-[10/9.4]' : 'aspect-[10/8]')}>
                {s.prints.map((p, k) => (
                  <div key={p.id} data-depth={p.depth} className={cx('absolute', p.className)}>
                    <figure className="reveal print" style={vars({ '--r': p.rotate, '--i': k })}>
                      <Photo id={p.id} sizes={p.sizes} focus={p.focus} className={cx(p.aspect, 'rounded-[2px]')} />
                    </figure>
                  </div>
                ))}
                {s.ticket && (
                  <div data-depth={1.4} className="absolute bottom-[4%] left-[2%] w-[min(82%,310px)]">
                    <div className="reveal" style={vars({ '--r': '-3deg', '--i': 1 })}>
                      <Ticket lines={s.ticket} className="bg-tinta text-crema" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 max-w-[44ch] md:mt-10">
                <p className="font-mono text-[13px] font-bold text-amarillo">Paso {s.n}</p>
                <h3 id={`paso-${s.n}-t`} className="font-black-display mt-2 text-[clamp(2.3rem,5vw,3.6rem)] text-crema">
                  {s.title}
                </h3>
                <p className="mt-3 text-[1.15rem] leading-[1.45] text-crema/80">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
