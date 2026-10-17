function Bottle() {
  return (
    <svg viewBox="0 0 160 320" className="sm-bottle" data-float aria-hidden="true">
      <defs>
        <linearGradient id="sm-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#d9e1e6" />
          <stop offset="0.25" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f3f6f8" />
          <stop offset="1" stopColor="#c3cdd4" />
        </linearGradient>
        <linearGradient id="sm-cap" x1="0" x2="1">
          <stop offset="0" stopColor="#1b4fa8" />
          <stop offset="0.5" stopColor="#3d7be0" />
          <stop offset="1" stopColor="#163f86" />
        </linearGradient>
      </defs>
      <rect x="56" y="6" width="48" height="30" rx="6" fill="url(#sm-cap)" />
      <path
        d="M60 36h40v34c0 12 30 26 30 58v168c0 12-8 20-20 20H50c-12 0-20-8-20-20V128c0-32 30-46 30-58z"
        fill="url(#sm-glass)"
      />
      <rect x="34" y="150" width="92" height="96" rx="6" fill="#ffffff" stroke="#e3e9ee" />
      <text x="80" y="188" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1b2330">
        Organic
      </text>
      <text x="80" y="214" textAnchor="middle" fontSize="26" fontWeight="900" fill="#1b2330">
        milk
      </text>
      <circle cx="80" cy="232" r="7" fill="#2f6fd6" />
      <rect x="106" y="94" width="58" height="22" rx="3" fill="#3d7be0" transform="rotate(-48 135 105)" />
    </svg>
  );
}

function Coconut({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} data-float aria-hidden="true">
      <defs>
        <radialGradient id="sm-shell" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#9a6a43" />
          <stop offset="1" stopColor="#3f2614" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#sm-shell)" />
      <circle cx="60" cy="60" r="44" fill="#fbf8f2" />
      <circle cx="60" cy="60" r="34" fill="#f1ece2" />
    </svg>
  );
}

export default function SimplyMilkScreen() {
  return (
    <div className="scr scr-milk">
      <div className="sm-word sm-word-a">milk</div>
      <div className="sm-word sm-word-b">organic</div>
      <header className="scr-nav scr-nav-dark">
        <b>Simply Milk</b>
        <nav>
          <span>Home</span>
          <span>Catalog</span>
          <span>Juices</span>
          <span>Milk</span>
        </nav>
        <span className="scr-pill">Contact</span>
      </header>
      <Coconut className="sm-coco sm-coco-a" />
      <Coconut className="sm-coco sm-coco-b" />
      <Bottle />
      <span className="sm-cta">Open Details</span>
    </div>
  );
}
