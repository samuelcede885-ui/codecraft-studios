/** Entrada de la vista pública del catálogo (menu.html?r=<slug>). */
import { getRestaurantBySlug, getBranding, getCategories, getProducts } from '../services/api.js';
import { applyBranding } from '../theme.js';
import { MenuHeader, CategoryTabs, CategorySection } from '../components/menu-components.js';

async function init() {
  const app = document.getElementById('app');
  const slug = new URLSearchParams(location.search).get('r');
  if (!slug) {
    app.innerHTML = '<p class="empty">Falta el restaurante en la URL (menu.html?r=slug).</p>';
    return;
  }

  try {
    const restaurant = await getRestaurantBySlug(slug);
    const [branding, categories, products] = await Promise.all([
      getBranding(restaurant.id),
      getCategories(restaurant.id),
      getProducts(restaurant.id),
    ]);

    applyBranding(branding);
    document.title = `${restaurant.name} · Menú`;

    const visible = categories
      .filter((c) => c.is_active)
      .map((c) => ({ category: c, items: products.filter((p) => p.category_id === c.id && p.is_available) }))
      .filter(({ items }) => items.length);

    const tabs = CategoryTabs(visible.map((v) => v.category));
    const main = document.createElement('main');
    main.className = 'menu-body';
    visible.forEach(({ category, items }) => main.append(CategorySection(category, items, restaurant.currency)));

    app.replaceChildren(MenuHeader(restaurant, branding), tabs, main);
    watchActiveSection(main, tabs);
  } catch (err) {
    console.error(err);
    app.innerHTML = '<p class="empty">No pudimos cargar el menú. Inténtalo de nuevo.</p>';
  }
}

/** Marca en las pestañas la categoría que está en pantalla. */
function watchActiveSection(main, tabs) {
  const observer = new IntersectionObserver(
    (entries) => entries.filter((e) => e.isIntersecting).forEach((e) => tabs.setActive(e.target.dataset.id)),
    { rootMargin: '-120px 0px -60% 0px' },
  );
  main.querySelectorAll('.menu-section').forEach((s) => observer.observe(s));
  const first = main.querySelector('.menu-section');
  if (first) tabs.setActive(first.dataset.id);
}

init();
