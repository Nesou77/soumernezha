import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Footer({ t }: { t: Dictionary["footer"] }) {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-x flex flex-col justify-between gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>{t.built}</p>
        <p>{t.motto}</p>
      </div>
    </footer>
  );
}
