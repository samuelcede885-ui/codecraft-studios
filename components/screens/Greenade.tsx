// Pantalla demo inspirada en la referencia GREENADE. Todo se dimensiona en cqw
// respecto al ancho de la pantalla de la laptop, así que escala sin perder nitidez.

const bumps = Array.from({ length: 7 }, (_, row) =>
  Array.from({ length: 6 }, (_, col) => ({
    cx: 38 + col * 25 + (row % 2) * 12.5,
    cy: 92 + row * 24,
  })),
).flat();

function Grenade() {
  return (
    <svg viewBox="0 0 200 280" className="gr-grenade" data-float aria-hidden="true">
      <defs>
        <radialGradient id="gr-body" cx="38%" cy="35%" r="75%">
          <stop offset="0" stopColor="#b8f27a" />
          <stop offset="0.45" stopColor="#5cbf2c" />
          <stop offset="1" stopColor="#1f6b12" />
        </radialGradient>
        <radialGradient id="gr-bump" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#d4ff9c" />
          <stop offset="0.5" stopColor="#6ccb34" />
          <stop offset="1" stopColor="#2b7d18" />
        </radialGradient>
        <linearGradient id="gr-metal" x1="0" x2="1">
          <stop offset="0" stopColor="#2f7d1d" />
          <stop offset="0.5" stopColor="#8ede55" />
          <stop offset="1" stopColor="#25661a" />
        </linearGradient>
        <clipPath id="gr-clip">
          <ellipse cx="100" cy="170" rx="74" ry="98" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="170" rx="74" ry="98" fill="url(#gr-body)" />
      <g clipPath="url(#gr-clip)">
        {bumps.map((b, i) => (
          <ellipse key={i} cx={b.cx} cy={b.cy} rx="12" ry="11" fill="url(#gr-bump)" />
        ))}
      </g>
      <rect x="72" y="62" width="56" height="26" rx="6" fill="url(#gr-metal)" />
      <rect x="80" y="44" width="40" height="22" rx="5" fill="url(#gr-metal)" />
      <path d="M118 52c22-6 38 4 44 30l6 56-12 2-8-52c-3-14-12-22-28-22z" fill="url(#gr-metal)" />
      <circle cx="70" cy="50" r="14" fill="none" stroke="#9be563" strokeWidth="5" />
    </svg>
  );
}

export default function GreenadeScreen() {
  return (
    <div className="scr scr-greenade">
      <header className="scr-nav">
        <b>GREENADE</b>
        <nav>
          <span>Home</span>
          <span>Juices &amp; Bowls</span>
          <span>Contact</span>
        </nav>
        <span className="scr-burger" />
      </header>
      <div className="gr-copy" data-float>
        <span className="gr-num">01</span>
        <p>
          A HEALTHY
          <br />
          EXPLOSION
        </p>
        <span className="gr-btn">SHOP NOW</span>
      </div>
      <Grenade />
      <div className="gr-dots">
        <i className="is-on" />
        <i />
        <i />
      </div>
      <div className="gr-title">GREENADE!</div>
    </div>
  );
}
