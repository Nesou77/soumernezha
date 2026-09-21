"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/data/content";
import { phases, skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";
import type { SkillGroup, SkillItem } from "@/types";

interface Active extends SkillItem {
  group: string;
}

const RINGS = [
  { phase: "develop", inset: "27%", speed: "70s", color: "#2DE2D0" },
  { phase: "test", inset: "13%", speed: "95s", color: "#8B9BFF" },
  { phase: "deploy", inset: "0%", speed: "120s", color: "#F5F7FA" },
] as const;

function flatten(groups: SkillGroup[], phase: string): Active[] {
  return groups
    .filter((g) => g.phase === phase)
    .flatMap((g) => g.skills.map((s) => ({ ...s, group: g.label })));
}

export function Skills() {
  const c = content.skills;
  const [active, setActive] = useState<Active | null>(null);
  const rings = useMemo(
    () => RINGS.map((r) => ({ ...r, skills: flatten(skillGroups, r.phase) })),
    [],
  );
  const lookup = useMemo(() => {
    const map = new Map<string, Active>();
    skillGroups.forEach((g) => g.skills.forEach((s) => map.set(s.name, { ...s, group: g.label })));
    return map;
  }, []);

  return (
    <section id="skills" aria-labelledby="skills-title" className="section-y relative overflow-x-clip">
      <div className="container-x">
        <SectionHeading id="skills-title" index="04" eyebrow={c.eyebrow} lines={c.headline} intro={c.intro} />

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* Decorative orbit: hover a dot to preview. The full content lives in the list. */}
          <Reveal>
            <div
              aria-hidden
              className={cn("relative mx-auto aspect-square w-full max-w-[34rem]", active && "orbit-paused")}
              onPointerLeave={() => setActive(null)}
            >
              {rings.map((ring) => (
                <div
                  key={ring.phase}
                  className="absolute rounded-full border border-white/10"
                  style={{ inset: ring.inset }}
                >
                  <div className="orbit absolute inset-0" style={{ ["--orbit-speed" as string]: ring.speed }}>
                    {ring.skills.map((s, i) => {
                      const on = active?.name === s.name;
                      return (
                        <div
                          key={s.name}
                          className="absolute inset-0"
                          style={{ transform: `rotate(${(360 / ring.skills.length) * i}deg)` }}
                        >
                          <span
                            className="absolute left-1/2 top-0 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
                            onPointerEnter={() => setActive(s)}
                            data-cursor
                          >
                            <span
                              className="block rounded-full transition-all duration-300"
                              style={{
                                width: on ? 14 : 7,
                                height: on ? 14 : 7,
                                background: on ? ring.color : `${ring.color}99`,
                                boxShadow: on ? `0 0 0 6px ${ring.color}26` : undefined,
                              }}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[170%] font-mono text-[0.62rem] tracking-[0.3em] text-muted">
                    {phases.find((p) => p.id === ring.phase)?.label}
                  </span>
                </div>
              ))}
              <div className="absolute inset-[40%] grid place-items-center rounded-full border border-accent/30 bg-[#080b10] px-2 text-center">
                <span className="font-display text-[clamp(0.6rem,1.6vw,0.85rem)] leading-tight tracking-tight">
                  {active ? active.name : "Build · Test · Ship"}
                </span>
              </div>
            </div>
          </Reveal>

          <div>
            <div className="space-y-8">
              {skillGroups.map((g, gi) => (
                <Reveal key={g.id} delay={gi * 0.04}>
                  <div className="grid gap-x-6 gap-y-3 border-t border-line pt-5 sm:grid-cols-[9rem_1fr]">
                    <div>
                      <h3 className="font-display text-base">{g.label}</h3>
                      <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                        {g.phase}
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-x-1 gap-y-1">
                      {g.skills.map((s) => {
                        const on = active?.name === s.name;
                        return (
                          <li key={s.name}>
                            <button
                              type="button"
                              onPointerEnter={() => setActive(lookup.get(s.name) ?? null)}
                              onPointerLeave={() => setActive(null)}
                              onFocus={() => setActive(lookup.get(s.name) ?? null)}
                              onBlur={() => setActive(null)}
                              aria-describedby="skill-detail"
                              className={cn(
                                "px-2.5 py-1 text-sm transition-colors",
                                on ? "bg-accent text-black" : "text-fg/85 hover:text-accent",
                              )}
                            >
                              {s.name}
                              <span className="sr-only">: {s.description}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <div
              id="skill-detail"
              aria-live="off"
              className="mt-8 min-h-[5.5rem] border border-line bg-[#0b0f14]/70 p-5"
            >
              {active ? (
                <>
                  <p className="eyebrow mb-1">{active.group}</p>
                  <p className="font-display text-lg">{active.name}</p>
                  <p className="text-sm text-muted">{active.description}</p>
                </>
              ) : (
                <p className="text-sm text-muted">Hover or focus a skill to read how I use it.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
