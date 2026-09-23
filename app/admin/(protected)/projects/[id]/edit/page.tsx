import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProjectAction } from "@/lib/actions/projects";
import { getProjectByIdAdmin } from "@/lib/data/admin-projects";

export const metadata: Metadata = { title: "Edit project" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);
  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-2xl font-semibold">Edit project</h1>
      <ProjectForm mode="edit" action={updateProjectAction.bind(null, id)} project={project} />
    </div>
  );
}
