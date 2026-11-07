import type { CSSProperties } from 'react';
import { Seal } from '../brand/Brand';
import { ButtonLink } from '../ui/Button';
import { Photo } from '../ui/Photo';
import { site } from '../../config/site';
import { useUI } from '../../state/ui';

const vars = (v: Record<string, string | number>) => v as CSSProperties;

const TAGS = ['Chacao · Caracas', 'Smash burgers', 'Hechas en la plancha'];

export function Hero() {
  const { setPreferredMode } = useUI();
  const deliveryUrl = site.ordering.deliveryUrl;

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-x-clip px-4 pb-16 pt-[calc(var(--header-h)+30px)] md:px-6 lg:pb-24">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:min-h-[min(860px,calc(100svh-var(--header-h)-40px))] lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-7 lg:pl-2">
          <ul className="flex flex-wrap gap-2" aria-label="Punkie's en corto">
            {TAGS.map((t) => (
              <li key={t} className="label-mono rounded-full border-[1.5px] border-crema/60 px-3 py-1.5 text-crema">
                {t}
              </li>
            ))}
          </ul>

          <h1 id="hero-title" className="font-black-display mt-8 text-[clamp(3.6rem,14.2vw,9.4rem)] text-crema lg:text-[clamp(5.5rem,8.4vw,9.4rem)]">
            <span className="hero-word" style={vars({ '--i': 0 })}>
              Aplastada.
            </span>
            <span className="hero-word" style={vars({ '--i': 1 })}>
              Dorada.
            </span>
            <span className="hero-word" style={vars({ '--i': 2 })}>
              Tuya.
            </span>
          </h1>

          <p className="mt-8 max-w-[22ch] text-[1.35rem] font-medium leading-[1.22] tracking-[-0.015em] text-crema/90 md:text-[1.65rem]">
            {site.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#menu" size="lg">
              Ver el menú
            </ButtonLink>
            {deliveryUrl ? (
              <ButtonLink href={deliveryUrl} external variant="linea" size="lg" className="text-crema">
                Pedir delivery
              </ButtonLink>
            ) : (
              <ButtonLink href="#menu" onClick={() => setPreferredMode('delivery')} variant="linea" size="lg" className="text-crema">
                Pedir delivery
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-[10/11] w-full max-w-[580px]">
            <figure className="hero-print print absolute right-[1%] top-[5%] w-[76%]" style={vars({ '--r': '2.4deg', '--i': 0 })}>
              <Photo id="clasica-cerca" priority sizes="(min-width: 1024px) 32vw, 76vw" className="aspect-[4/5] rounded-[2px]" />
              <figcaption className="label-mono absolute right-[calc(clamp(6px,0.9vw,11px)+12px)] top-[calc(clamp(6px,0.9vw,11px)+12px)] rounded-[6px] bg-crema px-2.5 py-1.5 text-[11px] text-tinta">
                La Clásica · doble smash
              </figcaption>
            </figure>
            <figure className="hero-print print absolute bottom-[0%] left-[0%] w-[44%]" style={vars({ '--r': '-5.5deg', '--i': 1 })}>
              <Photo id="papas-vaso" sizes="(min-width: 1024px) 19vw, 44vw" className="aspect-[4/5] rounded-[2px]" />
            </figure>
            <div className="hero-print absolute left-[3%] top-[0%] w-[31%]" style={vars({ '--r': '-9deg', '--i': 2 })}>
              <Seal title="Punkie's" className="ring-[5px] ring-tinta" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
