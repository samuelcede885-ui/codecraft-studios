import type { ScreenId } from "@/data/content";

/*
 * Pantallas que se muestran dentro de la laptop y en el portafolio.
 * Las cuatro primeras son imágenes de referencia (public/projects, 16:10);
 * el panel de métricas es una interfaz propia en HTML.
 */

const images: Record<Exclude<ScreenId, "dashboard">, { src: string; alt: string; width: number; height: number }> = {
  greenade: {
    src: "/projects/greenade.webp",
    alt: "Referencia Greenade: landing verde con un producto central y el titular GREENADE! en gran tamaño",
    width: 1036,
    height: 648,
  },
  milk: {
    src: "/projects/simply-milk.webp",
    alt: "Referencia Simply Milk: botellas de leche orgánica y cocos sobre fondo claro con tipografía gigante",
    width: 1199,
    height: 749,
  },
  syntha: {
    src: "/projects/syntha-6.webp",
    alt: "Referencia Syntha-6: app móvil de tienda de proteínas en rojo y blanco",
    width: 1376,
    height: 860,
  },
  depthfield: {
    src: "/projects/depthfield.webp",
    alt: "Referencia Depthfield: escena oscura con un círculo rojo, una figura y la palabra FORM en gran tamaño",
    width: 1099,
    height: 687,
  },
};

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

/** `priority`: la primera pantalla visible (LCP) se carga sin lazy-loading. */
export function Screen({ id, priority, lazy }: { id: ScreenId; priority?: boolean; lazy?: boolean }) {
  if (id === "dashboard") return <DashboardScreen />;
  const img = images[id];
  return (
    <div className="sc">
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes */}
      <img
        className="sc-img"
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        decoding="async"
        loading={lazy ? "lazy" : "eager"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
      />
    </div>
  );
}
