import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { TiltCard } from "@/components/animations/TiltCard";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/lib/i18n";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { ExpertiseList } from "./About";

interface KeySkillsProps {
  locale: Locale;
  t: Dictionary["home"]["skills"];
  about: Dictionary["about"];
  index?: string;
}

/** Home page overview: the two sides of the work (build / verify) and the core stack. */
export function KeySkills({ locale, t, about, index = "01" }: KeySkillsProps) {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading id="expertise-title" index={index} eyebrow={t.eyebrow} lines={t.headline} intro={t.intro} size="h3" variant="mixed" />

        <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <Reveal>
              <h3 className="eyebrow mb-4 text-muted">{about.expertiseLabel}</h3>
              <ExpertiseList items={about.expertise} />
            </Reveal>
            <Reveal delay={0.1}>
              <Link href={localizePath(locale, "/about")} className="btn btn-ghost">
                {t.more} <ArrowIcon />
              </Link>
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {about.cards.map((card, i) => (
              <Reveal key={card.num} delay={0.1 + i * 0.12} className={i === 1 ? "sm:mt-16" : undefined}>
                <TiltCard className="h-full">
                  <article className="flex h-full min-h-[22rem] flex-col justify-between border border-line bg-[#0b0f14]/60 p-7 backdrop-blur-sm">
                    <div className="flex items-start justify-between font-mono text-xs tracking-[0.2em]">
                      <span className="text-muted">{card.num}</span>
                      <span className={i === 0 ? "text-accent" : "text-violet"}>{card.tag}</span>
                    </div>
                    <div style={{ transform: "translateZ(30px)" }}>
                      <span
                        aria-hidden
                        className={`display mb-6 block text-[clamp(4rem,9vw,7rem)] ${i === 0 ? "text-accent/90" : "outline-text opacity-60"}`}
                      >
                        {i === 0 ? "</>" : "✓"}
                      </span>
                      <h3 className="display-mixed text-2xl">{card.title}</h3>
                      <p className="mt-3 text-sm text-muted">{card.text}</p>
                      <ul className="mt-5 space-y-1.5 border-t border-line pt-4 font-mono text-xs text-muted">
                        {card.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
