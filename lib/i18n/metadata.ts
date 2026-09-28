import type { Metadata } from "next";
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
