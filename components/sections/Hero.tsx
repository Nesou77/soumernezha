"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, type MotionStyle } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { MaskLines } from "@/components/animations/MaskLines";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import type { Dictionary } from "@/lib/i18n";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { HeroPortrait } from "./HeroPortrait";

interface HeroProps {
  locale: Locale;
  t: Dictionary["hero"];
  meta: Dictionary["meta"];
  about: Dictionary["about"];
  introduction: Dictionary["home"]["skills"];
  newTab: string;
  nextId: string;
}

/**
 * One pinned scene, two semantic sections, and exactly one portrait.
 * CSS computes the travel distance from its container, so resizing never
 * requires measuring or swapping the image. Scroll only updates transforms.
 */
export function Hero({ locale, t: c, meta, about, introduction }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Keep inactive links out of keyboard/screen-reader navigation without
  // rerendering the motion tree during a scrub.
  const syncAccessibility = useCallback((progress: number) => {
    const heroActive = reduce ? progress < 0.5 : progress < 0.26;
    const aboutActive = reduce ? progress >= 0.5 : progress >= 0.6;
    if (heroRef.current) {
      heroRef.current.inert = !heroActive;
      heroRef.current.setAttribute("aria-hidden", String(!heroActive));
    }
    if (expertiseRef.current) {
      const visible = reduce ? aboutActive : progress >= 0.8;
      expertiseRef.current.inert = !visible;
      expertiseRef.current.setAttribute("aria-hidden", String(!visible));
    }
    if (aboutRef.current) {
      aboutRef.current.inert = !aboutActive;
      aboutRef.current.setAttribute("aria-hidden", String(!aboutActive));
    }
  }, [reduce]);
  useMotionValueEvent(scrollYProgress, "change", syncAccessibility);
  useEffect(() => syncAccessibility(scrollYProgress.get()), [scrollYProgress, syncAccessibility]);

  return (
    <div ref={ref} className="portrait-journey" data-reduced={reduce || undefined}>
      <div className="journey-stage">
        <motion.div className="journey-layout container-x" style={{ "--journey-progress": scrollYProgress } as MotionStyle}>
          <motion.section
            ref={heroRef}
            id="home"
            aria-labelledby="hero-title"
            aria-hidden={false}
            className="journey-panel journey-hero"
          >
            <div className="journey-hero-copy">
              <p className="eyebrow">{site.name}</p>
              <p className="journey-role">{meta.role}</p>
              <h1 id="hero-title" className="journey-title display">
                <span className="sr-only">{site.name}, {meta.role}. {c.srTitle}</span>
                <span aria-hidden="true">
                  <MaskLines immediate lines={c.words} lineClassNames={["", "outline-text", "text-accent"]} delay={0.12} />
                </span>
              </h1>
              <Link href={localizePath(locale, "/projects")} className="btn btn-primary journey-cta">
                {c.primaryCta}<ArrowIcon />
              </Link>
            </div>
          </motion.section>

          <motion.section
            ref={aboutRef}
            id="home-about"
            aria-labelledby="home-about-title"
            aria-hidden={true}
            inert
            className="journey-panel journey-about"
          >
            <div className="journey-about-copy">
              <div className="journey-heading-reveal">
                <p className="eyebrow">{about.eyebrow}</p>
                <h2 id="home-about-title" className="journey-about-title display-mixed">
                  {introduction.journeyHeadline[0]}
                  <span className="block text-accent">{introduction.journeyHeadline[1]}</span>
                </h2>
              </div>
              <p className="journey-introduction">
                {introduction.bio}
              </p>
              <div ref={expertiseRef} className="journey-expertise-reveal" inert aria-hidden={true}>
                <p className="journey-expertise-copy">{introduction.intro}</p>
                <ul aria-label={about.expertiseLabel} className="journey-expertise">
                  {about.expertise.slice(0, 4).map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
                <Link href={localizePath(locale, "/about")} className="link-underline journey-about-link">
                  {introduction.more}<ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </motion.section>

          <div className="journey-portrait">
            <HeroPortrait alt={c.portraitAlt} />
          </div>
          <p aria-hidden="true" className="journey-scroll eyebrow">{c.scroll}</p>
        </motion.div>
      </div>
    </div>
  );
}
