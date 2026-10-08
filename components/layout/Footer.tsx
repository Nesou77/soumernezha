import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import type { Dictionary } from "@/lib/i18n";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { cvFor, site } from "@/lib/site";
import type { NavItem } from "@/types";

interface FooterProps {
  locale: Locale;
  t: Dictionary["footer"];
  nav: NavItem[];
  role: string;
  cvLabel: string;
  newTab: string;
}

const linkClass = "link-underline text-muted transition-colors hover:text-fg";

export function Footer({ locale, t, nav, role, cvLabel, newTab }: FooterProps) {
  const cv = cvFor(locale);
  return (
    <footer className="border-t border-line">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Link href={localizePath(locale, "/")} className="inline-flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <span className="font-display text-lg">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted">{role}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted">{t.motto}</p>
        </div>

        <nav aria-labelledby="footer-pages" className="lg:col-span-3">
          <h2 id="footer-pages" className="eyebrow mb-4 text-muted">
            {t.pages}
          </h2>
          <ul className="space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.id}>
                <Link href={localizePath(locale, item.href)} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="eyebrow mb-4 text-muted">{t.contact}</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                LinkedIn<span className="sr-only"> {newTab}</span>
              </a>
            </li>
            <li>
              <a href={cv.href} download={cv.fileName} type="application/pdf" className={linkClass}>
                {cvLabel} (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-6 font-mono text-xs uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name} · {t.built}
          </p>
          <a href="#main" className="inline-flex items-center gap-2 py-1 transition-colors hover:text-fg">
            {t.backToTop} <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
