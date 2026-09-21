"use client";

import { useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/animations/Magnetic";
import { runnerSteps, testSuite } from "@/data/qa";
import { cn } from "@/lib/utils";

type Phase = "idle" | "running" | "done";

const STEP_MS = 340;
const START_MS = 350;

export function TestRunner() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const total = runnerSteps.length;

  useEffect(() => {
    if (phase !== "running") return;
    const wait = reduce ? 40 : progress === 0 ? START_MS : STEP_MS;
    const id = setTimeout(() => {
      if (progress < total) setProgress(progress + 1);
      else setPhase("done");
    }, progress === total ? (reduce ? 40 : 250) : wait);
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

  const passed = phase === "idle" ? total : progress;

  return (
    <div className="border border-white/12 bg-[#05070a] font-mono text-[0.8rem] shadow-[0_30px_80px_-30px_rgba(45,226,208,0.18)]">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3">qa-lab / regression</span>
        </div>
        <span className="hidden sm:block">simulated run</span>
      </div>

      <div className="p-5 sm:p-7">
        <div className="mb-1 flex items-end justify-between">
          <h3 className="text-base font-medium tracking-[0.2em] text-fg">TEST SUITE</h3>
          <span className="tabular-nums text-muted" aria-hidden>
            {passed}/{total}
          </span>
        </div>
        <div aria-hidden className="mb-5 h-px w-full bg-white/10">
          <div
            className="h-px bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${(passed / total) * 100}%` }}
          />
        </div>

        <ul className="divide-y divide-white/[0.06]">
          {testSuite.map((t, i) => {
            const s = rowStatus(i);
            return (
              <li key={t.name} className="flex items-center gap-4 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-fg">{t.name}</span>
                  <span className="block truncate text-[0.68rem] text-muted">{t.detail}</span>
                </span>
                <span aria-hidden className="hidden flex-1 border-b border-dotted border-white/10 sm:block" />
                <span
                  className={cn(
                    "w-[4.5rem] text-right text-[0.72rem] tracking-[0.16em] transition-colors",
                    s === "pass" && "text-accent",
                    s === "running" && "text-violet",
                    s === "queued" && "text-white/25",
                  )}
                >
                  {s === "pass" ? "PASS" : s === "running" ? "RUNNING" : "QUEUED"}
                </span>
              </li>
            );
          })}
        </ul>

        {/* terminal log */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Test run output"
          className="mt-6 min-h-[11.5rem] border-t border-white/10 pt-4 text-[0.78rem] leading-7"
        >
          {phase === "idle" && (
            <p className="text-muted">
              <span className="text-accent">$</span> npm run test:regression <span className="caret" />
            </p>
          )}
          {phase !== "idle" && (
            <>
              <p className="text-muted">
                <span className="text-accent">$</span> Running regression suite…
              </p>
              {runnerSteps.slice(0, progress).map((step) => (
                <p key={step} className="text-fg">
                  <span className="text-accent">✓</span> {step}
                </p>
              ))}
              {phase === "done" && (
                <p className="mt-2 tracking-[0.2em] text-accent">ALL TESTS PASSED</p>
              )}
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <Magnetic>
            <button
              type="button"
              onClick={run}
              disabled={phase === "running"}
              className="btn btn-primary font-mono !text-[0.8rem] tracking-[0.18em] disabled:cursor-wait disabled:opacity-70"
            >
              {phase === "done" ? <RotateCcw size={15} aria-hidden /> : <Play size={15} aria-hidden fill="currentColor" />}
              {phase === "running" ? "RUNNING…" : phase === "done" ? "RUN AGAIN" : "RUN TESTS"}
            </button>
          </Magnetic>
          <p className="hidden text-right text-[0.68rem] text-muted sm:block">Illustrative. Not a live run.</p>
        </div>
      </div>
    </div>
  );
}
