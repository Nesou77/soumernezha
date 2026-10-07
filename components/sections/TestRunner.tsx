"use client";

import { useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/animations/Magnetic";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Phase = "idle" | "running" | "done";

const STEP_MS = 340;
const START_MS = 350;

export function TestRunner({
  t,
}: {
  t: Dictionary["qa"]["runner"];
}) {
  const { tests: testSuite, steps: runnerSteps } = t;

  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);

  const total = runnerSteps.length;

  useEffect(() => {
    if (phase !== "running") return;

    const wait =
      reduce
        ? 40
        : progress === 0
          ? START_MS
          : STEP_MS;

    const id = setTimeout(
      () => {
        if (progress < total) {
          setProgress(progress + 1);
        } else {
          setPhase("done");
        }
      },
      progress === total ? (reduce ? 40 : 250) : wait,
    );

    return () => clearTimeout(id);
  }, [phase, progress, total, reduce]);

  const run = () => {
    setProgress(0);
    setPhase("running");
  };

  const rowStatus = (i: number) => {
    if (phase !== "running") return "pass";
    if (i < progress) return "pass";

    return i === progress ? "running" : "queued";
  };

  const passed =
    phase === "idle"
      ? total
      : progress;

  return (
    <div className="border border-white/12 bg-[#05070a] font-mono text-[0.8rem] shadow-[0_30px_80px_-30px_rgba(45,226,208,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full bg-accent/80"
          />

          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full bg-white/20"
          />

          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full bg-white/20"
          />

          <span className="ml-3">
            {t.window}
          </span>
        </div>

        <span className="hidden sm:block">
          {t.simulated}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-1 flex items-end justify-between">
          <h3 className="text-base font-medium tracking-[0.2em] text-fg">
            {t.suite}
          </h3>

          <span
            className="tabular-nums text-muted"
            aria-hidden
          >
            {passed}/{total}
          </span>
        </div>

        <div
          aria-hidden
          className="mb-3 h-px w-full bg-white/10"
        >
          <div
            className="h-px bg-accent transition-[width] duration-300 ease-out"
            style={{
              width: `${(passed / total) * 100}%`,
            }}
          />
        </div>

        <ul className="divide-y divide-white/[0.06]">
          {testSuite.map((test, i) => {
            const s = rowStatus(i);

            return (
              <li
                key={test.name}
                className="flex items-center gap-4 py-1.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-fg">
                    {test.name}
                  </span>

                  <span className="block truncate text-[0.68rem] text-muted">
                    {test.detail}
                  </span>
                </span>

                <span
                  aria-hidden
                  className="hidden flex-1 border-b border-dotted border-white/10 sm:block"
                />

                <span
                  className={cn(
                    "w-[6.5rem] shrink-0 text-right text-[0.72rem] tracking-[0.16em] transition-colors",
                    s === "pass" && "text-accent",
                    s === "running" && "text-violet",
                    s === "queued" && "text-white/25",
                  )}
                >
                  {s === "pass"
                    ? t.pass
                    : s === "running"
                      ? t.running
                      : t.queued}
                </span>
              </li>
            );
          })}
        </ul>

        <div
          role="log"
          aria-live="polite"
          aria-label={t.log}
          className="mt-4 min-h-[6.5rem] border-t border-white/10 pt-3 text-[0.75rem] leading-5"
        >
          {phase === "idle" && (
            <p className="text-muted">
              <span className="text-accent">$</span>{" "}
              npm run test:regression{" "}
              <span className="caret" />
            </p>
          )}

          {phase !== "idle" && (
            <>
              <p className="text-muted">
                <span className="text-accent">$</span>{" "}
                {t.runningSuite}
              </p>

              {runnerSteps
                .slice(0, progress)
                .map((step) => (
                  <p
                    key={step}
                    className="text-fg"
                  >
                    <span className="text-accent">
                      ✓
                    </span>{" "}
                    {step}
                  </p>
                ))}

              {phase === "done" && (
                <p className="mt-2 tracking-[0.2em] text-accent">
                  {t.allPassed}
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <Magnetic>
            <button
              type="button"
              onClick={run}
              disabled={phase === "running"}
              className="btn btn-primary font-mono !text-[0.8rem] tracking-[0.18em] disabled:cursor-wait disabled:opacity-70"
            >
              {phase === "done" ? (
                <RotateCcw
                  size={15}
                  aria-hidden
                />
              ) : (
                <Play
                  size={15}
                  aria-hidden
                  fill="currentColor"
                />
              )}

              {phase === "running"
                ? t.runningButton
                : phase === "done"
                  ? t.again
                  : t.run}
            </button>
          </Magnetic>

          <p className="hidden text-right text-[0.68rem] text-muted sm:block">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}