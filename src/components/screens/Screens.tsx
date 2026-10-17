import { LogoMark } from "../Logo";
import type { ScreenId } from "@/data/screens";

/*
 * Pantallas que se muestran dentro de la laptop y en el portafolio.
 * Las cuatro primeras reconstruyen en HTML la tienda Gramercy (diseño 16:9) para poder
 * animar cada pieza; el zueco es un recorte con transparencia en public/projects.
 * Los atributos data-gm son los puntos de anclaje de las animaciones de ShowcaseStory.
 */

const SHOE = "/projects/gramercy-shoe.webp";
const LOGO = "/projects/gramercy-logo.webp";
const SHOE_CLEAN = "/projects/gramercy-shoe-clean.webp";

/** `clean`: versión sin sombra, para la portada donde el zueco va sobre las letras. */
function Shoe({ className, lazy, clean }: { className: string; lazy?: boolean; clean?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- export estático sin optimizador de imágenes
    <img
      className={`sc-img ${className}`}
      src={clean ? SHOE_CLEAN : SHOE}
      alt="Zueco Birkenstock Boston de ante color taupe"
      width={clean ? 804 : 809}
      height={clean ? 710 : 754}
      decoding="async"
      loading={lazy ? "lazy" : "eager"}
      draggable={false}
      data-gm="shoe"
    />
  );
}

function GmHeader() {
  return (
    <div className="gm-header" aria-hidden="true">
      <span className="gm-header__menu">
        <i />
        <i />
        <i />
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- logo recortado del diseño original */}
      <img className="sc-img gm-header__logo" src={LOGO} alt="Gramercy" width={265} height={88} draggable={false} />
      <svg className="gm-header__search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
        <circle cx="10" cy="10" r="6.5" />
        <path d="M15 15l6 6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function PayBadge({ kind }: { kind: "pm" | "bn" | "ef" }) {
  if (kind === "pm")
    return (
      <span className="gm-badge gm-badge--pm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <rect x="7" y="3" width="10" height="18" rx="2" />
        </svg>
        Pago Móvil
      </span>
    );
  if (kind === "bn")
    return (
      <span className="gm-badge gm-badge--bn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3l3 3-3 3-3-3zM6 9l3 3-3 3-3-3zM18 9l3 3-3 3-3-3zM12 15l3 3-3 3-3-3zM12 9.5l2.5 2.5-2.5 2.5L9.5 12z" />
        </svg>
        BINANCE
      </span>
    );
  return (
    <span className="gm-badge gm-badge--ef">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <rect x="2.5" y="6" width="19" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.6" />
      </svg>
      Efectivo
    </span>
  );
}

function HomeScreen({ lazy }: { lazy?: boolean }) {
  return (
    <div className="sc gm gm-home">
      <GmHeader />
      <span className="gm-home__birken" data-gm="birken">
        BIRKEN
      </span>
      <Shoe className="gm-home__shoe" lazy={lazy} clean />
      <span className="gm-home__boston" data-gm="boston">
        BOSTON
      </span>
      <span className="gm-btn gm-btn--dark gm-home__order" data-gm="order">
        ORDER NOW
      </span>
    </div>
  );
}

function ProductScreen({ lazy }: { lazy?: boolean }) {
  return (
    <div className="sc gm gm-product">
      <GmHeader />
      <Shoe className="gm-side-shoe" lazy={lazy} />
      <div className="gm-panel" data-gm="panel">
        <span className="gm-title" data-gm="item">
          BIRKENSTOCK
        </span>
        <span className="gm-subtitle" data-gm="item">
          BOSTON
        </span>
        <span className="gm-price" data-gm="item">
          $50.00
        </span>
        <span className="gm-pill gm-pill--dark gm-delivery" data-gm="item">
          DELIVERY GRATIS
          <svg viewBox="0 0 32 20" fill="currentColor" aria-hidden="true">
            <path d="M10 3h12v11H10zM22 7h5l3 4v3h-8z" />
            <path d="M1 6h7M3 9h5M0 12h8" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="14" cy="16" r="2.4" />
            <circle cx="26" cy="16" r="2.4" />
          </svg>
        </span>
        <span className="gm-mini-badges" data-gm="item">
          <PayBadge kind="pm" />
          <PayBadge kind="bn" />
          <PayBadge kind="ef" />
        </span>
        <span className="gm-stock" data-gm="item">
          <span className="gm-qty">
            <b>−</b>
            <span className="gm-qty__n" data-gm="qty">
              1
            </span>
            <b>+</b>
          </span>
          <span className="gm-stock__head">
            <span>STOCK</span>
            <span>22 PAR</span>
          </span>
          <span className="gm-stock__bar">
            <span className="gm-stock__fill" data-gm="fill" />
          </span>
        </span>
        <span className="gm-desc-title" data-gm="item">
          DESCRIPCIÓN
        </span>
        <span className="gm-desc" data-gm="item">
          Diseñadas en Alemania desde 1774, las Birkenstock combinan artesanía y comodidad atemporal en una pieza que
          no necesita presentación. Su icónica plantilla anatómica de corcho y látex natural se adapta a la forma de tu
          pie con cada paso, mientras que la suela ligera y las correas de cuero de primera calidad garantizan
          durabilidad y un ajuste impecable.
        </span>
        <span className="gm-btn gm-btn--tan gm-product__cta" data-gm="item">
          ADD TO CART
        </span>
      </div>
    </div>
  );
}

