import { Download, Link2, Mail } from "lucide-react";
import { MaskLines } from "@/components/animations/MaskLines";
import { Magnetic } from "@/components/animations/Magnetic";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { content } from "@/data/content";
import { site } from "@/lib/site";

const words = ["BUILD.", "TEST.", "PERFECT."] as const;
const wordStyle = ["", "outline-text", "text-accent"] as const;

export function Hero() {
  const c = content.hero;
  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-svh flex-col justify-end pb-24 pt-32 sm:pb-28">
      <div className="container-x">
        <Reveal immediate>
          <p className="eyebrow mb-6 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{c.eyebrow}</span>
            <span aria-hidden className="hidden h-px w-10 bg-accent/60 sm:block" />
            <span className="text-muted">{site.location}</span>
          </p>
        </Reveal>

        <h1 id="hero-title" className="display text-h1 -ml-[0.04em]">
          <span className="sr-only">
            {site.name}, {site.role}. Build. Test. Perfect.
          </span>
          <span aria-hidden>
            <MaskLines immediate delay={0.9} lines={words} lineClassNames={wordStyle} />
          </span>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Reveal immediate delay={1.3}>
              <p className="display-mixed text-[clamp(1.35rem,0.9rem+1.8vw,2.3rem)]">
                {c.statement[0]}
                <br />
                <span className="text-muted">{c.statement[1]}</span>
              </p>
            </Reveal>
            <Reveal immediate delay={1.45}>
              <p className="mt-6 max-w-lg text-muted">{c.support}</p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-8 lg:items-start lg:pt-1">
            <Reveal immediate delay={1.55}>
              <p className="font-display text-sm uppercase tracking-[0.18em] text-fg">
                {c.roleLines[0]} <span className="text-accent">{c.roleLines[1]}</span> {c.roleLines[2]}
              </p>
            </Reveal>
            <Reveal immediate delay={1.65}>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a href="#projects" className="btn btn-primary">
                    {c.primaryCta}
                    <ArrowIcon />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#about" className="btn btn-ghost">
                    {c.secondaryCta}
                  </a>
                </Magnetic>
              </div>
            </Reveal>
            <Reveal immediate delay={1.75}>
              <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted">
                <li>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2 hover:text-fg"
                  >
                    <Link2 size={15} aria-hidden /> LinkedIn
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="link-underline inline-flex items-center gap-2 hover:text-fg">
                    <Mail size={15} aria-hidden /> Email
                  </a>
                </li>
                <li>
                  <a href={site.cv} download className="link-underline inline-flex items-center gap-2 hover:text-fg">
                    <Download size={15} aria-hidden /> Download CV
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      <p className="sr-only">
        Decorative 3D illustration: translucent interface panels labelled build and test orbit a glass core, then
        drift apart as you scroll.
      </p>

      <a
        href="#about"
        aria-label="Scroll to the About section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted sm:flex"
      >
        {c.scroll}
        <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-0 bg-accent" style={{ animation: "scroll-cue 2.2s var(--ease-out) infinite" }} />
        </span>
      </a>
    </section>
  );
}

