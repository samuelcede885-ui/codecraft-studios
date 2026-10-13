/** Componentes de la vista pública (catálogo móvil). */
import { escapeHtml, fallbackOnError, formatPrice, html, initials } from '../utils.js';

export function MenuHeader(restaurant, branding) {
  const logo = branding.logo_url
    ? `<img class="menu-header__logo" src="${escapeHtml(branding.logo_url)}" alt="">`
    : `<span class="menu-header__logo menu-header__logo--fallback">${initials(restaurant.name)}</span>`;
  return html(`
    <header class="menu-header">
      ${logo}
      <div>
        <h1 class="menu-header__name">${escapeHtml(restaurant.name)}</h1>
        ${restaurant.description ? `<p class="menu-header__desc">${escapeHtml(restaurant.description)}</p>` : ''}
      </div>
    </header>`);
}

/** Barra de categorías fija; resalta la sección visible y desplaza al pulsar. */
export function CategoryTabs(categories) {
  const nav = html(`
    <nav class="category-tabs" aria-label="Categorías">
      ${categories.map((c) => `<a class="category-tabs__item" href="#cat-${c.id}" data-id="${c.id}">${escapeHtml(c.name)}</a>`).join('')}
    </nav>`);

  nav.setActive = (id) => {
    nav.querySelectorAll('.category-tabs__item').forEach((a) => {
      const active = a.dataset.id === id;
      a.classList.toggle('is-active', active);
      if (active) a.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  };
  return nav;
}

export function ProductCard(product, currency) {
  const image = product.image_url
    ? `<img class="product-card__img" src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" loading="lazy">`
    : `<div class="product-card__img product-card__img--empty" aria-hidden="true">🍽️</div>`;
  const tags = product.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  return fallbackOnError(html(`
    <article class="product-card">
      <div class="product-card__body">
        <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
        ${product.description ? `<p class="product-card__desc">${escapeHtml(product.description)}</p>` : ''}
        ${tags ? `<div class="product-card__tags">${tags}</div>` : ''}
        <strong class="product-card__price">${formatPrice(product.price, currency)}</strong>
      </div>
      ${image}
    </article>`), 'product-card__img--empty');
}

export function CategorySection(category, products, currency) {
  const section = html(`
    <section class="menu-section" id="cat-${category.id}" data-id="${category.id}">
      <h2 class="menu-section__title">${escapeHtml(category.name)}</h2>
      <div class="menu-section__list"></div>
    </section>`);
  const list = section.querySelector('.menu-section__list');
  products.forEach((p) => list.append(ProductCard(p, currency)));
  return section;
}
