"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useFinePointer } from "@/hooks/useMedia";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
}

/** Subtle 3D tilt that follows the pointer, with a soft moving highlight. */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 140, damping: 18, mass: 0.5 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glow = useTransform(
    [px, py],
    ([x, y]: number[]) =>
      `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgb(45 226 208 / 0.13), transparent 60%)`,
  );
  const enabled = fine && !reduce;

  return (
    <div style={{ perspective: 1100 }} className={className}>
      <motion.div
        className="relative h-full"
        style={enabled ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" } : undefined}
        onPointerMove={(e) => {
          if (!enabled) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        {enabled && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: glow }}
          />
        )}
      </motion.div>
    </div>
  );
}
