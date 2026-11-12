import { priceParts } from '../../lib/format.js'

/** Precio compuesto: símbolo y decimales pequeños, entero grande. */
export function Price({ value, className = '' }) {
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
