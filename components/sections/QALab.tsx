"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";

import type { Dictionary } from "@/lib/i18n";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { fallbackLang } from "@/lib/i18n/projects";

import type { Project } from "@/types";

import { TestRunner } from "./TestRunner";

interface QALabProps {
  qaProjects: Project[];
  t: Dictionary["qa"];
  locale: Locale;
  index?: string;
}

export function QALab({
  qaProjects,
  t: c,
  locale,
  index = "03",
}: QALabProps) {
  const reduce = useReducedMotion();

  return (
    <section
      id="qa-lab"
      aria-labelledby="qa-title"
      className="relative py-6 sm:py-10"
    >
      {/* Background grid */}
      <motion.div
        aria-hidden
        className="grid-bg absolute inset-0 bg-[#080b10] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        initial={
          reduce
            ? false
            : {
                clipPath: "inset(10% 6% 10% 6%)",
                opacity: 0.4,
              }
        }
        whileInView={{
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
        }}
        viewport={{
          once: true,
          margin: "-15% 0px",
        }}
        transition={{
          duration: 1.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <div className="container-x section-y relative">
        <SectionHeading
          id="qa-title"
          index={index}
          eyebrow={c.eyebrow}
          lines={c.headline}
          intro={c.intro}
        />

        {/*
          Main 2-column area.

          min-h-[100dvh]:
          - fills the device viewport on desktop
          - does NOT clip content
          - if content ever needs more than 100dvh,
            the block grows naturally

          Nothing uses overflow-hidden here.
        */}
        <div className="mt-10 grid gap-10 lg:min-h-[100dvh] lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* LEFT COLUMN */}
          <Reveal className="lg:col-span-7">
            <TestRunner t={c.runner} />
          </Reveal>

          {/* RIGHT COLUMN */}
          <div className="space-y-[clamp(2rem,4vh,3rem)] lg:col-span-5">
            <Reveal delay={0.1}>
              <h3 className="eyebrow mb-4 text-muted">
                {c.practice}
              </h3>

              <ol className="divide-y divide-line border-y border-line">
                {c.testingTypes.map((t, i) => (
                  <li
                    key={t}
                    className="group flex items-baseline gap-4 py-[clamp(0.5rem,1.2vh,0.75rem)] transition-colors hover:text-accent"
                  >
                    <span className="font-mono text-xs text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="font-display text-lg tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                      {t}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.15}>
              <h3 className="eyebrow mb-4 text-muted">
                {c.tools}
              </h3>

              <ul className="flex flex-wrap gap-2">
                {c.toolList.map((t) => (
                  <li
                    key={t}
                    className="border border-white/15 px-3.5 py-1.5 font-mono text-xs text-fg"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* QA projects remain OUTSIDE the 100dvh 2-column area */}
        {qaProjects.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <Reveal>
              <h3 className="eyebrow mb-6 text-muted">
                {c.projects}
              </h3>
            </Reveal>

            <ul className="border-t border-line">
              {qaProjects.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.slug}
                  delay={i * 0.08}
                  className="border-b border-line"
                >
                  <Link
                    href={localizePath(
                      locale,
                      `/projects/${p.slug}`,
                    )}
                    className="group grid gap-x-10 gap-y-3 py-8 md:grid-cols-[1fr_1.2fr_auto] md:items-start"
                  >
                    <div>
                      <span className="mb-2 block font-mono text-xs text-muted">
                        {p.index}
                      </span>

                      <span className="display-mixed block text-[clamp(1.8rem,1rem+2.6vw,3.2rem)] transition-colors group-hover:text-accent">
                        {p.title}
                      </span>

                      <span
                        className="mt-1 block text-sm text-muted"
                        lang={fallbackLang(p, "sector")}
                      >
                        {p.sector}
                      </span>
                    </div>

                    <ul
                      className="flex flex-wrap gap-x-4 gap-y-1.5 self-center font-mono text-xs text-muted"
                      lang={fallbackLang(
                        p,
                        "contributions",
                      )}
                    >
                      {p.contribution
                        .slice(0, 7)
                        .map((r) => (
                          <li
                            key={r}
                            className="before:mr-2 before:text-accent before:content-['›']"
                          >
                            {r}
                          </li>
                        ))}
                    </ul>

                    <span className="hidden self-center md:block">
                      <ArrowIcon size={24} />

                      <span className="sr-only">
                        {c.readCaseStudy}
                      </span>
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