/** Selector compacto de variante (topping, relleno, versión). Semántica de radios. */
export function OptionChips({ product, value, onChange, tone = 'light' }) {
  const { label, choices } = product.options
  const onKeyDown = (event) => {
    const i = choices.findIndex((c) => c.id === value)
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = choices[(i + step + choices.length) % choices.length]
    onChange(next.id)
    event.currentTarget.querySelector(`[data-choice="${next.id}"]`)?.focus()
  }
  return (
    <div className={`chips chips--${tone}`} role="radiogroup" aria-label={`${label} de ${product.name}`} onKeyDown={onKeyDown}>
      {choices.map((choice) => (
        <button
          type="button"
          key={choice.id}
          role="radio"
          aria-checked={choice.id === value}
          tabIndex={choice.id === value ? 0 : -1}
          data-choice={choice.id}
          className="chip"
          onClick={() => onChange(choice.id)}
        >
          {choice.name}
        </button>
      ))}
    </div>
  )
}
