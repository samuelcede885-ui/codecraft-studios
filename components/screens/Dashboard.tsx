// Dashboard conceptual de Fary Labs. Las cifras son datos de ejemplo y así se indica en pantalla.

const line = "0,34 14,30 28,32 42,22 56,26 70,16 84,20 100,8";
const line2 = "0,30 14,28 28,31 42,26 56,24 70,25 84,18 100,14";
const bars = [10, 14, 9, 16, 12, 18, 15, 22, 19, 28];

function Card({ label, value, delta, children }: { label: string; value: string; delta: string; children: React.ReactNode }) {
  return (
    <article className="db-card" data-float>
      <div className="db-card-head">
        <small>{label}</small>
        <em>{delta}</em>
      </div>
      <b>{value}</b>
      {children}
    </article>
  );
}

export default function DashboardScreen() {
  return (
    <div className="scr scr-dash">
      <aside className="db-side">
        <b className="db-logo">
          Fary
          <br />
          <span>Dashboard</span>
        </b>
        {["Overview", "Analytics", "Products", "Customers", "Settings"].map((item, i) => (
          <span key={item} className={i === 0 ? "is-on" : undefined}>
            <i />
            {item}
          </span>
        ))}
      </aside>
      <main className="db-main">
        <div className="db-top">
          <span className="db-search">Buscar…</span>
          <span className="db-sample">Datos de ejemplo</span>
          <span className="db-avatar" />
        </div>
        <div className="db-grid">
          <Card label="Ventas totales" value="$12,430" delta="+12%">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="db-chart" aria-hidden="true">
              <polyline points={line} fill="none" stroke="#3b6cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </Card>
          <Card label="Usuarios" value="1,240" delta="+8%">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="db-chart" aria-hidden="true">
              {bars.map((h, i) => (
                <rect key={i} x={i * 10 + 2} y={40 - h} width="6" height={h} rx="1" fill="#3b6cf6" opacity={0.45 + i * 0.055} />
              ))}
            </svg>
          </Card>
          <Card label="Productos" value="24" delta="+6%">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="db-chart" aria-hidden="true">
              <polygon points={`${line2} 100,40 0,40`} fill="#3b6cf6" opacity="0.14" />
              <polyline points={line2} fill="none" stroke="#3b6cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </Card>
          <Card label="Conversión" value="3.6%" delta="+1.2%">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="db-chart" aria-hidden="true">
              <polyline points={line} fill="none" stroke="#9aa3b2" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </Card>
        </div>
      </main>
    </div>
  );
}
