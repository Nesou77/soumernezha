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
