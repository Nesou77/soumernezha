"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { errorCopy } from "@/data/locales/error";
import { defaultLocale, isLocale, localizePath } from "@/lib/i18n/config";

/**
 * Localized error boundary for the public pages (copy in data/locales/error.ts).
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ lang?: string }>();
  const locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const t = errorCopy[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="container-x grid min-h-svh place-content-center gap-6 text-center">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="display text-h2">{t.title}</h1>
      <p className="text-muted">{t.text}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          {t.retry}
        </button>
        <Link href={localizePath(locale, "/")} className="btn btn-ghost">
          {t.home}
        </Link>
      </div>
    </main>
  );
}
