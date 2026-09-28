"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import type { Dictionary } from "@/lib/i18n";
import { format, localizePath, type Locale } from "@/lib/i18n/config";
import { fallbackLang } from "@/lib/i18n/projects";
import type { Project } from "@/types";

const ease = [
  0.22,
  1,
  0.36,
  1,
] as const;

interface ActiveProjectStageProps {
  project: Project;
  activeIndex: number;
  total: number;
  direction: number;
  onPrevious: () => void;
  onNext: () => void;
  locale: Locale;
  t: Dictionary["projects"];
  projectT: Dictionary["project"];
}

export function ActiveProjectStage({
  project,
  activeIndex,
  total,
  direction,
  onPrevious,
  onNext,
  locale,
  t,
  projectT,
}: ActiveProjectStageProps) {
  const number = String(
    activeIndex + 1,
  ).padStart(2, "0");

  const isFirst =
    activeIndex === 0;

  const isLast =
    activeIndex === total - 1;

  return (
    <div
      className="
        relative
        flex
        h-full
        min-h-0
        flex-col
      "
    >
      {/* =================================
          DECORATIVE NUMBER
         ================================= */}

      <AnimatePresence initial={false}>
        <motion.span
          key={`number-${project.slug}`}
          aria-hidden
          initial={{
            opacity: 0,
            y:
              direction >= 0
                ? 30
                : -30,
          }}
          animate={{
            opacity: 0.07,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y:
              direction >= 0
                ? -30
                : 30,
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className="
            display
            outline-text
            pointer-events-none
            absolute
            -right-2
            -top-10
            z-0
            select-none
            text-[clamp(8rem,16vw,16rem)]
            leading-none
          "
        >
          {number}
        </motion.span>
      </AnimatePresence>

      {/* =================================
          PROJECT IMAGE
         ================================= */}

      <div
        className="
          relative
          z-10
          h-[clamp(500px,68vh,760px)]
          shrink-0
          overflow-hidden
          bg-black
        "
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={project.slug}
            initial={{
              opacity: 0,
              y:
                direction >= 0
                  ? "20%"
                  : "-20%",
              scale: 0.975,
            }}
            animate={{
              opacity: 1,
              y: "0%",
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y:
                direction >= 0
                  ? "-8%"
                  : "8%",
              scale: 0.99,
            }}
            transition={{
              duration: 0.65,
              ease,
            }}
            className="
              absolute
              inset-0
            "
          >
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`${project.title}: open case study`}
              data-cursor
              className="
                group
                absolute
                inset-0
                block
                overflow-hidden
              "
            >
              <motion.div
                className="
                  absolute
                  inset-0
                "
                whileHover={{
                  scale: 1.012,
                }}
                transition={{
                  duration: 0.55,
                  ease,
                }}
              >
                <ProjectVisual
                  project={project}
                  alt=""
                  priority
                  sizes="(min-width: 1024px) 75vw, 100vw"
                  className="
                    h-full
                    w-full
                  "
                />
              </motion.div>

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  border
                  border-white/10
                  transition-colors
                  duration-500

                  group-hover:border-accent/50
                "
              />

              {/* VIEW BUTTON */}

              <div
                className="
                  absolute
                  bottom-5
                  right-5
                  translate-y-2
                  opacity-0
                  transition-all
                  duration-500

                  group-hover:
                  translate-y-0

                  group-hover:
                  opacity-100
                "
              >
                <span
                  className="
                    flex
                    h-16 w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-accent
                    font-display
                    text-xs
                    text-black
                  "
                >
                  View ↗
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* =================================
            PREVIOUS / NEXT

            Floats over top-right of image.
           ================================= */}

        <div
          className="
            absolute
            right-4
            top-4
            z-40
            flex
            items-center
            gap-1.5
          "
        >
          <button
            type="button"
                aria-label={projectT.previousProject}
            disabled={isFirst}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              if (!isFirst) {
                onPrevious();
              }
            }}
            className="
              flex
              h-8 w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/25
              bg-black/45
              text-white
              backdrop-blur-md
              transition-all
              duration-300

              hover:border-accent
              hover:bg-black/70
              hover:text-accent

              disabled:pointer-events-none
              disabled:opacity-25
            "
          >
            <ArrowUp size={13} />
          </button>

          <button
            type="button"
                aria-label={projectT.nextProject}
            disabled={isLast}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              if (!isLast) {
                onNext();
              }
            }}
            className="
              flex
              h-8 w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/25
              bg-black/45
              text-white
              backdrop-blur-md
              transition-all
              duration-300

              hover:border-accent
              hover:bg-black/70
              hover:text-accent

              disabled:pointer-events-none
              disabled:opacity-25
            "
          >
            <ArrowDown size={13} />
          </button>
        </div>
      </div>

      {/* =================================
          PROJECT DETAILS
         ================================= */}

      <div
        className="
          relative
          z-10
          mt-3
          grid
          gap-3
          xl:grid-cols-[1fr_auto]
        "
      >
        <div className="min-w-0">
          <div className="overflow-hidden">
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.h3
                key={`title-${project.slug}`}
                initial={{
                  y:
                    direction >= 0
                      ? "100%"
                      : "-100%",
                  opacity: 0,
                }}
                animate={{
                  y: "0%",
                  opacity: 1,
                }}
                exit={{
                  y:
                    direction >= 0
                      ? "-100%"
                      : "100%",
                  opacity: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease,
                }}
                className="
                  display-mixed
                  text-[clamp(1.9rem,3.3vw,3.8rem)]
                  leading-[0.95]
                "
              >
                <Link
                  href={localizePath(locale, `/projects/${project.slug}`)}
                  aria-label={format(t.openCaseStudy, { title: project.title })}
                  className="
                    transition-colors
                    duration-300
                    hover:text-accent
                  "
                >
                  {project.title}
                </Link>
              </motion.h3>
            </AnimatePresence>
          </div>

          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.div
              key={`details-${project.slug}`}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.38,
                delay: 0.06,
                ease,
              }}
            >
              <p
                lang={fallbackLang(project, "summary")}
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  text-muted
                "
              >
                {project.summary}
              </p>

              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  gap-x-3
                  gap-y-1
                  font-mono
                  text-[0.58rem]
                  uppercase
                  tracking-[0.1em]
                  text-muted
                "
              >
                {project.technologies
                  .slice(0, 5)
                  .map(
                    (
                      technology,
                      index,
                    ) => (
                      <span
                        key={technology}
                      >
                        {index > 0 && (
                          <span
                            className="
                              mr-3
                              text-accent/50
                            "
                          >
                            /
                          </span>
                        )}

                        {technology}
                      </span>
                    ),
                  )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="
            flex
            items-center
            xl:items-end
          "
        >
          <Link
            href={`/projects/${project.slug}`}
            className="
              btn
              btn-ghost
              whitespace-nowrap
            "
          >
            {t.viewCaseStudy}
            <ArrowIcon />
          </Link>
        </div>
      </div>

      {/* =================================
          PROGRESS
         ================================= */}

      <div
        className="
          relative
          z-10
          mt-2
          flex
          items-center
          gap-3
        "
      >
        <span
          className="
            font-mono
            text-[0.58rem]
            text-muted
          "
        >
          {number}
        </span>

        <div
          className="
            h-px
            flex-1
            overflow-hidden
            bg-white/10
          "
        >
          <motion.div
            className="
              h-full
              bg-accent
            "
            animate={{
              width: `${
                ((activeIndex + 1) /
                  total) *
                100
              }%`,
            }}
            transition={{
              duration: 0.5,
              ease,
            }}
          />
        </div>
      </div>
    </div>
  );
}