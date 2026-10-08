import { projectCategories } from "@/lib/project-constants";
import type { Project, ProjectCategory } from "@/types";

/** Client-safe helpers for the project gallery filters. */

export type CategoryFilter = "all" | ProjectCategory;

/** "Next.js 15" and "Next.js" are the same filter: trailing version numbers are dropped. */
export function techKey(tech: string): string {
  return tech.replace(/\s+v?\d+(\.\d+)*$/i, "").trim();
}

export function projectTechKeys(project: Project): string[] {
  return [...new Set(project.technologies.map(techKey))];
}

export function parseCategory(value: string | null): CategoryFilter {
  return value && (projectCategories as string[]).includes(value) ? (value as ProjectCategory) : "all";
}

/** Technologies used by the given projects, most used first. */
export function techOptions(projects: Project[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of projects) for (const t of projectTechKeys(p)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function filterProjects(projects: Project[], category: CategoryFilter, tech: string | null): Project[] {
  return projects.filter(
    (p) => (category === "all" || p.category === category) && (!tech || projectTechKeys(p).includes(tech)),
  );
}

/** Featured projects first (in display order), topped up with the next ones. */
export function pickFeatured(projects: Project[], count = 3): Project[] {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, count);
}
