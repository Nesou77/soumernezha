import type { Project, TranslatableField } from "@/types";
import type { ProjectRow, ProjectTranslation } from "@/types/database";
import { defaultLocale, type Locale } from "./config";

/**
 * Localized project content. Client-safe: used by the public data layer and
 * by the admin form (completion indicators).
 *
 * Storage model: the regular columns hold English (the default locale), and
 * `translations[locale]` holds optional per-field overrides. Resolution is
 * per field, so a half-translated project shows French where it exists and
 * English elsewhere, never an empty section.
 */

export const translatableTextFields = ["title", "sector", "role", "summary", "description", "challenge"] as const;
export const translatableListFields = ["contributions", "features"] as const;

type TextField = (typeof translatableTextFields)[number];
type ListField = (typeof translatableListFields)[number];

/**
 * Fields expected to be translated for a translation to count as complete.
 * The title is excluded: it is usually a brand name that stays identical.
 */
export const expectedTranslationFields: TranslatableField[] = [
  "sector",
  "role",
  "summary",
  "description",
  "challenge",
  "contributions",
  "features",
];

export type LocalizedProjectContent = Pick<ProjectRow, TextField | ListField>;

type BaseContent = LocalizedProjectContent & { translations?: ProjectRow["translations"] | null };

function hasValue(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value && value.trim());
}

export function resolveProjectContent(
  row: BaseContent,
  locale: Locale,
): { content: LocalizedProjectContent; untranslated: TranslatableField[] } {
  const base: LocalizedProjectContent = {
    title: row.title,
    sector: row.sector,
    role: row.role,
    summary: row.summary,
    description: row.description,
    challenge: row.challenge,
    contributions: row.contributions,
    features: row.features,
  };
  if (locale === defaultLocale) return { content: base, untranslated: [] };

  // `?? {}` keeps the site working if the column does not exist yet (migration not run).
  const translation: ProjectTranslation = row.translations?.[locale] ?? {};
  const content = { ...base };
  const untranslated: TranslatableField[] = [];

  for (const field of translatableTextFields) {
    const value = translation[field];
    if (hasValue(value)) content[field] = value!.trim();
    else if (field !== "title" && hasValue(base[field])) untranslated.push(field);
  }
  for (const field of translatableListFields) {
    const value = translation[field];
    if (value && hasValue(value)) content[field] = value;
    else if (hasValue(base[field])) untranslated.push(field);
  }
  return { content, untranslated };
}

/**
 * `lang` attribute for a project field rendered in the default language
 * because its translation is missing (so screen readers and search engines
 * don't read English text with French pronunciation rules).
 */
export function fallbackLang(project: Pick<Project, "untranslated">, field: TranslatableField): typeof defaultLocale | undefined {
  return project.untranslated?.includes(field) ? defaultLocale : undefined;
}

/** How much of the expected translation exists, relative to the English content that exists. */
export function translationProgress(
  base: LocalizedProjectContent,
  translation: ProjectTranslation | undefined,
): { done: number; total: number } {
  const relevant = expectedTranslationFields.filter((f) => hasValue(base[f]));
  const done = relevant.filter((f) => hasValue(translation?.[f])).length;
  return { done, total: relevant.length };
}

/** Drops empty values so the stored JSON only contains real overrides. */
export function compactTranslation(input: ProjectTranslation): ProjectTranslation {
  const out: ProjectTranslation = {};
  for (const field of translatableTextFields) {
    const value = input[field]?.trim();
    if (value) out[field] = value;
  }
  for (const field of translatableListFields) {
    const value = input[field]?.map((v) => v.trim()).filter(Boolean);
    if (value && value.length > 0) out[field] = value;
  }
  return out;
}
