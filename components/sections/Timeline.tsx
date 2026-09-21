"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/data/content";
import { certification, education, experience } from "@/data/experience";
import { cn } from "@/lib/utils";

export function Timeline() {
  const c = content.experience;
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading id="experience-title" index="05" eyebrow={c.eyebrow} lines={[c.headline]} />

        <ol ref={listRef} className="relative mt-16 ml-2 sm:ml-0">
          {/* rail + progress */}
          <span aria-hidden className="absolute bottom-0 left-0 top-2 w-px bg-white/10 md:left-[calc(30%-1px)]" />
          <motion.span
            aria-hidden
            style={{ scaleY: reduce ? 1 : scaleY, transformOrigin: "top" }}
            className="absolute bottom-0 left-0 top-2 w-px bg-accent md:left-[calc(30%-1px)]"
          />

          {experience.map((e, i) => (
            <li key={e.company} className="relative grid gap-y-2 pb-14 pl-8 last:pb-0 md:grid-cols-[30%_1fr] md:pl-0">
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-2.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-accent md:left-[30%]",
                  e.highlight ? "bg-accent" : "bg-[#050505]",
                )}
              />
              <Reveal className="md:pr-12 md:text-right">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{e.period}</p>
                {e.location && <p className="mt-1 font-mono text-xs text-muted/70">{e.location}</p>}
              </Reveal>
              <Reveal delay={0.08} className="md:pl-12">
                <h3
                  className={cn(
                    "display-mixed",
                    e.highlight ? "text-[clamp(1.8rem,1rem+2.6vw,3.2rem)]" : "text-xl text-fg/90",
                  )}
                >
                  {e.company}
                </h3>
                <p className={cn("mt-1", e.highlight ? "font-display text-lg text-accent" : "text-sm text-muted")}>
                  {e.role}
                </p>
                {e.summary && <p className="mt-4 max-w-xl text-muted">{e.summary}</p>}
                {e.tags && (
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-fg/80">
                    {e.tags.map((t) => (
                      <li key={t} className="before:mr-1.5 before:text-accent before:content-['+']">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="sr-only">{i === 0 ? "Current role" : ""}</span>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Education */}
        <div className="mt-28 grid gap-10 md:grid-cols-[30%_1fr]">
          <Reveal>
            <h3 className="display-mixed text-[clamp(1.6rem,1rem+2vw,2.6rem)]">Education</h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">& training</p>
          </Reveal>
          <div className="md:pl-12">
            <ul className="border-t border-line">
              {education.map((e, i) => (
                <Reveal as="li" key={e.title} delay={i * 0.07} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:gap-8">
                  <div>
                    <p className="font-display text-lg leading-snug">{e.title}</p>
                    <p className="text-sm text-muted">{e.school}</p>
                  </div>
                  <p className="font-mono text-xs text-muted sm:pt-1.5">{e.period}</p>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.1} className="mt-10">
              <p className="eyebrow mb-2">Certification / training</p>
              <p className="font-display text-lg">{certification.title}</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
                {certification.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
