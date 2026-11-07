import type { CSSProperties } from 'react';
import { LOGO, STARS } from './marks';
import { cx } from '../../lib/cx';

/** Sprite único con la firma y las estrellas: el trazo se descarga una sola vez. */
export function BrandSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="pk-logo" viewBox={LOGO.viewBox}>
          <path fill="currentColor" fillRule="evenodd" d={LOGO.d} />
        </symbol>
        <symbol id="pk-stars" viewBox={STARS.viewBox}>
          <path fill="currentColor" fillRule="evenodd" d={STARS.d} />
        </symbol>
      </defs>
    </svg>
  );
}

/** Un <use> de un <symbol> se dibuja desde 0,0: el viewBox externo debe empezar en el origen. */
const zeroBox = (vb: string) => {
  const [, , w, h] = vb.split(' ').map(Number);
  return `0 0 ${w} ${h}`;
};
const LOGO_BOX = zeroBox(LOGO.viewBox);
const STARS_BOX = zeroBox(STARS.viewBox);

interface MarkProps {
  className?: string;
  style?: CSSProperties;
  /** Texto accesible. Si se omite, la marca es decorativa. */
  title?: string;
}

/** Firma manuscrita original de Punkie's (nunca se reescribe con una tipografía). */
export function Logo({ className, style, title }: MarkProps) {
  return (
    <svg
      viewBox={LOGO_BOX}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <use href="#pk-logo" />
    </svg>
  );
}

/** Las tres estrellas dibujadas a mano del empaque. */
export function Stars({ className, style, title }: MarkProps) {
  return (
    <svg
      viewBox={STARS_BOX}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <use href="#pk-stars" />
    </svg>
  );
}

/** Sello circular: círculo crema, aro tinta y firma roja (como el avatar de Instagram). */
export function Seal({ className, style, title }: MarkProps) {
  return (
    <div
      className={cx('relative aspect-square rounded-full bg-crema text-rojo', className)}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
    >
      <span className="absolute inset-[4.5%] rounded-full border-[3px] border-tinta" aria-hidden="true" />
      <Logo className="absolute left-1/2 top-1/2 w-[64%] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

/**
 * Patrón repetido de la firma (papel de envolver, cajón de luz, collage).
 * Se dibuja con <pattern> en SVG, girado como en el material de marca.
 */
export function LogoPattern({
  className,
  color = 'var(--color-rojo)',
  background = 'var(--color-crema)',
  angle = -9,
  scale = 1,
  id,
}: {
  className?: string;
  color?: string;
  background?: string;
  angle?: number;
  scale?: number;
  id: string;
}) {
  const w = 236 * scale;
  const h = 76 * scale;
  return (
    <svg className={cx('block h-full w-full', className)} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
          <rect width={w} height={h} fill={background} />
          <svg x={6 * scale} y={8 * scale} width={w - 14 * scale} height={h - 16 * scale} viewBox={LOGO_BOX} style={{ color }}>
            <use href="#pk-logo" />
          </svg>
          <svg x={-w / 2 + 6 * scale} y={h / 2 + 8 * scale} width={w - 14 * scale} height={h - 16 * scale} viewBox={LOGO_BOX} style={{ color }} overflow="visible">
            <use href="#pk-logo" />
          </svg>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Sello de ticket con borde punteado y tipografía mono. */
export function Ticket({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <div className={cx('rounded-[10px] border-2 border-dashed border-current px-4 py-3 font-mono text-[12px] leading-[1.7] tracking-[0.06em] uppercase', className)}>
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  );
}
