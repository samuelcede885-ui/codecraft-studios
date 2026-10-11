const PAPAS = { id: "acomp", title: "¿Papas O Aros?", choices: ["Papas", "Aros"] };
const PAN = { id: "pan", title: "¿Pan Regular O Sin Gluten?", choices: ["Regular", "Sin Gluten"] };

const PRODUCTS = [
  {
    id: "bacon-cloud",
    name: "Bacon Cloud Burger",
    category: "A Lo Que Se Vino",
    price: 11.99,
    img: "img/bacon-cloud.webp",
    cutout: true,
    desc: "Pan, carne de 130g, queso americano, queso crema aliñado, tocineta glaseada, wanton frito, rúcula, sirope de piña y aderezo Chicago.",
    options: [PAPAS, PAN],
  },
  {
    id: "la-mentirosa",
    name: "La Mentirosa",
    category: "A Lo Que Se Vino",
    price: 10.99,
    img: "img/la-mentirosa.webp",
    cutout: true,
    desc: "Como ya lo sabemos, todas mienten, lo único que no es mentira en esto es que tienes que disfrutar de esta combinación de este pan a base de cerveza y malta coronado de nuestra molienda de res especial y patty cremoso de parmigiano.",
    options: [PAN],
  },
  {
    id: "la-cabrona",
    name: "La Cabrona",
    category: "Promo",
    price: 14.99,
    img: "img/la-cabrona.webp",
    cutout: true,
    desc: "Pan, carne de 200g, patty de queso de cabra con yerbas, champiñones al ajillo, compota bourbon, mostaza miel y coronada con queso Mozzarella.",
    options: [PAPAS],
  },
  {
    id: "trufalina-chicken",
    name: "Trufalina Chicken",
    category: "Por Aquí Sandwich",
    price: 10.99,
    img: "img/trufalina-chicken.webp",
    cutout: false,
    desc: "Pechuga de pollo crispy, coronada en queso suizo, hongos salteados al ajillo, tocineta, huevo y aderezo.",
    options: [],
  },
  {
    id: "la-antiburger",
    name: "La AntiBurger",
    category: "A Lo Que Se Vino",
    price: 11.99,
    img: "img/la-antiburger.webp",
    cutout: false,
    desc: "Nuestro pan de masa madre, molienda de res especial, parte de mezcla de quesos, tocineta, cebolla crispy, pepinillos y aderezo de pimientos asados. Acompañada con papas o aros de cebolla.",
    options: [PAPAS],
  },
];

const CATEGORIES = ["Todos", "A Lo Que Se Vino", "Promo", "Por Aquí Sandwich"];
const $ = (s) => document.querySelector(s);
const fmt = (n) => `REF ${n.toFixed(2)}`;
const byId = (id) => PRODUCTS.find((p) => p.id === id);

/* ---------- Menu grid ---------- */
let activeCat = "Todos";

function renderChips() {
  $("#chips").innerHTML = CATEGORIES.map(
    (c) => `<button class="chip" role="tab" aria-selected="${c === activeCat}" data-cat="${c}">${c}</button>`
  ).join("");
}

function renderGrid() {
  const list = activeCat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat);
  $("#grid").innerHTML = list
    .map(
      (p) => `
      <button class="card" data-open="${p.id}" aria-label="${p.name}, ${fmt(p.price)}">
        <div class="card-media ${p.cutout ? "" : "photo"}"><img src="${p.img}" alt="" loading="lazy"></div>
        <div class="card-info"><h3>${p.name}</h3><span>${fmt(p.price)}</span></div>
      </button>`
    )
    .join("");
}

function setCategory(cat) {
  activeCat = cat === "todos" ? "Todos" : cat;
  renderChips();
  renderGrid();
}

$("#chips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (chip) setCategory(chip.dataset.cat);
});

/* ---------- Overlays ---------- */
function open(el) {
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
}
function close(el) {
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".sheet.open, .drawer.open")) document.body.classList.remove("lock");
}
document.querySelectorAll(".sheet, .drawer").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (e.target === el || e.target.closest("[data-close]")) close(el);
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".sheet.open, .drawer.open").forEach(close);
});

