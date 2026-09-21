"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMedia";
import { useWebGL } from "@/hooks/useWebGL";
import { HeroFallback } from "./HeroFallback";

// Three.js is only ever loaded in the browser, in its own chunk.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * Fixed backdrop shared by the hero and the start of the About section.
 * It fades out with scroll and stops rendering once it is off-screen.
 */
export function HeroCanvas() {
  const webgl = useWebGL();
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const fade = 1 - Math.min(1, Math.max(0, (y - vh * 0.4) / (vh * 0.7)));
      if (wrapper.current) wrapper.current.style.opacity = String(fade * (mobile ? 0.5 : 1));
      setActive(y < vh * 1.6 && !document.hidden);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mobile]);

  return (
    <div ref={wrapper} aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {webgl === true && <HeroScene active={active} reduced={reduced} mobile={mobile} />}
      {webgl === false && <HeroFallback />}
    </div>
  );
}
