"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TagListInput } from "@/components/admin/TagListInput";
import { TechnologySelector } from "@/components/admin/TechnologySelector";
import type { ProjectActionState } from "@/lib/actions/projects";
import type { AdminProject } from "@/lib/data/admin-projects";
import { translationProgress, type LocalizedProjectContent } from "@/lib/i18n/projects";
import { projectCategories, categoryLabels } from "@/lib/project-constants";
import { cn, slugify } from "@/lib/utils";
import type { ProjectTranslation } from "@/types/database";

interface ProjectFormProps {
  mode: "create" | "edit";
  action: (state: ProjectActionState, formData: FormData) => Promise<ProjectActionState>;
  project?: AdminProject;
}

type Tab = "en" | "fr";
const initialState: ProjectActionState = {};

function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-white/80">
        {label} {required && <span className="text-red-300">*</span>}
      </label>
      {children}
      {hint && !error && <div className="mt-1.5 text-[0.7rem] leading-relaxed text-white/40">{hint}</div>}
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none";
const sectionClass = "space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6";
const headingClass = "text-sm font-semibold uppercase tracking-wide text-white/50";
const subsectionClass = "space-y-5 border-t border-white/10 pt-5";

function readSnapshot(form: HTMLFormElement): { en: LocalizedProjectContent; fr: ProjectTranslation } {
  const data = new FormData(form);
  const text = (key: string) => String(data.get(key) ?? "");
  const list = (key: string) =>
    data
      .getAll(key)
      .map((value) => String(value).trim())
      .filter(Boolean);

  const content = (prefix: string): LocalizedProjectContent => ({
    title: text(`${prefix}title`),
    sector: text(`${prefix}sector`),
    role: text(`${prefix}role`),
    summary: text(`${prefix}summary`),
    description: text(`${prefix}description`),
    challenge: text(`${prefix}challenge`),
    challengePoints: list(`${prefix}challengePoints`),
    contributions: list(`${prefix}contributions`),
    solution: text(`${prefix}solution`),
    solutionPoints: list(`${prefix}solutionPoints`),
    features: list(`${prefix}features`),
  });

  return { en: content(""), fr: content("fr.") };
}

function initialSnapshot(project?: AdminProject): { en: LocalizedProjectContent; fr: ProjectTranslation } {
  return {
    en: {
      title: project?.title ?? "",
      sector: project?.sector ?? "",
      role: project?.role ?? "",
      summary: project?.summary ?? "",
      description: project?.description ?? "",
      challenge: project?.challenge ?? "",
      challengePoints: project?.challengePoints ?? [],
      contributions: project?.contribution ?? [],
      solution: project?.solution ?? "",
      solutionPoints: project?.solutionPoints ?? [],
      features: project?.features ?? [],
    },
    fr: project?.translations.fr ?? {},
  };
}

function ProgressBadge({ done, total }: { done: number; total: number }) {
  const complete = total > 0 && done === total;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums",
        complete ? "bg-accent/15 text-accent" : done === 0 ? "bg-white/10 text-white/50" : "bg-amber-400/15 text-amber-300",
      )}
    >
      {complete ? "Complete" : `${done}/${total}`}
    </span>
  );
}

