"use client";

import { motion } from "framer-motion";
import { categoryLabels } from "@/lib/project-constants";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

export type ProjectFilter = "all" | ProjectCategory;

const filters: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: categoryLabels.web },
  { id: "cms", label: categoryLabels.cms },
  { id: "qa", label: categoryLabels.qa },
];

interface ProjectFiltersProps {
  value: ProjectFilter;
  onChange: (filter: ProjectFilter) => void;
}

export function ProjectFilters({
  value,
  onChange,
}: ProjectFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className="flex flex-wrap items-center gap-x-6 gap-y-3"
    >
      {filters.map((filter) => {
        const active = value === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(filter.id)}
            className={cn(
              "relative pb-2 font-mono text-[0.7rem] uppercase tracking-[0.16em]",
              "transition-colors duration-300",
              active ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {filter.label}

            {active && (
              <motion.span
                layoutId="project-filter-indicator"
                className="absolute inset-x-0 bottom-0 h-px bg-accent"
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}