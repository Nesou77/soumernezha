"use client";

import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { categoryLabels } from "@/lib/project-constants";
import type { Project } from "@/types";

export function MobileProjectCarousel({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <div
      className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-5"
      style={{ scrollbarWidth: "none" }}
    >
      {projects.map((project, index) => (
        <article
          key={project.slug}
          className="w-[86vw] max-w-[34rem] shrink-0 snap-center"
        >
          <Link
            href={`/projects/${project.slug}`}
            className="group block"
          >
            <ProjectVisual
              project={project}
              sizes="86vw"
              className="aspect-video"
            />

            <div className="mt-5 flex items-start justify-between gap-5">
              <div>
                <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                  {" / "}
                  {String(projects.length).padStart(2, "0")}
                  {" · "}
                  {categoryLabels[project.category]}
                </p>

                <h3 className="display-mixed text-3xl">
                  {project.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-muted">
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