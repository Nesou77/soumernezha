"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMedia";

/** Separate entrance and pointer transforms so the portrait never shifts the layout. */
export function HeroPortrait({ alt }: { alt: string }) {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 24, mass: 0.7 };
  const x = useSpring(px, spring);
  const y = useSpring(py, spring);
  const enabled = fine && !reduce;

  return (
    <motion.div
      className="hero-portrait"
      initial={false}
      onPointerMove={(event) => {
        if (!enabled || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        px.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14);
        py.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
      }}
      onPointerLeave={() => { px.set(0); py.set(0); }}
    >
      <div aria-hidden="true" className="portrait-glow" />
      <div aria-hidden="true" className="portrait-frame" />
      <div className="portrait-entrance">
        <motion.div className="portrait-image" style={{ x: enabled ? x : 0, y: enabled ? y : 0 }}>
          <Image
            src="/images/nezha-portrait.webp"
            alt={alt}
            width={1122}
            height={1402}
            sizes="(min-width: 1536px) 610px, (min-width: 1024px) 43vw, (min-width: 640px) 44vw, 42vw"
            priority
            className="h-full w-full object-contain object-bottom"
          />
        </motion.div>
      </div>
      <span aria-hidden="true" className="portrait-marker" />
    </motion.div>
  );
}
