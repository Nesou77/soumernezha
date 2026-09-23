import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/data/projects";
import { site } from "@/lib/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await getPublishedProjects();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
