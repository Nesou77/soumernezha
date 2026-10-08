import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data/projects";
import { defaultLocale, localizePath, locales } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export const revalidate = 60;

/** One entry per page and language, each listing its translations (hreflang). */
function entries(path: string, priority: number, changeFrequency: "monthly" | "yearly", lastModified: Date) {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}${localizePath(l, path)}`]));
  return locales.map((locale) => ({
    url: `${site.url}${localizePath(locale, path)}`,
    lastModified,
    changeFrequency,
    priority: locale === defaultLocale ? priority : priority - 0.1,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await getPublishedProjects(defaultLocale);
  return [
    ...entries("/", 1, "monthly", now),
    ...entries("/projects", 0.9, "monthly", now),
    ...entries("/about", 0.8, "monthly", now),
    ...entries("/contact", 0.6, "yearly", now),
    ...projects.flatMap((p) => entries(`/projects/${p.slug}`, 0.7, "yearly", now)),
  ];
}
