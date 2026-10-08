"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ActiveProjectStage } from "@/components/projects/ActiveProjectStage";
import { MobileProjectCarousel } from "@/components/projects/MobileProjectCarousel";
import {
  ProjectFilters,
  type ProjectFilter,
} from "@/components/projects/ProjectFilters";
import { ProjectReel } from "@/components/projects/ProjectReel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/i18n";
import { format, type Locale } from "@/lib/i18n/config";
import type { Project } from "@/types";

const SCROLL_PER_PROJECT_VH = 55;

interface ProjectShowcaseProps {
  projects: Project[];
  locale: Locale;
  t: Dictionary["projects"];
  projectT: Dictionary["project"];
  categories: Dictionary["categories"];
  /** Category filters (off on the home page, which only shows a few featured projects). */
  showFilters?: boolean;
  /** Overrides the section heading copy. */
  heading?: { eyebrow: string; headline: string; intro: string };
  index?: string;
  /** Rendered under the projects (e.g. a "View all projects" link). */
  footer?: ReactNode;
}

export function ProjectShowcase({
  projects,
  locale,
  t: c,
  projectT,
  categories,
  showFilters = true,
  heading,
  index = "02",
  footer,
}: ProjectShowcaseProps) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

  /* =========================================
     FILTER PROJECTS
     ========================================= */

  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          filter === "all" ||
          project.category === filter,
      ),
    [projects, filter],
  );

  const activeProject = visibleProjects[activeIndex];

  /* =========================================
     RESET AFTER FILTER CHANGE
     ========================================= */

  function changeFilter(next: ProjectFilter) {
    activeIndexRef.current = 0;
    setActiveIndex(0);
    setDirection(1);
    setFilter(next);
  }

  /* =========================================
     DECORATIVE MARQUEE
     ========================================= */

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const marqueeX = useTransform(
    scrollYProgress,
    [0, 1],
    reduce
      ? ["0%", "0%"]
      : ["4%", "-38%"],
  );

  /* =========================================
     PROJECT SCROLL
     ========================================= */

  const {
    scrollYProgress: projectProgress,
  } = useScroll({
    target: scrollStageRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(
    projectProgress,
    "change",
    (progress) => {
      const total =
        visibleProjects.length;

      if (total <= 1) {
        return;
      }

      const nextIndex = Math.min(
        total - 1,
        Math.max(
          0,
          Math.round(
            progress * (total - 1),
          ),
        ),
      );

      const current =
        activeIndexRef.current;

      if (nextIndex === current) {
        return;
      }

      setDirection(
        nextIndex > current ? 1 : -1,
      );

      activeIndexRef.current =
        nextIndex;

      setActiveIndex(nextIndex);
    },
  );

  /* =========================================
     NAVIGATION
     ========================================= */

  function goToProject(index: number) {
    const stage =
      scrollStageRef.current;

    const total =
      visibleProjects.length;

    if (!stage || total === 0) {
      return;
    }

    const targetIndex = Math.max(
      0,
      Math.min(
        index,
        total - 1,
      ),
    );

    const rect =
      stage.getBoundingClientRect();

    const stageTop =
      window.scrollY + rect.top;

    const scrollDistance =
      Math.max(
        0,
        stage.offsetHeight -
          window.innerHeight,
      );

    const targetProgress =
      total <= 1
        ? 0
        : targetIndex /
          (total - 1);

    window.scrollTo({
      top:
        stageTop +
        scrollDistance *
          targetProgress,
      behavior: "smooth",
    });
  }

  function previous() {
    const current =
      activeIndexRef.current;

    if (current <= 0) {
      return;
    }

    goToProject(current - 1);
  }

  function next() {
    const current =
      activeIndexRef.current;

    if (
      current >=
      visibleProjects.length - 1
    ) {
      return;
    }

    goToProject(current + 1);
  }

  if (!projects.length) {
    return null;
  }

  /* =========================================
     SCROLL HEIGHT
     ========================================= */

  const transitions = Math.max(
    visibleProjects.length - 1,
    0,
  );

  const scrollHeight =
    100 +
    transitions *
      SCROLL_PER_PROJECT_VH;

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-title"
      className="
        relative
        overflow-x-clip
      "
    >
      {/* =====================================
          DECORATIVE BACKGROUND
         ===================================== */}

      <motion.p
        aria-hidden
        style={{ x: marqueeX }}
        className="
          display outline-text
          pointer-events-none
          absolute top-16 z-0
          whitespace-nowrap
          text-[clamp(6rem,20vw,20rem)]
          opacity-[0.055]
        "
      >
        {Array.from({ length: 3 }, () => c.marquee).join(" — ")}
      </motion.p>

      <div className="container-x relative z-10 pt-[var(--section-y)]">
        <SectionHeading
          id="projects-title"
          index={index}
          eyebrow={heading?.eyebrow ?? c.eyebrow}
          lines={[heading?.headline ?? c.headline]}
          intro={heading?.intro ?? c.intro}
        />
        <div aria-live="polite" className="sr-only">
          {format(c.showing, { count: visibleProjects.length })}
        </div>
      </div>

      {activeProject && (
        <div ref={scrollStageRef} className="relative mt-4 hidden lg:block" style={{ height: `${scrollHeight}vh` }}>
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="container-x flex h-full flex-col py-5 xl:py-6">
              {showFilters && (
                <div className="shrink-0 border-b border-line pb-3">
                  <ProjectFilters value={filter} onChange={changeFilter} categories={categories} t={c} />
                </div>
              )}
              <div className="grid min-h-0 flex-1 grid-cols-[minmax(230px,0.62fr)_minmax(0,2.15fr)] gap-10 pt-3 xl:gap-14">
                <ProjectReel projects={visibleProjects} activeIndex={activeIndex} onChange={goToProject} />
                <ActiveProjectStage
                  project={activeProject}
                  activeIndex={activeIndex}
                  total={visibleProjects.length}
                  direction={direction}
                  onPrevious={previous}
                  onNext={next}
                  locale={locale}
                  t={c}
                  projectT={projectT}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-x relative z-10">
        <div className="mt-8 lg:hidden">
          {showFilters && <ProjectFilters value={filter} onChange={changeFilter} categories={categories} t={c} />}
          <div className={showFilters ? "mt-6" : undefined}>
            {visibleProjects.length > 0 ? (
              <MobileProjectCarousel projects={visibleProjects} locale={locale} categories={categories} t={c} />
            ) : (
              <p className="text-muted">{c.empty}</p>
            )}
          </div>
        </div>
        <div className="pb-[var(--section-y)] lg:pt-8">{footer}</div>
      </div>
    </section>
  );
}