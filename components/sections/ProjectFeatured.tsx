"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { categoryLabels } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectFeatured({ project, flip }: { project: Project; flip?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);
  const numX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [flip ? "-8%" : "8%", flip ? "8%" : "-8%"]);

  return (
    <article ref={ref} className="relative [perspective:1400px]">
      <motion.span
        aria-hidden
        style={{ x: numX }}
        className="display outline-text pointer-events-none absolute -top-[0.35em] z-0 select-none text-[clamp(8rem,26vw,24rem)] opacity-[0.16]"
      >
        {project.index}
      </motion.span>

      <motion.div
        className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
        initial={reduce ? false : { opacity: 0, rotateX: 10, y: 80 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1.1, ease }}
        style={{ transformOrigin: "50% 100%" }}
      >
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.title}: open case study`}
          data-cursor
          className={cn("group relative block overflow-hidden lg:col-span-7", flip && "lg:order-2")}
        >
          <motion.div style={{ y: imgY, scale: 1.14 }} className="will-change-transform">
            <ProjectVisual project={project} />
          </motion.div>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-accent/0 transition-colors duration-500 group-hover:border-accent/60"
          />
          <span
            aria-hidden
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-display text-sm text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2"
          >
            Case study <ArrowIcon size={16} />
          </span>
        </Link>

        <div className={cn("lg:col-span-5", flip && "lg:order-1")}>
          <p className="eyebrow mb-4">{categoryLabels[project.category]}</p>
          <h3 className="display text-h2 mb-4">
            <Link href={`/projects/${project.slug}`} className="link-underline">
              {project.title}
            </Link>
          </h3>
          <p className="mb-2 font-display text-lg text-fg">{project.sector}</p>
          <p className="mb-6 max-w-md text-muted">{project.summary}</p>

          <ul className="mb-7 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
            {project.technologies.slice(0, 7).map((t, i) => (
              <li key={t}>
                {i > 0 && <span aria-hidden className="mr-3 text-accent/60">/</span>}
                {t}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={`/projects/${project.slug}`} className="btn btn-ghost">
              Read case study <ArrowIcon />
            </Link>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
              >
                Visit website <ArrowIcon size={14} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </article>
  );
}