export function ProjectForm({ mode, action, project }: ProjectFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [tab, setTab] = useState<Tab>("en");
  const [snapshot, setSnapshot] = useState(() => initialSnapshot(project));

  const errors = state.fieldErrors ?? {};
  const errorKeys = Object.keys(errors);
  const frHasErrors = errorKeys.some((key) => key.startsWith("fr."));
  const contentKeys = [
    "title",
    "sector",
    "role",
    "summary",
    "description",
    "challenge",
    "challengePoints",
    "contributions",
    "solution",
    "solutionPoints",
    "features",
  ];
  const enHasErrors = errorKeys.some((key) => contentKeys.includes(key));

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (enHasErrors) setTab("en");
    else if (frHasErrors) setTab("fr");
  }

  const progress = translationProgress(snapshot.en, snapshot.fr);
  const refresh = () => {
    setTimeout(() => formRef.current && setSnapshot(readSnapshot(formRef.current)), 0);
  };

  const en = snapshot.en;
  const frHint = (value: string) => (value ? undefined : "Nothing in English either: this section stays hidden.");
  const listHint = (items: string[]) =>
    items.length > 0 ? (
      <>
        <span className="font-semibold text-white/50">EN:</span> {items.join(" · ")}
      </>
    ) : undefined;

  const tabs: { id: Tab; label: string; badge: React.ReactNode; error: boolean }[] = [
    {
      id: "en",
      label: "English",
      badge: <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] text-white/60">Default</span>,
      error: enHasErrors,
    },
    { id: "fr", label: "Français", badge: <ProgressBadge {...progress} />, error: frHasErrors },
  ];

  return (
    <form ref={formRef} action={formAction} onInput={refresh} onClick={refresh} className="space-y-10">
      {state.error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <section className={sectionClass}>
        <div>
          <h2 className={headingClass}>Case-study content</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/40">
            English is the default content. French fields are optional and fall back to English field by field.
          </p>
        </div>

        <div role="tablist" aria-label="Content language" className="flex gap-1 border-b border-white/10">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`panel-${item.id}`}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  const nextTab = item.id === "en" ? "fr" : "en";
                  setTab(nextTab);
                  document.getElementById(`tab-${nextTab}`)?.focus();
                }
              }}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === item.id ? "border-accent text-white" : "border-transparent text-white/50 hover:text-white/80",
              )}
            >
              <span className="font-mono text-[0.65rem] uppercase text-white/40">{item.id}</span>
              {item.label}
              {item.badge}
              {item.error && <span aria-label="has errors" className="h-1.5 w-1.5 rounded-full bg-red-400" />}
            </button>
          ))}
        </div>

        <div role="tabpanel" id="panel-en" aria-labelledby="tab-en" hidden={tab !== "en"} className="space-y-7">
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Introduction</p>

            <Field label="Title" htmlFor="title" required error={errors.title}>
              <input
                id="title"
                name="title"
                required
                value={title}
                onChange={(event) => {
                  const value = event.target.value;
                  setTitle(value);
                  if (!slugTouched) setSlug(slugify(value));
                }}
                className={inputClass}
                placeholder="Luxury Hotel Website"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Sector" htmlFor="sector" error={errors.sector}>
                <input id="sector" name="sector" defaultValue={project?.sector ?? ""} className={inputClass} placeholder="Tourism / Activities booking" />
              </Field>
              <Field label="Role" htmlFor="role" error={errors.role}>
                <input id="role" name="role" defaultValue={project?.role ?? ""} className={inputClass} placeholder="Web Developer" />
              </Field>
            </div>

            <Field
              label="Short description"
              htmlFor="summary"
              required
              error={errors.summary}
              hint="1–2 sentences used in project cards and the hero. Keep this concise."
            >
              <textarea id="summary" name="summary" required rows={2} defaultValue={project?.summary ?? ""} className={inputClass} />
            </Field>

            <Field
              label="Detailed description"
              htmlFor="description"
              error={errors.description}
              hint="Explain the context, objective and project in more detail."
            >
              <textarea id="description" name="description" rows={5} defaultValue={project?.description ?? ""} className={inputClass} />
            </Field>
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Challenge</p>
            <Field
              label="Challenge — short description"
              htmlFor="challenge"
              error={errors.challenge}
              hint="A short paragraph explaining the main problem or constraint."
            >
              <textarea id="challenge" name="challenge" rows={3} defaultValue={project?.challenge ?? ""} className={inputClass} />
            </Field>
            <TagListInput
              name="challengePoints"
              label="Challenge points"
              placeholder="e.g. Simplify the booking journey"
              initialValues={project?.challengePoints}
            />
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Contribution</p>
            <TagListInput
              name="contributions"
              label="My contribution"
              placeholder="e.g. Front-end development"
              initialValues={project?.contribution}
            />
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Solution</p>
            <Field
              label="Solution — short description"
              htmlFor="solution"
              error={errors.solution}
              hint="Briefly explain the approach or solution that was delivered."
            >
              <textarea id="solution" name="solution" rows={3} defaultValue={project?.solution ?? ""} className={inputClass} />
            </Field>
            <TagListInput
              name="solutionPoints"
              label="Solution points"
              placeholder="e.g. Real-time availability synchronization"
              initialValues={project?.solutionPoints}
            />
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Key features</p>
            <TagListInput
              name="features"
              label="Key features"
              placeholder="e.g. Automated booking confirmations"
              initialValues={project?.features}
            />
          </div>
        </div>

        <div role="tabpanel" id="panel-fr" aria-labelledby="tab-fr" hidden={tab !== "fr"} lang="fr" className="space-y-7">
          <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/60">
            Leave a field empty to display the English version on the French site. English content is shown as a reference where useful.
          </p>

          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Introduction</p>

            <Field label="Titre" htmlFor="fr-title" error={errors["fr.title"]} hint="Leave empty to reuse the English project title.">
              <input id="fr-title" name="fr.title" defaultValue={project?.translations.fr?.title ?? ""} className={inputClass} placeholder={en.title} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Secteur" htmlFor="fr-sector" error={errors["fr.sector"]}>
                <input id="fr-sector" name="fr.sector" defaultValue={project?.translations.fr?.sector ?? ""} className={inputClass} placeholder={en.sector} />
              </Field>
              <Field label="Rôle" htmlFor="fr-role" error={errors["fr.role"]}>
                <input id="fr-role" name="fr.role" defaultValue={project?.translations.fr?.role ?? ""} className={inputClass} placeholder={en.role} />
              </Field>
            </div>

            <Field label="Description courte" htmlFor="fr-summary" error={errors["fr.summary"]}>
              <textarea id="fr-summary" name="fr.summary" rows={2} defaultValue={project?.translations.fr?.summary ?? ""} className={inputClass} placeholder={en.summary} />
            </Field>

            <Field label="Description détaillée" htmlFor="fr-description" error={errors["fr.description"]} hint={frHint(en.description)}>
              <textarea id="fr-description" name="fr.description" rows={5} defaultValue={project?.translations.fr?.description ?? ""} className={inputClass} placeholder={en.description} />
            </Field>
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Défi</p>
            <Field label="Défi — description courte" htmlFor="fr-challenge" error={errors["fr.challenge"]} hint={frHint(en.challenge)}>
              <textarea id="fr-challenge" name="fr.challenge" rows={3} defaultValue={project?.translations.fr?.challenge ?? ""} className={inputClass} placeholder={en.challenge} />
            </Field>
            <TagListInput
              name="fr.challengePoints"
              label="Points du défi"
              addLabel="Ajouter un point"
              placeholder="ex. Simplifier le parcours de réservation"
              initialValues={project?.translations.fr?.challengePoints}
              hint={listHint(en.challengePoints)}
            />
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Contribution</p>
            <TagListInput
              name="fr.contributions"
              label="Ma contribution"
              addLabel="Ajouter une contribution"
              placeholder="ex. Développement front-end"
              initialValues={project?.translations.fr?.contributions}
              hint={listHint(en.contributions)}
            />
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Solution</p>
            <Field label="Solution — description courte" htmlFor="fr-solution" error={errors["fr.solution"]} hint={frHint(en.solution)}>
              <textarea id="fr-solution" name="fr.solution" rows={3} defaultValue={project?.translations.fr?.solution ?? ""} className={inputClass} placeholder={en.solution} />
            </Field>
            <TagListInput
              name="fr.solutionPoints"
              label="Points de la solution"
              addLabel="Ajouter un point"
              placeholder="ex. Synchronisation des disponibilités en temps réel"
              initialValues={project?.translations.fr?.solutionPoints}
              hint={listHint(en.solutionPoints)}
            />
          </div>

          <div className={subsectionClass}>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">Fonctionnalités clés</p>
            <TagListInput
              name="fr.features"
              label="Fonctionnalités clés"
              addLabel="Ajouter une fonctionnalité"
              placeholder="ex. Confirmations automatiques de réservation"
              initialValues={project?.translations.fr?.features}
              hint={listHint(en.features)}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div>
          <h2 className={headingClass}>Project details</h2>
          <p className="mt-1 text-xs text-white/40">Shared by every language.</p>
        </div>

        <Field label="Slug" htmlFor="slug" required error={errors.slug}>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            onBlur={(event) => setSlug(slugify(event.target.value))}
            className={inputClass}
            placeholder="luxury-hotel-website"
          />
          <p className="mt-1.5 text-[0.7rem] text-white/40">
            Public URLs: /projects/{slug || "your-slug"} · /fr/projects/{slug || "your-slug"}
          </p>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category" required error={errors.category}>
            <select id="category" name="category" defaultValue={project?.category ?? "web"} className={inputClass}>
              {projectCategories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Year" htmlFor="year" error={errors.year}>
            <input id="year" name="year" defaultValue={project?.year ?? ""} className={inputClass} placeholder="2025" />
          </Field>
        </div>

        <TechnologySelector name="technologies" initialValues={project?.technologies} />
        {errors.technologies && <p className="text-sm text-red-300">{errors.technologies}</p>}

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
      </section>

      <section className={sectionClass}>
        <div>
          <h2 className={headingClass}>Media</h2>
          <p className="mt-1 text-xs text-white/40">Use a strong cover image and 16:9 screenshots when possible.</p>
        </div>

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

      <section className={sectionClass}>
        <h2 className={headingClass}>Publication</h2>
        <div className="flex flex-wrap gap-8">
          <label className="flex items-center gap-2.5 text-sm text-white/80">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4 rounded border-white/30 bg-white/10 accent-accent" />
            Featured project
          </label>

          <label className="flex items-center gap-2.5 text-sm text-white/80">
            <input type="checkbox" name="published" defaultChecked={project?.published ?? false} className="h-4 w-4 rounded border-white/30 bg-white/10 accent-accent" />
            Published (visible on the public website, in both languages)
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
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

        <span className="text-xs text-white/40">
          French: {progress.total === 0 ? "—" : `${progress.done} of ${progress.total} sections translated`}
        </span>
      </div>
    </form>
  );
}
