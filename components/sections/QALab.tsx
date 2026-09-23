"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/data/content";
import { qaTools, testingTypes } from "@/data/qa";
import type { Project } from "@/types";
import { TestRunner } from "./TestRunner";

export function QALab({ qaProjects }: { qaProjects: Project[] }) {
  const c = content.qa;
  const reduce = useReducedMotion();
  return (
    <section id="qa-lab" aria-labelledby="qa-title" className="relative py-6 sm:py-10">
      {/* The section "clicks" from open canvas into a structured grid as it enters. */}
      <motion.div
        aria-hidden
        className="grid-bg absolute inset-0 bg-[#080b10] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        initial={reduce ? false : { clipPath: "inset(10% 6% 10% 6%)", opacity: 0.4 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="container-x section-y relative">
        <SectionHeading id="qa-title" index="03" eyebrow={c.eyebrow} lines={c.headline} intro={c.intro} />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <TestRunner />
          </Reveal>

          <div className="space-y-12 lg:col-span-5">
            <Reveal delay={0.1}>
              <h3 className="eyebrow mb-5 text-muted">Testing practice</h3>
              <ol className="divide-y divide-line border-y border-line">
                {testingTypes.map((t, i) => (
                  <li key={t} className="group flex items-baseline gap-4 py-3 transition-colors hover:text-accent">
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-lg tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                      {t}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.15}>
              <h3 className="eyebrow mb-5 text-muted">Tools</h3>
              <ul className="flex flex-wrap gap-2">
                {qaTools.map((t) => (
                  <li key={t} className="border border-white/15 px-3.5 py-1.5 font-mono text-xs text-fg">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {qaProjects.length > 0 && (
        <div className="mt-24">
          <Reveal>
            <h3 className="eyebrow mb-6 text-muted">QA projects</h3>
          </Reveal>
          <ul className="border-t border-line">
            {qaProjects.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.08} className="border-b border-line">
                <Link
                  href={`/projects/${p.slug}`}
                  className="group grid gap-x-10 gap-y-3 py-8 md:grid-cols-[1fr_1.2fr_auto] md:items-start"
                >
                  <div>
                    <span className="mb-2 block font-mono text-xs text-muted">{p.index}</span>
                    <span className="display-mixed block text-[clamp(1.8rem,1rem+2.6vw,3.2rem)] transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted">{p.sector}</span>
                  </div>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1.5 self-center font-mono text-xs text-muted">
                    {p.contribution.slice(0, 7).map((r) => (
                      <li key={r} className="before:mr-2 before:text-accent before:content-['›']">
                        {r}
                      </li>
                    ))}
                  </ul>
                  <span className="hidden self-center md:block">
                    <ArrowIcon size={24} />
                    <span className="sr-only">Read case study</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
        )}
      </div>
    </section>
  );
}
