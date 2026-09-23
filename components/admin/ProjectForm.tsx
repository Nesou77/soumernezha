"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TagListInput } from "@/components/admin/TagListInput";
import { TechnologySelector } from "@/components/admin/TechnologySelector";
import type { ProjectActionState } from "@/lib/actions/projects";
import { projectCategories, categoryLabels } from "@/lib/project-constants";
import { slugify } from "@/lib/utils";
import type { AdminProject } from "@/lib/data/admin-projects";

interface ProjectFormProps {
  mode: "create" | "edit";
  action: (state: ProjectActionState, formData: FormData) => Promise<ProjectActionState>;
  project?: AdminProject;
}

const initialState: ProjectActionState = {};

function Field({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-white/80">
        {label} {required && <span className="text-red-300">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none";

export function ProjectForm({ mode, action, project }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-10">
      {state.error && !Object.keys(errors).length && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <section className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Basic information</h2>

        <Field label="Title" htmlFor="title" required error={errors.title}>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
              if (!slugTouched) setSlug(slugify(value));
            }}
            className={inputClass}
            placeholder="Luxury Hotel Website"
          />
        </Field>

        <Field label="Slug" htmlFor="slug" required error={errors.slug}>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            onBlur={(e) => setSlug(slugify(e.target.value))}
            className={inputClass}
            placeholder="luxury-hotel-website"
          />
          <p className="mt-1.5 text-[0.7rem] text-white/40">
            Public URL: /projects/{slug || "your-slug"}
          </p>
        </Field>
      </section>

      <section className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Classification</h2>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Category" htmlFor="category" required error={errors.category}>
            <select id="category" name="category" defaultValue={project?.category ?? "web"} className={inputClass}>
              {projectCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sector" htmlFor="sector" error={errors.sector}>
            <input id="sector" name="sector" defaultValue={project?.sector ?? ""} className={inputClass} placeholder="Tourism / Activities booking" />
          </Field>

          <Field label="Role" htmlFor="role" error={errors.role}>
            <input id="role" name="role" defaultValue={project?.role ?? ""} className={inputClass} placeholder="Web Developer" />
          </Field>
        </div>

        <Field label="Year" htmlFor="year" error={errors.year}>
          <input id="year" name="year" defaultValue={project?.year ?? ""} className={`${inputClass} sm:max-w-[10rem]`} placeholder="2025" />
        </Field>
      </section>

      <section className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Content</h2>

        <Field label="Short summary" htmlFor="summary" required error={errors.summary}>
          <textarea
            id="summary"
            name="summary"
            required
            rows={2}
            defaultValue={project?.summary ?? ""}
            className={inputClass}
            placeholder="One-line pitch used in lists and metadata."
          />
        </Field>

        <Field label="Full description" htmlFor="description" error={errors.description}>
          <textarea id="description" name="description" rows={4} defaultValue={project?.description ?? ""} className={inputClass} />
        </Field>

        <Field label="Challenge" htmlFor="challenge" error={errors.challenge}>
          <textarea id="challenge" name="challenge" rows={3} defaultValue={project?.challenge ?? ""} className={inputClass} />
        </Field>

        <TagListInput
          name="contributions"
          label="Contributions / Solution"
          placeholder="e.g. Multi-step booking flow"
          initialValues={project?.contribution}
        />
      </section>

      <section className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Features &amp; technologies</h2>

        <TagListInput name="features" label="Features" placeholder="e.g. Multi-step booking with validation" initialValues={project?.features} />

        <TechnologySelector name="technologies" initialValues={project?.technologies} />
        {errors.technologies && <p className="text-sm text-red-300">{errors.technologies}</p>}
      </section>

      <section className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Media</h2>

        <ImageUploader
          name="coverImageNew"
          label="Cover image"
          currentUrl={project?.image}
          required
          error={errors.coverImage}
        />

        <GalleryUploader name="galleryNew" initialUrls={project?.gallery ?? []} />
        {errors.gallery && <p className="text-sm text-red-300">{errors.gallery}</p>}
      </section>

      <section className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">Links &amp; publication</h2>

        <Field label="Project URL" htmlFor="projectUrl" error={errors.projectUrl}>
          <input
            id="projectUrl"
            name="projectUrl"
            type="url"
            defaultValue={project?.url ?? ""}
            className={inputClass}
            placeholder="https://example.com"
          />
        </Field>

        <div className="flex flex-wrap gap-8">
          <label className="flex items-center gap-2.5 text-sm text-white/80">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4 rounded border-white/30 bg-white/10 accent-accent" />
            Featured project
          </label>

          <label className="flex items-center gap-2.5 text-sm text-white/80">
            <input type="checkbox" name="published" defaultChecked={project?.published ?? false} className="h-4 w-4 rounded border-white/30 bg-white/10 accent-accent" />
            Published (visible on the public website)
          </label>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-[#031513] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
        </button>
        <Link href="/admin" className="text-sm text-white/60 hover:text-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
