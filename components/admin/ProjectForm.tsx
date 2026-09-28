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
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-white/80">
        {label} {required && <span className="text-red-300">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[0.7rem] text-white/40">{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none";
const sectionClass = "space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-6";
const headingClass = "text-sm font-semibold uppercase tracking-wide text-white/50";

/** Current English + French content, read straight from the form's inputs. */
function readSnapshot(form: HTMLFormElement): { en: LocalizedProjectContent; fr: ProjectTranslation } {
  const data = new FormData(form);
  const text = (key: string) => String(data.get(key) ?? "");
  const list = (key: string) =>
    data
      .getAll(key)
      .map((v) => String(v).trim())
      .filter(Boolean);
  const content = (prefix: string) => ({
    title: text(`${prefix}title`),
    sector: text(`${prefix}sector`),
    role: text(`${prefix}role`),
    summary: text(`${prefix}summary`),
    description: text(`${prefix}description`),
    challenge: text(`${prefix}challenge`),
    contributions: list(`${prefix}contributions`),
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
      contributions: project?.contribution ?? [],
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
  const frHasErrors = errorKeys.some((k) => k.startsWith("fr."));
  const contentKeys = ["title", "sector", "role", "summary", "description", "challenge", "contributions", "features"];
  const enHasErrors = errorKeys.some((k) => contentKeys.includes(k));

  // After a failed submit, jump to the tab that holds the errors
  // ("adjust state while rendering" pattern, no effect needed).
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (enHasErrors) setTab("en");
    else if (frHasErrors) setTab("fr");
  }

  const progress = translationProgress(snapshot.en, snapshot.fr);
  const refresh = () => {
    // Deferred so list rows added/removed by a click are already in the DOM.
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

      {/* ---------------------------------------------------------------- Content (per language) */}
      <section className={sectionClass}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={headingClass}>Content</h2>
            <p className="mt-1 text-xs text-white/40">
              Text shown on the public site. English is required; French is optional and falls back to English
              field by field.
            </p>
          </div>
        </div>

        <div role="tablist" aria-label="Content language" className="flex gap-1 border-b border-white/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  const nextTab = t.id === "en" ? "fr" : "en";
                  setTab(nextTab);
                  document.getElementById(`tab-${nextTab}`)?.focus();
                }
              }}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.id ? "border-accent text-white" : "border-transparent text-white/50 hover:text-white/80",
              )}
            >
              <span className="font-mono text-[0.65rem] uppercase text-white/40">{t.id}</span>
              {t.label}
              {t.badge}
              {t.error && <span aria-label="has errors" className="h-1.5 w-1.5 rounded-full bg-red-400" />}
            </button>
          ))}
        </div>

        {/* English: the base columns, also the fallback for every other language. */}
        <div role="tabpanel" id="panel-en" aria-labelledby="tab-en" hidden={tab !== "en"} className="space-y-5">
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Sector" htmlFor="sector" error={errors.sector}>
              <input id="sector" name="sector" defaultValue={project?.sector ?? ""} className={inputClass} placeholder="Tourism / Activities booking" />
            </Field>
            <Field label="Role" htmlFor="role" error={errors.role}>
              <input id="role" name="role" defaultValue={project?.role ?? ""} className={inputClass} placeholder="Web Developer" />
            </Field>
          </div>

          <Field label="Short summary" htmlFor="summary" required error={errors.summary} hint="One-line pitch used in lists, the page intro and search results.">
            <textarea id="summary" name="summary" required rows={2} defaultValue={project?.summary ?? ""} className={inputClass} />
          </Field>

          <Field label="Overview" htmlFor="description" error={errors.description}>
            <textarea id="description" name="description" rows={4} defaultValue={project?.description ?? ""} className={inputClass} />
          </Field>

          <Field label="Challenge" htmlFor="challenge" error={errors.challenge}>
            <textarea id="challenge" name="challenge" rows={3} defaultValue={project?.challenge ?? ""} className={inputClass} />
          </Field>

          <TagListInput
            name="contributions"
            label="Contributions"
            placeholder="e.g. Multi-step booking flow"
            initialValues={project?.contribution}
          />
          <TagListInput
            name="features"
            label="Features"
            placeholder="e.g. Multi-step booking with validation"
            initialValues={project?.features}
          />
        </div>

        {/* French: every field optional; empty = English shown on the French site. */}
        <div role="tabpanel" id="panel-fr" aria-labelledby="tab-fr" hidden={tab !== "fr"} lang="fr" className="space-y-5">
          <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/60">
            Leave a field empty to display the English version on the French site. The greyed text in each field is
            the current English content, for reference.
          </p>

          <Field label="Titre" htmlFor="fr-title" error={errors["fr.title"]} hint="Usually identical (brand name): leave empty to reuse the English title.">
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

          <Field label="Résumé court" htmlFor="fr-summary" error={errors["fr.summary"]}>
            <textarea id="fr-summary" name="fr.summary" rows={2} defaultValue={project?.translations.fr?.summary ?? ""} className={inputClass} placeholder={en.summary} />
          </Field>

          <Field label="Présentation" htmlFor="fr-description" error={errors["fr.description"]} hint={frHint(en.description)}>
            <textarea id="fr-description" name="fr.description" rows={4} defaultValue={project?.translations.fr?.description ?? ""} className={inputClass} placeholder={en.description} />
          </Field>

          <Field label="Enjeu" htmlFor="fr-challenge" error={errors["fr.challenge"]} hint={frHint(en.challenge)}>
            <textarea id="fr-challenge" name="fr.challenge" rows={3} defaultValue={project?.translations.fr?.challenge ?? ""} className={inputClass} placeholder={en.challenge} />
          </Field>

          <TagListInput
            name="fr.contributions"
            label="Contributions"
            addLabel="Ajouter une contribution"
            placeholder="ex. Tunnel de réservation multi-étapes"
            initialValues={project?.translations.fr?.contributions}
            hint={listHint(en.contributions)}
          />
          <TagListInput
            name="fr.features"
            label="Fonctionnalités"
            addLabel="Ajouter une fonctionnalité"
            placeholder="ex. Réservation multi-étapes avec validation"
            initialValues={project?.translations.fr?.features}
            hint={listHint(en.features)}
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- Shared */}
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
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            onBlur={(e) => setSlug(slugify(e.target.value))}
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
              {projectCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
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
          <p className="mt-1 text-xs text-white/40">Shared by every language. 16:9 screenshots (e.g. 1920×1080) display best.</p>
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
