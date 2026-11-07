import { useState } from 'react';
import { getProduct, isOrderable } from '../../data/menu';
import { Overlay } from '../ui/Overlay';
import { Photo } from '../ui/Photo';
import { Button } from '../ui/Button';
import { CloseIcon } from '../ui/Icons';
import { QtyStepper } from './QtyStepper';
import { NoPhoto } from '../sections/ProductCard';
import { useCart } from '../../state/cart';
import { useUI } from '../../state/ui';
import { formatUSD, priceLabel } from '../../lib/format';
import { cx } from '../../lib/cx';

export function ProductDialog() {
  const { productId, closeProduct } = useUI();
  const product = productId ? getProduct(productId) : undefined;
  return (
    <Overlay
      open={!!product}
      onClose={closeProduct}
      placement="center"
      labelledBy="ficha-titulo"
      className="surface-crema flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[24px] md:max-w-[1000px] md:rounded-[26px]"
    >
      {product && <ProductBody key={product.id} productId={product.id} />}
    </Overlay>
  );
}

function ProductBody({ productId }: { productId: string }) {
  const product = getProduct(productId)!;
  const { add } = useCart();
  const { closeProduct, showToast, openCart } = useUI();
  const [choiceId, setChoiceId] = useState<string | null>(product.options?.choices[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [photoIndex, setPhotoIndex] = useState(0);
  const orderable = isOrderable(product);


  const choice = product.options?.choices.find((c) => c.id === choiceId) ?? null;
  const unit = choice ? choice.price : product.price;
  const total = unit === null ? null : unit * qty;
  const photo = product.photos[photoIndex];

  const onAdd = () => {
    add(product.id, choiceId, qty);
    closeProduct();
    const name = choice ? `${product.name} (${choice.label})` : product.name;
    showToast(`${qty > 1 ? `${qty} × ` : ''}${name} ${qty > 1 ? 'están' : 'está'} en tu pedido.`, { label: 'Ver pedido', onClick: () => openCart() });
  };

  return (
    <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1.05fr_1fr] md:overflow-hidden">
      <div className="relative min-w-0 bg-tinta md:h-full">
        {photo ? (
          <Photo id={photo} sizes="(min-width: 768px) 520px, 100vw" className="aspect-[4/3.2] md:aspect-auto md:h-full md:min-h-[560px]" />
        ) : (
          <NoPhoto id={`ficha-${product.id}`} className="aspect-[4/3.2] md:h-full md:min-h-[560px]" />
        )}
        {product.photos.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-2" role="group" aria-label="Fotos del producto">
            {product.photos.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setPhotoIndex(i)}
                aria-pressed={i === photoIndex}
                aria-label={`Foto ${i + 1} de ${product.photos.length}`}
                className={cx('h-14 w-14 overflow-hidden rounded-[10px] border-2 transition-colors', i === photoIndex ? 'border-crema' : 'border-transparent opacity-75 hover:opacity-100')}
              >
                <Photo id={id} sizes="56px" className="h-full w-full" alt="" />
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={closeProduct}
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-crema text-tinta md:hidden"
          aria-label="Cerrar ficha"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col md:overflow-y-auto">
        <div className="flex-1 px-5 pb-6 pt-6 md:px-9 md:pt-9">
          <div className="flex items-start justify-between gap-4">
            <h2 id="ficha-titulo" className="font-black-display text-[clamp(2.6rem,6vw,3.8rem)]">
              {product.name}
            </h2>
            <button type="button" onClick={closeProduct} className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-tinta md:grid" aria-label="Cerrar ficha">
              <CloseIcon />
            </button>
          </div>
          <p className="mt-4 text-[1.1rem] leading-[1.5] text-tinta/85">{product.description}</p>

          {product.ingredients && (
            <div className="mt-6">
              <h3 className="label-mono text-tinta/60">Lleva</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="rounded-full border-2 border-tinta/80 px-3 py-1 text-[14px] font-semibold">
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.options && orderable && (
            <fieldset className="mt-7">
              <legend className="label-mono text-tinta/60">{product.options.label}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.options.choices.map((c) => (
                  <label
                    key={c.id}
                    className={cx(
                      'flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-[14px] border-2 border-tinta px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rojo',
                      choiceId === c.id ? 'bg-tinta text-crema' : 'hover:bg-tinta/8',
                    )}
                  >
                    <input type="radio" name="opcion" value={c.id} checked={choiceId === c.id} onChange={() => setChoiceId(c.id)} className="sr-only" />
                    <span>
                      <span className="block text-[16px] font-bold">{c.label}</span>
                      {c.detail && (
                        <span className="block text-[13px] opacity-75" data-pendiente="Contenido del combo">
                          {c.detail}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-mono text-[15px] font-bold" data-pendiente={c.price === null ? 'Precio' : undefined}>
                      {priceLabel(c.price)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {!orderable && <p className="mt-7 rounded-[14px] border-2 border-dashed border-tinta/50 px-4 py-3 font-semibold">Este especial ya terminó. No se puede pedir.</p>}
        </div>

        {orderable && (
          <div className="sticky bottom-0 border-t-2 border-tinta bg-crema px-5 py-4 md:px-9">
            <div className="flex items-center justify-between gap-4">
              <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
              <Button size="lg" onClick={onAdd} className="flex-1 sm:flex-none">
                Añadir al pedido
                <span className="hidden font-mono text-[15px] font-bold opacity-90 min-[430px]:inline" data-pendiente={total === null ? 'Precio' : undefined}>
                  {total === null ? '· $\u00a0—' : `· ${formatUSD(total)}`}
                </span>
              </Button>
            </div>
            {total === null && <p className="mt-2.5 text-[13px] text-tinta/65">Este precio todavía está por confirmar.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
