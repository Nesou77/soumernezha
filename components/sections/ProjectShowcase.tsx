"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { content } from "@/data/content";
import { categoryLabels } from "@/lib/project-constants";
import { useFinePointer } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/types";
import { ProjectFeatured } from "./ProjectFeatured";

type Filter = "all" | ProjectCategory;
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: categoryLabels.web },
  { id: "cms", label: categoryLabels.cms },
  { id: "qa", label: categoryLabels.qa },
];

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const c = content.projects;
  const [filter, setFilter] = useState<Filter>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const marqueeX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-38%"]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.4 });

  const visible = projects.filter((p) => filter === "all" || p.category === filter);
  const featured = visible.filter((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);
  const hoveredProject = projects.find((p) => p.slug === hovered);

  return (
    <section ref={sectionRef} id="projects" aria-labelledby="projects-title" className="section-y relative overflow-x-clip">
      <motion.p
        aria-hidden
        style={{ x: marqueeX }}
        className="display outline-text pointer-events-none absolute top-16 z-0 whitespace-nowrap text-[clamp(6rem,20vw,20rem)] opacity-[0.09]"
      >
        Selected work — Selected work — Selected work
      </motion.p>

      <div className="container-x relative z-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading id="projects-title" index="02" eyebrow={c.eyebrow} lines={[c.headline]} intro={c.intro} />

          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
                  filter === f.id
                    ? "border-accent bg-accent text-black"
                    : "border-white/15 text-muted hover:border-white/40 hover:text-fg",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="sr-only">
          Showing {visible.length} projects
        </div>

        {featured.length > 0 && (
          <div className="mt-24 space-y-28 sm:space-y-40">
            {featured.map((p, i) => (
              <ProjectFeatured key={p.slug} project={p} flip={i % 2 === 1} />
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className={cn(featured.length > 0 ? "mt-32" : "mt-20")}>
            <p className="eyebrow mb-6 flex items-center justify-between text-muted">
              <span>Index</span>
              <span>{String(rest.length).padStart(2, "0")} projects</span>
            </p>
            <ul
              className="border-t border-line"
              onPointerMove={(e) => {
                if (e.pointerType !== "mouse") return;
                mx.set(e.clientX + 28);
                my.set(e.clientY - 110);
              }}
              onPointerLeave={() => setHovered(null)}
            >
              {rest.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <Link
                    href={`/projects/${p.slug}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(p.slug)}
                    onFocus={() => setHovered(p.slug)}
                    onBlur={() => setHovered(null)}
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 sm:gap-x-8 sm:py-8 md:grid-cols-[4rem_1.4fr_1fr_auto]"
                  >
                    <span className="font-mono text-xs text-muted">{p.index}</span>
                    <span className="display-mixed text-[clamp(1.7rem,1rem+3.6vw,4.4rem)] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-3 group-hover:text-accent group-focus-visible:translate-x-3 sm:group-hover:translate-x-6">
                      {p.title}
                    </span>
                    <span className="col-span-2 col-start-2 text-sm text-muted md:col-span-1 md:col-start-auto">
                      <span className="block text-fg/80">{p.sector}</span>
                      <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em]">
                        {categoryLabels[p.category]}
                      </span>
                    </span>
                    <span className="row-start-1 col-start-3 self-center md:row-start-auto md:col-start-auto">
                      <ArrowIcon size={22} />
                      <span className="sr-only">View case study</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Cursor-following preview (mouse only) */}
      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-30 w-[min(22rem,32vw)]"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence mode="wait">
            {hoveredProject && (
              <motion.div
                key={hoveredProject.slug}
                initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                exit={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectVisual project={hoveredProject} sizes="22rem" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
