import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bike,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Flame,
  Info,
  Instagram,
  Loader2,
  MapPin,
  MessageCircle,
  Minus,
  Pencil,
  Plus,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';

/* ==========================================================================
   RAFA'S CASUAL FOOD — "Un concepto de locos" by @rafacheff
   Single-file React app · Tailwind CSS · Lucide Icons
   ========================================================================== */

const ASSET = '/assets';

const BRAND = {
  white: '#FFFFFF',
  mist: '#F8F7FC',
  royal: '#5B21B6',
  violet: '#6D28D9',
  ink: '#1E1035',
  lavender: '#EDE9FE',
  gold: '#F59E0B',
};

// Datos de pago de ejemplo — reemplazar por los datos reales de la empresa antes de producción.
const PAYMENT_INFO = {
  pagoMovil: { bank: 'Banesco (0134)', rif: 'J-50123456-7', phone: '0414-7232766', holder: "Rafa's Casual Food C.A." },
  zelle: { email: 'pagos@rafascasualfood.com', holder: "Rafa's Casual Food LLC" },
};

const CITIES = [
  { id: 'caracas', name: 'Caracas', store: 'Las Mercedes', hours: '12:00 m – 11:00 pm', whatsapp: '584147232766' },
  { id: 'valencia', name: 'Valencia', store: 'Naguanagua · Av. Universidad', hours: '12:00 m – 11:00 pm', whatsapp: '584147232767' },
  { id: 'maracay', name: 'Maracay', store: 'Av. Las Delicias', hours: '12:00 m – 10:30 pm', whatsapp: '584147232768' },
  { id: 'barquisimeto', name: 'Barquisimeto', store: 'Av. Lara · Este', hours: '12:00 m – 10:30 pm', whatsapp: '584147232769' },
  { id: 'margarita', name: 'Margarita', store: 'Pampatar · Costa Azul', hours: '12:00 m – 11:30 pm', whatsapp: '584147232770' },
];

const VE_BANKS = [
  'Banesco (0134)',
  'Banco de Venezuela (0102)',
  'Mercantil (0105)',
  'Provincial BBVA (0108)',
  'BNC (0191)',
  'Bancamiga (0172)',
  'Banco del Tesoro (0163)',
  'Bancaribe (0114)',
  'Banplus (0174)',
  'Banco Exterior (0115)',
  'Venezolano de Crédito (0104)',
  'Otro banco',
];

const CATEGORIES = [
  { id: 'top', label: 'Más Vendidos', emoji: '🔥' },
  { id: 'burgers', label: 'Smash Burgers', emoji: '🍔' },
  { id: 'fajitas', label: 'Las Fajitas', emoji: '🌮' },
  { id: 'sides', label: 'Combos & Sides', emoji: '🍟' },
  { id: 'drinks', label: 'Bebidas & Postres', emoji: '🥤' },
];

const SIZES = [
  { id: 'simple', label: 'Simple', patties: 1, delta: -2.0, note: '1 carne · 90g' },
  { id: 'doble', label: 'Doble', patties: 2, delta: 0, note: '2 carnes · 180g' },
  { id: 'triple', label: 'Triple', patties: 3, delta: 2.5, note: '3 carnes · 270g' },
];

const EXTRAS = [
  { id: 'queso', label: 'Extra Queso Americano', price: 1.5, emoji: '🧀' },
  { id: 'tocineta', label: 'Extra Tocineta Crispy', price: 2.0, emoji: '🥓' },
  { id: 'aros', label: 'Aros de Cebolla', price: 1.5, emoji: '🧅' },
  { id: 'salsa', label: "Salsa Rafa's Extra", price: 1.0, emoji: '🥫' },
];

const REMOVALS = [
  { id: 'cebolla', label: 'Sin cebolla' },
  { id: 'pepinillos', label: 'Sin pepinillos' },
  { id: 'salsa', label: 'Sin salsa' },
];

const COMBO_PRICE = 3.5;
const DELIVERY_FEE = 2.5;
const FREE_DELIVERY_FROM = 35;

const PRODUCTS = [
  {
    id: 'original',
    name: "La Rafa's Original Smash",
    short: 'La que empezó la locura.',
    description:
      'Pan brioche, doble carne smash 180g con bordes tostados, aros de cebolla crispy, pepinillos, salsa blanca de la casa y relish rojo.',
    price: 8.99,
    categories: ['top', 'burgers'],
    kind: 'burger',
    defaultSize: 'doble',
    image: `${ASSET}/original.webp`,
    badge: 'La Original',
    heroWord: 'SMASH',
    heroTag: 'B FEST 2023',
    kcal: 980,
  },
  {
    id: 'bulldog',
    name: 'La Bulldog Bacon Master',
    short: 'Ganadora B Master 2024.',
    description:
      'Triple smash, mermelada de tocineta, queso cheddar fundido y salsa ahumada. Pesada, jugosa y sin pedir permiso.',
    price: 11.99,
    categories: ['top', 'burgers'],
    kind: 'burger',
    defaultSize: 'triple',
    image: `${ASSET}/bulldog.webp`,
    badge: '🏆 B Master 2024',
    heroWord: 'CHAMPION',
    heroTag: 'B MASTER 2024',
    kcal: 1340,
  },
  {
    id: 'chefs',
    name: "La Chef's Choice 2025",
    short: "Chef's Choice La Copa 2025.",
    description:
      'Doble smash, queso americano, cebolla caramelizada en reducción especial, mayo-trufa y pan brioche dorado.',
    price: 10.49,
    categories: ['top', 'burgers'],
    kind: 'burger',
    defaultSize: 'doble',
    image: `${ASSET}/chefs.webp`,
    badge: "Chef's Choice",
    heroWord: 'LOCURA',
    heroTag: 'LA COPA 2025',
    kcal: 1120,
  },
  {
    id: 'crispy',
    name: 'Crispy Chicken & Smash',
    short: 'Lo mejor de dos mundos.',
    description:
      'Pollo crispy con carne smash, lechuga fresca, pepinillos y salsa especial en pan brioche tostado.',
    price: 9.99,
    categories: ['burgers'],
    kind: 'burger',
    defaultSize: 'doble',
    image: `${ASSET}/exploded.webp`,
    badge: 'Nuevo',
    kcal: 1060,
  },
  {
    id: 'fajitas',
    name: "Las Famosas Fajitas de Rafa's",
    short: 'Para compartir (o no).',
    description:
      'Tiras de lomito y pollo salteadas al grill con pimentón y cebolla, tortillas calientes y salsas de la casa.',
    price: 12.99,
    categories: ['top', 'fajitas'],
    kind: 'other',
    art: { emoji: '🌮', bg: 'from-amber-200 via-orange-200 to-rose-200', sub: '🫑' },
    badge: 'Para 2',
    kcal: 1250,
  },
  {
    id: 'papas',
    name: "Papas Rafa's Loaded",
    short: 'Queso, tocineta y más queso.',
    description:
      "Papas fritas crujientes bañadas en queso fundido, trozos de tocineta y salsa Rafa's.",
    price: 5.49,
    categories: ['top', 'sides'],
    kind: 'other',
    art: { emoji: '🍟', bg: 'from-yellow-200 via-amber-200 to-orange-200', sub: '🧀' },
    kcal: 720,
  },
  {
    id: 'aros',
    name: 'Tequeños & Onion Rings Combo',
    short: 'El clásico venezolano + crunch.',
    description:
      '6 tequeños de queso blanco y aros de cebolla ultra crujientes con dip de la casa.',
    price: 5.99,
    categories: ['sides'],
    kind: 'other',
    art: { emoji: '🧅', bg: 'from-orange-100 via-amber-100 to-yellow-200', sub: '🧀' },
    kcal: 640,
  },
  {
    id: 'shake',
    name: 'Milkshake Morado Oreo',
    short: 'Morado como la marca.',
    description: 'Malteada cremosa de vainilla y moras con galleta Oreo triturada y crema batida.',
    price: 4.99,
    categories: ['top', 'drinks'],
    kind: 'other',
    art: { emoji: '🥤', bg: 'from-violet-300 via-fuchsia-200 to-purple-200', sub: '🍪' },
    badge: 'Favorito',
    kcal: 560,
  },
  {
    id: 'refresco',
    name: 'Refrescos & Papelón',
    short: 'Bien frío, como debe ser.',
    description: 'Refresco de lata 355ml o papelón con limón de la casa, servido con hielo.',
    price: 1.99,
    categories: ['drinks'],
    kind: 'other',
    art: { emoji: '🧃', bg: 'from-lime-100 via-emerald-100 to-teal-100', sub: '🍋' },
    kcal: 140,
  },
  {
    id: 'brownie',
    name: 'Brownie Loco con Helado',
    short: 'El cierre perfecto.',
    description: 'Brownie tibio de chocolate, bola de helado de vainilla y sirope de chocolate.',
    price: 3.99,
    categories: ['drinks'],
    kind: 'other',
    art: { emoji: '🍫', bg: 'from-amber-100 via-orange-100 to-stone-200', sub: '🍨' },
    kcal: 480,
  },
];

const HERO_SLIDES = ['original', 'bulldog', 'chefs'].map((id) => PRODUCTS.find((p) => p.id === id));

const AWARDS = [
  { label: 'B FEST', year: '2023' },
  { label: 'B Master', year: '2024' },
  { label: "Chef's Choice La Copa", year: '2025' },
];

/* --------------------------------- utils --------------------------------- */

