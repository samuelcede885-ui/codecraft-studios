import { Fragment } from 'react';

const WORDS = ["Punkie's", 'Smash'];

/** Cinta de marca: franja crema con texto rojo que se desplaza lento (se detiene con reduced-motion). */
export function Cinta() {
  const run = Array.from({ length: 8 }, () => WORDS).flat();
  const Track = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {run.map((w, i) => (
        <Fragment key={i}>
          <span className="px-[0.32em]">{w}</span>
          <span aria-hidden="true">·</span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden py-10 md:py-14" aria-hidden="true">
      <div className="surface-crema w-[112vw] -translate-x-[6vw] -rotate-[2.2deg] border-y-2 border-tinta py-2.5 md:py-3.5">
        <div className="cinta-track font-black-display flex w-max whitespace-nowrap text-[clamp(1.7rem,3.6vw,3.3rem)] uppercase leading-none tracking-[-0.03em] text-rojo">
          <Track />
          <Track hidden />
        </div>
      </div>
    </div>
  );
}
