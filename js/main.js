(() => {
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data ---------- */
  const C = { oceano: '#19587B', crema: '#F6EEDE', cielo: '#85B2CF', tinta: '#061C4B' };

  const featured = [
    { url: 'aurora-cafe.com',     tag: 'Web corporativa', title: 'Aurora Café',    text: 'Una web cálida con reservas online y carta digital.', bg: C.crema, fg: C.tinta, acc: C.oceano, acc2: C.cielo },
    { url: 'app.movefit.es',      tag: 'App iOS & Android', title: 'MoveFit',      text: 'Entrenamientos personalizados y seguimiento diario.', bg: C.tinta, fg: C.crema, acc: C.cielo, acc2: C.oceano },
    { url: 'nordica-shop.com',    tag: 'Tienda online',   title: 'Nórdica Home',   text: 'E‑commerce rápido con pagos en un clic.',             bg: C.cielo, fg: C.tinta, acc: C.crema, acc2: C.oceano },
    { url: 'legalia.app',         tag: 'Plataforma SaaS', title: 'Legalia',        text: 'Panel de gestión para despachos de abogados.',       bg: C.oceano, fg: C.crema, acc: C.crema, acc2: C.cielo },
  ];

  const projects = [
    { type: 'web',  title: 'Aurora Café',     place: 'Madrid, España',  stars: 5, desc: 'Web de reservas con carta digital y pedidos para llevar.', g: [C.cielo, C.oceano],  fg: C.crema, acc: C.oceano, acc2: C.cielo },
    { type: 'app',  title: 'MoveFit',         place: 'Valencia, España',stars: 5, desc: 'App de entrenamiento con planes a medida y retos semanales.', g: [C.oceano, C.tinta], fg: C.crema, acc: C.cielo, acc2: C.oceano },
    { type: 'shop', title: 'Nórdica Home',    place: 'Barcelona, España',stars: 4, desc: 'Tienda de decoración con +2.000 productos y envío exprés.', g: [C.crema, C.cielo], fg: '#FFFFFF', acc: C.oceano, acc2: C.cielo },
    { type: 'web',  title: 'Legalia',         place: 'Ciudad de México',stars: 5, desc: 'Plataforma para despachos: clientes, citas y facturas.',      g: [C.tinta, C.oceano], fg: C.crema, acc: C.tinta, acc2: C.cielo },
    { type: 'app',  title: 'Ruta Verde',      place: 'Bogotá, Colombia',stars: 4, desc: 'App de rutas en bici con mapas offline y comunidad.',        g: [C.cielo, C.crema], fg: '#FFFFFF', acc: C.oceano, acc2: C.tinta },
    { type: 'shop', title: 'Mar de Lino',     place: 'Lisboa, Portugal',stars: 5, desc: 'Moda sostenible: catálogo, tallas inteligentes y checkout.',  g: [C.oceano, C.cielo], fg: C.crema, acc: C.tinta, acc2: C.cielo },
    { type: 'web',  title: 'Clínica Dental Sol', place: 'Sevilla, España',stars: 5, desc: 'Citas online y un diseño que transmite confianza.',        g: [C.crema, C.oceano], fg: '#FFFFFF', acc: C.oceano, acc2: C.crema },
    { type: 'app',  title: 'Pagaré',          place: 'Buenos Aires, Argentina',stars: 4, desc: 'Finanzas personales: gastos compartidos sin líos.',    g: [C.tinta, C.cielo], fg: C.crema, acc: C.oceano, acc2: C.cielo },
  ];

  const typeMeta = {
    web:  { label: 'Web',        icon: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 9h18" stroke="currentColor" stroke-width="2"/></svg>' },
    app:  { label: 'App',        icon: '<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>' },
    shop: { label: 'E‑commerce', icon: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>' },
  };

  /* ---------- Hero slider ---------- */
  const slidesEl = document.querySelector('[data-slides]');
  const urlEl = document.querySelector('[data-slide-url]');
  const countEl = document.querySelector('[data-count]');
  const totalEl = document.querySelector('[data-total]');
  const phoneEl = document.querySelector('[data-phone]');

  slidesEl.innerHTML = featured.map((s, i) => `
    <div class="slide${i === 0 ? ' is-active' : ''}" style="background:${s.bg};color:${s.fg}" aria-hidden="${i !== 0}">
      <div>
        <p class="slide__tag">${s.tag}</p>
        <p class="slide__h">${s.title}</p>
        <p class="slide__p">${s.text}</p>
        <span class="slide__btn" style="background:${s.acc};color:${s.bg}">Ver proyecto</span>
      </div>
      <div class="slide__art" style="background:${s.acc2}">
        <span style="position:absolute;left:12%;top:14%;width:46%;height:40%;border-radius:10px;background:${s.acc}"></span>
        <span style="position:absolute;right:10%;bottom:12%;width:38%;height:30%;border-radius:10px;background:${s.fg};opacity:.85"></span>
      </div>
    </div>`).join('');
  totalEl.textContent = String(featured.length).padStart(2, '0');

  phoneEl.innerHTML = `
    <span class="p-hero"></span>
    <span class="p-line" style="top:54%;width:70%"></span>
    <span class="p-line" style="top:60%;width:50%"></span>
    <span class="p-line" style="top:66%;width:62%"></span>
    <span class="p-cta"></span>`;

  const slides = [...slidesEl.children];
  let current = 0;
  let timer;

  function paintPhone(s) {
    phoneEl.style.backgroundColor = s.bg;
    phoneEl.style.color = s.fg;
    phoneEl.querySelector('.p-hero').style.backgroundColor = s.acc2;
    phoneEl.querySelector('.p-cta').style.backgroundColor = s.acc;
  }

  function go(next) {
    next = (next + slides.length) % slides.length;
    if (next === current) return;
    const prev = slides[current];
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    prev.setAttribute('aria-hidden', 'true');
    setTimeout(() => prev.classList.remove('is-leaving'), 500);
    slides[next].classList.add('is-active');
    slides[next].setAttribute('aria-hidden', 'false');
    current = next;
    urlEl.textContent = featured[current].url;
    countEl.textContent = String(current + 1).padStart(2, '0');
    paintPhone(featured[current]);
  }

  function autoplay() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => go(current + 1), 5000);
  }

  document.querySelector('[data-prev]').addEventListener('click', () => { go(current - 1); autoplay(); });
  document.querySelector('[data-next]').addEventListener('click', () => { go(current + 1); autoplay(); });
  paintPhone(featured[0]);
  autoplay();

  /* ---------- Menu ---------- */
  const menuBtn = document.querySelector('.nav__menu');
  const menu = document.getElementById('menu');
  const setMenu = open => { menu.hidden = !open; menuBtn.setAttribute('aria-expanded', String(open)); };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('#menu, .nav__menu')) setMenu(false); });

  /* ---------- Project grid ---------- */
  const grid = document.querySelector('[data-grid]');
  const art = p => {
    const vars = `--fg:${p.fg};--acc:${p.acc};--acc2:${p.acc2}`;
    if (p.type === 'app') return `<span class="art-app" style="${vars}"></span>`;
    if (p.type === 'shop') return `<span class="art-shop" style="${vars}"><i></i><i></i><i></i><i></i></span>`;
    return `<span class="art-web" style="${vars}"></span>`;
  };
  grid.innerHTML = projects.map(p => `
    <article class="card" data-type="${p.type}">
      <div class="card__art" style="background:linear-gradient(160deg, ${p.g[0]}, ${p.g[1]})">${art(p)}</div>
      <span class="card__chip">${typeMeta[p.type].icon}${typeMeta[p.type].label}</span>
      <div class="card__body">
        <div class="card__stars" aria-label="${p.stars} de 5 estrellas">${'★'.repeat(p.stars)}<i>${'★'.repeat(5 - p.stars)}</i></div>
        <h3 class="card__title">${p.title}</h3>
        <p class="card__desc">${p.desc} <br>${p.place}</p>
      </div>
    </article>`).join('');

  const cards = [...grid.children];
  document.querySelectorAll('[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(c => {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-selected', String(c === chip));
      });
      const f = chip.dataset.filter;
      let i = 0;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.type === f;
        card.classList.toggle('is-hidden', !show);
        card.classList.remove('is-entering');
        if (show) {
          card.style.setProperty('--i', i++);
          void card.offsetWidth; // restart animation
          card.classList.add('is-entering');
        }
      });
    });
  });

  /* ---------- Quote form ---------- */
  const form = document.querySelector('.quote');
  const msg = form.querySelector('.quote__msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    msg.textContent = `¡Gracias! Te enviaremos un presupuesto para tu ${String(data.get('tipo')).toLowerCase()} en menos de 24 h.`;
  });

  /* ---------- Scroll reveal + counters ---------- */
  const revealTargets = document.querySelectorAll('.section__head, .quote, .card, .stat, .step, .footer > :not(.footer__bottom)');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const countUp = el => {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    if (reduceMotion) { el.textContent = to.toFixed(dec); return; }
    const dur = 1200;
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = (to * eased).toFixed(dec);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // stagger siblings that enter together
        const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 60}ms`;
        el.classList.add('is-visible');
        // hand control back to the element's own transitions (e.g. card hover)
        setTimeout(() => { el.classList.remove('reveal', 'is-visible'); el.style.transitionDelay = ''; }, 1100);
        el.querySelectorAll('[data-to]').forEach(countUp);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-to]').forEach(countUp);
  }

  document.querySelector('[data-year]').textContent = new Date().getFullYear();
})();
