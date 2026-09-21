"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MaskLinesProps {
  lines: readonly string[];
  className?: string;
  /** Optional class per line, by index. */
  lineClassNames?: readonly string[];
  delay?: number;
  /** Trigger immediately instead of on scroll (used in the hero). */
  immediate?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

/** Headline whose lines slide up out of an overflow mask. */
export function MaskLines({ lines, className, lineClassNames, delay = 0, immediate }: MaskLinesProps) {
  const reduce = useReducedMotion();
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={cn("block", lineClassNames?.[i])}
            initial={reduce ? false : { y: "108%", rotate: 2 }}
            {...(immediate
              ? { animate: { y: 0, rotate: 0 } }
              : { whileInView: { y: 0, rotate: 0 }, viewport: { once: true, margin: "-10% 0px" } })}
            transition={{ duration: 1.05, delay: delay + i * 0.09, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
