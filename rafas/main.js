(() => {
  // Set these when the real destinations exist. While empty, the page says the feature opens soon.
  const CONFIG = {
    orderUrl: '',        // e.g. your delivery / ordering page
    newsletterUrl: '',   // e.g. a form endpoint that accepts POST { email }
    price: 10.99,
    // Turntable frames cut from the product video, in order. The last frame is the banner's angle.
    // Leave empty to fall back to turning the single photo in 3D.
    spinFrames: Array.from({ length: 96 }, (_, i) => `assets/360/mentirosa-${String(i).padStart(2, '0')}.webp`),
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

  /* ---------- 360° spinner ---------- */
  // With spinFrames it flips through real turntable photos; otherwise it stacks copies of the
  // single photo in depth and turns the stack in 3D, so the burger keeps some volume edge-on.
  function createSpinner(root) {
    const face = $('img', root);
    const frames = CONFIG.spinFrames;
    if (frames.length) {
      // The video covers half a turn, so one 360° of "angle" plays it forward and back:
      // 0° is the banner's angle (last frame), 180° the opposite end of the clip.
      const n = frames.length;
      const ready = new Array(n).fill(false);
      ready[n - 1] = true;
      frames.forEach((src, i) => {
        const img = new Image();
        img.onload = () => { ready[i] = true; };
        img.src = src;
      });
      let shown = n - 1;
      return {
        set(angle) {
          const turn = ((angle / 360) % 1 + 1) % 1;
          const there = turn < .5 ? turn * 2 : 2 - turn * 2;
          let i = Math.round((1 - there) * (n - 1));
          // while frames are still loading, hold the closest one that is ready
          for (let d = 0; !ready[i] && d < n; d++) {
            if (ready[i + d]) { i += d; break; }
            if (ready[i - d]) { i -= d; break; }
          }
          if (i !== shown && ready[i]) { face.src = frames[i]; shown = i; }
        },
      };
    }
    const SLICES = 26;
    const slices = [face];
    for (let i = 1; i < SLICES; i++) {
      const s = face.cloneNode();
      s.removeAttribute('fetchpriority');
      s.alt = '';
      s.className = 'spin__slice';
      s.setAttribute('aria-hidden', 'true');
      root.appendChild(s);
      slices.push(s);
    }
    function layout() {
      const half = root.offsetWidth * .09;
      slices.forEach((s, i) => {
        const t = i / (SLICES - 1);              // 0 = front face, 1 = back face
        s.style.transform = `translateZ(${(half - 2 * half * t).toFixed(1)}px)`;
        if (i) s.style.filter = `brightness(${(1 - .4 * Math.sin(Math.PI * t)).toFixed(2)})`;
      });
    }
    layout();
    addEventListener('resize', layout);
    return {
      set(angle, tilt = 0) { root.style.transform = `rotateX(${tilt}deg) rotateY(${angle}deg)`; },
    };
  }

  const heroSpin = createSpinner($('[data-spin="hero"]'));
  const layersSpin = createSpinner($('[data-spin="layers"]'));

  /* ---------- hero: turntable that the visitor can grab ---------- */
  const heroSubject = $('[data-parallax]');
  const heroEl = $('.hero');
  const AUTO_SPEED = 30;                         // degrees per second while idle
  let angle = 0, velocity = motionOK() ? 160 : 0, dragging = false, lastX = 0, lastMove = 0;

  heroSubject.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; lastMove = performance.now();
    heroSubject.setPointerCapture(e.pointerId);
    heroSubject.classList.add('is-dragging');
  });
  heroSubject.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now();
    const delta = (e.clientX - lastX) * .55;
    angle += delta;
    velocity = delta / Math.max(1, now - lastMove) * 1000;
    lastX = e.clientX; lastMove = now;
    heroSpin.set(angle, -4);
  });
  const release = () => { dragging = false; heroSubject.classList.remove('is-dragging'); };
  heroSubject.addEventListener('pointerup', release);
  heroSubject.addEventListener('pointercancel', release);

  let heroVisible = true, spinning = false, lastT = 0;
  function spinLoop(t) {
    const dt = Math.min(.05, (t - lastT) / 1000 || 0);
    lastT = t;
    if (!dragging) {
      const target = motionOK() ? AUTO_SPEED : 0;
      velocity += (target - velocity) * Math.min(1, dt * 1.6);
      angle += velocity * dt;
    }
    heroSpin.set(angle, -4);
    if (heroVisible) requestAnimationFrame(spinLoop); else spinning = false;
  }
  const startSpin = () => { if (!spinning) { spinning = true; lastT = performance.now(); requestAnimationFrame(spinLoop); } };
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (heroVisible) startSpin();
  }).observe(heroEl);
  startSpin();

  /* ---------- scroll scenes (only the burger moves; type stays put) ---------- */
  const nav = $('#nav');
  const layers = $('[data-scene="layers"]');
  const stage = $('[data-stage]');
  const callouts = $$('.callout');
  const caption = $('[data-caption]');
  const reveal = $('[data-scene="reveal"]');
  const zoomImg = $('[data-zoom]');
  const drift = $('[data-drift]');

  // progress of an element moving through the viewport: 0 entering at bottom → 1 leaving at top
  const through = el => {
    const r = el.getBoundingClientRect();
    return clamp((innerHeight - r.top) / (innerHeight + r.height));
  };

  let lastCaption = '';
  function frame() {
    nav.classList.toggle('is-scrolled', scrollY > 40);

    if (!motionOK()) {
      callouts.forEach(c => c.classList.add('is-on'));
      layersSpin.set(0);
      return;
    }

    // hero: burger lifts away as the banner scrolls out
    const hr = heroEl.getBoundingClientRect();
    heroSubject.style.transform = `translate3d(0, ${(-clamp(-hr.top / hr.height) * 140).toFixed(1)}px, 0)`;

    // layers: scroll turns the burger a full 360°, then the six layers are called out
    const lr = layers.getBoundingClientRect();
    const lp = clamp(-lr.top / (lr.height - innerHeight));
    const intro = ease(clamp(lp / .15));
    const turn = easeInOut(clamp((lp - .04) / .52));
    stage.style.transform = `translate3d(0, ${lerp(70, 0, intro).toFixed(1)}px, 0) scale(${lerp(.75, 1, intro).toFixed(3)})`;
    layersSpin.set(turn * 360, lerp(-10, 0, turn));
    let latest = null;
    callouts.forEach((c, i) => {
      const on = lp > .58 + i * .06;
      c.classList.toggle('is-on', on);
      if (on) latest = c;
    });
    const text = latest ? $('.callout__label', latest).innerHTML : '';
    if (text !== lastCaption) { caption.innerHTML = text; lastCaption = text; }

    // split: burger drifts and turns
    const sp = through(drift.parentElement);
    drift.style.transform = `translate3d(0, ${lerp(60, -60, sp)}px, 0) rotate(${lerp(-6, 8, sp)}deg)`;

    // reveal: slow zoom into the layers
    zoomImg.style.transform = `scale(${lerp(.82, 1.12, through(reveal))})`;
  }

  let ticking = false;
  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { frame(); ticking = false; });
  };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { fitTitle(); request(); });
  reduced.addEventListener?.('change', () => {
    document.documentElement.classList.toggle('has-motion', motionOK());
    if (!motionOK()) $$('[data-parallax], [data-stage], [data-drift], [data-zoom]').forEach(el => { el.style.transform = ''; });
    startSpin();
    request();
  });

  renderBag();
  request();
})();
