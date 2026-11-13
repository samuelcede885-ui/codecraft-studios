import { useEffect, useRef, useState } from 'react'
import site from '../../config/site.js'
import { formatPrice, productSrc } from '../../lib/format.js'
import { scrollToTarget } from '../../lib/motion.js'
import { useCatalog } from '../../services/catalog.js'
import { buildOrder, orderToText, sendOrderToApi, usesApi, validateCheckout, whatsappTarget } from '../../services/orders.js'
import { cart, useCartLines } from '../../store/cart.js'
import { maxQty, qtyOfProduct, summarize } from '../../store/cartLogic.js'
import { ui, useUi } from '../../store/ui.js'
import { Icon } from '../ui/Icon.jsx'
import { Sheet } from '../ui/Sheet.jsx'

const DRAFT_KEY = 'noa.datos.v1'
const ISSUE_TEXT = {
  agotado: 'Se agotó. Quítalo para continuar.',
  excede: 'Hay menos unidades de las que pediste. Reduce la cantidad.',
  descatalogado: 'Ya no está en el menú. Quítalo para continuar.',
}

const firstEnabled = () => (site.fulfillment.pickup.enabled ? 'pickup' : 'delivery')
const emptyDraft = () => ({ name: '', phone: '', type: firstEnabled(), address: '', paymentMethodId: '' })

function readDraft() {
  try {
    return { ...emptyDraft(), ...JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? '{}') }
  } catch {
    return emptyDraft()
  }
}

/* ------------------------------------------------------------------ */

function Line({ item }) {
  const { line, product, option, issue } = item
  if (!product) {
    return (
      <li className="line" data-issue>
        <div className="line-body">
          <p className="line-name">Producto retirado</p>
          <p className="line-issue">{ISSUE_TEXT.descatalogado}</p>
        </div>
        <button type="button" className="line-remove" onClick={() => cart.remove(line.id)}>
          Quitar
        </button>
      </li>
    )
  }
  const lines = cart.getLines()
  const atLimit = qtyOfProduct(lines, product.id) >= maxQty(product)
  const what = option ? `${product.name}, ${option.name}` : product.name
  const set = (qty) => {
    cart.setQty(line.id, qty, product)
    ui.announce(qty > 0 ? `${what}: ${qty} en tu pedido.` : `${what} quitado de tu pedido.`)
  }
  return (
    <li className="line" data-issue={issue || undefined} data-testid={`line-${line.id}`}>
      {product.image?.widths ? (
        <img className="line-img" src={productSrc(product, 160)} alt="" width="64" height="64" loading="lazy" decoding="async" />
      ) : (
        <span className="line-img line-img--none" aria-hidden="true" />
      )}
      <div className="line-body">
        <p className="line-name">{product.name}</p>
        {option && (
          <p className="line-option">
            {product.options.label}: {option.name}
          </p>
        )}
        {issue ? (
          <p className="line-issue">{ISSUE_TEXT[issue]}</p>
        ) : (
          <p className="line-unit">{item.unitPrice === null ? 'Precio por confirmar' : `${formatPrice(item.unitPrice)} c/u`}</p>
        )}
        <div className="stepper stepper--sm" role="group" aria-label={`Cantidad de ${what}`}>
          <button type="button" className="stepper-btn" onClick={() => set(line.qty - 1)} aria-label={line.qty === 1 ? `Quitar ${what}` : `Una menos de ${what}`}>
            <Icon name={line.qty === 1 ? 'trash' : 'minus'} size={16} strokeWidth={2.4} />
          </button>
          <span className="stepper-qty" data-testid={`line-qty-${line.id}`}>
            {line.qty}
          </span>
          <button type="button" className="stepper-btn" onClick={() => set(line.qty + 1)} disabled={atLimit || Boolean(issue)} aria-label={`Una más de ${what}`}>
            <Icon name="plus" size={16} strokeWidth={2.6} />
          </button>
        </div>
      </div>
      <p className="line-total">{issue ? '—' : formatPrice(item.total)}</p>
    </li>
  )
}

