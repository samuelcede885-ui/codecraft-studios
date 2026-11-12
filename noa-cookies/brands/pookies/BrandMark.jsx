import logo from './logo.json'

/**
 * Logo de Pookies: su palabra "Pookies", trazada como vector a partir de su
 * foto de perfil pública (tools/fotos-provisionales/logo.py). Es provisional:
 * se sustituye por el archivo original de la marca en cuanto lo entregue.
 *
 * Toma el color del texto que lo rodea (rosa sobre rojo, rojo sobre rosa…),
 * como hace la marca en sus propias piezas.
 */
export function BrandMark({ size = 40, className = '' }) {
  return (
    <svg
      className={className}
      viewBox={logo.viewBox}
      width={Math.round((size * logo.width) / logo.height)}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path d={logo.d} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
