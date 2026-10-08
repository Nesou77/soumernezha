import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/i18n";

/** Comma-free list of expertise keywords separated by accent dots. */
export function ExpertiseList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 font-display text-sm text-fg">
      {items.map((e) => (
        <li key={e} className="flex items-center gap-5">
          {e}
          <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70 last:hidden" />
        </li>
      ))}
    </ul>
  );
}

interface AboutProps {
  t: Dictionary["about"];
  index?: string;
  /** `h1` when the section opens the About page. */
  as?: "h1" | "h2";
  /** Right-hand column (the CV card on the About page). */
  aside?: ReactNode;
  className?: string;
}

/** Biography: who I am, what I cover, and why the QA background matters. */
export function About({ t: c, index = "01", as = "h2", aside, className = "section-y" }: AboutProps) {
  return (
    <section id="about" aria-labelledby="about-title" className={`relative ${className}`}>
      <div className="container-x">
        <SectionHeading id="about-title" index={index} eyebrow={c.eyebrow} lines={c.headline} size="h3" variant="mixed" as={as} />

        <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-12">
          <div className="space-y-6 text-muted lg:col-span-7 xl:col-span-6">
            {c.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08} immediate={as === "h1"}>
                <p className={i === 0 ? "text-lg text-fg" : undefined}>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <h2 className="eyebrow mb-4 mt-10 text-muted">{c.expertiseLabel}</h2>
              <ExpertiseList items={c.expertise} />
            </Reveal>
          </div>

          {aside && (
            <Reveal delay={0.25} immediate={as === "h1"} className="lg:col-span-5 xl:col-span-5 xl:col-start-8">
              <div className="lg:sticky lg:top-28">{aside}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
