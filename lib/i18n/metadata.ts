import type { Metadata } from "next";
import { site } from "@/lib/site";
import { defaultLocale, localizePath, locales, ogLocales, type Locale } from "./config";

/** Canonical URL + hreflang alternates (with x-default) for a locale-independent path. */
export function localeAlternates(locale: Locale, path: string): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, localizePath(l, path)]));
  languages["x-default"] = localizePath(defaultLocale, path);
  return { canonical: localizePath(locale, path), languages };
}

export function openGraphLocale(locale: Locale) {
  return {
    locale: ogLocales[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
  };
}

/**
 * Metadata for an inner page: title, description, canonical + hreflang and
 * matching Open Graph / Twitter tags (the share image is inherited from the
 * locale's opengraph-image).
 */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type: "website",
      url: localizePath(locale, path),
      siteName: site.name,
      title,
      description,
      ...openGraphLocale(locale),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
