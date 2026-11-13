import { PRICE_TBD, priceParts } from '../../lib/format.js'

/** Precio compuesto: símbolo y decimales pequeños, entero grande. Sin precio publicado: "Por confirmar". */
export function Price({ value, className = '' }) {
  if (value === null || value === undefined) return <span className={`price price--tbd ${className}`}>{PRICE_TBD}</span>
  const { symbol, whole, cents, decimal } = priceParts(value)
  return (
    <span className={`price ${className}`}>
      <span className="price-symbol">{symbol}</span>
      {whole}
      <span className="price-cents">
        {decimal}
        {cents}
      </span>
    </span>
  )
}
