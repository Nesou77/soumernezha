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
  /** `h1` for the heading that opens an inner page (animates on mount). */
  as?: "h1" | "h2";
}

export function SectionHeading({
  id,
  eyebrow,
  index,
  lines,
  intro,
  className,
  size = "h2",
  variant = "caps",
  as: Heading = "h2",
}: SectionHeadingProps) {
  const immediate = Heading === "h1";
  return (
    <header className={cn("max-w-5xl", className)}>
      <Reveal immediate={immediate}>
        <p className="eyebrow mb-6 flex items-center gap-4">
          {index && <span className="text-muted">{index}</span>}
          <span aria-hidden className="h-px w-10 bg-accent/60" />
          {eyebrow}
        </p>
      </Reveal>
      <Heading id={id} className={cn(variant === "caps" ? "display" : "display-mixed", size === "h2" ? "text-h2" : "text-h3")}>
        <span className="sr-only">{lines.join(" ")}</span>
        <span aria-hidden>
          <MaskLines lines={lines} immediate={immediate} delay={immediate ? 0.1 : 0} />
        </span>
      </Heading>
      {intro && (
        <Reveal immediate={immediate} delay={immediate ? 0.3 : 0.15} className="mt-8 max-w-xl text-muted">
          <p>{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
