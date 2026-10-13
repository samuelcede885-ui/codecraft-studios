/**
 * Ejemplo autocontenido con el SDK de Supabase (supabase-js v2):
 *
 *   1) cargarProductos()       → lee los productos de un restaurante y los pinta en el DOM
 *   2) agregarProducto()       → el dueño crea un producto desde un formulario
 *   3) actualizarProducto()    → cambia el precio y/o marca el producto como "agotado"
 *
 * Y cómo manejar errores: sin conexión, tiempo de espera agotado, permisos (RLS),
 * datos inválidos y registros inexistentes.
 *
 * Esquema: supabase/migrations/20261013000000_menu_saas_schema.sql
 *   - "agotado" = products.is_available = false (no hay columna de estatus aparte).
 *   - Los IDs son UUID: un ID como '123' lo rechaza Postgres (error 22P02), lo
 *     que también sirve aquí de ejemplo de manejo de errores.
 *   - Escribir requiere sesión del dueño; RLS bloquea cualquier otro usuario.
 */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../js/config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** ID del restaurante a mostrar. Sustitúyelo por el UUID real (ver nota arriba). */
export const RESTAURANT_ID = '123';

const TIMEOUT_MS = 8000;

// =============================================================================
// Manejo de errores
// =============================================================================

/** Error de la app con un `tipo` para decidir qué hacer (reintentar, avisar...). */
export class ErrorSupabase extends Error {
  constructor(tipo, mensaje, causa) {
    super(mensaje, { cause: causa });
    this.name = 'ErrorSupabase';
    this.tipo = tipo; // 'conexion' | 'timeout' | 'permiso' | 'validacion' | 'no_encontrado' | 'desconocido'
  }

  /** Solo los fallos de red/tiempo tienen sentido reintentarlos. */
  get reintentable() {
    return this.tipo === 'conexion' || this.tipo === 'timeout';
  }
}

/**
 * Convierte el `error` que devuelve supabase-js en un ErrorSupabase.
 * Ojo: supabase-js NO lanza excepciones, devuelve `{ data, error }`; y cuando
 * falla la red, `error.message` contiene el TypeError de fetch.
 */
function clasificarError(error) {
  const msg = `${error?.message ?? ''} ${error?.details ?? ''}`;

  // AbortSignal.timeout() produce un "TimeoutError"; supabase-js lo devuelve
  // como `error.message = 'TimeoutError: signal timed out'`.
  if (/^(TimeoutError|AbortError)$/.test(error?.name) || /timeout|timed out|abort/i.test(msg)) {
    return new ErrorSupabase('timeout', 'El servidor tardó demasiado en responder. Inténtalo de nuevo.', error);
  }
  if (!navigator.onLine || /failed to fetch|networkerror|load failed|fetch failed/i.test(msg)) {
    return new ErrorSupabase('conexion', 'No hay conexión con el servidor. Revisa tu internet.', error);
  }
  switch (error?.code) {
    case '42501':
      return new ErrorSupabase('permiso', 'No tienes permiso para esta acción. ¿Iniciaste sesión como dueño?', error);
    case 'PGRST116':
      return new ErrorSupabase('no_encontrado', 'El producto no existe o no te pertenece.', error);
    case '22P02':
      return new ErrorSupabase('validacion', 'El ID no tiene un formato válido (debe ser un UUID).', error);
    case '23514':
      return new ErrorSupabase('validacion', 'Algún valor no es válido (p. ej. precio negativo).', error);
    case '23502':
      return new ErrorSupabase('validacion', 'Falta un campo obligatorio.', error);
    case '23503':
      return new ErrorSupabase('validacion', 'La categoría no existe en este restaurante.', error);
  }
  return new ErrorSupabase('desconocido', error?.message || 'Error inesperado.', error);
}

/**
 * Ejecuta una consulta con tiempo límite y reintentos (backoff exponencial)
 * SOLO ante fallos de red. `crearConsulta` recibe un AbortSignal y debe
 * devolver la consulta de supabase-js (un "thenable" con { data, error }).
 *
 * No uses reintentos en INSERT: si la petición llegó pero la respuesta se
 * perdió, reintentar crearía el producto dos veces.
 */
