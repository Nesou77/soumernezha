import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/lib/actions/projects";

export const metadata: Metadata = { title: "Add project" };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-2xl font-semibold">Add project</h1>
      <ProjectForm mode="create" action={createProjectAction} />
    </div>
  );
}
