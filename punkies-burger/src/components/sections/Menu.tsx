import { CATEGORIES, productsBy } from '../../data/menu';
import { ProductCard } from './ProductCard';
import { Stars } from '../brand/Brand';

export function Menu() {
  return (
    <section id="menu" aria-labelledby="menu-title" className="px-3 md:px-5">
      <div className="surface-crema mx-auto max-w-[1440px] rounded-[28px] px-4 pb-12 pt-14 sm:px-6 md:px-10 md:pb-16 md:pt-20 lg:px-14">
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="menu-title" className="font-black-display text-[clamp(3.3rem,10.5vw,8.2rem)] lg:col-span-8 lg:text-[clamp(5rem,7.9vw,7.6rem)]">
            Pocas cosas.
            <br />
            Perfectas.
          </h2>
          <div className="lg:col-span-4 lg:pb-3">
            <Stars className="mb-5 block h-7 w-auto text-rojo" />
            <p className="max-w-[30ch] text-[1.3rem] font-semibold leading-[1.25] tracking-[-0.015em] md:text-[1.5rem]">
              No hacemos de todo. Hacemos smash burgers como deben hacerse.
            </p>
            <p className="mt-4 max-w-[44ch] text-[15px] leading-[1.45] text-tinta/70">
              Precios en dólares. Donde ves <span className="font-mono font-bold">$ —</span>, el precio todavía está por confirmar.
            </p>
          </div>
        </header>

        <nav aria-label="Categorías del menú" className="no-scrollbar -mx-4 mt-12 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id} className="shrink-0">
                <a href={`#cat-${c.id}`} className="pm-interactive inline-flex min-h-11 items-center rounded-full border-2 border-tinta px-4 text-[15px] font-bold hover:bg-tinta hover:text-crema">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 space-y-16 md:mt-14 md:space-y-20">
          {CATEGORIES.map((c) => {
            const items = productsBy(c.id);
            return (
              <section key={c.id} id={`cat-${c.id}`} aria-labelledby={`cat-${c.id}-title`} className="scroll-mt-28">
                <div className="flex items-end justify-between gap-4 border-b-2 border-tinta pb-3">
                  <h3 id={`cat-${c.id}-title`} className="font-black-display text-[clamp(2rem,4.6vw,3.4rem)]">
                    {c.label}
                  </h3>
                </div>
                {items.length > 0 ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {items.map((p) => (
                      <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col gap-4 rounded-[18px] border-2 border-dashed border-tinta/40 px-5 py-6 sm:flex-row sm:items-center sm:justify-between" data-pendiente={c.id === 'bebidas' ? 'Cargar bebidas' : undefined}>
                    <p className="max-w-[48ch] text-[16px] leading-[1.45]">{c.emptyMessage}</p>
                    {c.id === 'especiales' && (
                      <a href="#especiales" className="pm-interactive inline-flex min-h-11 shrink-0 items-center self-start rounded-full bg-tinta px-5 text-[15px] font-extrabold text-crema sm:self-auto">
                        Ver especiales
                      </a>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