function OrderView({ summary, onCheckout }) {
  const browse = () => {
    ui.closeCart()
    scrollToTarget('#menu')
  }
  if (!summary.items.length) {
    return (
      <div className="cart-empty pm-enter">
        <p className="display cart-empty-title">Tu pedido está vacío</p>
        <p>Elige una cookie y empieza por ahí.</p>
        <button type="button" className="btn pm-interactive" onClick={browse}>
          Ver el menú
        </button>
      </div>
    )
  }
  return (
    <>
      <ul className="cart-lines">
        {summary.items.map((item) => (
          <Line item={item} key={item.line.id} />
        ))}
      </ul>
      <div className="cart-foot">
        <dl className="totals">
          <div className="totals-row totals-row--strong">
            <dt>Subtotal</dt>
            <dd data-testid="cart-subtotal">{formatPrice(summary.subtotal)}</dd>
          </div>
          {site.fulfillment.delivery.enabled && (
            <div className="totals-row">
              <dt>Delivery</dt>
              <dd>{site.fulfillment.delivery.fee === null ? 'Se confirma según tu zona' : formatPrice(site.fulfillment.delivery.fee)}</dd>
            </div>
          )}
        </dl>
        {summary.hasIssues && (
          <p className="form-error" role="alert">
            Revisa los productos marcados antes de continuar.
          </p>
        )}
        <button type="button" className="btn btn--orange cart-primary pm-interactive" onClick={onCheckout} disabled={summary.hasIssues} data-testid="checkout">
          Finalizar pedido
        </button>
        <button type="button" className="cart-secondary" onClick={browse}>
          Seguir comprando
        </button>
      </div>
    </>
  )
}

