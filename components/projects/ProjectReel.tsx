"use client";

import { motion } from "framer-motion";

import type { Project } from "@/types";

interface ProjectReelProps {
  projects: Project[];
  activeIndex: number;
  onChange: (index: number) => void;
}

const ITEM_HEIGHT = 78;

const ease = [
  0.22,
  1,
  0.36,
  1,
] as const;

export function ProjectReel({
  projects,
  activeIndex,
  onChange,
}: ProjectReelProps) {
  /*
   * Keep the active project visible
   * as the user moves through the list.
   */
  const reelOffset =
    -Math.max(
      0,
      activeIndex - 3,
    ) * ITEM_HEIGHT;

  return (
    <div
      className="
        flex
        min-h-0
        flex-1
        flex-col
        overflow-hidden
      "
    >
      {/* =================================
          PROJECT LIST
         ================================= */}

      <div
        className="
          relative
          mt-3
          min-h-0
          flex-1
          overflow-hidden
        "
      >
        <motion.div
          className="
            flex
            flex-col
          "
          animate={{
            y: reelOffset,
          }}
          transition={{
            duration: 0.55,
            ease,
          }}
        >
          {projects.map(
            (project, index) => {
              const active =
                index === activeIndex;

              const distance =
                Math.abs(
                  index -
                    activeIndex,
                );

              const opacity =
                active
                  ? 1
                  : distance === 1
                    ? 0.68
                    : distance === 2
                      ? 0.48
                      : 0.3;

              return (
                <motion.button
                  key={project.slug}
                  type="button"
                  onClick={() =>
                    onChange(index)
                  }
                  animate={{
                    opacity,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="
                    group
                    relative
                    flex
                    h-[78px]
                    shrink-0
                    items-center
                    border-b
                    border-white/[0.07]
                    text-left
                  "
                >
                  {/* =================================
                      ACTIVE INDICATOR
                     ================================= */}

                  <motion.span
                    aria-hidden
                    className="
                      absolute
                      bottom-3
                      left-0
                      top-3
                      w-px
                      origin-center
                      bg-accent
                    "
                    initial={false}
                    animate={{
                      scaleY:
                        active
                          ? 1
                          : 0,
                      opacity:
                        active
                          ? 1
                          : 0,
                    }}
                    transition={{
                      duration: 0.35,
                      ease,
                    }}
                  />

                  {/* =================================
                      PROJECT TITLE
                     ================================= */}

                  <motion.div
                    animate={{
                      x:
                        active
                          ? 12
                          : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease,
                    }}
                    className="
                      min-w-0
                      pr-4
                    "
                  >
                    <span
                      className={`
                        block
                        truncate
                        font-display
                        text-[clamp(1.1rem,1.5vw,1.45rem)]
                        leading-tight
                        transition-colors
                        duration-300

                        ${
                          active
                            ? "text-accent"
                            : "text-white/70 group-hover:text-white"
                        }
                      `}
                    >
                      {project.title}
                    </span>
                  </motion.div>
                </motion.button>
              );
            },
          )}
        </motion.div>
      </div>
    </div>
  );
}