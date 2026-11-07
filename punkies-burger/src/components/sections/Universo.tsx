import type { CSSProperties, ReactNode } from 'react';
import type { PhotoId } from '../../data/photos';
import { Photo } from '../ui/Photo';
import { LogoPattern, Seal, Stars } from '../brand/Brand';
import { useReveal } from '../../hooks/useReveal';
import { site } from '../../config/site';
import { cx } from '../../lib/cx';

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Etiqueta crema sobre la foto, como en el collage de marca. */
function Tag({ children }: { children: ReactNode }) {
  return <span className="label-mono absolute bottom-3 left-3 rounded-[6px] bg-crema px-2.5 py-1.5 text-[10.5px] text-tinta md:bottom-4 md:left-4 md:text-[11px]">{children}</span>;
}

interface Tile {
  key: string;
  /** Spans en móvil (2 columnas) y escritorio (4 columnas) */
  className: string;
  photo?: PhotoId;
  focus?: string;
  tag?: string;
  sizes?: string;
  content?: ReactNode;
}

const TILES: Tile[] = [
  { key: 'combo', photo: 'clasica-combo', tag: 'La Clásica · doble smash', className: 'col-span-2 row-span-2', sizes: '(min-width: 1024px) 48vw, 96vw', focus: '50% 66%' },
  {
    key: 'sello',
    className: 'bg-rojo',
    content: (
      <div className="grid h-full place-items-center p-[12%]">
        <Seal className="w-full max-w-[220px]" title="Punkie's" />
      </div>
    ),
  },
  { key: 'luz', photo: 'cajon-de-luz', className: 'row-span-2', sizes: '(min-width: 1024px) 24vw, 48vw', focus: '62% 30%' },
  {
    key: 'chacao',
    className: 'surface-crema',
    content: (
      <div className="flex h-full flex-col justify-between p-5 md:p-6">
        <Stars className="block w-[62%] max-w-[170px] text-rojo" />
        <p className="font-black-display text-[clamp(1.7rem,3vw,2.6rem)]">
          Hecho en
          <br />
          Chacao.
        </p>
      </div>
    ),
  },
  { key: 'fighter', photo: 'choose-your-fighter', tag: 'Choose your fighter', className: 'row-span-2', sizes: '(min-width: 1024px) 24vw, 48vw', focus: '50% 50%' },
  { key: 'versario', photo: 'punkieversario', tag: '365 days flipping burgers', className: 'col-span-2', sizes: '(min-width: 1024px) 48vw, 96vw', focus: '50% 45%' },
  { key: 'papas-rojo', photo: 'papas-logo-rojo', className: 'row-span-2', sizes: '(min-width: 1024px) 24vw, 48vw', focus: '62% 40%' },
  { key: 'papitas', photo: 'papas-sazonadas', className: '', sizes: '(min-width: 1024px) 24vw, 48vw', focus: '50% 55%' },
  {
    key: 'love',
    className: 'surface-crema',
    content: (
      <div className="relative h-full">
        <LogoPattern id="pattern-love" scale={0.72} />
        <p className="font-black-display absolute left-1/2 top-1/2 w-max max-w-[88%] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg] rounded-[10px] bg-tinta px-3.5 py-2.5 text-center text-[clamp(1.15rem,2.1vw,1.9rem)] leading-[0.95] tracking-[-0.03em] text-crema lg:max-w-none">
          <span className="block lg:inline">punkies.</span> with love&nbsp;&lt;3
        </p>
      </div>
    ),
  },
  { key: 'delivery', photo: 'bolsa-delivery', tag: 'Ya hay delivery', className: 'col-span-2 lg:col-span-1', sizes: '(min-width: 1024px) 24vw, 96vw', focus: '40% 52%' },
  {
    key: 'texto',
    className: 'surface-crema col-span-2 lg:col-span-3',
    content: (
      <div className="flex h-full flex-col justify-between gap-6 p-5 md:p-7">
        <p className="font-black-display max-w-[16ch] text-[clamp(1.9rem,3.4vw,3.1rem)]">Pan brioche, doble smash, queso y pepinillos.</p>
        <p className="label-mono text-tinta/80">
          {site.address.street} · {site.address.municipality}
        </p>
      </div>
    ),
  },
];

export function Universo() {
  const root = useReveal<HTMLElement>();
  return (
    <section ref={root} id="nosotros" aria-labelledby="uni-title" className="px-3 py-24 md:px-5 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-6 px-1 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="uni-title" className="font-black-display text-[clamp(3.2rem,10vw,7.6rem)] text-crema">
            Universo
            <br />
            Punkie’s.
          </h2>
          <p className="max-w-[40ch] text-[1.15rem] leading-[1.5] text-crema/80 md:text-[1.25rem]">
            Smash burgers de barrio en Chacao, desde 2025. Un local pequeño, la plancha encendida y una carta que cabe en una mano.
          </p>
        </div>

        <ul className="grid grid-flow-dense grid-cols-2 gap-2.5 [grid-auto-rows:clamp(150px,44vw,260px)] md:gap-3 lg:grid-cols-4 lg:[grid-auto-rows:clamp(200px,18.5vw,280px)]">
          {TILES.map((t, i) => (
            <li key={t.key} className={cx('reveal relative overflow-hidden rounded-[18px]', t.className)} style={vars({ '--i': i % 4 })}>
              {t.photo ? (
                <figure className="h-full">
                  <Photo id={t.photo} sizes={t.sizes ?? '50vw'} focus={t.focus} className="h-full" />
                  {t.tag && (
                    <figcaption>
                      <Tag>{t.tag}</Tag>
                    </figcaption>
                  )}
                </figure>
              ) : (
                t.content
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
