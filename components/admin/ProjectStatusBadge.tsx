import { cn } from "@/lib/utils";

export function ProjectStatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide",
        published ? "bg-accent/15 text-accent" : "bg-white/10 text-white/60",
      )}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-300">
      Featured
    </span>
  );
}

/** French translation status: complete, partial (x/y sections) or missing (English shown). */
export function TranslationBadge({ done, total }: { done: number; total: number }) {
  const complete = total > 0 && done === total;
  return (
    <span
      title={complete ? "French translation complete" : `French: ${done} of ${total} sections translated (the rest shows in English)`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide tabular-nums",
        complete ? "bg-accent/15 text-accent" : done === 0 ? "bg-red-400/10 text-red-300" : "bg-amber-400/15 text-amber-300",
      )}
    >
      FR {complete ? "✓" : `${done}/${total}`}
    </span>
  );
}
