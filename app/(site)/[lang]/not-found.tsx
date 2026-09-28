import Link from "next/link";
import { lang } from "next/root-params";
import { defaultLocale, getDictionary, isLocale, localizePath } from "@/lib/i18n";

export default async function NotFound() {
  const value = await lang();
  const locale = isLocale(value) ? value : defaultLocale;
  const t = getDictionary(locale).notFound;

  return (
    <main id="main" className="container-x grid min-h-svh place-content-center gap-6 text-center">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="display text-h2">{t.title}</h1>
      <p className="text-muted">{t.text}</p>
      <Link href={localizePath(locale, "/")} className="btn btn-primary mx-auto">
        {t.cta}
      </Link>
    </main>
  );
}
