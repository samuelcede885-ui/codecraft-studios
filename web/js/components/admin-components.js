/** Componentes del panel administrativo. */
import { escapeHtml, fallbackOnError, formatPrice, html } from '../utils.js';
import { foodPlaceholder, foodVisual } from '../food.js';

export function ProductRow(product, category, currency) {
  const visual = foodVisual(product, category?.name);
  const row = html(`
    <tr data-id="${product.id}">
      <td>
        <div class="cell-product">
          <span class="thumb-slot"></span>
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <small>${escapeHtml(product.description ?? '')}</small>
          </div>
        </div>
      </td>
      <td>${escapeHtml(category?.name ?? '—')}</td>
      <td class="num">${formatPrice(product.price, currency)}</td>
      <td>
        <label class="switch" title="Disponible">
          <input type="checkbox" data-action="toggle" ${product.is_available ? 'checked' : ''}>
          <span></span>
        </label>
      </td>
      <td class="actions">
        <button class="btn btn--ghost btn--sm" data-action="edit">Editar</button>
        <button class="btn btn--danger btn--sm" data-action="delete" aria-label="Eliminar ${escapeHtml(product.name)}">✕</button>
      </td>
    </tr>`);

  row.querySelector('.thumb-slot').replaceWith(product.image_url
    ? html(`<img class="thumb" src="${escapeHtml(product.image_url)}" alt="">`)
    : foodPlaceholder('thumb', visual));
  return fallbackOnError(row, () => foodPlaceholder('thumb', visual));
}

/**
 * Diálogo de alta/edición de producto.
 * @param {{ categories: any[], onSubmit: (data: object, file: File|null) => Promise<void> }} opts
 */
export function ProductDialog({ categories, onSubmit }) {
  const dialog = html(`
    <dialog class="dialog">
      <form method="dialog" class="form">
        <h2 class="dialog__title"></h2>
        <div class="image-picker">
          <img class="image-picker__preview" alt="" hidden>
          <label class="btn btn--ghost">Subir imagen
            <input type="file" name="image" accept="image/*" hidden>
          </label>
        </div>
        <label>Nombre del plato <input name="name" required maxlength="120"></label>
        <label>Descripción <textarea name="description" rows="2"></textarea></label>
        <div class="form__row">
          <label>Precio <input name="price" type="number" min="0" step="0.01" required></label>
          <label>Categoría
            <select name="category_id" required>
              ${categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
            </select>
          </label>
        </div>
        <label>Etiquetas <input name="tags" placeholder="vegano, picante"></label>
        <label class="checkbox"><input type="checkbox" name="is_available"> Disponible</label>
        <footer class="dialog__footer">
          <button type="button" class="btn btn--ghost" value="cancel">Cancelar</button>
          <button type="submit" class="btn btn--primary">Guardar</button>
        </footer>
      </form>
    </dialog>`);

  const form = dialog.querySelector('form');
  const preview = dialog.querySelector('.image-picker__preview');
  let file = null;

  form.image.addEventListener('change', () => {
    file = form.image.files[0] ?? null;
    if (file) { preview.src = URL.createObjectURL(file); preview.hidden = false; }
  });
  dialog.querySelector('[value="cancel"]').addEventListener('click', () => dialog.close());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      description: form.description.value.trim(),
      price: Number(form.price.value),
      category_id: form.category_id.value,
      tags: form.tags.value.split(',').map((t) => t.trim()).filter(Boolean),
      is_available: form.is_available.checked,
    };
    const submit = form.querySelector('[type=submit]');
    submit.disabled = true;
    try {
      await onSubmit(data, file);
      dialog.close();
    } catch (err) {
      console.error(err);
      toast(err.message ?? 'No se pudo guardar', 'error'); // el diálogo sigue abierto
    } finally {
      submit.disabled = false;
    }
  });

  /** Abre el diálogo vacío (crear) o con un producto (editar). */
  dialog.openWith = (product = null) => {
    form.reset();
    file = null;
    dialog.querySelector('.dialog__title').textContent = product ? 'Editar plato' : 'Nuevo plato';
    form.name.value = product?.name ?? '';
    form.description.value = product?.description ?? '';
    form.price.value = product?.price ?? '';
    form.category_id.value = product?.category_id ?? categories[0]?.id ?? '';
    form.tags.value = product?.tags.join(', ') ?? '';
    form.is_available.checked = product?.is_available ?? true;
    preview.hidden = !product?.image_url;
    preview.src = product?.image_url ?? '';
    dialog.showModal();
  };
  return dialog;
}

/** Notificación temporal. */
export function toast(message, type = 'ok') {
  document.querySelectorAll('.toast').forEach((t) => t.remove()); // solo uno a la vez
  const el = html(`<div class="toast toast--${type}" role="status">${escapeHtml(message)}</div>`);
  document.body.append(el);
  setTimeout(() => el.remove(), 2600);
}
