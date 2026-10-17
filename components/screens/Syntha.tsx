function Tub({ className, label = "SYNTHA" }: { className: string; label?: string }) {
  return (
    <svg viewBox="0 0 140 170" className={className} data-float aria-hidden="true">
      <defs>
        <linearGradient id="sy-jar" x1="0" x2="1">
          <stop offset="0" stopColor="#0b0b0b" />
          <stop offset="0.35" stopColor="#3a3a3a" />
          <stop offset="1" stopColor="#060606" />
        </linearGradient>
        <linearGradient id="sy-label" x1="0" x2="1">
          <stop offset="0" stopColor="#a90f14" />
          <stop offset="0.4" stopColor="#ff3a33" />
          <stop offset="1" stopColor="#8c0b10" />
        </linearGradient>
      </defs>
      <rect x="14" y="4" width="112" height="30" rx="8" fill="url(#sy-jar)" />
      <rect x="8" y="30" width="124" height="136" rx="14" fill="url(#sy-jar)" />
      <rect x="8" y="62" width="124" height="74" fill="url(#sy-label)" />
      <text x="70" y="108" textAnchor="middle" fontSize="24" fontWeight="900" fill="#fff" letterSpacing="-1">
        {label}
      </text>
      <circle cx="70" cy="48" r="8" fill="#ff3a33" />
    </svg>
  );
}

export default function SynthaScreen() {
  return (
    <div className="scr scr-syntha">
      <section className="sy-left">
        <span className="sy-badge" />
        <h3>
          PROTEIN
          <br />
          SYNTHA-6
        </h3>
        <p className="sy-small">
          <b>22g</b> protein per serving
        </p>
        <Tub className="sy-tub" />
      </section>
      <section className="sy-right">
        <div className="sy-head">
          <b>Category</b>
          <span className="sy-close" />
        </div>
        <div className="sy-chips">
          <span>GM</span>
          <span className="is-on">BSN</span>
          <span>LAN</span>
          <span>ON</span>
        </div>
        <div className="sy-cards">
          <article data-float>
            <small>PROTEIN</small>
            <b>SYNTHA-6 Cold Stone Creamery</b>
            <Tub className="sy-card-tub" />
          </article>
          <article data-float>
            <small>PRE-WORKOUT</small>
            <b>ENDORUSH</b>
            <Tub className="sy-card-tub" label="RUSH" />
          </article>
        </div>
      </section>
    </div>
  );
}