$("#menuBtn").addEventListener("click", () => open($("#navDrawer")));
$("#navDrawer").addEventListener("click", (e) => {
  const link = e.target.closest("[data-cat]");
  if (!link) return;
  setCategory(link.dataset.cat);
  close($("#navDrawer"));
});

/* ---------- Product sheet ---------- */
let current = null;
let qty = 1;

function openProduct(id) {
  current = byId(id);
  qty = 1;
  $("#qtyVal").textContent = qty;
  const media = $("#sheetImg").parentElement;
  media.classList.toggle("photo", !current.cutout);
  $("#sheetImg").src = current.img;
  $("#sheetImg").alt = current.name;
  $("#sheetCat").innerHTML = `Todos &gt; <b>${current.category}</b>`;
  $("#sheetTitle").textContent = current.name;
  $("#sheetDesc").textContent = current.desc;
  $("#sheetPrice").textContent = fmt(current.price);
  $("#sheetForm").innerHTML = current.options
    .map(
      (o) => `
      <fieldset class="opt" data-opt="${o.id}">
        <div class="opt-head">
          <strong>${o.title} <small>(<span class="n">0</span>/1)</small></strong>
          <span class="tag">Obligatorio</span>
        </div>
        <div class="opt-box">
          ${o.choices
            .map((c) => `<label>${c}<input type="radio" name="${o.id}" value="${c}"></label>`)
            .join("")}
        </div>
      </fieldset>`
    )
    .join("");
  updateAddBtn();
  open($("#sheet"));
}

function updateAddBtn() {
  const form = $("#sheetForm");
  let complete = true;
  form.querySelectorAll(".opt").forEach((fs) => {
    const chosen = fs.querySelector("input:checked");
    fs.querySelector(".n").textContent = chosen ? 1 : 0;
    const tag = fs.querySelector(".tag");
    tag.classList.toggle("ok", !!chosen);
    tag.textContent = chosen ? "Listo" : "Obligatorio";
    if (!chosen) complete = false;
  });
  const btn = $("#addBtn");
  btn.disabled = !complete;
  btn.textContent = `Agregar · ${fmt(current.price * qty)}`;
}

$("#sheetForm").addEventListener("change", updateAddBtn);
$("#qtyMinus").addEventListener("click", () => {
  qty = Math.max(1, qty - 1);
  $("#qtyVal").textContent = qty;
  updateAddBtn();
});
$("#qtyPlus").addEventListener("click", () => {
  qty = Math.min(20, qty + 1);
  $("#qtyVal").textContent = qty;
  updateAddBtn();
});

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-open]");
  if (trigger) openProduct(trigger.dataset.open);
});

/* ---------- Cart ---------- */
const cart = [];

$("#addBtn").addEventListener("click", () => {
  const choices = [...$("#sheetForm").querySelectorAll("input:checked")].map((i) => i.value);
  const key = current.id + "|" + choices.join("|");
  const line = cart.find((l) => l.key === key);
  if (line) line.qty += qty;
  else cart.push({ key, id: current.id, choices, qty });
  renderCart();
  close($("#sheet"));
  toast(`${current.name} agregada al carrito`);
});

function renderCart() {
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const total = cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
  const badge = $("#cartCount");
  badge.hidden = count === 0;
  badge.textContent = count;
  $("#cartEmpty").hidden = cart.length > 0;
  $("#cartTotal").textContent = fmt(total);
  $("#checkoutBtn").disabled = cart.length === 0;
  $("#cartList").innerHTML = cart
    .map((l, i) => {
      const p = byId(l.id);
      return `<li>
        <img src="${p.img}" alt="" class="${p.cutout ? "" : "photo-thumb"}">
        <div><b>${l.qty} × ${p.name}</b><small>${l.choices.join(" · ") || "&nbsp;"}</small>
          <button class="remove" data-remove="${i}">Quitar</button></div>
        <span class="line-price">${fmt(l.qty * p.price)}</span>
      </li>`;
    })
    .join("");
}

$("#cartList").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  cart.splice(Number(btn.dataset.remove), 1);
  renderCart();
});
$("#cartBtn").addEventListener("click", () => open($("#cart")));
$("#checkoutBtn").addEventListener("click", () => {
  cart.length = 0;
  renderCart();
  close($("#cart"));
  toast("¡Pedido recibido! Gracias por elegir Rafa's");
});

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

renderChips();
renderGrid();
renderCart();
