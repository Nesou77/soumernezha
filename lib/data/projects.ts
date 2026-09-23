import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Project, ProjectCategory } from "@/types";
import type { ProjectRow } from "@/types/database";

function toProject(row: ProjectRow, index: number): Project {
  return {
    id: row.id,
    slug: row.slug,
    index: String(index + 1).padStart(2, "0"),
    title: row.title,
    category: row.category as ProjectCategory,
    sector: row.sector,
    role: row.role,
    year: row.year ?? undefined,
    summary: row.summary,
    description: row.description,
    challenge: row.challenge,
    contribution: row.contributions,
    features: row.features,
    technologies: row.technologies,
    url: row.project_url ?? undefined,
    image: row.cover_image_url ?? undefined,
    gallery: row.gallery_urls,
    hue: row.hue,
    featured: row.featured,
    published: row.published,
  };
}

/**
 * All published projects, ordered for display. Cached per-request so the
 * homepage sections, the QA lab, project pages and the sitemap can each call
 * this without triggering duplicate database round-trips.
 */
export const getPublishedProjects = cache(async (): Promise<Project[]> => {
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

  return (data ?? []).map(toProject);
});

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getPublishedProjects();
  return all.filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getPublishedProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getAdjacentProjects(all: Project[], slug: string): { prev: Project; next: Project } | null {
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1 || all.length < 2) return null;
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  return { prev, next };
}
