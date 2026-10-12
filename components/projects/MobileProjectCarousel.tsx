"use client";

import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import type { Dictionary } from "@/lib/i18n";
import { format, localizePath, type Locale } from "@/lib/i18n/config";
import { fallbackLang } from "@/lib/i18n/projects";
import type { Project } from "@/types";

export function MobileProjectCarousel({
  projects,
  locale,
  categories,
  t,
}: {
  projects: Project[];
  locale: Locale;
  categories: Dictionary["categories"];
  t: Dictionary["projects"];
}) {
  return (
    <div
      className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-5"
      style={{ scrollbarWidth: "none" }}
    >
      {projects.map((project) => (
        <article
          key={project.slug}
          className="w-[86vw] max-w-[34rem] shrink-0 snap-center"
        >
          <Link
            href={localizePath(locale, `/projects/${project.slug}`)}
            aria-label={format(t.openCaseStudy, { title: project.title })}
            className="group block overflow-hidden rounded-2xl border border-line bg-bg-2"
          >
            <ProjectVisual
              project={project}
              alt=""
              sizes="86vw"
              className="aspect-video"
            />

            <div className="flex items-start justify-between gap-5 p-5">
              <div>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">
                  {categories[project.category]}
                </p>

                <h3 className="display-mixed break-words text-2xl group-hover:text-accent">
                  {project.title}
                </h3>

                <p lang={fallbackLang(project, "summary")} className="mt-2 line-clamp-2 text-sm text-muted">
                  {project.summary}
                </p>
              </div>

              <ArrowIcon size={20} />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}