const fmtUSD = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
const fmtBs = (n, rate) =>
  `Bs. ${(n * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtBsPlain = (n, rate) =>
  (n * rate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const digits = (s) => String(s || '').replace(/\D/g, '');

const storage = {
  get(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked — the app keeps working in memory */
    }
  },
};

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy copy */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function defaultConfig(product) {
  return { size: product.defaultSize || null, extras: [], removals: [], combo: false, note: '' };
}

function unitPrice(product, cfg) {
  let price = product.price;
  if (product.kind === 'burger' && cfg.size) {
    const base = SIZES.find((s) => s.id === product.defaultSize)?.delta ?? 0;
    const chosen = SIZES.find((s) => s.id === cfg.size)?.delta ?? 0;
    price += chosen - base;
    price += cfg.extras.reduce((sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
    if (cfg.combo) price += COMBO_PRICE;
  }
  return Math.round(price * 100) / 100;
}

function describeConfig(product, cfg) {
  if (product.kind !== 'burger') return cfg.note ? [`Nota: ${cfg.note}`] : [];
  const lines = [];
  const size = SIZES.find((s) => s.id === cfg.size);
  if (size) lines.push(`${size.label} Smash`);
  cfg.extras.forEach((id) => {
    const e = EXTRAS.find((x) => x.id === id);
    if (e) lines.push(`+ ${e.label}`);
  });
  cfg.removals.forEach((id) => {
    const r = REMOVALS.find((x) => x.id === id);
    if (r) lines.push(r.label);
  });
  if (cfg.combo) lines.push('+ Combo (papas + bebida)');
  if (cfg.note) lines.push(`Nota: ${cfg.note}`);
  return lines;
}

function configKey(productId, cfg) {
  return [productId, cfg.size, [...cfg.extras].sort().join('.'), [...cfg.removals].sort().join('.'), cfg.combo ? 'c' : '', cfg.note.trim()].join('|');
}

/* ----------------------------- global styles ----------------------------- */

const GlobalStyles = () => (
  <style>{`
    :root { color-scheme: light; }
    html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; }
    body { background: ${BRAND.white}; color: ${BRAND.ink}; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
    .font-display { font-family: 'Anton', 'Inter', ui-sans-serif, sans-serif; letter-spacing: -0.01em; }
    .font-script { font-family: 'Yellowtail', cursive; }
    .font-mono-ticket { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { scrollbar-width: none; }

    @keyframes rf-float { 0%,100% { transform: translate3d(0,0,0) rotate(var(--r,0deg)); } 50% { transform: translate3d(0,-14px,0) rotate(calc(var(--r,0deg) + 8deg)); } }
    @keyframes rf-float-slow { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-10px,0); } }
    @keyframes rf-word-in { from { opacity: 0; transform: translate3d(0, 8%, 0) scale(.96); letter-spacing: .08em; } to { opacity: 1; transform: none; letter-spacing: -0.02em; } }
    @keyframes rf-burger-in { 0% { opacity: 0; transform: translate3d(0,-40px,0) scale(.86) rotate(-6deg); } 60% { opacity: 1; transform: translate3d(0,6px,0) scale(1.02) rotate(1deg); } 100% { opacity: 1; transform: none; } }
    @keyframes rf-fade-up { from { opacity: 0; transform: translate3d(0,14px,0); } to { opacity: 1; transform: none; } }
    @keyframes rf-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35); } 60% { transform: scale(.92); } 100% { transform: scale(1); } }
    @keyframes rf-print { from { transform: translate3d(0,-100%,0); } to { transform: translate3d(0,0,0); } }
    @keyframes rf-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
    @keyframes rf-sheet-in { from { transform: translate3d(0,100%,0); } to { transform: none; } }
    @keyframes rf-pop-in { from { opacity: 0; transform: translate3d(0,24px,0) scale(.97); } to { opacity: 1; transform: none; } }
    @keyframes rf-drawer-in { from { transform: translate3d(100%,0,0); } to { transform: none; } }
    @keyframes rf-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes rf-toast { 0% { opacity: 0; transform: translate3d(0,16px,0) scale(.96); } 12% { opacity: 1; transform: none; } 88% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translate3d(0,8px,0); } }
    @keyframes rf-stripes { from { background-position: 0 0; } to { background-position: 40px 0; } }
    @keyframes rf-sizzle { 0%,100% { opacity:.25; transform: translateY(0) scaleY(1); } 50% { opacity:.7; transform: translateY(-10px) scaleY(1.15); } }

    .rf-float { animation: rf-float 6s ease-in-out infinite; }
    .rf-float-slow { animation: rf-float-slow 7s ease-in-out infinite; }
    .rf-word-in { animation: rf-word-in .9s cubic-bezier(.2,.8,.2,1) both; }
    .rf-burger-in { animation: rf-burger-in .9s cubic-bezier(.2,.8,.2,1) both; }
    .rf-fade-up { animation: rf-fade-up .6s cubic-bezier(.2,.8,.2,1) both; }
    .rf-bump { animation: rf-bump .5s cubic-bezier(.2,.8,.2,1); }
    .rf-print { animation: rf-print 1.5s cubic-bezier(.3,.7,.2,1) both; }
    .rf-marquee { animation: rf-marquee 28s linear infinite; }
    .rf-sheet-in { animation: rf-sheet-in .45s cubic-bezier(.2,.8,.2,1) both; }
    .rf-pop-in { animation: rf-pop-in .4s cubic-bezier(.2,.8,.2,1) both; }
    .rf-drawer-in { animation: rf-drawer-in .45s cubic-bezier(.2,.8,.2,1) both; }
    .rf-fade { animation: rf-fade .3s ease both; }
    .rf-toast { animation: rf-toast 2.6s ease both; }
    .rf-stripes { background-image: repeating-linear-gradient(135deg, rgba(255,255,255,.28) 0 10px, transparent 10px 20px); background-size: 40px 40px; animation: rf-stripes 1s linear infinite; }

    .rf-zigzag { -webkit-mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 16px 100%; mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 16px 100%; }
    .rf-paper { background-color: #fff; background-image: linear-gradient(180deg, rgba(30,16,53,.035), transparent 30%), repeating-linear-gradient(0deg, transparent 0 3px, rgba(30,16,53,.012) 3px 4px); }
    @media (min-width: 1024px) { .rf-edge-fade { -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%); mask-image: linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%); } }
    .rf-mask { -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
    }
  `}</style>
);

/* ----------------------------- brand marks ------------------------------- */

function LogoMark({ color = BRAND.royal, className = '', label = "Rafa's" }) {
  const src = `${ASSET}/logo-rafas.png`;
  return (
    <span
      role="img"
      aria-label={label}
      className={`rf-mask inline-block aspect-[700/406] ${className}`}
      style={{ backgroundColor: color, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
    />
  );
}

function BulldogMark({ color = BRAND.ink, className = '' }) {
  const src = `${ASSET}/logo-bulldog.png`;
  return (
    <span
      aria-hidden="true"
      className={`rf-mask inline-block aspect-[700/581] ${className}`}
      style={{ backgroundColor: color, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
    />
  );
}

/* ------------------------------- barcode --------------------------------- */

function Barcode({ value }) {
  const bars = useMemo(() => {
    const out = [];
    let x = 0;
    const seq = `*${value}*`.split('');
    seq.forEach((ch, ci) => {
      const code = ch.charCodeAt(0) * 7 + ci * 13;
      for (let b = 0; b < 6; b++) {
        const w = ((code >> b) & 1) + 1 + ((code >> (b + 3)) & 1);
        if (b % 2 === 0) out.push({ x, w });
        x += w + 1;
      }
      x += 2;
    });
    return { out, width: x };
  }, [value]);
  return (
    <svg viewBox={`0 0 ${bars.width} 40`} preserveAspectRatio="none" className="h-14 w-full" role="img" aria-label={`Código de barras ${value}`}>
      {bars.out.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="40" fill={BRAND.ink} />
      ))}
    </svg>
  );
}

/* ------------------------------ product art ------------------------------ */

function ProductArt({ product, size = 'md', className = '' }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        draggable="false"
        className={`h-full w-full select-none object-contain ${className}`}
        style={{ filter: 'drop-shadow(0 22px 22px rgba(30,16,53,.28)) drop-shadow(0 6px 8px rgba(91,33,182,.18))' }}
      />
    );
  }
  const big = size === 'lg' ? 'text-[7.5rem]' : size === 'sm' ? 'text-4xl' : 'text-[5.5rem]';
  const sub = size === 'lg' ? 'text-6xl' : size === 'sm' ? 'text-xl' : 'text-4xl';
  return (
    <div className={`relative grid h-full w-full place-items-center ${className}`}>
      <div className={`absolute aspect-square w-[78%] rounded-full bg-gradient-to-br ${product.art.bg} opacity-90 blur-[1px]`} />
      <div className="absolute aspect-square w-[60%] rounded-full border-2 border-dashed border-white/70" />
      <span className={`relative ${big} leading-none`} style={{ filter: 'drop-shadow(0 18px 16px rgba(30,16,53,.30))' }}>
        {product.art.emoji}
      </span>
      <span className={`absolute bottom-[14%] right-[16%] ${sub} leading-none rf-float-slow`} style={{ filter: 'drop-shadow(0 8px 8px rgba(30,16,53,.25))' }}>
        {product.art.sub}
      </span>
    </div>
  );
}

/* ================================ APP ==================================== */

export default function RafasApp() {
  /* ------------------------------ state ---------------------------------- */
  const [rate, setRate] = useState(() => storage.get('rafas.rate', 214.35));
  const [cityId, setCityId] = useState(() => storage.get('rafas.city', 'caracas'));
  const [mode, setMode] = useState(() => storage.get('rafas.mode', 'delivery'));
  const [cart, setCart] = useState(() => {
    const saved = storage.get('rafas.cart', []);
    return Array.isArray(saved) ? saved.filter((l) => PRODUCTS.some((p) => p.id === l.productId)) : [];
  });
  const [category, setCategory] = useState('top');
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [modal, setModal] = useState(null); // { product, cfg, qty, editKey? }
  const [drawer, setDrawer] = useState(null); // null | 'cart' | 'checkout' | 'success'
  const [cityOpen, setCityOpen] = useState(false);
  const [rateEditing, setRateEditing] = useState(false); // false | 'desktop' | 'mobile'
  const [rateDraft, setRateDraft] = useState('');
  const [toasts, setToasts] = useState([]);
  const [bumpKey, setBumpKey] = useState(0);
  const [justAdded, setJustAdded] = useState(null);
  const [payMethod, setPayMethod] = useState('pagomovil');
  const [cashKind, setCashKind] = useState('efectivo');
  const [form, setForm] = useState(() => ({
    name: '',
    phone: '',
    address: '',
    reference: '',
    pmBank: '',
    pmPhone: '',
    pmRef: '',
    zHolder: '',
    zRef: '',
    cashBill: '',
    ...storage.get('rafas.customer', {}),
  }));
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState(0);
  const [now, setNow] = useState(() => new Date());

  const city = CITIES.find((c) => c.id === cityId) || CITIES[0];
  const heroProduct = HERO_SLIDES[heroIndex];
  const heroRef = useRef(null);
  const cityRef = useRef(null);
  const menuRef = useRef(null);

  /* ---------------------------- persistence ------------------------------ */
  useEffect(() => storage.set('rafas.rate', rate), [rate]);
  useEffect(() => storage.set('rafas.city', cityId), [cityId]);
  useEffect(() => storage.set('rafas.mode', mode), [mode]);
  useEffect(() => storage.set('rafas.cart', cart), [cart]);
  useEffect(() => {
    const { name, phone, address, reference } = form;
    storage.set('rafas.customer', { name, phone, address, reference });
  }, [form.name, form.phone, form.address, form.reference]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ------------------------------ derived -------------------------------- */
  const products = useMemo(() => Object.fromEntries(PRODUCTS.map((p) => [p.id, p])), []);
  const cartLines = useMemo(
    () =>
      cart.map((line) => {
        const product = products[line.productId];
        const unit = unitPrice(product, line.cfg);
        return { ...line, product, unit, total: Math.round(unit * line.qty * 100) / 100 };
      }),
    [cart, products]
  );
  const itemCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const subtotal = Math.round(cartLines.reduce((s, l) => s + l.total, 0) * 100) / 100;
  const deliveryFee = mode === 'delivery' && subtotal > 0 && subtotal < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;
  const totalBs = Math.round(total * rate * 100) / 100;

  const filtered = useMemo(() => PRODUCTS.filter((p) => p.categories.includes(category)), [category]);

  /* ------------------------------ effects -------------------------------- */
  // Hero autoplay
  useEffect(() => {
    if (heroPaused) return undefined;
    const t = setTimeout(() => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length), 6500);
    return () => clearTimeout(t);
  }, [heroIndex, heroPaused]);

  // Clock for the receipt
  useEffect(() => {
    if (!drawer) return undefined;
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, [drawer]);

  // Lock scroll under overlays
  useEffect(() => {
    const lock = Boolean(drawer || modal);
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer, modal]);

  // Escape key & outside click for dropdown
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (modal) setModal(null);
      else if (drawer && drawer !== 'success') setDrawer(null);
      setCityOpen(false);
      setRateEditing(false);
    };
    const onClick = (e) => {
      // Only the desktop dropdown closes on outside click; the mobile bottom sheet has its own backdrop.
      if (!window.matchMedia('(min-width: 768px)').matches) return;
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [modal, drawer]);

  // Order tracking simulation
  useEffect(() => {
    if (drawer !== 'success' || !order) return undefined;
    setProgress(0);
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / 24000) * 100);
      setProgress(p);
      if (p >= 100) clearInterval(t);
    }, 120);
    return () => clearInterval(t);
  }, [drawer, order]);

  // If pickup, cash payments allow "Punto"; if delivery, force cash
  useEffect(() => {
    if (mode === 'delivery') setCashKind('efectivo');
  }, [mode]);

  /* ------------------------------ actions -------------------------------- */
  const toast = useCallback((message, icon = 'check') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-2), { id, message, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const addToCart = useCallback(
    (product, cfg = defaultConfig(product), qty = 1, replaceKey = null) => {
      const key = configKey(product.id, cfg);
      setCart((prev) => {
        let next = replaceKey ? prev.filter((l) => l.key !== replaceKey) : [...prev];
        const existing = next.find((l) => l.key === key);
        if (existing) next = next.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
        else next.push({ key, productId: product.id, cfg, qty });
        return next;
      });
      setBumpKey((k) => k + 1);
      setJustAdded(product.id);
      setTimeout(() => setJustAdded((id) => (id === product.id ? null : id)), 1300);
      toast(replaceKey ? 'Pedido actualizado' : `${qty}× ${product.name} al pedido`);
    },
    [toast]
  );

  const changeQty = (key, delta) =>
    setCart((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, l.qty + delta) } : l)));
  const removeLine = (key) => setCart((prev) => prev.filter((l) => l.key !== key));

  const openProduct = (product, editLine = null) => {
    setModal({
      product,
      cfg: editLine ? { ...editLine.cfg, extras: [...editLine.cfg.extras], removals: [...editLine.cfg.removals] } : defaultConfig(product),
      qty: editLine ? editLine.qty : 1,
      editKey: editLine ? editLine.key : null,
    });
  };

  const quickAdd = (product) => {
    if (product.kind === 'burger') openProduct(product);
    else addToCart(product);
  };

  const doCopy = async (text, label) => {
    const ok = await copyText(text);
    toast(ok ? `${label} copiado` : 'No se pudo copiar — cópialo manualmente', ok ? 'copy' : 'info');
  };

  const onHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty('--mx', x.toFixed(3));
    el.style.setProperty('--my', y.toFixed(3));
  };
  const onHeroLeave = () => {
    heroRef.current?.style.setProperty('--mx', '0');
    heroRef.current?.style.setProperty('--my', '0');
    setHeroPaused(false);
  };
  const heroGo = (dir) => setHeroIndex((i) => (i + dir + HERO_SLIDES.length) % HERO_SLIDES.length);

  const saveRate = () => {
    const v = parseFloat(String(rateDraft).replace(',', '.'));
    if (Number.isFinite(v) && v > 0) {
      setRate(Math.round(v * 100) / 100);
      toast(`Tasa BCV actualizada: ${v.toFixed(2)} Bs.`);
    }
    setRateEditing(false);
  };

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  /* ----------------------------- validation ------------------------------ */
  const errors = useMemo(() => {
    const e = {};
    if (form.name.trim().length < 3) e.name = 'Escribe tu nombre y apellido';
    if (digits(form.phone).length < 10) e.phone = 'Número de WhatsApp válido (ej. 0414-1234567)';
    if (mode === 'delivery' && form.address.trim().length < 8) e.address = 'Indica la dirección exacta';
    if (payMethod === 'pagomovil') {
      if (!form.pmBank) e.pmBank = 'Selecciona el banco emisor';
      if (digits(form.pmPhone).length < 10) e.pmPhone = 'Teléfono desde donde pagaste';
      const ref = digits(form.pmRef);
      if (ref.length < 4 || ref.length > 6) e.pmRef = 'Últimos 4 a 6 dígitos de la referencia';
    }
    if (payMethod === 'zelle') {
      if (form.zHolder.trim().length < 3) e.zHolder = 'Nombre del titular de la cuenta Zelle';
      if (form.zRef.trim().length < 4) e.zRef = 'Número de confirmación';
    }
    if (payMethod === 'cash' && mode === 'delivery') {
      const bill = parseFloat(String(form.cashBill).replace(',', '.'));
      if (!Number.isFinite(bill) || bill < total) e.cashBill = `Debe ser mayor o igual a ${fmtUSD(total)}`;
    }
    return e;
  }, [form, mode, payMethod, total]);
  const isValid = Object.keys(errors).length === 0 && cartLines.length > 0;

  const paymentSummary = () => {
    if (payMethod === 'pagomovil') return `Pago Móvil · ${form.pmBank} · Tel ${form.pmPhone} · Ref ${digits(form.pmRef)} · ${fmtBs(total, rate)}`;
    if (payMethod === 'zelle') return `Zelle · Titular ${form.zHolder} · Conf. ${form.zRef} · ${fmtUSD(total)}`;
    if (mode === 'delivery') {
      const bill = parseFloat(String(form.cashBill).replace(',', '.')) || 0;
      return `Efectivo USD · Paga con ${fmtUSD(bill)} · Vuelto ${fmtUSD(Math.max(0, bill - total))}`;
    }
    return cashKind === 'punto' ? 'Punto de Venta (en tienda)' : 'Efectivo USD (en tienda)';
  };

  const confirmOrder = () => {
    setTriedSubmit(true);
    if (!isValid) {
      toast('Revisa los campos marcados', 'info');
      // Wait for the re-render that flags invalid fields before scrolling to the first one.
      setTimeout(() => {
        const first = document.querySelector('[data-invalid="true"]');
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        first?.focus({ preventScroll: true });
      }, 60);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const seq = (storage.get('rafas.orderSeq', 0) || 0) + 1;
      storage.set('rafas.orderSeq', seq);
      setOrder({
        number: `RAFA-${String(seq).padStart(3, '0')}`,
        date: new Date(),
        lines: cartLines,
        subtotal,
        deliveryFee,
        total,
        totalBs,
        rate,
        city,
        mode,
        payment: paymentSummary(),
        customer: { name: form.name, phone: form.phone, address: form.address, reference: form.reference },
      });
      setSubmitting(false);
      setDrawer('success');
    }, 1400);
  };

  const whatsappLink = (o) => {
    if (!o) return '#';
    const lines = [
      `*RAFA'S CASUAL FOOD* 🍔`,
      `Pedido *#${o.number}*`,
      `Sede: ${o.city.name} (${o.city.store})`,
      `Modalidad: ${o.mode === 'delivery' ? 'Delivery 🛵' : 'Pick-up 🛍️'}`,
      `Fecha: ${o.date.toLocaleString('es-VE')}`,
      '——————————————',
      ...o.lines.flatMap((l) => [
        `${l.qty}× ${l.product.name} — ${fmtUSD(l.total)}`,
        ...describeConfig(l.product, l.cfg).map((d) => `   · ${d}`),
      ]),
      '——————————————',
      `Subtotal: ${fmtUSD(o.subtotal)}`,
      o.mode === 'delivery' ? `Delivery: ${o.deliveryFee ? fmtUSD(o.deliveryFee) : 'GRATIS'}` : null,
      `*TOTAL: ${fmtUSD(o.total)} (${fmtBs(o.total, o.rate)})*`,
      `Tasa BCV: 1 USD = ${o.rate.toFixed(2)} Bs.`,
      '',
      `Pago: ${o.payment}`,
      `Cliente: ${o.customer.name} · ${o.customer.phone}`,
      o.mode === 'delivery' ? `Dirección: ${o.customer.address}${o.customer.reference ? ` (Ref: ${o.customer.reference})` : ''}` : null,
    ].filter(Boolean);
    return `https://wa.me/${o.city.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const startNewOrder = () => {
    setCart([]);
    setOrder(null);
    setDrawer(null);
    setTriedSubmit(false);
    setForm((f) => ({ ...f, pmBank: '', pmPhone: '', pmRef: '', zHolder: '', zRef: '', cashBill: '' }));
  };

  /* =============================== RENDER ================================ */
  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#1E1035] antialiased">
      <GlobalStyles />

      {/* ============================== HEADER ============================== */}
      <header className="sticky top-0 z-40 border-b border-[#EDE9FE] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-5">
          <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="Rafa's Casual Food — inicio">
            <LogoMark className="w-[78px] sm:w-[92px]" />
            <span className="hidden font-script text-xl leading-none text-[#6D28D9] xl:inline">Casual Food</span>
          </a>

          {/* Desktop controls */}
          <div className="ml-auto hidden items-center gap-2 md:flex lg:gap-3">
            <CityPicker
              refEl={cityRef}
              city={city}
              open={cityOpen}
              setOpen={setCityOpen}
              onPick={(id) => {
                setCityId(id);
                setCityOpen(false);
                toast(`Sede: ${CITIES.find((c) => c.id === id).name}`, 'pin');
              }}
            />
            <ModeSwitch mode={mode} setMode={setMode} />
            <RateBadge
              rate={rate}
              editing={rateEditing === 'desktop'}
              draft={rateDraft}
              setDraft={setRateDraft}
              onEdit={() => {
                setRateDraft(String(rate));
                setRateEditing('desktop');
              }}
              onSave={saveRate}
              onCancel={() => setRateEditing(false)}
            />
          </div>

          <div className="ml-auto md:hidden">
            <RateBadge
              rate={rate}
              editing={rateEditing === 'mobile'}
              draft={rateDraft}
              setDraft={setRateDraft}
              onEdit={() => {
                setRateDraft(String(rate));
                setRateEditing('mobile');
              }}
              onSave={saveRate}
              onCancel={() => setRateEditing(false)}
              compact
            />
          </div>

          <button
            type="button"
            onClick={() => setDrawer('cart')}
            className="group relative flex items-center gap-2 rounded-full bg-[#5B21B6] py-2 pl-3 pr-4 text-white shadow-lg shadow-purple-600/30 transition hover:bg-[#6D28D9] active:scale-95 md:ml-0"
            aria-label={`Abrir carrito, ${itemCount} productos`}
          >
            <span className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span
                key={bumpKey}
                className={`absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#F59E0B] px-1 text-[11px] font-extrabold text-[#1E1035] ring-2 ring-[#5B21B6] ${bumpKey ? 'rf-bump' : ''}`}
              >
                {itemCount}
              </span>
            </span>
            <span className="text-sm font-bold tabular-nums">{fmtUSD(total)}</span>
          </button>
        </div>

        {/* Mobile controls row */}
        <div className="flex items-center gap-2 px-4 pb-3 md:hidden">
          <CityPicker
            refEl={null}
            city={city}
            open={false}
            setOpen={() => setCityOpen((o) => !o)}
            compact
          />
          <div className="min-w-0 flex-1">
            <ModeSwitch mode={mode} setMode={setMode} full />
          </div>
        </div>
      </header>

      {/* Mobile city sheet (outside the header: its backdrop-filter would trap fixed children) */}
      {cityOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-[#1E1035]/40 backdrop-blur-sm rf-fade" onClick={() => setCityOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-white p-5 pb-8 shadow-2xl rf-sheet-in">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#EDE9FE]" />
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6D28D9]">Elige tu sede</p>
            <CityList
              current={cityId}
              onPick={(id) => {
                setCityId(id);
                setCityOpen(false);
                toast(`Sede: ${CITIES.find((c) => c.id === id).name}`, 'pin');
              }}
            />
          </div>
        </div>
      )}

      <main id="top">
        {/* ============================== HERO ============================== */}
        <section
          ref={heroRef}
          onMouseMove={onHeroMove}
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={onHeroLeave}
          className="relative overflow-hidden bg-[#F8F7FC]"
          style={{ '--mx': 0, '--my': 0 }}
          aria-roledescription="carrusel"
          aria-label="Hamburguesas insignia"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-14 pt-8 sm:px-6 lg:min-h-[calc(100vh-76px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8 lg:py-10">
            {/* Center: giant word + burger */}
            <div className="order-1 [container-type:inline-size] lg:order-2">
              <h2
                key={heroProduct.heroWord}
                className="rf-word-in font-display select-none whitespace-nowrap text-center uppercase leading-[0.8] text-[#6D28D9]"
                style={{ fontSize: `min(${(118 / (heroProduct.heroWord.length * 0.6)).toFixed(2)}cqw, 15rem)` }}
                aria-hidden="true"
              >
                {heroProduct.heroWord}
              </h2>
              <div className="relative mx-auto -mt-[13%] w-[80%] max-w-[460px]">
                <div style={{ transform: 'translate3d(calc(var(--mx) * 10px), calc(var(--my) * 6px), 0)' }} className="transition-transform duration-300 ease-out">
                  <img
                    key={heroProduct.id}
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    draggable="false"
                    className="rf-burger-in mx-auto aspect-[4/3] w-full select-none object-contain"
                    style={{ filter: 'drop-shadow(0 28px 24px rgba(30,16,53,.22))' }}
                  />
                </div>
              </div>

              {/* Slider controls */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => heroGo(-1)}
                  aria-label="Hamburguesa anterior"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#1E1035]/15 text-[#1E1035] transition hover:border-[#5B21B6] hover:bg-[#5B21B6] hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2" role="tablist" aria-label="Seleccionar hamburguesa">
                  {HERO_SLIDES.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={i === heroIndex}
                      aria-label={p.name}
                      onClick={() => setHeroIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === heroIndex ? 'w-8 bg-[#5B21B6]' : 'w-3 bg-[#1E1035]/15 hover:bg-[#1E1035]/30'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => heroGo(1)}
                  aria-label="Siguiente hamburguesa"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#1E1035]/15 text-[#1E1035] transition hover:border-[#5B21B6] hover:bg-[#5B21B6] hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Left: headline + awards */}
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <p className="font-script text-3xl leading-none text-[#6D28D9] sm:text-4xl">Casual Food</p>
              <h1 className="font-display mt-3 text-[2.6rem] uppercase leading-[0.92] text-[#1E1035] sm:text-6xl lg:text-[3.6rem] xl:text-[4.2rem]">
                Más que una burger, <span className="text-[#5B21B6]">un concepto</span> de locos.
              </h1>
              <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-[#1E1035]/65 lg:mx-0">
                Smash burgers con costra crujiente, pan brioche y salsas de la casa. <span className="font-script text-xl text-[#6D28D9]">by @rafacheff</span>
              </p>
              <ul className="mt-6 space-y-1.5 text-[13px] font-semibold text-[#1E1035]/70">
                {AWARDS.map((a) => (
                  <li key={a.label} className="flex items-center justify-center gap-2 lg:justify-start">
                    <Trophy className="h-3.5 w-3.5 text-[#F59E0B]" />
                    {a.label} {a.year}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: active product */}
            <div key={heroProduct.id} className="rf-fade-up order-3 text-center lg:text-left">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#6D28D9]">
                {heroProduct.heroTag} · 0{heroIndex + 1}/0{HERO_SLIDES.length}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{heroProduct.name}</h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[#1E1035]/65 lg:mx-0">{heroProduct.description}</p>
              <p className="mt-5 font-display text-4xl leading-none text-[#5B21B6]">
                {fmtUSD(heroProduct.price)} <span className="font-sans text-sm font-semibold text-[#1E1035]/50">≈ {fmtBs(heroProduct.price, rate)}</span>
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 lg:items-start">
                <button
                  type="button"
                  onClick={() => openProduct(heroProduct)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#5B21B6] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#6D28D9]"
                >
                  Ordenar Ahora — {fmtUSD(heroProduct.price)}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => addToCart(heroProduct)} className="text-sm font-bold text-[#5B21B6] underline-offset-4 hover:underline">
                  {justAdded === heroProduct.id ? 'Agregada ✓' : 'Agregar rápido'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ MARQUEE ============================= */}
        <div className="relative overflow-hidden bg-[#5B21B6] py-3 text-white">
          <div className="rf-marquee flex w-max items-center gap-8 whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex items-center gap-8">
                {['Smash Burgers', 'Un concepto de locos', 'B FEST 2023', 'B Master 2024', "Chef's Choice 2025", 'Delivery & Pick-up', 'Pago Móvil · Zelle · Efectivo'].map((t, i) => (
                  <span key={i} className="flex items-center gap-8">
                    <span className={i % 2 ? 'font-script text-2xl leading-none text-[#EDE9FE]' : 'font-display text-xl uppercase tracking-wide'}>{t}</span>
                    <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ============================== MENU ============================== */}
        <section id="menu" ref={menuRef} className="scroll-mt-28 bg-[#F8F7FC] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="font-script text-3xl leading-none text-[#6D28D9]">El menú</p>
                <h2 className="font-display mt-2 text-5xl uppercase leading-[0.9] sm:text-7xl">
                  Elige tu <span className="text-[#5B21B6]">locura</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[#1E1035]/60">
                Precios en USD con su equivalente en Bolívares a la tasa BCV del día ({rate.toFixed(2)} Bs.). Sede activa:{' '}
                <span className="font-bold text-[#1E1035]">{city.name}</span>.
              </p>
            </div>

            {/* Category pills */}
            <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Categorías">
              {CATEGORIES.map((c) => {
                const active = c.id === category;
                const count = PRODUCTS.filter((p) => p.categories.includes(c.id)).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(c.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 ${
                      active
                        ? 'bg-[#5B21B6] text-white shadow-lg shadow-purple-600/30'
                        : 'bg-[#EDE9FE] text-[#1E1035] hover:bg-[#DDD6FE]'
                    }`}
                  >
                    <span className="text-base leading-none">{c.emoji}</span>
                    {c.label}
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20' : 'bg-white/70 text-[#6D28D9]'}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Product grid */}
            <div key={category} className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  featured={i % 3 === 1}
                  index={i}
                  rate={rate}
                  added={justAdded === p.id}
                  onOpen={() => openProduct(p)}
                  onQuick={() => quickAdd(p)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =========================== ANATOMÍA ============================= */}
        <section className="relative overflow-hidden bg-[#1E1035] py-16 text-white sm:py-24">
          <div className="pointer-events-none absolute -right-20 top-10 select-none font-display text-[30vw] uppercase leading-none text-white/[.03]" aria-hidden="true">
            Rafa's
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-6 rounded-[3rem] bg-[#6D28D9]/40 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white shadow-2xl shadow-purple-900/50">
                <video
                  className="aspect-[9/16] w-full object-cover"
                  poster={`${ASSET}/anatomia-poster.jpg`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Anatomía de La Rafa's Original Smash"
                >
                  <source src={`${ASSET}/anatomia.webm`} type="video/webm" />
                  <source src={`${ASSET}/anatomia.mp4`} type="video/mp4" />
                </video>
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#1E1035]/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> En la plancha
                </div>
              </div>
            </div>
            <div>
              <p className="font-script text-3xl leading-none text-[#C4B5FD]">Anatomía de una locura</p>
              <h2 className="font-display mt-3 text-5xl uppercase leading-[0.9] sm:text-7xl">
                7 capas.
                <br />
                <span className="text-[#A78BFA]">Cero excusas.</span>
              </h2>
              <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ['Pan brioche', 'Tostado en mantequilla'],
                  ['Lechuga fresca', 'Cortada a mano cada día'],
                  ['Aros de cebolla', 'Rebozado crispy de la casa'],
                  ['Pepinillos', 'Encurtido dulce-ácido'],
                  ['Relish rojo', 'Receta secreta de @rafacheff'],
                  ['Salsa blanca', 'Hierbas, ajo y limón'],
                  ['Carne smash', 'Costra Maillard a 230 °C'],
                ].map(([t, d], i) => (
                  <li key={t} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4 transition hover:border-[#A78BFA]/40 hover:bg-white/[.07]">
                    <span className="font-mono-ticket grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#6D28D9] text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block text-sm font-bold">{t}</span>
                      <span className="block text-xs text-white/55">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => openProduct(products.original)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-[#5B21B6] shadow-xl shadow-purple-900/40 transition hover:-translate-y-0.5 hover:bg-[#EDE9FE]"
              >
                Armar la Original <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ============================ SEDES =============================== */}
        <section id="sedes" className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2 className="font-display text-5xl uppercase leading-[0.9] sm:text-6xl">
                5 ciudades, <span className="text-[#5B21B6]">una misma locura</span>
              </h2>
              <p className="max-w-xs text-sm text-[#1E1035]/60">Toca una sede para pedir desde allí. Tu carrito se mantiene.</p>
            </div>
            <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5">
              {CITIES.map((c) => {
                const active = c.id === cityId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCityId(c.id);
                      toast(`Sede: ${c.name}`, 'pin');
                    }}
                    className={`group relative w-[72%] shrink-0 snap-start overflow-hidden rounded-[1.75rem] p-5 text-left transition sm:w-auto ${
                      active ? 'bg-[#5B21B6] text-white shadow-xl shadow-purple-600/30' : 'border border-[#EDE9FE] bg-[#F8F7FC] hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10'
                    }`}
                  >
                    <BulldogMark color={active ? 'rgba(255,255,255,.12)' : 'rgba(91,33,182,.07)'} className="absolute -bottom-6 -right-6 w-28 transition group-hover:rotate-6" />
                    <MapPin className={`h-5 w-5 ${active ? 'text-[#F59E0B]' : 'text-[#6D28D9]'}`} />
                    <p className="font-display mt-6 text-3xl uppercase leading-none">{c.name}</p>
                    <p className={`mt-1 text-xs font-medium ${active ? 'text-white/70' : 'text-[#1E1035]/55'}`}>{c.store}</p>
                    <p className={`mt-4 flex items-center gap-1.5 text-[11px] font-bold ${active ? 'text-white/80' : 'text-[#1E1035]/60'}`}>
                      <Clock className="h-3.5 w-3.5" /> {c.hours}
                    </p>
                    {active && <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Activa</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ============================== FOOTER ============================== */}
      <footer className="bg-[#F8F7FC] pb-28 pt-14 md:pb-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#1E1035]">
              <BulldogMark color="#FFFFFF" className="w-11" />
            </span>
            <div>
              <LogoMark color={BRAND.ink} className="w-24" />
              <p className="font-script text-lg leading-none text-[#6D28D9]">Un concepto de locos</p>
            </div>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#1E1035]/50">
            © {new Date().getFullYear()} Rafa's Casual Food. Precios en USD; el monto en Bs. se calcula con la tasa BCV indicada. Imágenes de referencia.
          </p>
          <a href="https://instagram.com/rafacheff" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#EDE9FE] px-4 py-2 text-sm font-bold text-[#5B21B6] transition hover:bg-[#5B21B6] hover:text-white">
            <Instagram className="h-4 w-4" /> @rafacheff
          </a>
        </div>
      </footer>

      {/* ===================== MOBILE FLOATING CART BAR ===================== */}
      {itemCount > 0 && !drawer && !modal && (
        <div className="fixed inset-x-3 bottom-3 z-30 md:hidden rf-pop-in" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <button
            type="button"
            onClick={() => setDrawer('cart')}
            className="flex w-full items-center gap-3 rounded-full bg-[#1E1035] p-2 pr-5 text-left text-white shadow-2xl shadow-purple-900/40"
          >
            <span key={bumpKey} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#5B21B6] text-base font-extrabold rf-bump">
              {itemCount}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-white/60">
                {mode === 'delivery' ? 'Delivery' : 'Pick-up'} · {city.name}
              </span>
              <span className="block truncate text-sm font-bold tabular-nums">
                {fmtUSD(total)} <span className="font-medium text-white/60">· {fmtBs(total, rate)}</span>
              </span>
            </span>
            <span className="flex items-center gap-1 text-sm font-extrabold">
              Ver pedido <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      )}

      {/* ========================= PRODUCT MODAL ============================ */}
      {modal && (
        <ProductModal
          modal={modal}
          setModal={setModal}
          rate={rate}
          onClose={() => setModal(null)}
          onAdd={(m) => {
            addToCart(m.product, m.cfg, m.qty, m.editKey);
            setModal(null);
          }}
        />
      )}

      {/* ========================== CART DRAWER ============================= */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[#1E1035]/50 backdrop-blur-sm rf-fade" onClick={() => drawer !== 'success' && setDrawer(null)} />
          <aside
            className={`rf-drawer-in absolute inset-y-0 right-0 flex w-full flex-col bg-[#F8F7FC] shadow-2xl ${drawer === 'cart' ? 'sm:max-w-md' : 'sm:max-w-xl'}`}
            role="dialog"
            aria-modal="true"
            aria-label={drawer === 'cart' ? 'Tu pedido' : drawer === 'checkout' ? 'Checkout' : 'Pedido confirmado'}
          >
            {/* Drawer header */}
            <div className="flex items-center gap-3 border-b border-[#EDE9FE] bg-white px-4 py-4 sm:px-6">
              {drawer === 'checkout' ? (
                <button type="button" onClick={() => setDrawer('cart')} className="grid h-10 w-10 place-items-center rounded-full bg-[#EDE9FE] text-[#5B21B6] transition hover:bg-[#DDD6FE]" aria-label="Volver al carrito">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#5B21B6] text-white">
                  {drawer === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-display text-2xl uppercase leading-none">
                  {drawer === 'cart' ? 'Tu pedido' : drawer === 'checkout' ? 'Checkout' : '¡Pedido recibido!'}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-[#1E1035]/55">
                  {city.name} · {city.store} · {mode === 'delivery' ? 'Delivery' : 'Pick-up'}
                </p>
              </div>
              {drawer !== 'success' && (
                <button type="button" onClick={() => setDrawer(null)} className="grid h-10 w-10 place-items-center rounded-full text-[#1E1035]/60 transition hover:bg-[#EDE9FE] hover:text-[#1E1035]" aria-label="Cerrar">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* ------------------------------ CART ------------------------------ */}
            {drawer === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                  {cartLines.length === 0 ? (
                    <div className="grid h-full place-items-center text-center">
                      <div>
                        <BulldogMark color={BRAND.lavender} className="w-32" />
                        <p className="font-display mt-4 text-3xl uppercase">El bulldog tiene hambre</p>
                        <p className="mt-1 text-sm text-[#1E1035]/55">Tu carrito está vacío. ¡Arma tu primera locura!</p>
                        <button
                          type="button"
                          onClick={() => {
                            setDrawer(null);
                            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="mt-6 rounded-full bg-[#5B21B6] px-6 py-3 text-sm font-extrabold uppercase text-white shadow-lg shadow-purple-600/30"
                        >
                          Ver el menú
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <ModeSwitch mode={mode} setMode={setMode} full />
                      </div>
                      <ul className="space-y-3">
                        {cartLines.map((l) => (
                          <li key={l.key} className="rf-fade-up flex gap-3 rounded-3xl border border-[#EDE9FE] bg-white p-3 shadow-sm shadow-purple-500/5">
                            <button type="button" onClick={() => openProduct(l.product, l)} className="h-20 w-20 shrink-0 rounded-2xl bg-[#F8F7FC] p-1.5" aria-label={`Editar ${l.product.name}`}>
                              <ProductArt product={l.product} size="sm" />
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-2">
                                <p className="flex-1 text-sm font-bold leading-tight">{l.product.name}</p>
                                <button type="button" onClick={() => removeLine(l.key)} className="-m-1 rounded-full p-1 text-[#1E1035]/35 transition hover:bg-red-50 hover:text-red-500" aria-label="Eliminar">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              {describeConfig(l.product, l.cfg).length > 0 && (
                                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#1E1035]/55">{describeConfig(l.product, l.cfg).join(' · ')}</p>
                              )}
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <Stepper value={l.qty} onDec={() => (l.qty === 1 ? removeLine(l.key) : changeQty(l.key, -1))} onInc={() => changeQty(l.key, 1)} small />
                                <div className="text-right">
                                  <p className="text-sm font-extrabold tabular-nums">{fmtUSD(l.total)}</p>
                                  <p className="text-[10px] font-medium text-[#1E1035]/45 tabular-nums">{fmtBs(l.total, rate)}</p>
                                </div>
                              </div>
                              {l.product.kind === 'burger' && (
                                <button type="button" onClick={() => openProduct(l.product, l)} className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#6D28D9] hover:underline">
                                  <Pencil className="h-3 w-3" /> Personalizar
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Upsell */}
                      <div className="mt-6">
                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6D28D9]">¿Le sumamos algo?</p>
                        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
                          {PRODUCTS.filter((p) => p.kind !== 'burger' && !cart.some((l) => l.productId === p.id)).slice(0, 4).map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => addToCart(p)}
                              className="flex w-40 shrink-0 items-center gap-2 rounded-2xl border border-[#EDE9FE] bg-white p-2 text-left transition hover:border-[#5B21B6]"
                            >
                              <span className="h-12 w-12 shrink-0">
                                <ProductArt product={p} size="sm" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-xs font-bold">{p.name}</span>
                                <span className="text-xs font-extrabold text-[#5B21B6]">+{fmtUSD(p.price)}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {cartLines.length > 0 && (
                  <div className="border-t border-[#EDE9FE] bg-white px-4 pb-6 pt-4 sm:px-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                    <TotalsBlock subtotal={subtotal} deliveryFee={deliveryFee} total={total} rate={rate} mode={mode} />
                    <button
                      type="button"
                      onClick={() => setDrawer('checkout')}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#5B21B6] py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-xl shadow-purple-600/30 transition hover:bg-[#6D28D9] active:scale-[.99]"
                    >
                      <Receipt className="h-4 w-4" /> Ir a pagar — {fmtUSD(total)}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ---------------------------- CHECKOUT ---------------------------- */}
            {drawer === 'checkout' && (
              <div className="flex-1 overflow-y-auto">
                {/* Thermal printer */}
                <div className="px-3 pt-5 sm:px-6">
                  <div className="relative mx-auto max-w-[460px]">
                    <div className="relative z-10 rounded-t-[1.75rem] rounded-b-xl bg-gradient-to-b from-[#3B2A5C] via-[#2A1B47] to-[#1E1035] px-5 pb-4 pt-4 shadow-xl shadow-purple-900/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,.7)]" />
                          <span className="font-mono-ticket text-[10px] font-bold uppercase tracking-[.25em] text-white/50">Rafa's POS · {city.name}</span>
                        </div>
                        <LogoMark color="rgba(255,255,255,.5)" className="w-12" />
                      </div>
                      {/* slot */}
                      <div className="mt-3 h-3 rounded-full bg-gradient-to-b from-black via-[#0b0616] to-[#4c3a70] shadow-[inset_0_2px_4px_rgba(0,0,0,.8)]" />
                    </div>

                    {/* Receipt (comes out of the slot) */}
                    <div className="relative -mt-2 overflow-hidden px-3">
                      <div className="rf-print">
                        <div className="rf-paper font-mono-ticket px-5 pb-5 pt-7 text-[12.5px] text-[#1E1035] shadow-[0_18px_30px_-12px_rgba(30,16,53,.35)]">
                          <div className="flex flex-col items-center text-center">
                            <BulldogMark color={BRAND.ink} className="w-12" />
                            <p className="mt-2 text-[13px] font-bold tracking-wider">RAFA'S CASUAL FOOD — EST. 2022</p>
                            <p className="mt-0.5 text-[15px] tracking-[.4em] text-[#F59E0B]">★★★★★</p>
                            <p className="mt-1 text-[11px] text-[#1E1035]/60">Un concepto de locos · @rafacheff</p>
                          </div>
                          <Dashed />
                          <TicketRow left="FECHA" right={now.toLocaleDateString('es-VE')} />
                          <TicketRow left="HORA" right={now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })} />
                          <TicketRow left="SEDE" right={`${city.name.toUpperCase()}`} />
                          <TicketRow left="TIENDA" right={city.store} />
                          <TicketRow left="MODALIDAD" right={mode === 'delivery' ? 'DELIVERY 🛵' : 'PICK-UP 🛍️'} />
                          <Dashed />
                          <div className="space-y-2.5">
                            {cartLines.map((l) => (
                              <div key={l.key}>
                                <div className="flex gap-2">
                                  <span className="shrink-0 font-bold">{l.qty}×</span>
                                  <span className="flex-1 font-bold uppercase leading-tight">{l.product.name}</span>
                                  <span className="shrink-0 font-bold tabular-nums">{fmtUSD(l.total)}</span>
                                </div>
                                {describeConfig(l.product, l.cfg).map((d) => (
                                  <p key={d} className="pl-6 text-[11px] leading-snug text-[#1E1035]/60">
                                    {d}
                                  </p>
                                ))}
                              </div>
                            ))}
                          </div>
                          <Dashed />
                          <TicketRow left="SUBTOTAL" right={fmtUSD(subtotal)} />
                          {mode === 'delivery' && <TicketRow left="DELIVERY" right={deliveryFee ? fmtUSD(deliveryFee) : 'GRATIS'} />}
                          <TicketRow left="TASA BCV" right={`${rate.toFixed(2)} Bs/$`} muted />
                          <div className="my-3 border-y-2 border-[#1E1035] py-2">
                            <div className="flex items-end justify-between">
                              <span className="text-sm font-bold">TOTAL USD</span>
                              <span className="text-2xl font-bold tabular-nums">{fmtUSD(total)}</span>
                            </div>
                            <div className="flex items-end justify-between">
                              <span className="text-sm font-bold">TOTAL Bs.</span>
                              <span className="text-lg font-bold tabular-nums">{fmtBsPlain(total, rate)}</span>
                            </div>
                          </div>

                          {/* ---------------- payment ---------------- */}
                          <p className="mt-4 text-center text-[11px] font-bold tracking-[.3em]">— MÉTODO DE PAGO —</p>
                          <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-2xl bg-[#F8F7FC] p-1.5 font-sans">
                            {[
                              { id: 'pagomovil', label: 'Pago Móvil', emoji: '📱' },
                              { id: 'zelle', label: 'Zelle', emoji: '💸' },
                              { id: 'cash', label: mode === 'pickup' ? 'Efectivo / Punto' : 'Efectivo', emoji: '💵' },
                            ].map((m) => {
                              const active = payMethod === m.id;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => setPayMethod(m.id)}
                                  className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[11px] font-bold transition ${
                                    active ? 'bg-[#5B21B6] text-white shadow-md shadow-purple-600/30' : 'text-[#1E1035]/70 hover:bg-white'
                                  }`}
                                  aria-pressed={active}
                                >
                                  <span className="text-lg leading-none">{m.emoji}</span>
                                  {m.label}
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-4 font-sans">
                            {payMethod === 'pagomovil' && (
                              <div className="rf-fade-up space-y-3">
                                <AmountBox label="Monto exacto a pagar" value={fmtBs(total, rate)} sub={`${fmtUSD(total)} × ${rate.toFixed(2)}`} onCopy={() => doCopy(fmtBsPlain(total, rate), 'Monto')} />
                                <div className="rounded-2xl border border-dashed border-[#1E1035]/25 p-3 font-mono-ticket text-[12px]">
                                  <TicketRow left="BANCO" right={PAYMENT_INFO.pagoMovil.bank} />
                                  <TicketRow left="RIF" right={PAYMENT_INFO.pagoMovil.rif} />
                                  <TicketRow left="TELÉFONO" right={PAYMENT_INFO.pagoMovil.phone} />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      doCopy(
                                        `Pago Móvil Rafa's\nBanco: ${PAYMENT_INFO.pagoMovil.bank}\nRIF: ${PAYMENT_INFO.pagoMovil.rif}\nTeléfono: ${PAYMENT_INFO.pagoMovil.phone}\nMonto: Bs. ${fmtBsPlain(total, rate)}`,
                                        'Datos de Pago Móvil'
                                      )
                                    }
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E1035] py-2.5 font-sans text-xs font-bold text-white transition hover:bg-[#5B21B6]"
                                  >
                                    <Copy className="h-3.5 w-3.5" /> Copiar Datos
                                  </button>
                                </div>
                                <Field label="Banco emisor" error={triedSubmit && errors.pmBank}>
                                  <select value={form.pmBank} onChange={setField('pmBank')} className={inputCls(triedSubmit && errors.pmBank)} data-invalid={Boolean(triedSubmit && errors.pmBank)}>
                                    <option value="">Selecciona tu banco…</option>
                                    {VE_BANKS.map((b) => (
                                      <option key={b} value={b}>
                                        {b}
                                      </option>
                                    ))}
                                  </select>
                                </Field>
                                <div className="grid grid-cols-2 gap-3">
                                  <Field label="Teléfono que pagó" error={triedSubmit && errors.pmPhone}>
                                    <input inputMode="tel" placeholder="0414-1234567" value={form.pmPhone} onChange={setField('pmPhone')} className={inputCls(triedSubmit && errors.pmPhone)} data-invalid={Boolean(triedSubmit && errors.pmPhone)} />
                                  </Field>
                                  <Field label="Ref. (últ. 4-6 díg.)" error={triedSubmit && errors.pmRef}>
                                    <input
                                      inputMode="numeric"
                                      maxLength={6}
                                      placeholder="123456"
                                      value={form.pmRef}
                                      onChange={(e) => setForm((f) => ({ ...f, pmRef: digits(e.target.value).slice(0, 6) }))}
                                      className={`${inputCls(triedSubmit && errors.pmRef)} font-mono-ticket tracking-[.3em]`}
                                      data-invalid={Boolean(triedSubmit && errors.pmRef)}
                                    />
                                  </Field>
                                </div>
                              </div>
                            )}

                            {payMethod === 'zelle' && (
                              <div className="rf-fade-up space-y-3">
                                <AmountBox label="Monto exacto en USD" value={fmtUSD(total)} sub={`≈ ${fmtBs(total, rate)}`} onCopy={() => doCopy(total.toFixed(2), 'Monto')} />
                                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[#1E1035]/25 p-3">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E1035]/50">Correo Zelle</p>
                                    <p className="truncate font-mono-ticket text-[13px] font-bold">{PAYMENT_INFO.zelle.email}</p>
                                    <p className="text-[11px] text-[#1E1035]/55">{PAYMENT_INFO.zelle.holder}</p>
                                  </div>
                                  <button type="button" onClick={() => doCopy(PAYMENT_INFO.zelle.email, 'Correo')} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#1E1035] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#5B21B6]">
                                    <Copy className="h-3.5 w-3.5" /> Copiar Correo
                                  </button>
                                </div>
                                <Field label="Titular de la cuenta Zelle" error={triedSubmit && errors.zHolder}>
                                  <input placeholder="Nombre como aparece en Zelle" value={form.zHolder} onChange={setField('zHolder')} className={inputCls(triedSubmit && errors.zHolder)} data-invalid={Boolean(triedSubmit && errors.zHolder)} />
                                </Field>
                                <Field label="Nº de confirmación / referencia" error={triedSubmit && errors.zRef}>
                                  <input placeholder="Ej. 4F7K2Q9" value={form.zRef} onChange={setField('zRef')} className={`${inputCls(triedSubmit && errors.zRef)} font-mono-ticket uppercase`} data-invalid={Boolean(triedSubmit && errors.zRef)} />
                                </Field>
                              </div>
                            )}

                            {payMethod === 'cash' && (
                              <div className="rf-fade-up space-y-3">
                                {mode === 'pickup' ? (
                                  <>
                                    <div className="grid grid-cols-2 gap-2">
                                      {[
                                        { id: 'efectivo', label: 'Efectivo USD', icon: Banknote },
                                        { id: 'punto', label: 'Punto de Venta', icon: CreditCard },
                                      ].map((k) => (
                                        <button
                                          key={k.id}
                                          type="button"
                                          onClick={() => setCashKind(k.id)}
                                          className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-xs font-bold transition ${
                                            cashKind === k.id ? 'border-[#5B21B6] bg-[#EDE9FE] text-[#5B21B6]' : 'border-[#EDE9FE] text-[#1E1035]/70 hover:border-[#C4B5FD]'
                                          }`}
                                        >
                                          <k.icon className="h-4 w-4" /> {k.label}
                                        </button>
                                      ))}
                                    </div>
                                    <InfoNote>
                                      {cashKind === 'punto'
                                        ? `Paga con tarjeta de débito en caja al retirar en ${city.store}. Monto: ${fmtBs(total, rate)}.`
                                        : `Paga ${fmtUSD(total)} en efectivo al retirar tu pedido en ${city.store}.`}
                                    </InfoNote>
                                  </>
                                ) : (
                                  <>
                                    <AmountBox label="Total a pagar en efectivo" value={fmtUSD(total)} sub="El motorizado lleva tu vuelto exacto" />
                                    <Field label="¿Con cuánto billete vas a pagar? (Para enviar tu vuelto exacto)" error={triedSubmit && errors.cashBill}>
                                      <div className="relative">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#1E1035]/50">$</span>
                                        <input
                                          inputMode="decimal"
                                          placeholder="20.00"
                                          value={form.cashBill}
                                          onChange={(e) => setForm((f) => ({ ...f, cashBill: e.target.value.replace(/[^\d.,]/g, '') }))}
                                          className={`${inputCls(triedSubmit && errors.cashBill)} pl-8`}
                                          data-invalid={Boolean(triedSubmit && errors.cashBill)}
                                        />
                                      </div>
                                    </Field>
                                    <div className="flex flex-wrap gap-2">
                                      {[10, 20, 50, 100].filter((b) => b >= total).slice(0, 3).concat(total > 100 ? [Math.ceil(total / 10) * 10] : []).map((b) => (
                                        <button key={b} type="button" onClick={() => setForm((f) => ({ ...f, cashBill: String(b) }))} className="rounded-full border border-[#EDE9FE] bg-white px-3 py-1.5 text-xs font-bold transition hover:border-[#5B21B6] hover:text-[#5B21B6]">
                                          ${b}
                                        </button>
                                      ))}
                                    </div>
                                    {(() => {
                                      const bill = parseFloat(String(form.cashBill).replace(',', '.'));
                                      if (!Number.isFinite(bill) || bill < total) return null;
                                      return (
                                        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                          <span>Tu vuelto</span>
                                          <span className="font-mono-ticket tabular-nums">{fmtUSD(bill - total)}</span>
                                        </div>
                                      );
                                    })()}
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* ---------------- customer ---------------- */}
                          <p className="mt-6 text-center text-[11px] font-bold tracking-[.3em]">— DATOS {mode === 'delivery' ? 'DE ENTREGA' : 'DE RETIRO'} —</p>
                          <div className="mt-3 space-y-3 font-sans">
                            <Field label="Nombre y apellido" error={triedSubmit && errors.name}>
                              <input autoComplete="name" placeholder="Ej. María Pérez" value={form.name} onChange={setField('name')} className={inputCls(triedSubmit && errors.name)} data-invalid={Boolean(triedSubmit && errors.name)} />
                            </Field>
                            <Field label="Teléfono (WhatsApp)" error={triedSubmit && errors.phone}>
                              <input autoComplete="tel" inputMode="tel" placeholder="0414-1234567" value={form.phone} onChange={setField('phone')} className={inputCls(triedSubmit && errors.phone)} data-invalid={Boolean(triedSubmit && errors.phone)} />
                            </Field>
                            {mode === 'delivery' ? (
                              <>
                                <Field label="Dirección exacta" error={triedSubmit && errors.address}>
                                  <textarea rows={2} autoComplete="street-address" placeholder="Urbanización, calle, edificio/casa, piso y apto." value={form.address} onChange={setField('address')} className={`${inputCls(triedSubmit && errors.address)} resize-none`} data-invalid={Boolean(triedSubmit && errors.address)} />
                                </Field>
                                <Field label="Punto de referencia (opcional)">
                                  <input placeholder="Ej. Frente a la panadería, portón negro" value={form.reference} onChange={setField('reference')} className={inputCls(false)} />
                                </Field>
                              </>
                            ) : (
                              <InfoNote icon={Store}>
                                Retiras en <b>{city.store}, {city.name}</b>. Te avisamos por WhatsApp cuando esté listo (~15 min).
                              </InfoNote>
                            )}
                          </div>

                          <Dashed />
                          <p className="text-center text-[11px] leading-relaxed text-[#1E1035]/60">
                            ¡GRACIAS POR SER PARTE DE LA LOCURA!
                            <br />
                            CONSERVE SU TICKET
                          </p>
                          <div className="mt-3">
                            <Barcode value={`RAFA${cityId.slice(0, 3).toUpperCase()}${String(Math.round(total * 100)).padStart(6, '0')}`} />
                            <p className="mt-1 text-center text-[10px] tracking-[.4em]">{`RAFA-${cityId.slice(0, 3).toUpperCase()}-${String(Math.round(total * 100)).padStart(6, '0')}`}</p>
                          </div>
                        </div>
                        <div className="rf-zigzag h-3 bg-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 mt-4 border-t border-[#EDE9FE] bg-white/95 px-4 pt-4 backdrop-blur sm:px-6" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
                  {triedSubmit && !isValid && (
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                      <Info className="h-3.5 w-3.5" /> Completa los campos marcados para confirmar.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={confirmOrder}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5B21B6] py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-xl shadow-purple-600/40 transition hover:bg-[#6D28D9] active:scale-[.99] disabled:opacity-80"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Enviando a la plancha…
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" /> Confirmar y Enviar Pedido · {fmtUSD(total)}
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-center text-[11px] text-[#1E1035]/45">{fmtBs(total, rate)} a tasa BCV {rate.toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* ----------------------------- SUCCESS ---------------------------- */}
            {drawer === 'success' && order && (
              <SuccessView order={order} progress={progress} rate={rate} whatsappHref={whatsappLink(order)} onNew={startNewOrder} />
            )}
          </aside>
        </div>
      )}

      {/* ============================== TOASTS ============================== */}
      <div className="pointer-events-none fixed inset-x-0 top-[84px] z-[70] flex flex-col items-center gap-2 px-4 md:bottom-6 md:top-auto" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="rf-toast flex items-center gap-2 rounded-full bg-[#1E1035] px-4 py-2.5 text-sm font-semibold text-white shadow-2xl shadow-purple-900/40">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#5B21B6]">
              {t.icon === 'copy' ? <Copy className="h-3.5 w-3.5" /> : t.icon === 'pin' ? <MapPin className="h-3.5 w-3.5" /> : t.icon === 'info' ? <Info className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ SUB-COMPONENTS ============================== */

function CityList({ current, onPick }) {
  return (
    <ul className="space-y-1">
      {CITIES.map((c) => {
        const active = c.id === current;
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onPick(c.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${active ? 'bg-[#EDE9FE]' : 'hover:bg-[#F8F7FC]'}`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full ${active ? 'bg-[#5B21B6] text-white' : 'bg-[#F8F7FC] text-[#6D28D9]'}`}>
                <MapPin className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold">{c.name}</span>
                <span className="block text-xs text-[#1E1035]/55">{c.store}</span>
              </span>
              {active && <Check className="h-4 w-4 text-[#5B21B6]" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CityPicker({ refEl, city, open, setOpen, onPick, compact }) {
  return (
    <div ref={refEl} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-full border border-[#EDE9FE] bg-white text-left transition hover:border-[#C4B5FD] ${compact ? 'py-1.5 pl-1.5 pr-3' : 'py-1.5 pl-1.5 pr-3'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#EDE9FE] text-[#5B21B6]">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <span className="leading-tight">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-[#1E1035]/45">Sede</span>
          <span className="block text-xs font-bold">{city.name}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-[#1E1035]/50 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && onPick && (
        <div className="rf-pop-in absolute left-0 top-[calc(100%+8px)] z-50 w-72 rounded-3xl border border-[#EDE9FE] bg-white p-2 shadow-2xl shadow-purple-500/20" role="listbox">
          <CityList current={city.id} onPick={onPick} />
        </div>
      )}
    </div>
  );
}

function ModeSwitch({ mode, setMode, compact, full }) {
  const opts = [
    { id: 'delivery', label: 'Delivery', icon: Bike },
    { id: 'pickup', label: compact ? 'Pick-up' : 'Pick-up', icon: Store },
  ];
  return (
    <div className={`relative flex shrink-0 rounded-full bg-[#EDE9FE] p-1 ${full ? 'w-full' : ''}`} role="radiogroup" aria-label="Modalidad de pedido">
      <span
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#5B21B6] shadow-md shadow-purple-600/30 transition-transform duration-300 ease-out"
        style={{ transform: mode === 'pickup' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={mode === o.id}
          onClick={() => setMode(o.id)}
          className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors ${mode === o.id ? 'text-white' : 'text-[#1E1035]/70'}`}
        >
          <o.icon className="h-3.5 w-3.5" /> {o.label}
        </button>
      ))}
    </div>
  );
}

function RateBadge({ rate, editing, draft, setDraft, onEdit, onSave, onCancel, compact }) {
  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="flex shrink-0 items-center gap-1 rounded-full border border-[#5B21B6] bg-white py-1 pl-3 pr-1"
      >
        <span className="text-[11px] font-bold text-[#1E1035]/60">{compact ? '$1=' : '1 USD ='}</span>
        <input
          autoFocus
          inputMode="decimal"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^\d.,]/g, ''))}
          onBlur={onSave}
          onKeyDown={(e) => e.key === 'Escape' && onCancel()}
          className={`${compact ? 'w-12' : 'w-16'} bg-transparent text-xs font-bold tabular-nums outline-none`}
          aria-label="Tasa BCV en Bolívares por dólar"
        />
        <span className="text-[11px] font-bold text-[#1E1035]/60">Bs.</span>
        <button type="submit" className="grid h-7 w-7 place-items-center rounded-full bg-[#5B21B6] text-white" aria-label="Guardar tasa">
          <Check className="h-3.5 w-3.5" />
        </button>
      </form>
    );
  }
  return (
    <button
      type="button"
      onClick={onEdit}
      title="Tasa de referencia BCV — toca para editar"
      className={`group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[#EDE9FE] bg-white py-2 text-xs transition hover:border-[#C4B5FD] ${compact ? 'px-2.5' : 'px-3'}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-bold text-[#1E1035]/55">{compact ? 'BCV' : 'Tasa BCV:'}</span>
      <span className="font-extrabold tabular-nums">
        {compact ? '' : '1 USD = '}
        {rate.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
        {compact ? '' : ' Bs.'}
      </span>
      <Pencil className="h-3 w-3 text-[#6D28D9] opacity-60 transition group-hover:opacity-100" />
    </button>
  );
}

function ProductCard({ product, featured, index, rate, added, onOpen, onQuick }) {
  const isBurger = product.kind === 'burger';
  return (
    <article
      className={`group relative flex cursor-pointer flex-col rounded-[2rem] p-5 pb-6 transition-all duration-300 hover:-translate-y-1.5 rf-fade-up ${
        featured
          ? 'bg-[#5B21B6] text-white shadow-xl shadow-purple-700/30 hover:shadow-2xl hover:shadow-purple-700/40'
          : 'border border-[#EDE9FE] bg-white shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
      tabIndex={0}
      role="button"
      aria-label={`${product.name}, ${fmtUSD(product.price)}`}
    >
      {featured && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden="true">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#7C3AED] opacity-70 blur-2xl" />
          <span className="absolute -left-2 top-2 font-display text-8xl uppercase leading-none text-white/[.06]">Rafa's</span>
        </div>
      )}
      <div className="relative flex items-center justify-between">
        {product.badge ? (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${featured ? 'bg-white/15 text-white' : 'bg-[#EDE9FE] text-[#5B21B6]'}`}>
            {product.badge}
          </span>
        ) : (
          <span />
        )}
        <span className={`flex items-center gap-1 text-[11px] font-bold ${featured ? 'text-white/70' : 'text-[#1E1035]/45'}`}>
          <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" /> 4.{9 - (index % 3)}
        </span>
      </div>

      <div className="relative mx-auto my-3 aspect-[4/3] w-full">
        <div className={`absolute inset-x-[18%] bottom-[6%] h-[14%] rounded-[50%] blur-xl ${featured ? 'bg-black/30' : 'bg-[#5B21B6]/20'}`} />
        <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-[1.07]">
          <ProductArt product={product} />
        </div>
      </div>

      <h3 className="relative font-display text-[1.6rem] uppercase leading-[0.95]">{product.name}</h3>
      <p className={`relative mt-2 line-clamp-2 text-[13px] leading-snug ${featured ? 'text-white/75' : 'text-[#1E1035]/60'}`}>{product.description}</p>

      <div className="relative mt-4 pr-20">
        <p className={`font-display text-3xl leading-none ${featured ? 'text-white' : 'text-[#5B21B6]'}`}>{fmtUSD(product.price)}</p>
        <p className={`mt-1 text-xs font-semibold tabular-nums ${featured ? 'text-white/60' : 'text-[#1E1035]/45'}`}>{fmtBs(product.price, rate)}</p>
      </div>

      {/* circular cut-out + action */}
      <div className="absolute -bottom-3 -right-3 grid h-[92px] w-[92px] place-items-center rounded-full bg-[#F8F7FC]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuick();
          }}
          className={`grid h-14 w-14 place-items-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 ${
            added ? 'bg-emerald-500 shadow-emerald-500/40' : featured ? 'bg-[#1E1035] shadow-purple-900/40 hover:bg-[#2D1B4E]' : 'bg-[#5B21B6] shadow-purple-600/40 hover:bg-[#6D28D9]'
          }`}
          aria-label={isBurger ? `Personalizar ${product.name}` : `Agregar ${product.name}`}
        >
          {added ? <Check className="h-6 w-6" /> : isBurger ? <ArrowRight className="h-6 w-6 transition group-hover:-rotate-45" /> : <Plus className="h-6 w-6" />}
        </button>
      </div>
    </article>
  );
}

function ProductModal({ modal, setModal, rate, onClose, onAdd }) {
  const { product, cfg, qty, editKey } = modal;
  const isBurger = product.kind === 'burger';
  const unit = unitPrice(product, cfg);
  const lineTotal = Math.round(unit * qty * 100) / 100;
  const update = (patch) => setModal((m) => ({ ...m, cfg: { ...m.cfg, ...patch } }));
  const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const baseDelta = SIZES.find((s) => s.id === product.defaultSize)?.delta ?? 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[#1E1035]/55 backdrop-blur-sm rf-fade" onClick={onClose} />
      <div
        className="rf-sheet-in relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem] sm:[animation-name:rf-pop-in]"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Purple top half */}
          <div className="relative h-56 shrink-0 overflow-visible bg-[#5B21B6] sm:h-60">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-10 -top-16 h-64 w-64 rounded-full bg-[#7C3AED] blur-3xl" />
              <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-[#4C1D95] blur-3xl" />
              <span className="absolute inset-x-0 top-6 select-none whitespace-nowrap text-center font-display text-[7.5rem] uppercase leading-none text-white/[.08]">
                {product.heroWord || "RAFA'S"}
              </span>
            </div>
            <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
            {product.badge && (
              <span className="absolute left-4 top-4 z-20 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur">{product.badge}</span>
            )}
            <div className="absolute inset-x-0 -bottom-16 z-10 mx-auto h-60 w-[78%] rf-burger-in sm:h-64">
              <ProductArt product={product} size="lg" />
            </div>
          </div>

          {/* White bottom half */}
          <div className="px-5 pb-6 pt-20 sm:px-7">
            <h3 className="font-display text-4xl uppercase leading-[0.95]">{product.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#1E1035]/65">{product.description}</p>
            <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-[#1E1035]/50">
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-[#F59E0B]" /> {product.kcal} kcal
              </span>
              <span className="flex items-center gap-1">
                <ChefHat className="h-3.5 w-3.5 text-[#6D28D9]" /> Receta @rafacheff
              </span>
            </div>

            {isBurger && (
              <>
                <Section title="Tamaño de la burger" required>
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((s) => {
                      const active = cfg.size === s.id;
                      const diff = s.delta - baseDelta;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => update({ size: s.id })}
                          className={`relative flex flex-col items-center rounded-2xl border-2 px-2 pb-3 pt-3 text-center transition ${
                            active ? 'border-[#5B21B6] bg-[#EDE9FE] shadow-md shadow-purple-500/20' : 'border-[#EDE9FE] hover:border-[#C4B5FD]'
                          }`}
                          aria-pressed={active}
                        >
                          <span className="flex h-7 flex-col-reverse items-center justify-start gap-[3px]">
                            {Array.from({ length: s.patties }).map((_, i) => (
                              <span key={i} className={`block h-[5px] w-9 rounded-full ${active ? 'bg-[#5B21B6]' : 'bg-[#1E1035]/40'}`} />
                            ))}
                          </span>
                          <span className="mt-1 text-sm font-extrabold">{s.label}</span>
                          <span className="text-[10px] text-[#1E1035]/50">{s.note}</span>
                          <span className={`mt-1 text-[11px] font-bold ${diff > 0 ? 'text-[#5B21B6]' : diff < 0 ? 'text-emerald-600' : 'text-[#1E1035]/40'}`}>
                            {diff === 0 ? 'Incluido' : `${diff > 0 ? '+' : '−'}${fmtUSD(Math.abs(diff))}`}
                          </span>
                          {active && (
                            <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[#5B21B6] text-white">
                              <Check className="h-3 w-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Extras">
                  <div className="space-y-2">
                    {EXTRAS.map((e) => {
                      const on = cfg.extras.includes(e.id);
                      return (
                        <label key={e.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-3 py-2.5 transition ${on ? 'border-[#5B21B6] bg-[#F8F7FC]' : 'border-[#EDE9FE] hover:border-[#C4B5FD]'}`}>
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => update({ extras: toggle(cfg.extras, e.id) })} />
                          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition ${on ? 'border-[#5B21B6] bg-[#5B21B6] text-white' : 'border-[#C4B5FD] bg-white'}`}>
                            {on && <Check className="h-3.5 w-3.5" />}
                          </span>
                          <span className="text-lg leading-none">{e.emoji}</span>
                          <span className="flex-1 text-sm font-semibold">+ {e.label}</span>
                          <span className="text-sm font-extrabold text-[#5B21B6]">{fmtUSD(e.price)}</span>
                        </label>
                      );
                    })}
                  </div>
                </Section>

                <Section title="Sin ingredientes" hint="Gratis">
                  <div className="flex flex-wrap gap-2">
                    {REMOVALS.map((r) => {
                      const on = cfg.removals.includes(r.id);
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => update({ removals: toggle(cfg.removals, r.id) })}
                          className={`flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-3.5 text-xs font-bold transition ${on ? 'border-[#1E1035] bg-[#1E1035] text-white' : 'border-[#EDE9FE] text-[#1E1035]/75 hover:border-[#C4B5FD]'}`}
                          aria-pressed={on}
                        >
                          <span className={`relative h-5 w-9 rounded-full transition ${on ? 'bg-[#6D28D9]' : 'bg-[#EDE9FE]'}`}>
                            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
                          </span>
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Section title="¿Lo hacemos combo?">
                  <button
                    type="button"
                    onClick={() => update({ combo: !cfg.combo })}
                    className={`relative flex w-full items-center gap-4 overflow-hidden rounded-3xl p-4 text-left transition ${
                      cfg.combo ? 'bg-[#5B21B6] text-white shadow-lg shadow-purple-600/30' : 'border-2 border-dashed border-[#C4B5FD] bg-[#F8F7FC] hover:border-[#5B21B6]'
                    }`}
                    aria-pressed={cfg.combo}
                  >
                    <span className="flex -space-x-2 text-3xl">
                      <span>🍟</span>
                      <span>🥤</span>
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-extrabold">Hacerlo Combo</span>
                      <span className={`block text-xs ${cfg.combo ? 'text-white/75' : 'text-[#1E1035]/55'}`}>Papas fritas + bebida de 355ml</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-sm font-extrabold">+{fmtUSD(COMBO_PRICE)}</span>
                      <span className={`mt-1 inline-grid h-6 w-6 place-items-center rounded-full ${cfg.combo ? 'bg-white text-[#5B21B6]' : 'border-2 border-[#C4B5FD]'}`}>
                        {cfg.combo && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </span>
                  </button>
                </Section>
              </>
            )}

            <Section title="Instrucciones especiales" hint="Opcional">
              <input
                value={cfg.note}
                maxLength={80}
                onChange={(e) => update({ note: e.target.value })}
                placeholder={isBurger ? 'Ej. Término bien cocido, salsa aparte…' : 'Ej. Sin hielo, extra salsa…'}
                className={inputCls(false)}
              />
            </Section>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-bold">Cantidad</span>
              <Stepper value={qty} onDec={() => setModal((m) => ({ ...m, qty: Math.max(1, m.qty - 1) }))} onInc={() => setModal((m) => ({ ...m, qty: Math.min(20, m.qty + 1) }))} />
            </div>
          </div>
        </div>

        {/* Fixed CTA */}
        <div className="border-t border-[#EDE9FE] bg-white p-4 sm:px-7" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <button
            type="button"
            onClick={() => onAdd(modal)}
            className="flex w-full items-center justify-between gap-3 rounded-full bg-[#5B21B6] py-3 pl-6 pr-3 text-white shadow-xl shadow-purple-600/40 transition hover:bg-[#6D28D9] active:scale-[.99]"
          >
            <span className="text-left">
              <span className="block text-sm font-extrabold uppercase tracking-wide">{editKey ? 'Actualizar Pedido' : 'Agregar al Pedido'}</span>
              <span className="block text-[11px] font-semibold text-white/70">
                {fmtUSD(lineTotal)} ({fmtBs(lineTotal, rate)})
              </span>
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-base font-extrabold tabular-nums">
              {fmtUSD(lineTotal)} <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessView({ order, progress, rate, whatsappHref, onNew }) {
  const isDelivery = order.mode === 'delivery';
  const steps = [
    { label: 'Verificando Pago', emoji: '🔎' },
    { label: 'En la Plancha', emoji: '🔥' },
    { label: isDelivery ? 'En Camino' : 'Listo para Retirar', emoji: isDelivery ? '🛵' : '🛍️' },
  ];
  const stage = progress < 33 ? 0 : progress < 66 ? 1 : 2;
  const eta = isDelivery ? '30–40 min' : '15–20 min';
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative overflow-hidden bg-[#5B21B6] px-6 pb-24 pt-10 text-center text-white">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#7C3AED] blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-[#4C1D95] blur-3xl" />
        <div className="relative">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-[#5B21B6] shadow-2xl shadow-purple-900/40 rf-burger-in">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <p className="font-script mt-4 text-3xl leading-none text-[#EDE9FE]">¡Qué locura!</p>
          <h3 className="font-display mt-1 text-5xl uppercase leading-none">Pedido #{order.number}</h3>
          <p className="mt-2 text-sm text-white/75">
            {order.city.name} · {order.city.store} · {isDelivery ? 'Delivery' : 'Pick-up'}
          </p>
        </div>
      </div>

      <div className="relative -mt-16 px-4 sm:px-6">
        <div className="rounded-[2rem] border border-[#EDE9FE] bg-white p-5 shadow-xl shadow-purple-500/15">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6D28D9]">Tracking en vivo</p>
            <p className="flex items-center gap-1 text-xs font-bold text-[#1E1035]/60">
              <Clock className="h-3.5 w-3.5" /> {eta}
            </p>
          </div>
          <div className="relative mt-4 h-3 overflow-hidden rounded-full bg-[#EDE9FE]">
            <div className="rf-stripes absolute inset-y-0 left-0 rounded-full bg-[#5B21B6] transition-[width] duration-200 ease-linear" style={{ width: `${Math.max(4, progress)}%` }} />
          </div>
          <ol className="mt-4 grid grid-cols-3 gap-2">
            {steps.map((s, i) => {
              const done = i < stage || progress >= 100;
              const active = i === stage && progress < 100;
              return (
                <li key={s.label} className="text-center">
                  <span
                    className={`mx-auto grid h-12 w-12 place-items-center rounded-full text-xl transition-all duration-500 ${
                      done ? 'bg-[#5B21B6] text-white' : active ? 'scale-110 bg-[#EDE9FE] ring-4 ring-[#5B21B6]/20' : 'bg-[#F8F7FC] opacity-50 grayscale'
                    }`}
                  >
                    {done ? <Check className="h-5 w-5" /> : s.emoji}
                  </span>
                  <span className={`mt-2 block text-[11px] font-bold leading-tight ${done || active ? 'text-[#1E1035]' : 'text-[#1E1035]/40'}`}>
                    {i + 1}. {s.label}
                  </span>
                  {active && <span className="mt-0.5 block text-[10px] font-semibold text-[#6D28D9]">En proceso…</span>}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mini receipt */}
        <div className="mt-5 overflow-hidden">
          <div className="rf-paper font-mono-ticket px-5 pb-4 pt-5 text-[12px] shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-bold">#{order.number}</span>
              <span className="text-[#1E1035]/60">{order.date.toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
            <Dashed />
            {order.lines.map((l) => (
              <div key={l.key} className="flex gap-2">
                <span className="font-bold">{l.qty}×</span>
                <span className="flex-1 truncate uppercase">{l.product.name}</span>
                <span className="tabular-nums">{fmtUSD(l.total)}</span>
              </div>
            ))}
            <Dashed />
            <TicketRow left="TOTAL USD" right={fmtUSD(order.total)} bold />
            <TicketRow left="TOTAL Bs." right={fmtBsPlain(order.total, order.rate)} bold />
            <p className="mt-2 text-[11px] leading-snug text-[#1E1035]/60">PAGO: {order.payment.toUpperCase()}</p>
          </div>
          <div className="rf-zigzag h-3 bg-white" />
        </div>

        <div className="mt-6 space-y-3 pb-8">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-xl shadow-emerald-500/30 transition hover:brightness-105 active:scale-[.99]"
          >
            <MessageCircle className="h-5 w-5" /> Enviar comprobante por WhatsApp
          </a>
          <p className="text-center text-[11px] text-[#1E1035]/50">
            Se abrirá WhatsApp con el resumen de tu pedido para la sede {order.city.name}. Adjunta la captura de tu pago.
          </p>
          <button type="button" onClick={onNew} className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#EDE9FE] bg-white py-3.5 text-sm font-bold text-[#5B21B6] transition hover:border-[#5B21B6]">
            <Plus className="h-4 w-4" /> Hacer un nuevo pedido
          </button>
          <p className="text-center text-[10px] text-[#1E1035]/35">Tasa aplicada: {rate.toFixed(2)} Bs/$</p>
        </div>
      </div>
    </div>
  );
}

function TotalsBlock({ subtotal, deliveryFee, total, rate, mode }) {
  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between text-[#1E1035]/65">
        <span>Subtotal</span>
        <span className="font-semibold tabular-nums">{fmtUSD(subtotal)}</span>
      </div>
      {mode === 'delivery' && (
        <div className="flex justify-between text-[#1E1035]/65">
          <span className="flex items-center gap-1">
            Delivery {deliveryFee === 0 && <span className="rounded-full bg-emerald-100 px-1.5 text-[10px] font-bold text-emerald-700">GRATIS</span>}
          </span>
          <span className="font-semibold tabular-nums">{fmtUSD(deliveryFee)}</span>
        </div>
      )}
      {mode === 'delivery' && deliveryFee > 0 && (
        <p className="text-[11px] font-medium text-[#6D28D9]">Te faltan {fmtUSD(FREE_DELIVERY_FROM - subtotal)} para delivery gratis</p>
      )}
      <div className="flex items-end justify-between border-t border-dashed border-[#EDE9FE] pt-2">
        <span className="font-bold">Total</span>
        <span className="text-right">
          <span className="block font-display text-3xl leading-none text-[#5B21B6]">{fmtUSD(total)}</span>
          <span className="block text-xs font-semibold text-[#1E1035]/50 tabular-nums">{fmtBs(total, rate)}</span>
        </span>
      </div>
    </div>
  );
}

function Stepper({ value, onDec, onInc, small }) {
  const s = small ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <div className="flex items-center gap-1 rounded-full bg-[#F8F7FC] p-1">
      <button type="button" onClick={onDec} className={`${s} grid place-items-center rounded-full bg-white text-[#1E1035] shadow-sm transition hover:bg-[#EDE9FE] active:scale-90`} aria-label="Restar">
        <Minus className="h-4 w-4" />
      </button>
      <span className={`min-w-7 text-center font-extrabold tabular-nums ${small ? 'text-sm' : 'text-base'}`}>{value}</span>
      <button type="button" onClick={onInc} className={`${s} grid place-items-center rounded-full bg-[#5B21B6] text-white shadow-sm shadow-purple-600/30 transition hover:bg-[#6D28D9] active:scale-90`} aria-label="Sumar">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Section({ title, hint, required, children }) {
  return (
    <div className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-extrabold uppercase tracking-wide">{title}</p>
        {required && <span className="rounded-full bg-[#1E1035] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Requerido</span>}
        {hint && <span className="rounded-full bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5B21B6]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[#1E1035]/60">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-semibold text-red-600">{error}</span>}
    </label>
  );
}

function inputCls(err) {
  return `w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm font-medium text-[#1E1035] outline-none transition placeholder:text-[#1E1035]/30 focus:border-[#5B21B6] focus:ring-4 focus:ring-[#5B21B6]/10 ${
    err ? 'border-red-400 bg-red-50/40' : 'border-[#EDE9FE]'
  }`;
}

function AmountBox({ label, value, sub, onCopy }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1E1035] p-4 text-white">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#6D28D9] opacity-60 blur-2xl" />
      <p className="relative text-[10px] font-bold uppercase tracking-widest text-white/60">{label}</p>
      <div className="relative mt-1 flex items-center justify-between gap-2">
        <p className="font-mono-ticket text-2xl font-bold tabular-nums sm:text-[1.7rem]">{value}</p>
        {onCopy && (
          <button type="button" onClick={onCopy} className="flex shrink-0 items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-[11px] font-bold transition hover:bg-white/25">
            <Copy className="h-3.5 w-3.5" /> Monto
          </button>
        )}
      </div>
      {sub && <p className="relative mt-1 text-[11px] text-white/55">{sub}</p>}
    </div>
  );
}

function InfoNote({ children, icon: Icon = Info }) {
  return (
    <div className="flex gap-2.5 rounded-2xl bg-[#EDE9FE] p-3 text-xs leading-relaxed text-[#1E1035]/80">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#5B21B6]" />
      <p>{children}</p>
    </div>
  );
}

function TicketRow({ left, right, muted, bold }) {
  return (
    <div className={`flex justify-between gap-3 leading-relaxed ${muted ? 'text-[#1E1035]/50' : ''} ${bold ? 'font-bold' : ''}`}>
      <span>{left}</span>
      <span className="text-right tabular-nums">{right}</span>
    </div>
  );
}

function Dashed() {
  return <div className="my-3 border-t-2 border-dashed border-[#1E1035]/25" />;
}
