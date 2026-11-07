import { useState } from 'react';
import { site, directionsUrl, mapEmbedUrl } from '../../config/site';
import { formatHour } from '../../lib/hours';
import { Photo } from '../ui/Photo';
import { ButtonLink } from '../ui/Button';
import { ArrowOutIcon, InstagramIcon, PinIcon } from '../ui/Icons';
import { OpenNow } from './OpenNow';
import { useUI } from '../../state/ui';
import { useReveal } from '../../hooks/useReveal';

export function Ubicacion() {
  const { setPreferredMode } = useUI();
  const [mapLoaded, setMapLoaded] = useState(false);
  const root = useReveal<HTMLElement>();
  const delivery = site.ordering.deliveryUrl;

  return (
    <section ref={root} id="ubicacion" aria-labelledby="ubi-title" className="px-3 md:px-5">
      <div className="surface-crema mx-auto grid max-w-[1440px] gap-12 rounded-[28px] px-4 py-14 sm:px-6 md:px-10 md:py-20 lg:grid-cols-12 lg:gap-10 lg:px-14">
        <div className="flex flex-col lg:col-span-5">
          <h2 id="ubi-title" className="font-black-display text-[clamp(3.2rem,12vw,7.2rem)] lg:text-[clamp(4rem,5.9vw,6rem)]">
            Nos vemos
            <br />
            en Chacao.
          </h2>

          <address className="mt-10 not-italic" data-pendiente={site.address.confirmed ? undefined : 'Confirmar dirección'}>
            <p className="text-[1.35rem] font-extrabold tracking-[-0.02em]">Punkie’s Burger</p>
            <p className="mt-1 text-[1.2rem] leading-[1.4]">
              {site.address.street},
              <br />
              {site.address.municipality}, {site.address.city}.
            </p>
          </address>

          <OpenNow className="mt-6 self-start" />

          <div className="mt-8" data-pendiente={site.hoursConfirmed ? undefined : 'Confirmar horario'}>
            <h3 className="label-mono text-tinta/65">Horario</h3>
            <dl className="mt-3 divide-y-2 divide-dashed divide-tinta/25 border-y-2 border-dashed border-tinta/25 font-mono text-[15px]">
              {site.hours.map((h) => (
                <div key={h.label} className="flex justify-between gap-4 py-3">
                  <dt className="font-semibold">{h.label}</dt>
                  <dd className="font-bold">
                    {formatHour(h.open)} – {formatHour(h.close)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={directionsUrl()} external size="lg">
              <PinIcon />
              Cómo llegar
            </ButtonLink>
            {delivery ? (
              <ButtonLink href={delivery} external variant="linea" size="lg">
                Pedir delivery
                <ArrowOutIcon />
              </ButtonLink>
            ) : (
              <ButtonLink href="#menu" onClick={() => setPreferredMode('delivery')} variant="linea" size="lg">
                Pedir delivery
              </ButtonLink>
            )}
            <ButtonLink href={site.instagram.url} external variant="linea" size="lg">
              <InstagramIcon />@{site.instagram.handle}
            </ButtonLink>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="relative h-[380px] overflow-hidden rounded-[20px] border-2 border-tinta bg-[#e7e2b2] sm:h-[460px] lg:h-full lg:min-h-[560px]" data-pendiente={site.map.coordinates ? undefined : 'Verificar pin del mapa'}>
            {!mapLoaded && (
              <p className="label-mono absolute inset-0 grid place-items-center text-tinta/60" aria-hidden="true">
                Cargando mapa…
              </p>
            )}
            <iframe
              title="Mapa de Google con la ubicación de Punkie’s Burger en Av. Mohedano, Chacao"
              src={mapEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="relative h-full w-full"
              onLoad={() => setMapLoaded(true)}
            />
          </div>
          <figure
            className="reveal print absolute -bottom-8 right-3 w-[42%] max-w-[250px] sm:right-6 lg:-bottom-12 lg:right-10 lg:w-[30%]"
            style={{ ['--r' as string]: '-4deg' }}
          >
            <Photo id="fachada" sizes="(min-width: 1024px) 18vw, 42vw" className="aspect-[4/4.9] rounded-[2px]" />
            <figcaption className="label-mono absolute bottom-[calc(clamp(6px,0.9vw,11px)+8px)] left-[calc(clamp(6px,0.9vw,11px)+8px)] rounded-[6px] bg-crema px-2 py-1 text-[10px] text-tinta">
              Av. Mohedano
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
