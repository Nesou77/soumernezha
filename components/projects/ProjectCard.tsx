
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import type { Dictionary } from "@/lib/i18n";
import { format, localizePath, type Locale } from "@/lib/i18n/config";
import { fallbackLang } from "@/lib/i18n/projects";
import { techKey } from "@/lib/project-filters";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  categoryLabel: string;
  t: Dictionary["projects"];
  highlight?: string | null;
  priority?: boolean;
  position?: number;
}

/** A single accessible link wraps the whole case-study card. */
export function ProjectCard({
  project,
  locale,
  categoryLabel,
  t,
  highlight,
  priority,
  position,
}: ProjectCardProps) {
  const technologies = highlight
    ? [...project.technologies].sort(
        (a, b) =>
          Number(techKey(b) === highlight) -
          Number(techKey(a) === highlight)
      )
    : project.technologies;

  return (
    <article className="group relative h-full min-w-0">
      <Link
        href={localizePath(locale, `/projects/${project.slug}`)}
        aria-label={format(t.openCaseStudy, { title: project.title })}
        className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.025] transition-[border-color,background-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.045] hover:shadow-[0_24px_80px_rgba(0,0,0,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {/* Project image */}
        <div className="relative overflow-hidden bg-[#0b0e12]">
          <ProjectVisual
            project={project}
            alt=""
            priority={priority}
            bordered={false}
            sizes="(min-width: 1024px) 48vw, (min-width: 640px) 50vw, 100vw"
            className="aspect-[16/11] w-full transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />

          {/* Image gradient */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15"
          />

          {/* Category badge */}
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white backdrop-blur-lg sm:left-5 sm:top-5">
            {categoryLabel}
          </span>

          {/* Arrow button */}
          <span
            aria-hidden
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-lg transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-black sm:right-5 sm:top-5"
          >
            <ArrowUpRight size={20} strokeWidth={1.7} />
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
          {/* Sector and index */}
          <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[0.67rem] uppercase tracking-[0.15em] text-muted">
            <span lang={fallbackLang(project, "sector")}>
              {project.sector || categoryLabel}
            </span>

            <span className="tabular-nums">
              {project.index ||
                String((position ?? 0) + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Project title */}
          <h3 className="font-display text-[clamp(1.65rem,2.6vw,2.45rem)] leading-[1.12] tracking-[-0.035em] text-fg transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h3>

          {/* Description */}
          {project.summary && (
            <p
              className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-muted sm:text-[0.95rem]"
              lang={fallbackLang(project, "summary")}
            >
              {project.summary}
            </p>
          )}

          {/* Technology tags */}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            {technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className={`rounded-full border px-3 py-1.5 font-mono text-[0.65rem] leading-none ${
                  highlight && techKey(tech) === highlight
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-white/10 bg-white/[0.035] text-muted"
                }`}
              >
                {tech}
              </span>
            ))}

            {technologies.length > 3 && (
              <span className="font-mono text-xs text-muted">
                +{technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