async function ejecutar(crearConsulta, { reintentos = 2 } = {}) {
  for (let intento = 0; ; intento++) {
    let resultado;
    try {
      resultado = await crearConsulta(AbortSignal.timeout(TIMEOUT_MS));
    } catch (excepcion) {
      resultado = { data: null, error: excepcion }; // por si el SDK llegara a lanzar
    }
    if (!resultado.error) return resultado.data;

    const err = clasificarError(resultado.error);
    if (!err.reintentable || intento >= reintentos) throw err;

    const espera = 500 * 2 ** intento; // 500ms, 1s, 2s...
    console.warn(`[supabase] ${err.message} Reintento ${intento + 1}/${reintentos} en ${espera}ms`);
    await new Promise((r) => setTimeout(r, espera));
  }
}

// =============================================================================
// 1) Cargar productos y mostrarlos en el DOM
// =============================================================================

/** Lee los productos de un restaurante ordenados por categoría y posición. */
export async function obtenerProductos(restaurantId) {
  const filas = await ejecutar((signal) =>
    supabase
      .from('products')
      .select('id, name, description, price, image_url, is_available, category:categories(name)')
      .eq('restaurant_id', restaurantId)
      .order('position')
      .abortSignal(signal));
  // Postgres devuelve `numeric` como texto: lo convertimos a número.
  return filas.map((p) => ({ ...p, price: Number(p.price) }));
}

const formatoPrecio = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });

/** Crea el <li> de un producto. Usa textContent (no innerHTML) para evitar XSS. */
function crearItemProducto(producto) {
  const li = document.createElement('li');
  li.className = 'producto' + (producto.is_available ? '' : ' producto--agotado');
  li.dataset.id = producto.id;

  const nombre = document.createElement('strong');
  nombre.textContent = producto.name;

  const categoria = document.createElement('small');
  categoria.textContent = producto.category?.name ?? '';

  const precio = document.createElement('span');
  precio.className = 'producto__precio';
  precio.textContent = formatoPrecio.format(producto.price);

  const estado = document.createElement('span');
  estado.className = 'producto__estado';
  estado.textContent = producto.is_available ? 'Disponible' : 'Agotado';

  li.append(nombre, categoria, precio, estado);
  return li;
}

/** Muestra un mensaje de error en el contenedor, con botón de reintento si aplica. */
function mostrarError(contenedor, error, alReintentar) {
  const caja = document.createElement('div');
  caja.className = `alerta alerta--${error.tipo ?? 'desconocido'}`;
  caja.setAttribute('role', 'alert');
  caja.textContent = error.message;

  if (error.reintentable && alReintentar) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = 'Reintentar';
    boton.addEventListener('click', alReintentar);
    caja.append(' ', boton);
  }
  contenedor.replaceChildren(caja);
}

/**
 * Carga los productos y los pinta en `contenedor`.
 * Ante un fallo de conexión muestra el error, ofrece "Reintentar" y además
 * recarga sola cuando el navegador recupera la red.
 * `alMostrar(productos)` se ejecuta tras cada pintado correcto, también en
 * los reintentos (útil para añadir botones u otros extras a cada producto).
 */
export async function cargarProductos(contenedor, restaurantId = RESTAURANT_ID, { alMostrar } = {}) {
  contenedor.setAttribute('aria-busy', 'true');
  contenedor.textContent = 'Cargando productos…';

  try {
    const productos = await obtenerProductos(restaurantId);

    if (productos.length === 0) {
      contenedor.textContent = 'Este restaurante aún no tiene productos.';
      return [];
    }
    const lista = document.createElement('ul');
    lista.className = 'productos';
    lista.append(...productos.map(crearItemProducto));
    contenedor.replaceChildren(lista);
    alMostrar?.(productos);
    return productos;
  } catch (error) {
    console.error('[cargarProductos]', error.tipo, error.cause ?? error);
    const recargar = () => cargarProductos(contenedor, restaurantId, { alMostrar });
    mostrarError(contenedor, error, recargar);
    if (error.tipo === 'conexion') window.addEventListener('online', recargar, { once: true });
    return [];
  } finally {
    contenedor.removeAttribute('aria-busy');
  }
}

