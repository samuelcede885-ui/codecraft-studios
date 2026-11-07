import { useState } from 'react';
import type { Product } from '../../data/menu';
import { Photo } from '../ui/Photo';
import { LogoPattern, Stars } from '../brand/Brand';
import { CheckIcon, PlusIcon } from '../ui/Icons';
import { useCart } from '../../state/cart';
import { useUI } from '../../state/ui';
import { priceLabel } from '../../lib/format';
import { cx } from '../../lib/cx';

/** Precio mostrado en tarjeta: precio fijo, "desde" si hay opciones, o pendiente. */
export function productPrice(p: Product): { label: string; pending: boolean; from: boolean } {
  if (p.options) {
    const prices = p.options.choices.map((c) => c.price).filter((x): x is number => x !== null);
    if (prices.length === p.options.choices.length) {
      const min = Math.min(...prices);
      return { label: priceLabel(min), pending: false, from: prices.some((x) => x !== min) };
    }
    return { label: priceLabel(null), pending: true, from: false };
  }
  return { label: priceLabel(p.price), pending: p.price === null, from: false };
}

export function NoPhoto({ id, className }: { id: string; className?: string }) {
  return (
    <span className={cx('relative block overflow-hidden bg-rojo', className)} data-pendiente="Foto del producto">
      <LogoPattern id={`np-${id}`} color="rgb(243 239 195 / 0.16)" background="var(--color-rojo)" scale={0.8} />
      <Stars className="absolute left-1/2 top-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2 text-crema" />
    </span>
  );
}

export function ProductCard({ product, sizes }: { product: Product; sizes: string }) {
  const { add } = useCart();
  const { openProduct, showToast, openCart } = useUI();
  const [justAdded, setJustAdded] = useState(false);
  const price = productPrice(product);
  const [first, second] = product.photos;
  const needsChoice = !!product.options;

  const onAdd = () => {
    if (needsChoice) {
      openProduct(product.id);
      return;
    }
    add(product.id, null, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
    showToast(`${product.name} está en tu pedido.`, { label: 'Ver pedido', onClick: () => openCart() });
  };

  return (
    <article className="group relative flex flex-col rounded-[20px] border-2 border-tinta bg-crema p-2 transition-transform duration-200 ease-[var(--pm-ease-out)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
      <div className="relative overflow-hidden rounded-[13px]">
        {first ? (
          <>
            <Photo id={first} sizes={sizes} className="aspect-[4/3.3]" imgClassName="transition-transform duration-700 ease-[var(--pm-ease-out)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
            {second && (
              <Photo
                id={second}
                sizes={sizes}
                className="!absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
                alt=""
              />
            )}
          </>
        ) : (
          <NoPhoto id={product.id} className="aspect-[4/3.3]" />
        )}
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-1.5 pt-4">
        <h4 className="font-black-display text-[2rem] leading-[0.92] md:text-[2.2rem]">
          <button
            type="button"
            onClick={() => openProduct(product.id)}
            className="text-left after:absolute after:inset-0 after:rounded-[20px] after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-[3px] focus-visible:after:outline-rojo"
          >
            {product.name}
          </button>
        </h4>
        <p className="mt-2.5 max-w-[34ch] text-[15px] leading-[1.42] text-tinta/80">{product.description}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="leading-none" data-pendiente={price.pending ? 'Precio' : undefined}>
            <span className="font-mono text-[1.15rem] font-bold">
              {price.from && <span className="mr-1 text-[0.8em] font-semibold">desde</span>}
              {price.label}
            </span>
            {price.pending && <span className="label-mono mt-1.5 block text-[10px] text-tinta/60">Precio por confirmar</span>}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className={cx(
              'pm-interactive relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full text-crema',
              justAdded ? 'bg-tinta' : 'bg-rojo hover:bg-rojo-hondo',
            )}
            aria-label={needsChoice ? `Elegir opciones de ${product.name}` : `Añadir ${product.name} al pedido`}
          >
            {justAdded ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>
    </article>
  );
}
