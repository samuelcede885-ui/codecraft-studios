import site from '../config/site.js'
import { scrollToTarget } from '../lib/motion.js'

/** Cabecera limpia: nombre de la marca en texto (sin logotipo), enlace al menú y, fijo aparte, el pedido. */
export function Header() {
  const toMenu = (event) => {
    event.preventDefault()
    scrollToTarget('#menu')
    history.replaceState(null, '', '#menu')
  }
  return (
    <header className="site-header">
      <a className="site-brand" href="#top">
        {site.name}
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
