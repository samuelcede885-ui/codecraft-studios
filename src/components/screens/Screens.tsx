import type { ScreenId } from "@/data/content";

/*
 * Pantallas conceptuales que se muestran dentro de la laptop y en el portafolio.
 * Son interfaces dibujadas en HTML/SVG a partir de la dirección visual de las
 * referencias; se escalan con unidades de contenedor (cqw).
 */

function MiniNav({ brand, links, dark }: { brand: string; links: string[]; dark?: boolean }) {
  return (
    <div className={`sc-nav ${dark ? "sc-nav--dark" : ""}`}>
      <span className="sc-nav__brand">{brand}</span>
      <span className="sc-nav__links">
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </span>
      <span className="sc-nav__burger" />
    </div>
  );
}

function GrenadeBottle({ p }: { p: string }) {
  const bumps = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 6; col++) {
      bumps.push(
        <rect
          key={`${row}-${col}`}
          x={36 + col * 22 + (row % 2) * 4}
          y={92 + row * 22}
          width={18}
          height={18}
          rx={7}
          fill={`url(#${p}gr-bump)`}
        />,
      );
    }
  }
  return (
    <svg viewBox="0 0 200 270" className="sc-greenade__product" aria-hidden="true">
      <defs>
        <radialGradient id={p + "gr-body"} cx="38%" cy="35%" r="75%">
          <stop offset="0" stopColor="#b7f36b" />
          <stop offset="0.45" stopColor="#4fb51f" />
          <stop offset="1" stopColor="#14460a" />
        </radialGradient>
        <linearGradient id={p + "gr-bump"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c6ff86" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#3f9a18" stopOpacity="0.2" />
          <stop offset="1" stopColor="#0f3a06" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={p + "gr-metal"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2c6d14" />
          <stop offset="0.5" stopColor="#8fdc4c" />
          <stop offset="1" stopColor="#1f5a0c" />
        </linearGradient>
        <clipPath id={p + "gr-clip"}>
          <ellipse cx="100" cy="168" rx="72" ry="92" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="262" rx="62" ry="7" fill="#0b2a05" opacity="0.45" />
      <path d="M118 52 q42 6 46 58 l-9 2 q-6 -44 -38 -48z" fill={`url(#${p}gr-metal)`} />
      <circle cx="70" cy="58" r="15" fill="none" stroke="#98e655" strokeWidth="5" />
      <rect x="76" y="46" width="48" height="34" rx="6" fill={`url(#${p}gr-metal)`} />
      <ellipse cx="100" cy="168" rx="72" ry="92" fill={`url(#${p}gr-body)`} />
      <g clipPath={`url(#${p}gr-clip)`}>{bumps}</g>
      <ellipse cx="74" cy="122" rx="16" ry="30" fill="#e9ffd0" opacity="0.25" />
    </svg>
  );
}

function MilkBottle({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 120 270" className="sc-milk__product" aria-hidden="true">
      <defs>
        <linearGradient id={p + "mk-glass"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dfe6ee" />
          <stop offset="0.35" stopColor="#ffffff" />
          <stop offset="0.8" stopColor="#f1f4f8" />
          <stop offset="1" stopColor="#c9d2dd" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="264" rx="44" ry="5" fill="#8aa1b8" opacity="0.35" />
      <rect x="42" y="4" width="36" height="22" rx="4" fill="#2a63c8" />
      <path
        d="M46 26 h28 v22 q0 14 18 30 q14 12 14 34 v140 q0 10 -10 10 h-72 q-10 0 -10 -10 v-140 q0 -22 14 -34 q18 -16 18 -30z"
        fill={`url(#${p}mk-glass)`}
      />
      <rect x="14" y="132" width="92" height="76" rx="3" fill="#ffffff" />
      <text x="60" y="160" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d2b3c">
        Organic
      </text>
      <text x="60" y="186" textAnchor="middle" fontSize="24" fontWeight="800" fill="#1d2b3c">
        milk
      </text>
      <circle cx="60" cy="198" r="4" fill="#2a63c8" />
      <rect x="26" y="70" width="8" height="160" rx="4" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}

function ProteinTub({ p, small }: { p: string; small?: boolean }) {
  return (
    <svg viewBox="0 0 160 190" className={small ? "sc-syntha__tub--small" : "sc-syntha__tub"} aria-hidden="true">
      <defs>
        <linearGradient id={p + "sy-tub"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a0a0c" />
          <stop offset="0.3" stopColor="#b3161c" />
          <stop offset="0.6" stopColor="#e2262c" />
          <stop offset="1" stopColor="#5a0d10" />
        </linearGradient>
        <linearGradient id={p + "sy-lid"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#111" />
          <stop offset="0.5" stopColor="#3b3b3b" />
          <stop offset="1" stopColor="#0c0c0c" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="184" rx="66" ry="5" fill="#000" opacity="0.3" />
      <rect x="18" y="6" width="124" height="30" rx="6" fill={`url(#${p}sy-lid)`} />
      <rect x="14" y="34" width="132" height="148" rx="10" fill={`url(#${p}sy-tub)`} />
      <rect x="14" y="78" width="132" height="54" fill="#111" opacity="0.85" />
      <text x="80" y="104" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff" letterSpacing="1">
        SYNTHA-6
      </text>
      <text x="80" y="122" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ff5a5f" letterSpacing="2">
        PROTEIN
      </text>
    </svg>
  );
}

function GreenadeScreen({ p }: { p: string }) {
  return (
    <div className="sc sc-greenade">
      <MiniNav brand="GREENADE" links={["Inicio", "Sabores", "Contacto"]} />
      <div className="sc-greenade__copy">
        <span className="sc-greenade__num">01</span>
        <span className="sc-greenade__kicker">
          Energía
          <br />
          natural
        </span>
        <span className="sc-pill sc-pill--ghost">Descubrir</span>
      </div>
      <GrenadeBottle p={p} />
      <div className="sc-greenade__dots">
        <i className="is-on" />
        <i />
        <i />
      </div>
      <div className="sc-greenade__title">GREENADE!</div>
    </div>
  );
}

function MilkScreen({ p }: { p: string }) {
  return (
    <div className="sc sc-milk">
      <MiniNav brand="Simply Milk" links={["Inicio", "Catálogo", "Origen", "Granjas"]} />
      <div className="sc-milk__bg" aria-hidden="true">
        <span>milk</span>
        <span>organic</span>
      </div>
      <span className="sc-milk__circle sc-milk__circle--a" />
      <span className="sc-milk__circle sc-milk__circle--b" />
      <MilkBottle p={p} />
      <span className="sc-milk__tag">100% natural</span>
      <span className="sc-pill sc-milk__cta">Ver productos</span>
    </div>
  );
}

function SynthaScreen({ p }: { p: string }) {
  return (
    <div className="sc sc-syntha">
      <div className="sc-syntha__hero">
        <span className="sc-syntha__brand">● SYNTHA</span>
        <span className="sc-syntha__title">
          PROTEIN
          <br />
          SYNTHA-6
        </span>
        <span className="sc-syntha__meta">22 g proteína</span>
        <ProteinTub p={p} />
      </div>
      <div className="sc-syntha__shop">
        <div className="sc-syntha__head">
          <span>Categorías</span>
          <i />
        </div>
        <div className="sc-syntha__chips">
          <span>Todo</span>
          <span className="is-on">Proteína</span>
          <span>Energía</span>
        </div>
        <div className="sc-syntha__cards">
          <div className="sc-syntha__card">
            <span>Syntha-6 Cold Stone</span>
            <ProteinTub p={p + "a"} small />
          </div>
          <div className="sc-syntha__card">
            <span>Pre-entreno Edge</span>
            <ProteinTub p={p + "b"} small />
          </div>
        </div>
      </div>
    </div>
  );
}

function DepthfieldScreen({ p }: { p: string }) {
  return (
    <div className="sc sc-depth">
      <svg className="sc-depth__scene" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id={p + "df-sun"} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ff3b2f" />
            <stop offset="0.7" stopColor="#d4140c" />
            <stop offset="1" stopColor="#7a0703" />
          </radialGradient>
          <radialGradient id={p + "df-glow"} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ff2a1a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff2a1a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={p + "df-sky"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a2329" />
            <stop offset="1" stopColor="#3a1612" />
          </linearGradient>
        </defs>
        <rect width="400" height="250" fill={`url(#${p}df-sky)`} />
        <circle cx="220" cy="100" r="110" fill={`url(#${p}df-glow)`} />
        <circle cx="220" cy="100" r="62" fill={`url(#${p}df-sun)`} />
        <path d="M0 170 L60 120 L110 150 L170 105 L230 150 L300 112 L360 140 L400 125 V250 H0z" fill="#170c0b" />
        <path d="M0 200 L80 160 L150 185 L230 158 L320 190 L400 170 V250 H0z" fill="#0c0606" />
        <path
          d="M216 92 q4 -10 10 0 q2 6 -1 10 l3 2 q6 4 6 16 l0 26 l-4 0 l-2 26 l-4 0 l-1 -24 l-2 0 l-1 24 l-4 0 l-2 -26 l-4 0 l0 -26 q0 -12 6 -16 l3 -2 q-3 -4 -3 -10z"
          fill="#050303"
        />
      </svg>
      <MiniNav brand="DEPTHFIELD STUDIO" links={["Estudio", "Servicios", "Proyectos", "Contacto"]} dark />
      <span className="sc-depth__claim">
        Más allá
        <br />
        de la pantalla.
      </span>
      <span className="sc-depth__link">Ver proyectos →</span>
      <span className="sc-depth__title">DEPTH</span>
    </div>
  );
}

function Spark({ points, color = "#2f6bff" }: { points: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="sc-dash__spark" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function DashboardScreen() {
  return (
    <div className="sc sc-dash">
      <aside className="sc-dash__side">
        <span className="sc-dash__brand">
          Fary
          <br />
          Dashboard
        </span>
        {["Resumen", "Analítica", "Productos", "Clientes", "Ajustes"].map((l, i) => (
          <span key={l} className={i === 0 ? "is-on" : undefined}>
            {l}
          </span>
        ))}
      </aside>
      <div className="sc-dash__main">
        <div className="sc-dash__top">
          <span>Resumen</span>
          <span className="sc-dash__badge">Datos de ejemplo</span>
        </div>
        <div className="sc-dash__grid">
          <div className="sc-dash__card">
            <small>Ventas totales</small>
            <b>$12,430</b>
            <Spark points="0,24 12,20 24,22 36,14 48,17 60,10 72,13 84,6 100,8" />
          </div>
          <div className="sc-dash__card">
            <small>Usuarios</small>
            <b>1,240</b>
            <div className="sc-dash__bars" aria-hidden="true">
              {[30, 45, 38, 52, 48, 60, 56, 72, 66, 84, 78, 95].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="sc-dash__card">
            <small>Productos</small>
            <b>24</b>
            <Spark points="0,22 14,18 28,20 42,12 56,15 70,9 84,12 100,5" />
          </div>
          <div className="sc-dash__card">
            <small>Conversión</small>
            <b>3.6%</b>
            <Spark points="0,18 14,20 28,14 42,16 56,11 70,13 84,8 100,10" color="#9aa3b2" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** `uid` debe ser único por instancia para no duplicar ids de gradientes SVG. */
export function Screen({ id, uid }: { id: ScreenId; uid: string }) {
  const p = `${uid}-`;
  switch (id) {
    case "greenade":
      return <GreenadeScreen p={p} />;
    case "milk":
      return <MilkScreen p={p} />;
    case "syntha":
      return <SynthaScreen p={p} />;
    case "depthfield":
      return <DepthfieldScreen p={p} />;
    case "dashboard":
      return <DashboardScreen />;
  }
}
