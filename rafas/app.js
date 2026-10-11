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

const HERO_IDS = ["bacon-cloud", "la-cabrona", "la-mentirosa"];
const FEATURED_ID = "la-cabrona";
const CATEGORIES = [
  { name: "Todos", img: "img/bacon-cloud.webp", cutout: true },
  { name: "A Lo Que Se Vino", img: "img/la-mentirosa.webp", cutout: true },
  { name: "Promo", img: "img/la-cabrona.webp", cutout: true },
  { name: "Por Aquí Sandwich", img: "img/trufalina-chicken.webp", cutout: false },
];

const $ = (s) => document.querySelector(s);
const fmt = (n) => `REF ${n.toFixed(2)}`;
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const ARROW = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const PLUS = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
const HEART = `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`;

function store(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/* ---------- Hero carousel ---------- */
const slides = $("#slides");
slides.innerHTML = HERO_IDS.map((id) => {
  const p = byId(id);
  return `<button class="slide" data-open="${p.id}" aria-label="${p.name}">
    <img src="${p.img}" alt="${p.name}">
    <span class="slide-tag">${p.name}<b>${fmt(p.price)}</b></span>
  </button>`;
}).join("");
$("#dots").innerHTML = HERO_IDS.map((_, i) => `<button aria-label="Ir a la imagen ${i + 1}" data-dot="${i}"></button>`).join("");

let slideIdx = 0;
function markDot() {
  slideIdx = Math.round(slides.scrollLeft / slides.clientWidth);
  document.querySelectorAll("[data-dot]").forEach((d, i) => d.classList.toggle("on", i === slideIdx));
}
function goSlide(i) {
  slides.scrollTo({ left: i * slides.clientWidth, behavior: "smooth" });
}
slides.addEventListener("scroll", () => requestAnimationFrame(markDot), { passive: true });
$("#dots").addEventListener("click", (e) => {
  const d = e.target.closest("[data-dot]");
  if (d) goSlide(Number(d.dataset.dot));
});
let autoplay = setInterval(() => goSlide((slideIdx + 1) % HERO_IDS.length), 4500);
slides.addEventListener("pointerdown", () => clearInterval(autoplay), { once: true });
markDot();

/* ---------- Featured ---------- */
(() => {
  const p = byId(FEATURED_ID);
  $("#featured").innerHTML = `
    <div class="featured-media"><img src="${p.img}" alt="${p.name}"></div>
    <div class="featured-info">
      <span class="kicker">${p.category}</span>
      <h3>${p.name}</h3>
      <p>Carne de 200g, queso de cabra con yerbas y compota bourbon.</p>
      <div class="featured-foot">
        <strong>${fmt(p.price)}</strong>
        <button class="round-btn" data-open="${p.id}" aria-label="Ver ${p.name}">${ARROW}</button>
      </div>
    </div>`;
})();

/* ---------- Categories + grid ---------- */
let activeCat = "Todos";
let favsOnly = false;
let favs = new Set(store("rafas-favs", []));

function renderTiles() {
  $("#tiles").innerHTML = CATEGORIES.map(
    (c) => `<button class="tile ${!favsOnly && c.name === activeCat ? "active" : ""}" data-cat="${c.name}">
      <div class="tile-img ${c.cutout ? "" : "photo"}"><img src="${c.img}" alt="" loading="lazy"></div>
      <span>${c.name}</span>
    </button>`
  ).join("");
  $("#drawerList").innerHTML = CATEGORIES.map(
    (c) => `<li><a href="#menu" data-cat="${c.name}">${c.name}<span aria-hidden="true">›</span></a></li>`
  ).join("");
}

function renderGrid() {
  let list = favsOnly ? PRODUCTS.filter((p) => favs.has(p.id)) : PRODUCTS;
  if (!favsOnly && activeCat !== "Todos") list = list.filter((p) => p.category === activeCat);
  $("#menuSub").textContent = favsOnly ? "Tus favoritos" : activeCat;
  $("#gridEmpty").hidden = list.length > 0;
  $("#grid").innerHTML = list
    .map(
      (p) => `
      <article class="card">
        <button class="card-open" data-open="${p.id}">
          <div class="card-media ${p.cutout ? "" : "photo"}"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
          <div class="card-body">
            <span class="card-cat">${p.category}</span>
            <h3>${p.name}</h3>
            <span class="card-price">${fmt(p.price)}</span>
          </div>
        </button>
        <button class="fav" data-fav="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="Favorito">${HEART}</button>
        <span class="round-btn" aria-hidden="true">${PLUS}</span>
      </article>`
    )
    .join("");
}

function showCategory(cat) {
  activeCat = cat;
  favsOnly = false;
  setTab("menu");
  renderTiles();
  renderGrid();
  $("#menu").scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("click", (e) => {
  const catEl = e.target.closest("[data-cat]");
  if (catEl) {
    e.preventDefault();
    close($("#navDrawer"));
    showCategory(catEl.dataset.cat);
    return;
  }
  const favEl = e.target.closest("[data-fav]");
  if (favEl) {
    const id = favEl.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    save("rafas-favs", [...favs]);
    renderGrid();
    return;
  }
  const openEl = e.target.closest("[data-open]");
  if (openEl) {
    close($("#search"));
    openProduct(openEl.dataset.open);
    return;
  }
  if (e.target.closest("[data-cart]")) open($("#cart"));
});

/* ---------- Tab bar ---------- */
function setTab(name) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
}
document.querySelector(".tabbar").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab || tab.dataset.tab === "cart") return;
  setTab(tab.dataset.tab);
  if (tab.dataset.tab === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    favsOnly = tab.dataset.tab === "favs";
    if (!favsOnly) activeCat = "Todos";
    renderTiles();
    renderGrid();
    $("#menu").scrollIntoView({ behavior: "smooth" });
  }
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

