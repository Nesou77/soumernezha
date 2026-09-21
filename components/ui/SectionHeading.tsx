import { MaskLines } from "@/components/animations/MaskLines";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  index?: string;
  lines: readonly string[];
  intro?: string;
  className?: string;
  size?: "h2" | "h3";
  /** `mixed` keeps sentence case, for long statements. */
  variant?: "caps" | "mixed";
}

export function SectionHeading({ id, eyebrow, index, lines, intro, className, size = "h2", variant = "caps" }: SectionHeadingProps) {
  return (
    <header className={cn("max-w-5xl", className)}>
      <Reveal>
        <p className="eyebrow mb-6 flex items-center gap-4">
          {index && <span className="text-muted">{index}</span>}
          <span aria-hidden className="h-px w-10 bg-accent/60" />
          {eyebrow}
        </p>
      </Reveal>
      <h2 id={id} className={cn(variant === "caps" ? "display" : "display-mixed", size === "h2" ? "text-h2" : "text-h3")}>
        <span className="sr-only">{lines.join(" ")}</span>
        <span aria-hidden>
          <MaskLines lines={lines} />
        </span>
      </h2>
      {intro && (
        <Reveal delay={0.15} className="mt-8 max-w-xl text-muted">
          <p>{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
