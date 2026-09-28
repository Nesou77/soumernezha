import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { resolveProjectContent } from "@/lib/i18n/projects";
import type { Locale } from "@/lib/i18n/config";
import type { Project, ProjectCategory } from "@/types";
import type { ProjectRow } from "@/types/database";

function toProject(row: ProjectRow, index: number, locale: Locale): Project {
  const { content, untranslated } = resolveProjectContent(row, locale);
  return {
    id: row.id,
    slug: row.slug,
    index: String(index + 1).padStart(2, "0"),
    title: content.title,
    category: row.category as ProjectCategory,
    sector: content.sector,
    role: content.role,
    year: row.year ?? undefined,
    summary: content.summary,
    description: content.description,
    challenge: content.challenge,
    contribution: content.contributions,
    features: content.features,
    technologies: row.technologies,
    url: row.project_url ?? undefined,
    image: row.cover_image_url ?? undefined,
    gallery: row.gallery_urls,
    hue: row.hue,
    featured: row.featured,
    published: row.published,
    untranslated,
  };
}

/** Raw published rows, fetched once per request whatever the number of locales rendered. */
const getPublishedRows = cache(async (): Promise<ProjectRow[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load published projects:", error.message);
    return [];
  }
  return data ?? [];
});

/**
 * All published projects, ordered for display and localized (with per-field
 * English fallback). Cached per request so the homepage sections, project
 * pages, metadata and the sitemap don't trigger duplicate round-trips.
 */
export const getPublishedProjects = cache(async (locale: Locale): Promise<Project[]> => {
  const rows = await getPublishedRows();
  return rows.map((row, i) => toProject(row, i, locale));
});

export async function getProjectBySlug(slug: string, locale: Locale): Promise<Project | null> {
  const all = await getPublishedProjects(locale);
  return all.find((p) => p.slug === slug) ?? null;
}

/** Neighbours in display order, wrapping around so the last project leads back to the first. */
export function getAdjacentProjects(all: Project[], slug: string): { prev: Project; next: Project } | null {
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1 || all.length < 2) return null;
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  return { prev, next };
}
