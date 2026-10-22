import { site } from "@/config/site";
import { trackAttrs } from "@/lib/analytics";

const { email, whatsapp, instagram } = site.contact;

/**
 * Canales del cierre. Solo se publican los que tienen dato real en site.contact; sin dato,
 * en desarrollo se ven como "próximamente" (para recordar que faltan) y en producción no aparecen.
 */
const dev = process.env.NODE_ENV === "development";
const channels = [
  { label: "Instagram", href: instagram ? `https://instagram.com/${instagram}` : "" },
  { label: "WhatsApp", href: whatsapp ? `https://wa.me/${whatsapp}` : "" },
  { label: "Email", href: email ? `mailto:${email}` : "" },
];

export function Channels() {
  return (
    <div className="container final__foot">
      <ul className="final__channels">
        {channels.map((c) =>
          !c.href && !dev ? null : c.href ? (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                {...(c.label === "WhatsApp" ? trackAttrs("whatsapp_clicked", { from: "footer" }) : {})}
              >
                {c.label}
              </a>
            </li>
          ) : (
            <li key={c.label} className="is-pending">
              {c.label} <small>próximamente</small>
            </li>
          ),
        )}
      </ul>
      <p className="final__copy">© {new Date().getFullYear()} Fary Labs</p>
    </div>
  );
}
