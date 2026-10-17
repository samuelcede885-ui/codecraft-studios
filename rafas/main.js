(() => {
  // Set these when the real destinations exist. While empty, the page says the feature opens soon.
  const CONFIG = {
    orderUrl: '',        // e.g. your delivery / ordering page
    newsletterUrl: '',   // e.g. a form endpoint that accepts POST { email }
    price: 10.99,
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const money = n => n.toFixed(2);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionOK = () => !reduced.matches;
  if (motionOK()) document.documentElement.classList.add('has-motion');

  /* ---------- hero title fit: "MENTIROSA" spans the full width ---------- */
  const fitEl = $('[data-fit]');
  const title = $('.hero__title');
  function fitTitle() {
    const probe = 100;
    title.style.setProperty('--ts', probe + 'px');
    const w = fitEl.getBoundingClientRect().width;
    const avail = title.getBoundingClientRect().width;
    const size = Math.min(300, Math.floor(probe * avail / w * 0.995));
    document.documentElement.style.setProperty('--ts', size + 'px');
    title.style.removeProperty('--ts');
  }
  document.fonts?.ready.then(fitTitle);
  fitTitle();

  /* ---------- menu ---------- */
  const menuBtn = $('.nav__menu');
  const menu = $('#menu');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('a', menu).focus();
  }
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

  /* ---------- bag ---------- */
  let qtyInBag = 0;
  const bag = $('#bag');
  const scrim = $('.bag-scrim');
  const bagBtn = $('.nav__bag');
  const countEl = $('[data-bag-count]');
  function renderBag() {
    countEl.hidden = qtyInBag === 0;
    countEl.textContent = qtyInBag;
    bagBtn.setAttribute('aria-label', `Ver bolsa (${qtyInBag} ${qtyInBag === 1 ? 'producto' : 'productos'})`);
    $('[data-bag-empty]').hidden = qtyInBag > 0;
    $('[data-bag-line]').hidden = qtyInBag === 0;
    $('[data-bag-qty]').textContent = `× ${qtyInBag}`;
    $('[data-bag-sub]').textContent = money(qtyInBag * CONFIG.price);
    $('[data-bag-total]').textContent = money(qtyInBag * CONFIG.price);
  }
  function setBag(open) {
    bag.hidden = scrim.hidden = !open;
    if (open) $('.bag__close').focus(); else bagBtn.focus();
  }
  bagBtn.addEventListener('click', () => setBag(true));
  $$('[data-bag-close]').forEach(el => el.addEventListener('click', () => setBag(false)));
  $('[data-checkout]').addEventListener('click', () => {
    const note = $('[data-checkout-note]');
    if (qtyInBag === 0) { note.textContent = 'Agrega al menos una Mentirosa para continuar.'; return; }
    if (CONFIG.orderUrl) { location.href = CONFIG.orderUrl; return; }
    note.textContent = 'Los pedidos en línea abren pronto. Mientras tanto, pide en el local.';
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!menu.hidden) { setMenu(false); menuBtn.focus(); }
    if (!bag.hidden) setBag(false);
  });

  /* ---------- order card ---------- */
  const qty = $('#qty');
  $$('[data-step]').forEach(b => b.addEventListener('click', () => {
    qty.value = clamp((parseInt(qty.value, 10) || 1) + Number(b.dataset.step), 1, 20);
  }));
  $('[data-order]').addEventListener('submit', e => {
    e.preventDefault();
    const n = clamp(parseInt(qty.value, 10) || 1, 1, 20);
    qtyInBag = Math.min(99, qtyInBag + n);
    renderBag();
    countEl.classList.remove('is-bump'); void countEl.offsetWidth; countEl.classList.add('is-bump');
    $('[data-order-status]').textContent = `${n === 1 ? 'Agregaste 1 Mentirosa' : `Agregaste ${n} Mentirosas`} a tu bolsa.`;
  });

  /* ---------- newsletter ---------- */
  $('[data-newsletter]').addEventListener('submit', async e => {
    e.preventDefault();
    const input = $('#email');
    const status = $('[data-newsletter-status]');
    if (!input.checkValidity()) { status.textContent = 'Escribe un correo válido, por ejemplo tu@correo.com.'; input.focus(); return; }
    if (!CONFIG.newsletterUrl) { status.textContent = 'Las suscripciones abren pronto. Vuelve en unos días.'; return; }
    try {
      const res = await fetch(CONFIG.newsletterUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: input.value }) });
      if (!res.ok) throw new Error(res.status);
      status.textContent = 'Listo. Te llegará la próxima promo.';
      input.value = '';
    } catch {
      status.textContent = 'No pudimos guardar tu correo. Inténtalo de nuevo en un momento.';
    }
  });

  /* ---------- scroll + pointer scenes ---------- */
  const nav = $('#nav');
  const heroSubject = $('[data-parallax]');
  const heroEl = $('.hero');
  const layers = $('[data-scene="layers"]');
  const stage = $('[data-stage]');
  const phrases = $$('[data-phrase]');
  const callouts = $$('.callout');
  const dots = $$('.layers__progress li');
  const caption = $('[data-caption]');
  const statement = $('[data-scene="statement"]');
  const reveal = $('[data-scene="reveal"]');
  const zoomImg = $('[data-zoom]');
  const marquees = $$('[data-marquee]');
  const drift = $('[data-drift]');

  // progress of an element moving through the viewport: 0 entering at bottom → 1 leaving at top
  const through = el => {
    const r = el.getBoundingClientRect();
    return clamp((innerHeight - r.top) / (innerHeight + r.height));
  };

  let pointer = { x: 0, y: 0 }, smooth = { x: 0, y: 0 };
  const finePointer = matchMedia('(pointer: fine)');
  heroEl.addEventListener('pointermove', e => {
    if (!finePointer.matches || !motionOK()) return;
    pointer.x = e.clientX / innerWidth - .5;
    pointer.y = e.clientY / innerHeight - .5;
  }, { passive: true });
  heroEl.addEventListener('pointerleave', () => { pointer = { x: 0, y: 0 }; });

  let lastCaption = '';
  function frame() {
    nav.classList.toggle('is-scrolled', scrollY > 40);

    if (!motionOK()) {
      callouts.forEach(c => c.classList.add('is-on'));
      return;
    }

    // hero: burger lifts away faster than the title, plus a little pointer depth
    const hr = heroEl.getBoundingClientRect();
    const hp = clamp(-hr.top / hr.height);
    smooth.x = lerp(smooth.x, pointer.x, .08);
    smooth.y = lerp(smooth.y, pointer.y, .08);
    heroSubject.style.transform =
      `translate3d(${smooth.x * 18}px, ${smooth.y * 12 - hp * 140}px, 0) rotate(${hp * 6}deg)`;

    // layers: burger tumbles upright, then the six layers are called out one by one
    const lr = layers.getBoundingClientRect();
    const lp = clamp(-lr.top / (lr.height - innerHeight));
    const intro = ease(clamp(lp / .22));
    const outro = ease(clamp((lp - .9) / .1));
    stage.style.transform =
      `translate3d(0, ${lerp(90, 0, intro)}px, 0) rotate(${lerp(-16, 0, intro)}deg) scale(${lerp(.62, 1, intro) + outro * .06})`;
    const phase = lp < .3 ? 0 : lp < .6 ? 1 : 2;
    phrases.forEach((p, i) => p.classList.toggle('is-on', i === phase));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === phase));
    let latest = null;
    callouts.forEach((c, i) => {
      const on = lp > .26 + i * .1;
      c.classList.toggle('is-on', on);
      if (on) latest = c;
    });
    const text = latest ? $('.callout__label', latest).innerHTML : '';
    if (text !== lastCaption) { caption.innerHTML = text; lastCaption = text; }

    // statement: letters fill as the section crosses the middle of the screen
    statement.style.setProperty('--fill', (clamp((through(statement) - .2) / .45) * 100).toFixed(1) + '%');

    // split: burger drifts and turns
    const sp = through(drift.parentElement);
    drift.style.transform = `translate3d(0, ${lerp(60, -60, sp)}px, 0) rotate(${lerp(-6, 8, sp)}deg)`;

    // reveal: slow zoom into the layers, two marquee rows in opposite directions
    const rp = through(reveal);
    zoomImg.style.transform = `scale(${lerp(.82, 1.12, rp)})`;
    marquees.forEach(m => { m.style.transform = `translate3d(${Number(m.dataset.marquee) * lerp(-8, 22, rp)}%, 0, 0)`; });
  }

  let ticking = false;
  function loop() {
    frame();
    // keep easing the pointer parallax while it settles
    if (Math.abs(smooth.x - pointer.x) + Math.abs(smooth.y - pointer.y) > .001) requestAnimationFrame(loop);
    else ticking = false;
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(loop); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { fitTitle(); request(); });
  heroEl.addEventListener('pointermove', request, { passive: true });
  reduced.addEventListener?.('change', () => {
    document.documentElement.classList.toggle('has-motion', motionOK());
    if (!motionOK()) $$('[style*="transform"]').forEach(el => { el.style.transform = ''; });
    request();
  });

  renderBag();
  request();
})();
