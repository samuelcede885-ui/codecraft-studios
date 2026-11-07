import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Overlay } from '../ui/Overlay';
import { Photo } from '../ui/Photo';
import { Button, ButtonLink } from '../ui/Button';
import { CheckIcon, ChevronLeftIcon, CloseIcon, CopyIcon, InstagramIcon, TrashIcon } from '../ui/Icons';
import { Stars } from '../brand/Brand';
import { NoPhoto } from '../sections/ProductCard';
import { QtyStepper } from './QtyStepper';
import { useCart } from '../../state/cart';
import { useUI, type CartStep } from '../../state/ui';
import { ORDER_MODE_LABEL, site, whatsappUrl, type OrderMode } from '../../config/site';
import { formatUSD, priceLabel } from '../../lib/format';
import { buildOrderMessage } from '../../lib/order';
import { NOTES_MAX, validateCheckout, type CheckoutErrors, type CheckoutForm } from '../../lib/validation';
import type { CartSummary } from '../../lib/cart';
import { cx } from '../../lib/cx';

const STEPS: { id: CartStep; label: string }[] = [
  { id: 'pedido', label: 'Pedido' },
  { id: 'datos', label: 'Tus datos' },
  { id: 'revisar', label: 'Confirmar' },
];

export function subtotalText(s: CartSummary) {
  if (s.subtotalComplete) return formatUSD(s.knownSubtotal);
  if (s.knownSubtotal > 0) return `${formatUSD(s.knownSubtotal)} + por confirmar`;
  return 'Por confirmar';
}

