/** Precios en USD con el formato del manual de marca: "$8.50". */
export function formatUSD(value: number) {
  return `$${value.toFixed(2)}`;
}

/** Precio o guion cuando todavía no está confirmado. */
export function priceLabel(value: number | null) {
  return value === null ? '$\u00a0—' : formatUSD(value);
}
