import { useEffect, useRef, useState } from 'react';
import { NAV } from './nav';
import { Logo, Stars } from '../brand/Brand';
import { BagIcon, CloseIcon, MenuIcon } from '../ui/Icons';
import { ButtonLink } from '../ui/Button';
import { Overlay } from '../ui/Overlay';
import { useCart } from '../../state/cart';
import { useUI } from '../../state/ui';
import { site } from '../../config/site';
import { formatHour } from '../../lib/hours';
import { cx } from '../../lib/cx';

function useActiveSection() {
  const [active, setActive] = useState<string>('#inicio');
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!('IntersectionObserver' in window) || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header() {
  const { summary, addedTick } = useCart();
  const { openCart, menuOpen, setMenuOpen } = useUI();
  const active = useActiveSection();
  const badge = useRef<HTMLSpanElement>(null);

  // Rebote del contador cuando se agrega un producto
  useEffect(() => {
    const el = badge.current;
    if (!el || addedTick === 0) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }, [addedTick]);

  const count = summary.itemCount;

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-5 md:pt-4">
      <div className="surface-crema mx-auto flex h-[60px] max-w-[1440px] items-center justify-between gap-3 rounded-[18px] pl-4 pr-2 md:h-[68px] md:pl-6 md:pr-3">
        <a href="#inicio" className="shrink-0 rounded-md text-rojo" aria-label="Punkie's, ir al inicio">
          <Logo className="block h-[32px] w-auto md:h-[40px]" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  aria-current={active === n.href ? 'location' : undefined}
                  className={cx(
                    'relative block rounded-full px-4 py-2 text-[15px] font-bold tracking-[-0.01em] transition-colors',
                    active === n.href ? 'bg-tinta text-crema' : 'hover:bg-tinta/8',
                  )}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Stars className="mr-2 hidden h-[24px] w-auto shrink-0 text-rojo xl:block" />
          <button
            type="button"
            onClick={() => openCart()}
            className="pm-interactive relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-tinta md:h-12 md:w-12"
            aria-label={count ? `Ver tu pedido: ${count} ${count === 1 ? 'producto' : 'productos'}` : 'Ver tu pedido (vacío)'}
          >
            <BagIcon />
            <span
              ref={badge}
              aria-hidden="true"
              className={cx(
                'absolute -right-1 -top-1 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-rojo px-1 font-mono text-[11px] font-bold text-crema transition-opacity',
                count ? 'opacity-100' : 'opacity-0',
              )}
            >
              {count}
            </span>
          </button>
          <ButtonLink href="#menu" className="max-[379px]:hidden md:min-h-12">
            Pedir ahora
          </ButtonLink>
          <button
            type="button"
            className="pm-interactive grid h-11 w-11 place-items-center rounded-full bg-tinta text-crema lg:hidden"
            aria-label="Abrir menú de navegación"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
    </header>
  );
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  return (
    <Overlay open={open} onClose={onClose} placement="top" label="Menú de navegación" className="w-full p-3">
      <div id="menu-movil" className="surface-crema rounded-[22px] px-5 pb-6 pt-3">
        <div className="flex h-[48px] items-center justify-between">
          <Logo className="block h-[32px] w-auto text-rojo" />
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-tinta text-crema" aria-label="Cerrar menú">
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Principal" className="mt-6">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={onClose}
                  aria-current={active === n.href ? 'location' : undefined}
                  className="font-black-display flex items-center justify-between rounded-xl py-2 text-[2.9rem] aria-[current=location]:text-rojo"
                >
                  {n.label}
                  {active === n.href && <Stars className="h-5 w-auto text-rojo" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href="#menu" onClick={onClose} size="lg">
            Pedir ahora
          </ButtonLink>
        </div>
        <dl className="label-mono mt-7 grid gap-1.5 text-tinta/75" data-pendiente={site.hoursConfirmed ? undefined : 'Confirmar horario'}>
          {site.hours.map((h) => (
            <div key={h.label} className="flex justify-between gap-3">
              <dt>{h.label}</dt>
              <dd>
                {formatHour(h.open)} – {formatHour(h.close)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Overlay>
  );
}
