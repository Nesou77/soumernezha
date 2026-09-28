import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { getAdjacentProjects, getPublishedProjects } from "@/lib/data/projects";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getPublishedProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.title}: ${project.sector}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await getPublishedProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const adjacent = getAdjacentProjects(projects, slug);

  return (
    <main id="main">
      <ProjectDetail project={project} prev={adjacent?.prev} next={adjacent?.next} />
    </main>
  );
}