function Field({ id, label, error, hint, children }) {
  return (
    <div className="field" data-invalid={error ? '' : undefined}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function CheckoutView({ summary, onSent }) {
  const [draft, setDraft] = useState(readDraft)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [failure, setFailure] = useState('')
  const formRef = useRef(null)
  const api = usesApi()
  const { pickup, delivery } = site.fulfillment
  const methods = site.payment.methods
  const isDelivery = draft.type === 'delivery'
  const ways = [pickup.enabled && { id: 'pickup', ...pickup }, delivery.enabled && { id: 'delivery', ...delivery }].filter(Boolean)
  const fee = isDelivery ? delivery.fee : 0
  const total = fee === null || summary.subtotal === null ? null : summary.subtotal + fee

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      // Sin almacenamiento de sesión: los datos solo viven mientras el panel está abierto.
    }
  }, [draft])

  const update = (patch) => {
    setDraft((d) => ({ ...d, ...patch }))
    setErrors((e) => {
      const next = { ...e }
      Object.keys(patch).forEach((key) => delete next[key === 'paymentMethodId' ? 'payment' : key])
      return next
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    setFailure('')
    const found = validateCheckout(draft)
    setErrors(found)
    const firstInvalid = ['name', 'phone', 'address', 'payment'].find((key) => found[key])
    if (firstInvalid) {
      formRef.current?.querySelector(`[data-field="${firstInvalid}"]`)?.focus()
      return
    }
    const order = buildOrder({
      summary,
      customer: { name: draft.name, phone: draft.phone },
      fulfillment: { type: draft.type, address: draft.address },
      paymentMethodId: draft.paymentMethodId,
    })

    if (site.demo) {
      onSent({ kind: 'demo', order, text: orderToText(order) })
      return
    }

    if (api) {
      setSending(true)
      try {
        const { orderNumber } = await sendOrderToApi(order)
        cart.clear()
        onSent({ kind: 'registered', orderNumber, order })
      } catch {
        setFailure('No pudimos registrar tu pedido. Revisa tu conexión y vuelve a intentarlo; tu pedido sigue guardado.')
      } finally {
        setSending(false)
      }
      return
    }

    // WhatsApp: se abre dentro del mismo gesto para que el navegador no lo bloquee.
    const text = orderToText(order)
    const target = whatsappTarget(text)
    if (!target.prefilled) navigator.clipboard?.writeText(text).catch(() => {})
    const opened = window.open(target.url, '_blank')
    if (opened) opened.opener = null
    onSent({ kind: 'handoff', order, text, ...target, opened: Boolean(opened) })
  }

  const describe = (id, hint) => [errors[id] && `${id}-error`, hint && !errors[id] && `${id}-hint`].filter(Boolean).join(' ') || undefined

  return (
    <form ref={formRef} className="checkout pm-enter-right" onSubmit={submit} noValidate data-testid="checkout-form">
      <div className="checkout-fields">
        <Field id="name" label="Nombre" error={errors.name}>
          <input
            id="name"
            data-field="name"
            name="name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            value={draft.name}
            onChange={(e) => update({ name: e.target.value })}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe('name')}
            required
          />
        </Field>

        <Field id="phone" label="Teléfono" error={errors.phone}>
          <input
            id="phone"
            data-field="phone"
            name="tel"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            placeholder="0412 123 4567"
            value={draft.phone}
            onChange={(e) => update({ phone: e.target.value })}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describe('phone')}
            required
          />
        </Field>

        <fieldset className="field">
          <legend>¿Cómo lo recibes?</legend>
          {ways.length > 1 ? (
            <div className="segmented">
              {ways.map((way) => (
                <label key={way.id} className="segmented-option">
                  <input
                    type="radio"
                    id={`entrega-${way.id}`}
                    name="fulfillment"
                    value={way.id}
                    checked={draft.type === way.id}
                    onChange={() => update({ type: way.id })}
                  />
                  <span>{way.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="field-static">{ways[0]?.label}</p>
          )}
          <p className="field-hint">{isDelivery ? delivery.detail : pickup.detail}</p>
        </fieldset>

        {isDelivery && (
          <div className="pm-enter">
            <Field id="address" label="Dirección de entrega" error={errors.address} hint="Calle, edificio o casa y un punto de referencia.">
              <textarea
                id="address"
                data-field="address"
                name="street-address"
                rows={2}
                autoComplete="street-address"
                value={draft.address}
                onChange={(e) => update({ address: e.target.value })}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={describe('address', true)}
                required
              />
            </Field>
          </div>
        )}

        {methods.length > 0 ? (
          <fieldset className="field" data-invalid={errors.payment ? '' : undefined}>
            <legend>¿Cómo pagas?</legend>
            <div className="choices">
              {methods.map((method, i) => (
                <label key={method.id} className="choice">
                  <input
                    type="radio"
                    id={`pago-${method.id}`}
                    name="payment"
                    data-field={i === 0 ? 'payment' : undefined}
                    value={method.id}
                    checked={draft.paymentMethodId === method.id}
                    onChange={() => update({ paymentMethodId: method.id })}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
            {errors.payment && (
              <p className="field-error" role="alert">
                {errors.payment}
              </p>
            )}
          </fieldset>
        ) : (
          <p className="checkout-note">
            <strong>Pago:</strong>
            {` lo coordinas con ${site.shortName} por WhatsApp al confirmar tu pedido.`}
          </p>
        )}
      </div>

      <div className="cart-foot">
        <dl className="totals">
          {isDelivery && (
            <>
              <div className={`totals-row ${total === null ? 'totals-row--strong' : ''}`}>
                <dt>Subtotal</dt>
                <dd>{formatPrice(summary.subtotal)}</dd>
              </div>
              <div className="totals-row">
                <dt>Delivery</dt>
                <dd>{fee === null ? 'Por confirmar' : formatPrice(fee)}</dd>
              </div>
            </>
          )}
          {total !== null && (
            <div className="totals-row totals-row--strong">
              <dt>Total</dt>
              <dd data-testid="checkout-total">{formatPrice(total)}</dd>
            </div>
          )}
        </dl>
        {failure && (
          <p className="form-error" role="alert">
            {failure}
          </p>
        )}
        <button type="submit" className="btn btn--orange cart-primary pm-interactive" disabled={sending || summary.hasIssues || !summary.items.length} data-testid="send-order">
          {site.demo ? 'Ver cómo llegaría el pedido' : api ? (sending ? 'Registrando pedido…' : 'Confirmar pedido') : 'Enviar pedido por WhatsApp'}
        </button>
        {site.demo ? (
          <p className="cart-foot-note">Demostración: no se envía nada ni se guarda fuera de tu navegador.</p>
        ) : (
          !api && <p className="cart-foot-note">{`Se abre WhatsApp con tu pedido escrito. ${site.shortName} lo confirma por ahí.`}</p>
        )}
      </div>
    </form>
  )
}

function SentView({ result, onDone }) {
  const [copied, setCopied] = useState('no')
  const textRef = useRef(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.text)
      setCopied('si')
    } catch {
      // El portapapeles puede negarse (vistas incrustadas): se deja el texto seleccionado.
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(textRef.current)
      selection.removeAllRanges()
      selection.addRange(range)
      setCopied('seleccionado')
    }
  }
  const copyLabel = { no: 'Copiar pedido', si: 'Pedido copiado', seleccionado: 'Texto seleccionado: cópialo' }[copied]
  const toMenu = () => {
    onDone()
    scrollToTarget('#menu')
  }

  if (result.kind === 'registered') {
    return (
      <div className="sent pm-enter" data-testid="sent">
        <p className="display sent-title">Pedido registrado</p>
        <p>
          Tu número de pedido es <strong>{result.orderNumber}</strong>
          {`. Guárdalo: ${site.shortName} lo usará para avisarte.`}
        </p>
        <p>
          Total: <strong>{result.order.total === null ? `${formatPrice(result.order.subtotal)} más delivery` : formatPrice(result.order.total)}</strong>
        </p>
        <button type="button" className="btn pm-interactive" onClick={toMenu}>
          Volver al menú
        </button>
      </div>
    )
  }

  if (result.kind === 'demo') {
    return (
      <div className="sent pm-enter" data-testid="sent">
        <p className="display sent-title">Así llegaría tu pedido</p>
        <p>
          Esto es una demostración: <strong>no se envió nada</strong>
          {`. En el sitio real, este paso abre WhatsApp con este mensaje ya escrito para ${site.shortName}.`}
        </p>
        <pre ref={textRef} className="sent-text" tabIndex={0} aria-label="Texto del pedido">
          {result.text}
        </pre>
        <div className="sent-actions">
          <button type="button" className="btn btn--orange pm-interactive" onClick={toMenu}>
            Volver al menú
          </button>
          <button type="button" className="btn btn--ghost pm-interactive" onClick={copy}>
            {copyLabel}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="sent pm-enter" data-testid="sent">
      <p className="display sent-title">{result.prefilled ? 'Falta un paso: envíalo en WhatsApp' : 'Falta un paso: pégalo en WhatsApp'}</p>
      {result.prefilled ? (
        <p>{`Abrimos WhatsApp con tu pedido ya escrito. Pulsa enviar en el chat y ${site.shortName} te confirma el pedido y el pago.`}</p>
      ) : (
        <p>
          {`Copiamos tu pedido y abrimos el chat de ${site.shortName}. `}
          <strong>Pégalo en el chat y envíalo</strong>
          {`: ${site.shortName} te confirma el pedido y el pago.`}
        </p>
      )}
      <p className="sent-warning">{`Tu pedido no queda hecho hasta que lo envíes por WhatsApp y ${site.shortName} te responda.`}</p>

      <pre ref={textRef} className="sent-text" tabIndex={0} aria-label="Texto de tu pedido">
        {result.text}
      </pre>

      <div className="sent-actions">
        <a className="btn btn--orange pm-interactive" href={result.url} target="_blank" rel="noopener noreferrer">
          {result.opened ? 'Abrir WhatsApp otra vez' : 'Abrir WhatsApp'}
        </a>
        <button type="button" className="btn btn--ghost pm-interactive" onClick={copy}>
          {copyLabel}
        </button>
      </div>
      <button
        type="button"
        className="cart-secondary"
        onClick={() => {
          cart.clear()
          onDone()
        }}
      >
        Ya lo envié: vaciar mi pedido
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */

const TITLES = { pedido: 'Tu pedido', datos: 'Tus datos', enviado: site.demo ? 'Demostración' : 'Casi listo' }

export function CartSheet() {
  const open = useUi((s) => s.cartOpen)
  const view = useUi((s) => s.cartView)
  const lines = useCartLines()
  const { byId } = useCatalog()
  const summary = summarize(lines, byId)
  const [result, setResult] = useState(null)

  // Sin resultado no hay vista "enviado" (p. ej. tras recargar).
  const current = view === 'enviado' && !result ? 'pedido' : view
  // Si el pedido se vacía a mitad del formulario, se vuelve a la lista.
  useEffect(() => {
    if (current === 'datos' && !summary.items.length) ui.setCartView('pedido')
  }, [current, summary.items.length])

  const close = () => {
    ui.closeCart()
    if (current === 'enviado' && result?.kind === 'registered') {
      setResult(null)
      ui.setCartView('pedido')
    }
  }

  return (
    <Sheet open={open} onClose={close} labelledBy="cart-title">
      <header className="sheet-head">
        {current === 'datos' || (current === 'enviado' && result?.kind !== 'registered') ? (
          <button
            type="button"
            className="sheet-back pm-interactive"
            onClick={() => ui.setCartView(current === 'enviado' ? 'datos' : 'pedido')}
            aria-label={current === 'enviado' ? 'Volver a tus datos' : 'Volver a tu pedido'}
          >
            <Icon name="left" size={22} />
          </button>
        ) : null}
        <h2 id="cart-title" className="display sheet-title">
          {TITLES[current]}
        </h2>
        <button type="button" className="sheet-close pm-interactive" onClick={close} aria-label="Cerrar">
          <Icon name="close" size={20} />
        </button>
      </header>

      <div className="sheet-body" data-view={current}>
        {current === 'pedido' && <OrderView summary={summary} onCheckout={() => ui.setCartView('datos')} />}
        {current === 'datos' && (
          <CheckoutView
            summary={summary}
            onSent={(value) => {
              setResult(value)
              ui.setCartView('enviado')
            }}
          />
        )}
        {current === 'enviado' && result && (
          <SentView
            result={result}
            onDone={() => {
              setResult(null)
              ui.setCartView('pedido')
              ui.closeCart()
            }}
          />
        )}
      </div>
    </Sheet>
  )
}
