/**
 * Locale configuration shared by the proxy, server components and client
 * components (no server-only imports here).
 *
 * URL strategy: the default locale (English) is served without a prefix
 * (`/`, `/projects/x`); other locales are prefixed (`/fr`, `/fr/projects/x`).
 * Internally every public route lives under `app/(site)/[lang]`, and the proxy
 * rewrites unprefixed URLs to `/en/...`.
 */
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en" satisfies Locale;

/** Locales whose project content is stored in the `translations` JSON column. */
export type TranslatedLocale = Exclude<Locale, typeof defaultLocale>;
export const translatedLocales = locales.filter((l): l is TranslatedLocale => l !== defaultLocale);

/** Remembers the visitor's explicit language choice (set by the language switcher). */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeNames: Record<Locale, string> = { en: "English", fr: "Français" };
export const ogLocales: Record<Locale, string> = { en: "en_US", fr: "fr_FR" };

export function isLocale(value: string | undefined | null): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}

/** `/projects/x` → `/fr/projects/x` (no prefix for the default locale). Keeps any `#hash`. */
export function localizePath(locale: Locale, path: string = "/"): string {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex === -1 ? "" : path.slice(hashIndex);
  const raw = hashIndex === -1 ? path : path.slice(0, hashIndex);
  const base = raw === "" ? "/" : raw.startsWith("/") ? raw : `/${raw}`;
  if (locale === defaultLocale) return `${base}${hash}`;
  return `${base === "/" ? `/${locale}` : `/${locale}${base}`}${hash}`;
}

/** Removes a leading locale segment: `/fr/projects/x` → `/projects/x`, `/fr` → `/`. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return `/${rest.join("/")}`;
  return pathname || "/";
}

/** Locale implied by a browser pathname (unprefixed means default). */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return isLocale(first) ? first : defaultLocale;
}

/** Fills `{placeholders}`: format("{count} projects", { count: 3 }). Client-safe. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
