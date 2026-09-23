import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { getProject, projects } from "@/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title}: ${project.sector}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title, description: project.summary, url: `/projects/${project.slug}`, type: "article" },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <main id="main">
      <ProjectDetail project={project} />
    </main>
  );
}
