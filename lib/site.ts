import type { Locale } from "@/lib/i18n/config";

/**
 * Single source of truth for language-independent site configuration.
 * Edit this file to change contact details, availability or the CV files.
 * Translated copy (role, description, work mode…) lives in data/locales/*.ts.
 */
export const site = {
  name: "Nezha Soumer",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nezhasoumer.com",
  email: "nezhasoumer@gmail.com",
  linkedin: "https://linkedin.com/in/nezha-soumer-145380280",
  /**
   * One PDF per language, served from /public. To update a CV, replace the
   * file at the same path (keep the file name) and redeploy. Both files
   * currently are placeholders: see "CV files" in README.md.
   */
  cv: {
    en: "/cv/Nezha-Soumer-EN.pdf",
    fr: "/cv/Nezha-Soumer-FR.pdf",
  } satisfies Record<Locale, string>,
  /** Toggle the availability indicator in the navigation (labels are in data/locales). */
  available: true,
} as const;

/** CV for the visitor's language. */
export function cvFor(locale: Locale): { href: string; fileName: string } {
  const href = site.cv[locale];
  return { href, fileName: href.split("/").pop() ?? "CV.pdf" };
}
