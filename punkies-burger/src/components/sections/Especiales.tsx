import type { CSSProperties } from 'react';
import { PRODUCTS, type Product } from '../../data/menu';
import { Photo } from '../ui/Photo';
import { Button, ButtonLink } from '../ui/Button';
import { InstagramIcon } from '../ui/Icons';
import { useCart } from '../../state/cart';
import { useUI } from '../../state/ui';
import { useReveal } from '../../hooks/useReveal';
import { site } from '../../config/site';
import { productPrice } from './ProductCard';

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/**
 * Especiales: los activos se pueden ver y pedir; los terminados quedan como archivo.
 * No se muestra ningún especial como vigente si no lo está.
 */
export function Especiales({ products = PRODUCTS }: { products?: Product[] }) {
  const specials = products.filter((p) => p.category === 'especiales');
  const active = specials.filter((p) => p.status === 'disponible');
  const past = specials.filter((p) => p.status === 'terminado');
  const root = useReveal<HTMLElement>();

  return (
    <section ref={root} id="especiales" aria-labelledby="esp-title" className="px-3 md:px-5">
      <div className="mx-auto max-w-[1440px] rounded-[28px] bg-burdeos px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="esp-title" className="font-black-display text-[clamp(3.1rem,9.6vw,7.2rem)] text-crema">
              Los especiales
              <br />
              de la casa.
            </h2>

            {active.length > 0 ? (
              <ul className="mt-12 grid gap-8 sm:grid-cols-2">
                {active.map((p, i) => (
                  <li key={p.id}>
                    <ActiveSpecial product={p} index={i} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-10 max-w-[40ch]" data-pendiente="Sin especial activo">
                <p className="text-[1.45rem] font-semibold leading-[1.25] tracking-[-0.015em] text-crema">Ahora mismo no hay un especial activo.</p>
                <p className="mt-3 text-[1.08rem] leading-[1.5] text-crema/75">
                  Salen por tiempo limitado y los anunciamos primero en Instagram. Cuando haya uno, lo vas a poder pedir desde aquí.
                </p>
                <ButtonLink href={site.instagram.url} external variant="crema" size="lg" className="mt-8">
                  <InstagramIcon />
                  Ver @{site.instagram.handle}
                </ButtonLink>
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div className="lg:col-span-6 lg:pt-4">
              <h3 className="label-mono text-crema/70">Ya pasó por la plancha</h3>
              <ul className="mt-6 space-y-12">
                {past.map((p, i) => (
                  <li key={p.id}>
                    <PastSpecial product={p} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PastSpecial({ product, index }: { product: Product; index: number }) {
  return (
    <article className="relative mx-auto max-w-[520px] lg:ml-auto lg:mr-6" aria-labelledby={`esp-${product.id}`}>
      <figure className="reveal print relative" style={vars({ '--r': index % 2 ? '-3deg' : '2.5deg' })}>
        {product.photos[0] && <Photo id={product.photos[0]} sizes="(min-width: 1024px) 34vw, 86vw" className="aspect-[4/4.2] rounded-[2px]" />}
        <span className="label-mono absolute -left-3 -top-3 -rotate-[5deg] rounded-[6px] bg-rojo px-3 py-2 text-[12px] text-crema">
          {product.badge}
        </span>
        <span className="label-mono absolute right-5 top-5 rounded-full bg-tinta px-3 py-1.5 text-[11px] text-crema" data-pendiente="Confirmar que terminó">
          Terminado
        </span>
      </figure>
      <div className="mt-8">
        <h4 id={`esp-${product.id}`} className="font-black-display text-[2.2rem] text-crema">
          {product.name}
        </h4>
        <p className="mt-2 text-[1.05rem] text-crema/80">{product.description}</p>
        {product.quote && (
          <blockquote className="mt-5 rounded-[12px] border-2 border-dashed border-crema/40 px-4 py-3 font-mono text-[13px] leading-[1.6] text-crema/85">
            “{product.quote}”
            <footer className="mt-1 text-crema/55">— @{site.instagram.handle}</footer>
          </blockquote>
        )}
      </div>
    </article>
  );
}

function ActiveSpecial({ product, index }: { product: Product; index: number }) {
  const { add } = useCart();
  const { openProduct, showToast, openCart } = useUI();
  const price = productPrice(product);
  const onAdd = () => {
    if (product.options) return openProduct(product.id);
    add(product.id, null, 1);
    showToast(`${product.name} está en tu pedido.`, { label: 'Ver pedido', onClick: () => openCart() });
  };
  return (
    <article className="flex h-full flex-col">
      <figure className="reveal print relative" style={vars({ '--r': index % 2 ? '2deg' : '-2.5deg' })}>
        {product.photos[0] && <Photo id={product.photos[0]} sizes="(min-width: 1024px) 22vw, 86vw" className="aspect-[4/4.4] rounded-[2px]" />}
        {product.badge && (
          <span className="label-mono absolute -left-2 -top-3 -rotate-[4deg] rounded-[6px] bg-rojo px-3 py-2 text-[12px] text-crema">{product.badge}</span>
        )}
      </figure>
      <h3 className="font-black-display mt-6 text-[2rem] text-crema">{product.name}</h3>
      <p className="mt-2 text-crema/80">{product.description}</p>
      <p className="mt-3 font-mono font-bold text-crema">{price.label}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="crema" onClick={() => openProduct(product.id)}>
          Ver especial
        </Button>
        <Button onClick={onAdd}>Añadir al pedido</Button>
      </div>
    </article>
  );
}
