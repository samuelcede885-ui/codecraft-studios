import { useRef } from 'react'
import site from '../config/site.js'
import { useFitText } from '../lib/hooks.js'
import { WhatsAppLink } from './ui/WhatsAppLink.jsx'
import { BrandMark } from './ui/BrandMark.jsx'

export function Footer() {
  const sloganRef = useRef(null)
  useFitText(sloganRef, { widthRatio: 1, maxHeightRatio: 10 }, [])
  const { location, hours, policies, social, fulfillment } = site
  const ways = [fulfillment.delivery.enabled && 'Delivery', fulfillment.pickup.enabled && 'pick-up'].filter(Boolean).join(' y ')

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="footer-name">
            <BrandMark size={52} />
            <span className={site.logoIncludesName ? 'sr-only' : undefined}>{site.name}</span>
          </p>
          <p>{site.descriptor}</p>
        </div>

        <div>
          <h2 className="footer-head">Dónde</h2>
          <p>
            {location.address && (
              <>
                {location.address}
                <br />
              </>
            )}
            {location.area && <>{location.area}, </>}
            {location.city}, {location.country}
          </p>
          {ways && <p>{ways}</p>}
          {location.mapsUrl && (
            <p>
              <a className="text-link" href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                Cómo llegar
              </a>
            </p>
          )}
        </div>

        {hours && (
          <div>
            <h2 className="footer-head">Horario</h2>
            {hours.map((h) => (
              <p key={h.days}>
                {h.days}: {h.hours}
              </p>
            ))}
          </div>
        )}

        <div>
          <h2 className="footer-head">Escríbenos</h2>
          <p>
            <WhatsAppLink className="text-link" question={`¡Hola, ${site.shortName}!`}>
              WhatsApp
            </WhatsAppLink>
          </p>
          {social.map((s) => (
            <p key={s.id}>
              <a className="text-link" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>{' '}
              <span className="footer-handle">{s.handle}</span>
            </p>
          ))}
        </div>

        {policies && (
          <div>
            <h2 className="footer-head">Políticas</h2>
            {policies.map((p) => (
              <p key={p.url}>
                <a className="text-link" href={p.url}>
                  {p.label}
                </a>
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="footer-slogan" aria-hidden="true">
        <div ref={sloganRef}>
          <p className="footer-slogan-text" data-fit>
            <span data-fit-line>{site.slogan}</span>
          </p>
        </div>
      </div>
      <p className="sr-only">{site.slogan}</p>

      {(site.preview || site.provisionalPhotos) && (
        <div className="wrap footer-legal">
          {site.preview && <p>{`Propuesta de diseño: sitio no oficial, pendiente de aprobación de ${site.name}.`}</p>}
          {site.provisionalPhotos && <p>{`Fotos provisionales tomadas ${site.photosSource ?? 'del menú público'} de ${social[0].handle}; se sustituyen por las originales.`}</p>}
        </div>
      )}
    </footer>
  )
}
