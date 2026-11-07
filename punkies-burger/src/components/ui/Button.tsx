import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx';

type Variant = 'rojo' | 'crema' | 'linea' | 'tinta';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  rojo: 'bg-rojo text-crema hover:bg-rojo-hondo',
  crema: 'bg-crema text-tinta hover:bg-[#fffbd6]',
  linea: 'border-2 border-current hover:bg-current/10',
  tinta: 'bg-tinta text-crema hover:bg-burdeos',
};

const SIZES: Record<Size, string> = {
  md: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-14 px-7 text-[17px]',
};

const base =
  'pm-interactive inline-flex items-center justify-center gap-2 rounded-full font-extrabold tracking-[-0.01em] whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-45';

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({ variant = 'rojo', size = 'md', className, children, type = 'button', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cx(base, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = 'rojo', size = 'md', className, children, external, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) {
  return (
    <a
      className={cx(base, VARIANTS[variant], SIZES[size], className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {external && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
    </a>
  );
}
