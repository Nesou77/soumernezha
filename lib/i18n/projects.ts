import type { Project, TranslatableField } from "@/types";
import type { ProjectRow, ProjectTranslation } from "@/types/database";
import { defaultLocale, type Locale } from "./config";

export const translatableTextFields = [
  "title",
  "sector",
  "role",
  "summary",
  "description",
  "challenge",
  "solution",
] as const;

export const translatableListFields = [
  "challengePoints",
  "contributions",
  "solutionPoints",
  "features",
] as const;

export const expectedTranslationFields: TranslatableField[] = [
  "sector",
  "role",
  "summary",
  "description",
  "challenge",
  "challengePoints",
  "contributions",
  "solution",
  "solutionPoints",
  "features",
];

export type LocalizedProjectContent = {
  title: string;
  sector: string;
  role: string;
  summary: string;
  description: string;
  challenge: string;
  challengePoints: string[];
  contributions: string[];
  solution: string;
  solutionPoints: string[];
  features: string[];
};

type BaseContent = ProjectRow;

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
    challengePoints: row.challenge_points ?? [],
    contributions: row.contributions,
    solution: row.solution ?? "",
    solutionPoints: row.solution_points ?? [],
    features: row.features,
  };

  if (locale === defaultLocale) return { content: base, untranslated: [] };

  const translation: ProjectTranslation = row.translations?.[locale] ?? {};
  const content: LocalizedProjectContent = { ...base };
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

export function fallbackLang(
  project: Pick<Project, "untranslated">,
  field: TranslatableField,
): typeof defaultLocale | undefined {
  return project.untranslated?.includes(field) ? defaultLocale : undefined;
}

export function translationProgress(
  base: LocalizedProjectContent,
  translation: ProjectTranslation | undefined,
): { done: number; total: number } {
  const relevant = expectedTranslationFields.filter((field) => hasValue(base[field as keyof LocalizedProjectContent]));
  const done = relevant.filter((field) => hasValue(translation?.[field as keyof ProjectTranslation])).length;
  return { done, total: relevant.length };
}

export function compactTranslation(input: ProjectTranslation): ProjectTranslation {
  const out: ProjectTranslation = {};

  for (const field of translatableTextFields) {
    const value = input[field]?.trim();
    if (value) out[field] = value;
  }

  for (const field of translatableListFields) {
    const value = input[field]?.map((item) => item.trim()).filter(Boolean);
    if (value && value.length > 0) out[field] = value;
  }

  return out;
}
