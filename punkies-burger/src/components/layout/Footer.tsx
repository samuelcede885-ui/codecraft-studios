import { NAV } from './nav';
import { Logo, Stars } from '../brand/Brand';
import { ButtonLink } from '../ui/Button';
import { InstagramIcon } from '../ui/Icons';
import { site } from '../../config/site';
import { formatHour } from '../../lib/hours';

export function Footer() {
  return (
    <footer className="px-4 pb-28 pt-24 md:px-6 md:pt-32 lg:pb-8" aria-labelledby="footer-title">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-t-2 border-crema/15 pt-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Stars className="block h-9 w-auto text-rojo" />
            <p id="footer-title" className="font-black-display mt-6 max-w-[12ch] text-[clamp(2.1rem,3.4vw,2.8rem)] text-crema">
              Punkie’s. With love&nbsp;&lt;3
            </p>
            <ButtonLink href="#menu" size="lg" className="mt-7">
              Pedir ahora
            </ButtonLink>
          </div>

          <nav aria-label="Pie de página" className="md:col-span-2">
            <h2 className="label-mono text-crema/55">Menú</h2>
            <ul className="mt-4 space-y-2.5 text-[17px] font-semibold text-crema">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="hover:text-amarillo">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3" data-pendiente={site.hoursConfirmed ? undefined : 'Confirmar horario'}>
            <h2 className="label-mono text-crema/55">Horario</h2>
            <dl className="mt-4 space-y-3 text-crema">
              {site.hours.map((h) => (
                <div key={h.label}>
                  <dt className="text-[15px] text-crema/70">{h.label}</dt>
                  <dd className="font-mono text-[15px] font-bold">
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-3">
            <h2 className="label-mono text-crema/55">Dónde</h2>
            <address className="mt-4 not-italic text-[17px] leading-[1.45] text-crema">
              {site.address.street},
              <br />
              {site.address.municipality}, {site.address.city}.
            </address>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[17px] font-bold text-crema hover:text-amarillo">
              <InstagramIcon />@{site.instagram.handle}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>

        <Logo className="mt-20 block w-full text-rojo md:mt-24" title="Punkie's" />

        <div className="label-mono mt-8 flex flex-col gap-2 text-[11px] text-crema/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Punkie’s Burger · Chacao, Caracas</span>
          <span>Smash de barrio</span>
        </div>
      </div>
    </footer>
  );
}