export function CartDrawer() {
  const { cartOpen, closeCart, cartStep, setCartStep, preferredMode } = useUI();
  const { summary } = useCart();
  const [form, setForm] = useState<CheckoutForm>({ mode: preferredMode, name: '', phone: '', address: '', reference: '', notes: '' });
  const touchedMode = useRef(false);

  useEffect(() => {
    if (cartOpen && !touchedMode.current) setForm((f) => ({ ...f, mode: preferredMode }));
  }, [cartOpen, preferredMode]);

  // Si el pedido queda vacío, vuelve al primer paso
  useEffect(() => {
    if (summary.lines.length === 0 && cartStep !== 'pedido') setCartStep('pedido');
  }, [summary.lines.length, cartStep, setCartStep]);

  const stepIndex = STEPS.findIndex((s) => s.id === cartStep);

  return (
    <Overlay open={cartOpen} onClose={closeCart} placement="right" labelledBy="carrito-titulo" className="surface-crema flex h-dvh w-full max-w-[480px] flex-col border-l-2 border-tinta">
      <header className="border-b-2 border-tinta px-5 pb-4 pt-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id="carrito-titulo" className="font-black-display text-[2.3rem]">
            {cartStep === 'pedido' ? 'Tu pedido' : cartStep === 'datos' ? 'Tus datos' : 'Confirmar'}
          </h2>
          <button type="button" onClick={closeCart} className="grid h-11 w-11 place-items-center rounded-full border-2 border-tinta hover:bg-tinta hover:text-crema" aria-label="Cerrar pedido">
            <CloseIcon />
          </button>
        </div>
        {summary.lines.length > 0 && (
          <ol className="mt-3 flex gap-1.5" aria-label="Pasos del pedido">
            {STEPS.map((s, i) => (
              <li key={s.id} aria-current={i === stepIndex ? 'step' : undefined} className={cx('label-mono flex-1 rounded-full border-2 px-2 py-1.5 text-center text-[10px]', i === stepIndex ? 'border-tinta bg-tinta text-crema' : i < stepIndex ? 'border-tinta' : 'border-tinta/25 text-tinta/50')}>
                {i + 1}. {s.label}
              </li>
            ))}
          </ol>
        )}
      </header>

      {cartStep === 'pedido' && <StepPedido onNext={() => setCartStep('datos')} />}
      {cartStep === 'datos' && (
        <StepDatos
          form={form}
          setForm={(f) => setForm(f)}
          onModeTouched={() => (touchedMode.current = true)}
          onBack={() => setCartStep('pedido')}
          onNext={() => setCartStep('revisar')}
        />
      )}
      {cartStep === 'revisar' && <StepRevisar form={form} onBack={() => setCartStep('datos')} />}
    </Overlay>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="border-t-2 border-tinta bg-crema px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 md:px-6">{children}</div>;
}

/* ── Paso 1: líneas del pedido ─────────────────────────────── */
function StepPedido({ onNext }: { onNext: () => void }) {
  const { summary, dispatch } = useCart();
  const { closeCart } = useUI();

  if (summary.lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-start justify-center px-6 pb-16">
        <Stars className="block h-10 w-auto text-rojo" />
        <p className="font-black-display mt-6 text-[2.4rem]">Tu pedido está vacío.</p>
        <p className="mt-3 text-[17px] text-tinta/75">Elige algo del menú para empezar.</p>
        <ButtonLink href="#menu" size="lg" className="mt-8" onClick={closeCart}>
          Ver el menú
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <ul className="flex-1 overflow-y-auto px-5 md:px-6" aria-label="Productos en tu pedido">
        {summary.lines.map((l) => (
          <li key={l.key} className="flex gap-3.5 border-b-2 border-dashed border-tinta/20 py-4">
            {l.product.photos[0] ? (
              <Photo id={l.product.photos[0]} sizes="76px" className="h-[76px] w-[76px] shrink-0 rounded-[12px]" alt="" />
            ) : (
              <NoPhoto id={`linea-${l.key}`} className="h-[76px] w-[76px] shrink-0 rounded-[12px]" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[17px] font-extrabold leading-tight">{l.product.name}</p>
                  {l.choiceLabel && <p className="mt-0.5 text-[14px] text-tinta/70">{l.choiceLabel}</p>}
                </div>
                <p className="shrink-0 font-mono text-[15px] font-bold" data-pendiente={l.lineTotal === null ? 'Precio' : undefined}>
                  {priceLabel(l.lineTotal)}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <QtyStepper size="sm" value={l.qty} label={l.product.name} onChange={(n) => dispatch({ type: 'setQty', key: l.key, qty: n })} />
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'remove', key: l.key })}
                  className="grid h-10 w-10 place-items-center rounded-full text-tinta/70 hover:bg-tinta/10 hover:text-rojo"
                  aria-label={`Quitar ${l.product.name}${l.choiceLabel ? ` (${l.choiceLabel})` : ''} del pedido`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Footer>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[17px] font-bold">Subtotal</span>
          <span className="font-mono text-[18px] font-bold" data-pendiente={summary.subtotalComplete ? undefined : 'Precios'}>
            {subtotalText(summary)}
          </span>
        </div>
        {!summary.subtotalComplete && <p className="mt-1.5 text-[13px] leading-snug text-tinta/65">Hay precios por confirmar, así que el total todavía no se puede calcular.</p>}
        <Button size="lg" className="mt-4 w-full" onClick={onNext}>
          Continuar
        </Button>
      </Footer>
    </>
  );
}

/* ── Paso 2: datos de entrega ──────────────────────────────── */
function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-bold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-[13px] text-tinta/60">
          {hint}
        </p>
      )}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[14px] font-semibold text-rojo">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (invalid?: boolean) =>
  cx(
    'block w-full rounded-[12px] border-2 bg-[#fbf8dc] px-3.5 py-3 text-[16px] text-tinta placeholder:text-tinta/40 focus-visible:outline-[3px] focus-visible:outline-offset-1',
    invalid ? 'border-rojo' : 'border-tinta',
  );

function StepDatos({
  form,
  setForm,
  onModeTouched,
  onBack,
  onNext,
}: {
  form: CheckoutForm;
  setForm: (f: CheckoutForm) => void;
  onModeTouched: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const update = <K extends keyof CheckoutForm>(k: K, v: CheckoutForm[K]) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (submitted) setErrors(validateCheckout(next));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateCheckout(form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#f-${first}`)?.focus();
      return;
    }
    onNext();
  };

  const aria = (k: keyof CheckoutForm, hint?: boolean) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': [errors[k] ? `f-${k}-error` : '', hint ? `f-${k}-hint` : ''].filter(Boolean).join(' ') || undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 md:px-6">
        <fieldset>
          <legend className="text-[15px] font-bold">¿Cómo lo quieres?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {site.ordering.modes.map((m: OrderMode) => (
              <label
                key={m}
                className={cx(
                  'flex min-h-14 cursor-pointer items-center justify-center rounded-[14px] border-2 border-tinta px-3 text-center text-[15px] font-extrabold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rojo',
                  form.mode === m ? 'bg-tinta text-crema' : 'hover:bg-tinta/8',
                )}
              >
                <input
                  type="radio"
                  name="modo"
                  value={m}
                  checked={form.mode === m}
                  onChange={() => {
                    onModeTouched();
                    update('mode', m);
                  }}
                  className="sr-only"
                />
                {ORDER_MODE_LABEL[m]}
              </label>
            ))}
          </div>
          {form.mode === 'retiro' && <p className="mt-2 text-[14px] text-tinta/70">Lo retiras en {site.address.street}, {site.address.municipality}.</p>}
        </fieldset>

        <Field id="f-name" label="Nombre" error={errors.name}>
          <input id="f-name" className={inputCls(!!errors.name)} value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" {...aria('name')} />
        </Field>

        <Field id="f-phone" label="Teléfono" hint="Para confirmar tu pedido. Ej.: 0414 123 4567" error={errors.phone}>
          <input id="f-phone" type="tel" inputMode="tel" className={inputCls(!!errors.phone)} value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" placeholder="0414 123 4567" {...aria('phone', true)} />
        </Field>

        {form.mode === 'delivery' && (
          <>
            <Field id="f-address" label="Dirección de entrega" error={errors.address}>
              <textarea id="f-address" rows={2} className={inputCls(!!errors.address)} value={form.address} onChange={(e) => update('address', e.target.value)} autoComplete="street-address" placeholder="Calle, edificio o casa, piso y zona" {...aria('address')} />
            </Field>
            <Field id="f-reference" label="Punto de referencia (opcional)">
              <input id="f-reference" className={inputCls()} value={form.reference} onChange={(e) => update('reference', e.target.value)} placeholder="Ej.: frente a la plaza" />
            </Field>
          </>
        )}

        <Field id="f-notes" label="Observaciones (opcional)" hint={`${form.notes.length}/${NOTES_MAX} caracteres`} error={errors.notes}>
          <textarea id="f-notes" rows={3} maxLength={NOTES_MAX} className={inputCls(!!errors.notes)} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Ej.: sin cebolla" {...aria('notes', true)} />
        </Field>
      </div>
      <Footer>
        <div className="flex gap-2">
          <Button variant="linea" size="lg" onClick={onBack} className="px-5" aria-label="Volver al pedido">
            <ChevronLeftIcon />
          </Button>
          <Button type="submit" size="lg" className="flex-1">
            Revisar pedido
          </Button>
        </div>
      </Footer>
    </form>
  );
}

/* ── Paso 3: confirmar y enviar ────────────────────────────── */
function StepRevisar({ form, onBack }: { form: CheckoutForm; onBack: () => void }) {
  const { summary, dispatch } = useCart();
  const { closeCart, setCartStep, showToast } = useUI();
  const message = useMemo(() => buildOrderMessage(summary, form), [summary, form]);
  const wa = whatsappUrl(message);
  const [opened, setOpened] = useState(false);
  const [copy, setCopy] = useState<'idle' | 'ok' | 'error'>('idle');
  const fallbackRef = useRef<HTMLTextAreaElement>(null);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopy('ok');
    } catch {
      setCopy('error');
      requestAnimationFrame(() => fallbackRef.current?.select());
    }
  };

  const onClear = () => {
    dispatch({ type: 'clear' });
    setCartStep('pedido');
    closeCart();
    showToast('Listo: vaciamos tu pedido.');
  };

  return (
    <>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 md:px-6">
        <section aria-label="Resumen del pedido" className="rounded-[14px] border-2 border-dashed border-tinta px-4 py-4 font-mono text-[13.5px] leading-[1.6]">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-[0.08em]">Pedido Punkie’s</span>
            <Stars className="block h-4 w-auto text-rojo" />
          </div>
          <ul className="mt-3 space-y-1.5 border-y-2 border-dashed border-tinta/30 py-3">
            {summary.lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-3">
                <span>
                  {l.qty} × {l.product.name}
                  {l.choiceLabel ? ` (${l.choiceLabel})` : ''}
                </span>
                <span className="shrink-0 font-bold">{priceLabel(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1">
            <Row k="Subtotal" v={subtotalText(summary)} strong />
            <Row k="Entrega" v={ORDER_MODE_LABEL[form.mode]} />
            <Row k="Nombre" v={form.name} />
            <Row k="Teléfono" v={form.phone} />
            {form.mode === 'delivery' && <Row k="Dirección" v={[form.address, form.reference].filter(Boolean).join(' · ')} />}
            {form.notes && <Row k="Obs." v={form.notes} />}
          </dl>
        </section>

        {wa ? (
          opened ? (
            <div className="rounded-[14px] bg-tinta p-4 text-crema" role="status">
              <p className="text-[17px] font-extrabold">Abrimos WhatsApp con tu pedido.</p>
              <p className="mt-1.5 text-[15px] text-crema/80">El pedido se envía cuando presionas «Enviar» en WhatsApp. Si no se abrió, vuelve a intentarlo.</p>
            </div>
          ) : (
            <p className="text-[15px] text-tinta/75">Se abrirá WhatsApp con tu pedido ya escrito. Revísalo y envíalo desde allí.</p>
          )
        ) : (
          <div className="rounded-[14px] border-2 border-tinta bg-amarillo/35 p-4" data-pendiente="Conectar WhatsApp o delivery">
            <p className="text-[17px] font-extrabold">Tu pedido todavía no se ha enviado.</p>
            <p className="mt-1.5 text-[15px] leading-[1.45]">
              Los pedidos en línea están pendientes de configuración: aún no hay un canal oficial conectado a esta web. Copia tu pedido y escríbenos por Instagram.
            </p>
            {copy === 'error' && (
              <div className="mt-3">
                <label htmlFor="pedido-texto" className="text-[14px] font-bold">
                  No pudimos copiarlo solo. Selecciona el texto y cópialo:
                </label>
                <textarea id="pedido-texto" ref={fallbackRef} readOnly rows={7} value={message} className="mt-1.5 w-full rounded-[10px] border-2 border-tinta bg-crema p-2 font-mono text-[12px]" />
              </div>
            )}
          </div>
        )}
      </div>

      <Footer>
        {wa ? (
          <div className="space-y-2">
            <ButtonLink href={wa} external size="lg" className="w-full" onClick={() => setOpened(true)}>
              {opened ? 'Abrir WhatsApp otra vez' : 'Enviar por WhatsApp'}
            </ButtonLink>
            {opened ? (
              <Button variant="linea" size="lg" className="w-full" onClick={onClear}>
                Ya lo envié: vaciar pedido
              </Button>
            ) : (
              <Button variant="linea" size="lg" className="w-full" onClick={onBack}>
                Editar datos
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Button size="lg" className="w-full" onClick={onCopy}>
              {copy === 'ok' ? <CheckIcon /> : <CopyIcon />}
              {copy === 'ok' ? 'Pedido copiado' : 'Copiar pedido'}
            </Button>
            <div className="flex gap-2">
              <Button variant="linea" size="lg" onClick={onBack} className="px-5" aria-label="Editar datos">
                <ChevronLeftIcon />
              </Button>
              {site.ordering.deliveryUrl ? (
                <ButtonLink href={site.ordering.deliveryUrl} external variant="linea" size="lg" className="flex-1">
                  Ir al delivery oficial
                </ButtonLink>
              ) : (
                <ButtonLink href={site.instagram.url} external variant="linea" size="lg" className="flex-1">
                  <InstagramIcon />
                  Abrir Instagram
                </ButtonLink>
              )}
            </div>
            <p className="sr-only" role="status">
              {copy === 'ok' ? 'Pedido copiado al portapapeles.' : ''}
            </p>
          </div>
        )}
      </Footer>
    </>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 uppercase tracking-[0.06em] text-tinta/65">{k}</dt>
      <dd className={cx('text-right', strong && 'font-bold')}>{v}</dd>
    </div>
  );
}