const SIZES = [37, 38, 39, 40, 41, 42, 43];

function CartScreen({ lazy }: { lazy?: boolean }) {
  return (
    <div className="sc gm gm-cart">
      <GmHeader />
      <div className="gm-cart__left">
        <span className="gm-pill gm-pill--dark gm-cart__label" data-gm="left">
          CARRITO
        </span>
        <span className="gm-cart__qty" data-gm="left">
          <b>−</b> 1 BIRKENSTOCK <b>+</b>
        </span>
        <span className="gm-pill gm-pill--dark gm-cart__tag" data-gm="left">
          TALLAS
        </span>
        <span className="gm-sizes" data-gm="left">
          {SIZES.map((n) => (
            <span key={n} className={n === 41 ? "is-on" : undefined} data-gm="size">
              {n}
            </span>
          ))}
        </span>
        <span className="gm-pill gm-pill--dark gm-cart__tag" data-gm="left">
          UBICACIÓN
        </span>
        <span className="gm-address" data-gm="left">
          <span data-gm="typed" data-text="CARACAS LOS SAMANES">
            CARACAS LOS SAMANES
          </span>
          <i className="gm-caret" />
        </span>
      </div>
      <div className="gm-panel gm-cart__panel" data-gm="panel">
        <span className="gm-cart__item" data-gm="item">
          <span className="gm-thumb">
            <Shoe className="gm-thumb__shoe" lazy={lazy} clean />
          </span>
          <span className="gm-cart__name">
            <b>1 BIRKENSTOCK</b>
            <small>TALLA 41</small>
          </span>
        </span>
        <span className="gm-toast" data-gm="toast">
          1 PAR AGREGADO AL CARRITO
        </span>
        <span className="gm-totals" data-gm="item">
          <span>
            PRODUCTO <b>$50.00</b>
          </span>
          <span>
            DELIVERY <b>$0.00</b>
          </span>
          <span>
            TOTAL <b>$50.00</b>
          </span>
        </span>
        <span className="gm-btn gm-btn--tan gm-cart__pay" data-gm="item">
          PAGAR $50.00
        </span>
      </div>
    </div>
  );
}

function PaymentScreen({ lazy }: { lazy?: boolean }) {
  return (
    <div className="sc gm gm-payment">
      <GmHeader />
      <Shoe className="gm-side-shoe" lazy={lazy} />
      <div className="gm-panel" data-gm="panel">
        <span className="gm-title" data-gm="item">
          BIRKENSTOCK
        </span>
        <span className="gm-subtitle" data-gm="item">
          BOSTON
        </span>
        <span className="gm-pill gm-pill--dark gm-payment__tag" data-gm="item">
          MÉTODOS DE PAGO
        </span>
        <span className="gm-methods">
          {(
            [
              ["pm", "PAGO MÓVIL"],
              ["bn", "BINANCE"],
              ["ef", "EFECTIVO"],
            ] as const
          ).map(([k, label]) => (
            <span key={k} className="gm-method" data-gm="row">
              <PayBadge kind={k} />
              {label}
            </span>
          ))}
        </span>
      </div>
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
          <LogoMark className="sc-dash__mark" />
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

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Concepto: asistente que gestiona reservas por chat. */
function AgentScreen() {
  return (
    <div className="sc sc-agent">
      <div className="sc-agent__chat">
        <div className="sc-agent__head">
          <span className="sc-agent__avatar" />
          <span>
            <b>Asistente</b>
            <small>En línea</small>
          </span>
        </div>
        <div className="sc-agent__msgs">
          <p className="is-user">Hola, ¿tienen disponibilidad el sábado?</p>
          <p>Sí. Hay horarios a las 10:00 y a las 12:30. ¿Cuál prefieres?</p>
          <p className="is-user">12:30, por favor.</p>
          <p>
            Listo. Tu reserva quedó confirmada para el sábado a las 12:30.
          </p>
        </div>
        <div className="sc-agent__input">Escribe un mensaje…</div>
      </div>
      <aside className="sc-agent__flow">
        <small>Automatización</small>
        {["Consulta recibida", "Horario reservado", "Calendario actualizado", "Confirmación enviada"].map((t) => (
          <span key={t}>
            <Check />
            {t}
          </span>
        ))}
        <em>Datos de ejemplo</em>
      </aside>
    </div>
  );
}

/** Concepto: portada editorial de un estudio de arquitectura. */
function StudioScreen() {
  return (
    <div className="sc sc-studio">
      <div className="sc-studio__nav">
        <b>NORTE</b>
        <span>Proyectos</span>
        <span>Estudio</span>
        <span>Contacto</span>
      </div>
      <div className="sc-studio__shapes" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p className="sc-studio__claim">
        Arquitectura
        <br />
        que se habita.
      </p>
      <span className="sc-studio__title">NORTE</span>
    </div>
  );
}

/** `lazy`: carga diferida del zueco en pantallas fuera de la vista inicial. */
export function Screen({ id, lazy }: { id: ScreenId; lazy?: boolean }) {
  switch (id) {
    case "home":
      return <HomeScreen lazy={lazy} />;
    case "product":
      return <ProductScreen lazy={lazy} />;
    case "cart":
      return <CartScreen lazy={lazy} />;
    case "payment":
      return <PaymentScreen lazy={lazy} />;
    case "dashboard":
      return <DashboardScreen />;
    case "agent":
      return <AgentScreen />;
    case "studio":
      return <StudioScreen />;
  }
}
