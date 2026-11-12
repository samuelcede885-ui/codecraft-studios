import site from '../../config/site.js'
import { whatsappAskUrl } from '../../services/orders.js'
import { ui } from '../../store/ui.js'

/**
 * Enlace para escribirle a la marca por WhatsApp. En modo demostración no sale de
 * la página: es un botón que avisa de lo que pasaría en el sitio real.
 */
export function WhatsAppLink({ question, children, ...rest }) {
  if (site.demo) {
    return (
      <button type="button" onClick={() => ui.toast(`Demostración: en el sitio real esto abre el WhatsApp de ${site.shortName}.`)} {...rest}>
        {children}
      </button>
    )
  }
  return (
    <a href={whatsappAskUrl(question)} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}
