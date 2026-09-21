"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "p" | "li" | "span";
  /** Animate on mount instead of on scroll (for above-the-fold content). */
  immediate?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades, lifts and de-blurs content when it scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className, as = "div", immediate }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0, filter: "blur(0px)" } }
        : { whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: true, margin: "-10% 0px" } })}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Comp>
  );
}
