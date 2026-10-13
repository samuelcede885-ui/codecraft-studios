/** Entrada del panel administrativo (admin.html). */
import * as api from '../services/api.js';
import { applyBranding } from '../theme.js';
import { escapeHtml, initials } from '../utils.js';
import { ProductRow, ProductDialog, toast } from '../components/admin-components.js';

const state = {
  restaurant: null,
  branding: null,
  categories: [],
  products: [],
  filter: { search: '', categoryId: '' },
  editingId: null,
};

const $ = (sel) => document.querySelector(sel);

// ---------------------------------------------------------------------------
// Carga inicial
// ---------------------------------------------------------------------------
async function init() {
  state.restaurant = await api.getMyRestaurant();
  const id = state.restaurant.id;
  [state.branding, state.categories, state.products] = await Promise.all([
    api.getBranding(id),
    api.getCategories(id),
    api.getProducts(id),
  ]);

  applyBranding(state.branding);
  renderSidebar();
  renderCategoryFilter();
  renderProducts();
  renderBranding();
  bindEvents();
  showView(location.hash.slice(1) || 'products');
}

// ---------------------------------------------------------------------------
// Navegación entre vistas
// ---------------------------------------------------------------------------
function showView(name) {
  document.querySelectorAll('[data-view]').forEach((v) => (v.hidden = v.dataset.view !== name));
  document.querySelectorAll('.sidebar__link').forEach((a) =>
    a.classList.toggle('is-active', a.getAttribute('href') === `#${name}`));
}

function renderSidebar() {
  $('#restaurant-name').textContent = state.restaurant.name;
  $('#menu-link').href = `menu.html?r=${encodeURIComponent(state.restaurant.slug)}`;
  renderLogo($('#sidebar-logo'));
}

function renderLogo(el) {
  el.innerHTML = state.branding.logo_url
    ? `<img src="${escapeHtml(state.branding.logo_url)}" alt="">`
    : initials(state.restaurant.name);
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------
function renderCategoryFilter() {
  const select = $('#filter-category');
  select.innerHTML = '<option value="">Todas las categorías</option>' +
    state.categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
}

function renderProducts() {
  const { search, categoryId } = state.filter;
  const q = search.toLowerCase();
  const rows = state.products
    .filter((p) => (!categoryId || p.category_id === categoryId) && p.name.toLowerCase().includes(q))
    .map((p) => ProductRow(p, state.categories.find((c) => c.id === p.category_id), state.restaurant.currency));

  $('#products-body').replaceChildren(...rows);
  $('#products-empty').hidden = rows.length > 0;
  $('#stat-total').textContent = state.products.length;
  $('#stat-available').textContent = state.products.filter((p) => p.is_available).length;
  $('#stat-categories').textContent = state.categories.length;
}

async function saveProduct(data, file) {
  const id = state.restaurant.id;
  if (file) data.image_url = await api.uploadImage(id, file, 'products');

  if (state.editingId) {
    const updated = await api.updateProduct(state.editingId, data);
    state.products = state.products.map((p) => (p.id === updated.id ? updated : p));
    toast('Plato actualizado');
  } else {
    state.products.push(await api.createProduct(id, data));
    toast('Plato creado');
  }
  renderProducts();
}

async function handleRowAction(e) {
  const action = e.target.dataset.action;
  if (!action) return;
  const id = e.target.closest('tr').dataset.id;
  const product = state.products.find((p) => p.id === id);

  if (action === 'edit') {
    state.editingId = id;
    productDialog.openWith(product);
  } else if (action === 'delete' && confirm(`¿Eliminar "${product.name}"?`)) {
    await api.deleteProduct(id);
    state.products = state.products.filter((p) => p.id !== id);
    renderProducts();
    toast('Plato eliminado');
  } else if (action === 'toggle') {
    const updated = await api.updateProduct(id, { is_available: e.target.checked });
    Object.assign(product, updated);
    renderProducts();
  }
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------
async function addCategory() {
  const name = prompt('Nombre de la nueva categoría');
  if (!name?.trim()) return;
  state.categories.push(await api.createCategory(state.restaurant.id, { name: name.trim() }));
  renderCategoryFilter();
  rebuildDialog();
  renderProducts();
  toast('Categoría creada');
}

// ---------------------------------------------------------------------------
// Personalización (color principal y logo) con vista previa en vivo
// ---------------------------------------------------------------------------
function renderBranding() {
  const form = $('#branding-form');
  form.primary_color.value = state.branding.primary_color;
  form.primary_color_hex.value = state.branding.primary_color;
  form.restaurant_name.value = state.restaurant.name;
  $('#preview-name').textContent = state.restaurant.name;
  renderLogo($('#logo-preview'));
  renderLogo($('#preview-logo'));
}

function previewColor(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return;
  const form = $('#branding-form');
  form.primary_color.value = hex;
  form.primary_color_hex.value = hex;
  applyBranding({ ...state.branding, primary_color: hex });
}

async function saveBranding(e) {
  e.preventDefault();
  const form = e.target;
  const id = state.restaurant.id;
  const changes = { primary_color: form.primary_color.value };

  const logo = form.logo.files[0];
  if (logo) changes.logo_url = await api.uploadImage(id, logo, 'logo');

  const name = form.restaurant_name.value.trim();
  if (name && name !== state.restaurant.name) {
    state.restaurant = await api.updateRestaurant(id, { name });
  }

  state.branding = await api.updateBranding(id, changes);
  applyBranding(state.branding);
  renderSidebar();
  renderBranding();
  toast('Personalización guardada');
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------
let productDialog;
function rebuildDialog() {
  productDialog?.remove();
  productDialog = ProductDialog({ categories: state.categories, onSubmit: saveProduct });
  document.body.append(productDialog);
}

function bindEvents() {
  rebuildDialog();
  window.addEventListener('hashchange', () => showView(location.hash.slice(1)));

  $('#btn-new-product').addEventListener('click', () => {
    state.editingId = null;
    productDialog.openWith();
  });
  $('#btn-new-category').addEventListener('click', addCategory);
  $('#products-body').addEventListener('click', handleRowAction);
  $('#products-body').addEventListener('change', handleRowAction);
  $('#filter-search').addEventListener('input', (e) => { state.filter.search = e.target.value; renderProducts(); });
  $('#filter-category').addEventListener('change', (e) => { state.filter.categoryId = e.target.value; renderProducts(); });

  const form = $('#branding-form');
  form.primary_color.addEventListener('input', (e) => previewColor(e.target.value));
  form.primary_color_hex.addEventListener('input', (e) => previewColor(e.target.value));
  form.restaurant_name.addEventListener('input', (e) => ($('#preview-name').textContent = e.target.value));
  form.logo.addEventListener('change', () => {
    const file = form.logo.files[0];
    if (!file) return;
    const img = `<img src="${URL.createObjectURL(file)}" alt="">`;
    $('#logo-preview').innerHTML = img;
    $('#preview-logo').innerHTML = img;
  });
  form.querySelectorAll('[data-swatch]').forEach((b) =>
    b.addEventListener('click', () => previewColor(b.dataset.swatch)));
  form.addEventListener('submit', saveBranding);
}

init();
