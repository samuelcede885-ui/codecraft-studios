import { site } from "@/config/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo className="logo--light" />
        <nav aria-label="Pie de página" className="footer__nav">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <p className="footer__copy">
          © {new Date().getFullYear()} Fary Labs. {site.tagline}
        </p>
      </div>
    </footer>
  );
}
