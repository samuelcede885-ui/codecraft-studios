import { useId } from 'react'

/**
 * Marca del sitio: una cookie con un mordisco. Es un dibujo original de esta
 * propuesta (no es el logotipo de NOA Cookies) y toma el color del texto que
 * la rodea, así que funciona sobre los cinco fondos del hero.
 * Las chispas y el mordisco son huecos: dejan ver el fondo.
 */
export function BrandMark({ size = 40, className = '' }) {
  const id = useId()
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <circle cx="24" cy="25" r="20" fill="#fff" />
        {/* mordisco */}
        <circle cx="39" cy="9.5" r="8.4" fill="#000" />
        <circle cx="29.5" cy="4.5" r="5" fill="#000" />
        <circle cx="45" cy="19" r="4.6" fill="#000" />
        {/* chispas */}
        <rect x="13" y="15" width="6.4" height="5.6" rx="2" transform="rotate(-18 16 18)" fill="#000" />
        <rect x="24" y="23" width="7" height="6" rx="2.2" transform="rotate(14 27.5 26)" fill="#000" />
        <rect x="11.5" y="28" width="5.6" height="5" rx="1.8" transform="rotate(26 14 30.5)" fill="#000" />
        <rect x="21" y="35" width="6.2" height="5" rx="1.9" transform="rotate(-10 24 37.5)" fill="#000" />
        <rect x="33" y="31" width="5" height="4.6" rx="1.7" transform="rotate(32 35.5 33)" fill="#000" />
      </mask>
      <rect width="48" height="48" fill="currentColor" mask={`url(#${id})`} />
      {/* migas que saltan del mordisco */}
      <circle cx="43.5" cy="3.6" r="1.7" fill="currentColor" />
      <circle cx="46" cy="9.8" r="1.1" fill="currentColor" />
    </svg>
  )
}
