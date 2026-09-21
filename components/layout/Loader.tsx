"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const KEY = "ns-intro-seen";
const words = ["BUILD", "TEST", "SHIP"] as const;

/**
 * Short intro (~1.4s): NS monogram draws, then BUILD / TEST / SHIP.
 * Shown once per browser session so repeat visitors are not slowed down.
 */
export function Loader() {
  const [phase, setPhase] = useState<"pending" | "playing" | "done">("pending");
  const [step, setStep] = useState(-1);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSkip(true);
      setPhase("done");
      return;
    }
    setPhase("playing");
    document.documentElement.style.overflow = "hidden";
    const timers = [
      setTimeout(() => setStep(0), 450),
      setTimeout(() => setStep(1), 680),
      setTimeout(() => setStep(2), 910),
      setTimeout(() => {
        setPhase("done");
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
      }, 1400),
    ];
    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.documentElement.style.overflow = "";
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[110] grid place-items-center bg-[#050505]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: skip ? 0 : 0.7, ease: [0.76, 0, 0.24, 1] }}
          initial={false}
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          {phase === "playing" && (
            <div className="flex flex-col items-center gap-8">
              <Logo animate className="h-20 w-20" />
              <div aria-hidden className="flex h-5 items-center gap-4 font-mono text-xs tracking-[0.3em] text-muted">
                {words.map((w, i) => (
                  <span
                    key={w}
                    className="transition-colors duration-200"
                    style={{ color: step >= i ? (step === i ? "#2DE2D0" : "#F5F7FA") : "#3a424e" }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

