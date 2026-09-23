import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectCategory } from "@/types";
import type { ProjectRow } from "@/types/database";

export interface AdminProject extends Project {
  id: string;
  published: boolean;
  updatedAt: string;
}

function toAdminProject(row: ProjectRow, index: number): AdminProject {
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
    updatedAt: row.updated_at,
  };
}

export interface AdminProjectStats {
  total: number;
  published: number;
  draft: number;
  featured: number;
}

export async function getAllProjectsAdmin(): Promise<AdminProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return (data ?? []).map(toAdminProject);
}

export function computeStats(projects: AdminProject[]): AdminProjectStats {
  return {
    total: projects.length,
    published: projects.filter((p) => p.published).length,
    draft: projects.filter((p) => !p.published).length,
    featured: projects.filter((p) => p.featured).length,
  };
}

export async function getProjectByIdAdmin(id: string): Promise<(AdminProject & { rawRow: ProjectRow }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Failed to load project: ${error.message}`);
  if (!data) return null;
  return { ...toAdminProject(data, 0), rawRow: data };
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("projects").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`Failed to check slug: ${error.message}`);
  return Boolean(data);
}

export async function getNextDisplayOrder(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Failed to compute display order: ${error.message}`);
  return (data?.display_order ?? -1) + 1;
}
