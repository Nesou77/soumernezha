"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  /** Subtle vertical drift while the image crosses the viewport. */
  parallax?: boolean;
  /** Reveal on mount (above the fold) instead of on scroll. */
  immediate?: boolean;
  delay?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Cinematic image entrance: the frame opens from a slight inset while the
 * picture settles from a gentle zoom. Transforms and clip-path only (no blur),
 * disabled entirely with prefers-reduced-motion.
 */
export function ImageReveal({ children, className, parallax = false, immediate = false, delay = 0 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], parallax && !reduce ? ["-3.5%", "3.5%"] : ["0%", "0%"]);

  const trigger = immediate
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: { once: true, margin: "-12% 0px" } };

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? false : "hidden"}
      {...trigger}
      variants={{
        hidden: { clipPath: "inset(6% 5% 6% 5%)" },
        shown: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.2, delay, ease } },
      }}
    >
      <motion.div style={{ y }} className={cn(parallax && "scale-[1.08]", "will-change-transform")}>
        <motion.div
          variants={{
            hidden: { scale: 1.14 },
            shown: { scale: 1, transition: { duration: 1.6, delay, ease } },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