// =============================================================================
// 2) El dueño agrega un producto desde un formulario
// =============================================================================

/**
 * Lee el formulario, valida en el cliente y lo inserta.
 * Campos esperados: name, description, price, category_id, is_available (checkbox).
 * @returns {Promise<object>} el producto creado
 */
export async function agregarProducto(formulario, restaurantId = RESTAURANT_ID) {
  const datos = new FormData(formulario);
  const nuevo = {
    restaurant_id: restaurantId,
    category_id: datos.get('category_id'),
    name: String(datos.get('name') ?? '').trim(),
    description: String(datos.get('description') ?? '').trim() || null,
    price: Number(datos.get('price')),
    is_available: datos.get('is_available') !== null,
  };

  // Validación rápida en el cliente (la BD vuelve a validar con CHECKs).
  if (!nuevo.name) throw new ErrorSupabase('validacion', 'El nombre es obligatorio.');
  if (!Number.isFinite(nuevo.price) || nuevo.price < 0) {
    throw new ErrorSupabase('validacion', 'El precio debe ser un número mayor o igual a 0.');
  }
  if (!nuevo.category_id) throw new ErrorSupabase('validacion', 'Elige una categoría.');

  // reintentos: 0 → un INSERT no es idempotente (ver ejecutar()).
  const creado = await ejecutar(
    (signal) => supabase.from('products').insert(nuevo).select().single().abortSignal(signal),
    { reintentos: 0 },
  );
  return { ...creado, price: Number(creado.price) };
}

// =============================================================================
// 3) Actualizar el precio o marcar como "agotado"
// =============================================================================

/**
 * Actualiza el precio y/o la disponibilidad de un producto.
 *   actualizarProducto(id, { precio: 14.5 })
 *   actualizarProducto(id, { agotado: true })
 *   actualizarProducto(id, { precio: 9, agotado: false })
 *
 * Un UPDATE con valores fijos es idempotente, así que sí se reintenta.
 * Si RLS impide editarlo (no es tu producto), no se actualiza ninguna fila y
 * `.single()` devuelve PGRST116 → tipo 'no_encontrado'.
 */
export async function actualizarProducto(productId, { precio, agotado } = {}) {
  const cambios = {};
  if (precio !== undefined) {
    const valor = Number(precio);
    if (!Number.isFinite(valor) || valor < 0) {
      throw new ErrorSupabase('validacion', 'El precio debe ser un número mayor o igual a 0.');
    }
    cambios.price = valor;
  }
  if (agotado !== undefined) cambios.is_available = !agotado;
  if (Object.keys(cambios).length === 0) {
    throw new ErrorSupabase('validacion', 'No hay cambios que guardar.');
  }

  const actualizado = await ejecutar((signal) =>
    supabase
      .from('products')
      .update(cambios)
      .eq('id', productId)
      .select()
      .single()
      .abortSignal(signal));
  return { ...actualizado, price: Number(actualizado.price) };
}

/** Atajo: marcar un producto como agotado. */
export const marcarAgotado = (productId) => actualizarProducto(productId, { agotado: true });

// =============================================================================
// Ejemplos de uso (conectados en productos.html)
// =============================================================================
//
// const lista = document.querySelector('#productos');
// await cargarProductos(lista, RESTAURANT_ID);
//
// formulario.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   try {
//     await agregarProducto(formulario, RESTAURANT_ID);
//     formulario.reset();
//     await cargarProductos(lista, RESTAURANT_ID);
//   } catch (error) {
//     if (error.tipo === 'conexion' || error.tipo === 'timeout') {
//       alert(`${error.message} Tus datos siguen en el formulario.`);
//     } else if (error.tipo === 'permiso') {
//       location.href = 'admin.html'; // pedir inicio de sesión
//     } else {
//       alert(error.message);
//     }
//   }
// });
//
// try {
//   await actualizarProducto(id, { precio: 15 });
//   await marcarAgotado(id);
// } catch (error) {
//   console.error(error.tipo, error.message, error.cause);
// }
