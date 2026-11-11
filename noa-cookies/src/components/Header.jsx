import site from '../config/site.js'
import { BrandMark } from './ui/BrandMark.jsx'
import { scrollToTarget } from '../lib/motion.js'

/** Cabecera limpia: marca (cookie mordida + nombre), enlace al menú y, fijo aparte, el pedido. */
export function Header() {
  const toMenu = (event) => {
    event.preventDefault()
    scrollToTarget('#menu')
    try {
      history.replaceState(null, '', '#menu')
    } catch {
      // Algunos marcos (vistas incrustadas) no dejan tocar la URL: el scroll ya se hizo.
    }
  }
  return (
    <header className="site-header">
      <a className="site-brand" href="#top">
        <BrandMark className="site-brand-mark" />
        <span>{site.name}</span>
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
