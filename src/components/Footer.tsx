import { site } from "@/config/site";

const { email, whatsapp, instagram } = site.contact;

/** Canales del cierre. Sin dato configurado se muestran como "próximamente", nunca con un enlace inventado. */
const channels = [
  { label: "Instagram", href: instagram ? `https://instagram.com/${instagram}` : "" },
  { label: "WhatsApp", href: whatsapp ? `https://wa.me/${whatsapp}` : "" },
  { label: "Email", href: email ? `mailto:${email}` : "" },
];

export function Footer() {
  return (
    <footer className="container final__foot">
      <ul className="final__channels">
        {channels.map((c) =>
          c.href ? (
            <li key={c.label}>
              <a
                href={c.href}
                className="link-line"
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
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
    </footer>
  );
}
