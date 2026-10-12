"use client";

import { usePrefersReducedMotion as useReducedMotion } from "@/hooks/useMedia";

import { motion } from "framer-motion";
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

/** A short, one-time entrance; avoids animating expensive blur filters. */
export function Reveal({ children, delay = 0, y = 18, className, as = "div", immediate }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-10% 0px" } })}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease }}
    >
      {children}
    </Comp>
  );
}
