import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
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
  /** Technologies to emphasise (the active filter). */
  highlight?: string | null;
  priority?: boolean;
}

/**
 * Gallery card. The whole card is one link (a single tab stop), with the
 * title as its accessible name; the image is decorative.
 */
export function ProjectCard({ project, locale, categoryLabel, t, highlight, priority }: ProjectCardProps) {
  // The filtered technology is moved to the front so it is always visible.
  const ordered = highlight
    ? [...project.technologies].sort((a, b) => Number(techKey(b) === highlight) - Number(techKey(a) === highlight))
    : project.technologies;
  const techs = ordered.slice(0, 4);
  const more = project.technologies.length - techs.length;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden">
        <div className="transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]">
          <ProjectVisual
            project={project}
            alt=""
            priority={priority}
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="aspect-[16/10]"
          />
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 border border-accent/0 transition-colors duration-500 group-hover:border-accent/60"
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fg backdrop-blur-md">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display-mixed text-[clamp(1.5rem,1.2rem+1vw,2rem)]">
            <Link
              href={localizePath(locale, `/projects/${project.slug}`)}
              aria-label={format(t.openCaseStudy, { title: project.title })}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:text-accent group-hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>
          <span className="font-mono text-xs text-muted">{project.index}</span>
        </div>
        {project.sector && (
          <p className="mt-1 text-sm text-fg/80" lang={fallbackLang(project, "sector")}>
            {project.sector}
          </p>
        )}
        <p className="mt-3 line-clamp-3 text-sm text-muted" lang={fallbackLang(project, "summary")}>
          {project.summary}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <ul className="flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <li
                key={tech}
                className={
                  highlight && techKey(tech) === highlight
                    ? "border border-accent/60 px-2 py-0.5 font-mono text-[0.62rem] text-accent"
                    : "border border-white/10 px-2 py-0.5 font-mono text-[0.62rem] text-muted"
                }
              >
                {tech}
              </li>
            ))}
            {more > 0 && <li className="px-1 py-0.5 font-mono text-[0.62rem] text-muted">+{more}</li>}
          </ul>
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-black"
          >
            <ArrowIcon size={16} />
          </span>
        </div>
      </div>
      {/* Keyboard focus ring for the stretched link. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-sm border-2 border-accent opacity-0 group-has-[a:focus-visible]:opacity-100"
      />
    </article>
  );
}
