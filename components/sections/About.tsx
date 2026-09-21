import { Reveal } from "@/components/animations/Reveal";
import { TiltCard } from "@/components/animations/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/data/content";

export function About() {
  const c = content.about;
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading id="about-title" index="01" eyebrow={c.eyebrow} lines={c.headline} size="h3" variant="mixed" />

        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <div className="space-y-6 text-muted lg:col-span-5">
            {c.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className={i === 0 ? "text-fg" : undefined}>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <h3 className="eyebrow mb-4 mt-10 text-muted">Expertise</h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 font-display text-sm text-fg">
                {c.expertise.map((e) => (
                  <li key={e} className="flex items-center gap-5">
                    {e}
                    <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70 last:hidden" />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {c.cards.map((card, i) => (
              <Reveal key={card.num} delay={0.1 + i * 0.12} className={i === 1 ? "sm:mt-16" : undefined}>
                <TiltCard className="h-full">
                  <article className="flex h-full min-h-[22rem] flex-col justify-between border border-line bg-[#0b0f14]/60 p-7 backdrop-blur-sm">
                    <div className="flex items-start justify-between font-mono text-xs tracking-[0.2em]">
                      <span className="text-muted">{card.num}</span>
                      <span className={i === 0 ? "text-accent" : "text-violet"}>{card.tag}</span>
                    </div>
                    <div style={{ transform: "translateZ(30px)" }}>
                      <span
                        aria-hidden
                        className={`display mb-6 block text-[clamp(4rem,9vw,7rem)] ${i === 0 ? "text-accent/90" : "outline-text opacity-60"}`}
                      >
                        {i === 0 ? "</>" : "✓"}
                      </span>
                      <h3 className="display-mixed text-2xl">{card.title}</h3>
                      <p className="mt-3 text-sm text-muted">{card.text}</p>
                      <ul className="mt-5 space-y-1.5 border-t border-line pt-4 font-mono text-xs text-muted">
                        {card.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