/* ---------- Search ---------- */
function thumb(p) {
  return `<img class="thumb ${p.cutout ? "" : "photo"}" src="${p.img}" alt="">`;
}
function renderSearch() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => !q || (p.name + " " + p.desc + " " + p.category).toLowerCase().includes(q));
  $("#searchList").innerHTML = list.length
    ? list.map((p) => `<li><button data-open="${p.id}">${thumb(p)}<span><b>${p.name}</b><small>${p.category}</small></span><b>${fmt(p.price)}</b></button></li>`).join("")
    : `<li class="empty">Nada por aquí. Prueba con “tocineta” o “queso”.</li>`;
}
$("#searchBtn").addEventListener("click", () => {
  $("#searchInput").value = "";
  renderSearch();
  open($("#search"));
  setTimeout(() => $("#searchInput").focus(), 300);
});
$("#searchInput").addEventListener("input", renderSearch);

/* ---------- Product sheet ---------- */
let current = null;
let qty = 1;

function openProduct(id) {
  current = byId(id);
  qty = 1;
  $("#qtyVal").textContent = qty;
  $("#sheetImg").parentElement.classList.toggle("photo", !current.cutout);
  $("#sheetImg").src = current.img;
  $("#sheetImg").alt = current.name;
  $("#sheetCat").innerHTML = `Todos › <b>${current.category}</b>`;
  $("#sheetTitle").textContent = current.name;
  $("#sheetDesc").textContent = current.desc;
  $("#sheetPrice").textContent = fmt(current.price);
  $("#sheetForm").innerHTML = current.options
    .map(
      (o) => `
      <fieldset class="opt">
        <div class="opt-head">
          <strong>${o.title} <small>(<span class="n">0</span>/1)</small></strong>
          <span class="tag">Obligatorio</span>
        </div>
        <div class="opt-box">
          ${o.choices.map((c) => `<label>${c}<input type="radio" name="${o.id}" value="${c}"></label>`).join("")}
        </div>
      </fieldset>`
    )
    .join("");
  updateAddBtn();
  open($("#sheet"));
}

function updateAddBtn() {
  let complete = true;
  $("#sheetForm").querySelectorAll(".opt").forEach((fs) => {
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

/* ---------- Cart ---------- */
const cart = store("rafas-cart", []).filter((l) => byId(l.id));

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
  save("rafas-cart", cart);
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const total = cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0);
  document.querySelectorAll("[data-count]").forEach((b) => {
    b.hidden = count === 0;
    b.textContent = count;
  });
  $("#cartEmpty").hidden = cart.length > 0;
  $("#cartTotal").textContent = fmt(total);
  $("#checkoutBtn").disabled = cart.length === 0;
  $("#cartList").innerHTML = cart
    .map((l, i) => {
      const p = byId(l.id);
      return `<li>
        ${thumb(p)}
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

renderTiles();
renderGrid();
renderCart();
