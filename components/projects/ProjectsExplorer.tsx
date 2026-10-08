"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SearchX, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { format, type Locale } from "@/lib/i18n/config";
import { projectCategories } from "@/lib/project-constants";
import { filterProjects, parseCategory, techOptions, type CategoryFilter } from "@/lib/project-filters";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

const VISIBLE_TECH = 10;

interface ExplorerProps {
  projects: Project[];
  locale: Locale;
  t: Dictionary["projects"];
  categories: Dictionary["categories"];
}

interface ViewProps extends ExplorerProps {
  category: CategoryFilter;
  tech: string | null;
  onChange: (next: { category: CategoryFilter; tech: string | null }) => void;
}

const chip = "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors";
const chipOn = "border-accent bg-accent text-black";
const chipOff = "border-white/15 text-muted hover:border-white/40 hover:text-fg";

function ExplorerView({ projects, locale, t, categories, category, tech, onChange }: ViewProps) {
  const reduce = useReducedMotion();
  const [showAllTech, setShowAllTech] = useState(false);

  const inCategory = useMemo(() => filterProjects(projects, category, null), [projects, category]);
  const options = useMemo(() => techOptions(inCategory), [inCategory]);
  const visible = useMemo(() => filterProjects(projects, category, tech), [projects, category, tech]);

  const shownOptions = options.slice(0, showAllTech ? options.length : VISIBLE_TECH);
  // Keep the active technology visible even when it is beyond the collapsed list.
  if (tech && !shownOptions.some((o) => o.name === tech)) {
    const active = options.find((o) => o.name === tech) ?? { name: tech, count: 0 };
    shownOptions.push(active);
  }

  const categoryCount = (id: CategoryFilter) =>
    id === "all" ? projects.length : projects.filter((p) => p.category === id).length;
  const categoryFilters: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: t.all },
    ...projectCategories.filter((id) => categoryCount(id) > 0).map((id) => ({ id, label: categories[id] })),
  ];
  const filtered = category !== "all" || tech !== null;

  if (projects.length === 0) {
    return (
      <div className="border border-dashed border-line px-6 py-16 text-center">
        <p className="mx-auto max-w-lg text-muted">{t.noProjects}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6 border-b border-line pb-8">
        <div className="grid gap-3 md:grid-cols-[8rem_1fr] md:items-start">
          <p id="filter-category" className="eyebrow pt-3 text-muted">
            {t.categoryHeading}
          </p>
          <div role="group" aria-labelledby="filter-category" className="flex flex-wrap gap-2">
            {categoryFilters.map((f) => {
              const on = category === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onChange({ category: f.id, tech: null })}
                  className={cn(chip, on ? chipOn : chipOff)}
                >
                  {f.label}
                  <span className={cn("tabular-nums", on ? "text-black/60" : "text-muted/70")}>{categoryCount(f.id)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {options.length > 1 && (
          <div className="grid gap-3 md:grid-cols-[8rem_1fr] md:items-start">
            <p id="filter-tech" className="eyebrow pt-2.5 text-muted">
              {t.techHeading}
            </p>
            <div>
              <div role="group" aria-labelledby="filter-tech" className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  aria-pressed={tech === null}
                  onClick={() => onChange({ category, tech: null })}
                  className={cn(chip, "min-h-9 px-3 normal-case tracking-normal", tech === null ? chipOn : chipOff)}
                >
                  {t.allTech}
                </button>
                {shownOptions.map((o) => {
                  const on = tech === o.name;
                  return (
                    <button
                      key={o.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onChange({ category, tech: on ? null : o.name })}
                      className={cn(chip, "min-h-9 px-3 normal-case tracking-normal", on ? chipOn : chipOff)}
                    >
                      {o.name}
                      <span className={cn("tabular-nums", on ? "text-black/60" : "text-muted/70")}>{o.count}</span>
                    </button>
                  );
                })}
              </div>
              {options.length > VISIBLE_TECH && (
                <button
                  type="button"
                  aria-expanded={showAllTech}
                  onClick={() => setShowAllTech((v) => !v)}
                  className="link-underline mt-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted hover:text-fg"
                >
                  {showAllTech ? t.showLessTech : format(t.showMoreTech, { count: options.length })}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
            {format(t.results, { count: visible.length, total: projects.length })}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={() => onChange({ category: "all", tech: null })}
              className="inline-flex items-center gap-1.5 py-1 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg"
            >
              <X size={14} aria-hidden /> {t.reset}
            </button>
          )}
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => (
              <motion.li
                key={project.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard
                  project={project}
                  locale={locale}
                  categoryLabel={categories[project.category]}
                  t={t}
                  highlight={tech}
                  priority={i < 2}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 border border-dashed border-line px-6 py-16 text-center">
          <SearchX size={28} aria-hidden className="text-muted" />
          <p className="font-display text-xl">{t.emptyFiltered}</p>
          <p className="text-sm text-muted">{t.emptyFilteredHint}</p>
          <button type="button" onClick={() => onChange({ category: "all", tech: null })} className="btn btn-ghost mt-2">
            {t.reset}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Filterable gallery. The filters live in the URL (?category=web&tech=Next.js)
 * so a filtered view can be shared or bookmarked; history.replaceState keeps
 * it instant (no server round-trip) while Next keeps useSearchParams in sync.
 */
export function ProjectsExplorer(props: ExplorerProps) {
  const params = useSearchParams();
  const category = parseCategory(params.get("category"));
  const tech = params.get("tech") || null;

  const onChange = (next: { category: CategoryFilter; tech: string | null }) => {
    const search = new URLSearchParams();
    if (next.category !== "all") search.set("category", next.category);
    if (next.tech) search.set("tech", next.tech);
    const qs = search.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  return <ExplorerView {...props} category={category} tech={tech} onChange={onChange} />;
}

/** Server-rendered, unfiltered version shown until the URL filters are read (Suspense fallback). */
export function ProjectsExplorerFallback(props: ExplorerProps) {
  return <ExplorerView {...props} category="all" tech={null} onChange={() => {}} />;
}
