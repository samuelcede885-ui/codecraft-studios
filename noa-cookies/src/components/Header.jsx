import site from '../config/site.js'
import { asset } from '../lib/format.js'
import { scrollToTarget } from '../lib/motion.js'

/** Cabecera limpia: logotipo, enlace al menú y (fijo, aparte) el pedido. */
export function Header() {
  const toMenu = (event) => {
    event.preventDefault()
    scrollToTarget('#menu')
    history.replaceState(null, '', '#menu')
  }
  return (
    <header className="site-header">
      <a className="site-logo" href="#top" aria-label={`${site.name}, inicio`}>
        <img
          src={asset('img/logo-noa-128.webp')}
          srcSet={`${asset('img/logo-noa-128.webp')} 1x, ${asset('img/logo-noa-256.webp')} 2x`}
          width="60"
          height="60"
          alt=""
        />
      </a>
      <nav aria-label="Principal">
        <a className="site-nav-link" href="#menu" onClick={toMenu}>
          Menú
        </a>
      </nav>
      <p className="site-slogan">{site.slogan}</p>
    </header>
  )
}
