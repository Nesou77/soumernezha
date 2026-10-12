import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ExternalLink, AlertCircle, Lightbulb, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { Reveal } from "@/components/animations/Reveal";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import type { Dictionary } from "@/lib/i18n";
import { defaultLocale, format, localizePath, type Locale } from "@/lib/i18n/config";
import { fallbackLang } from "@/lib/i18n/projects";
import { hostname } from "@/lib/utils";
import type { Project } from "@/types";
import { ProjectGallery } from "./ProjectGallery";

interface ProjectDetailProps {
  project: Project;
  prev?: Project;
  next?: Project;
  total: number;
  locale: Locale;
  t: Dictionary["project"];
  categoryLabel: string;
  newTab: string;
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{children}</h2>;
}

function DetailSection({ title, children, variant = "standard" }: { title: ReactNode; children: ReactNode; variant?: "standard" | "challenge" | "solution" | "contribution" | "feature" }) {
  const styles = {
    standard: "border-line",
    contribution: "rounded-3xl border border-violet/20 bg-violet/[0.025] p-6 sm:p-9",
    feature: "rounded-3xl border border-white/15 bg-bg-2 p-6 sm:p-9",
    challenge: "rounded-3xl border border-amber-400/20 bg-amber-400/[0.025] p-6 sm:p-9",
    solution: "rounded-3xl border border-accent/25 bg-accent/[0.025] p-6 sm:p-9",
  };
  return (
    <section className="container-x">
      <Reveal>
        <div className={`border-t pt-9 sm:pt-12 ${styles[variant]}`}>
          <div className="mb-6 sm:mb-9"><SectionHeading>{title}</SectionHeading></div>
          <div className="w-full min-w-0">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

function PointCards({ items, lang, variant }: { items: string[]; lang?: string; variant: "challenge" | "solution" | "feature" | "contribution" }) {
  if (!items.length) return null;
  const config = {
    challenge: { icon: AlertCircle, card: "border-amber-400/20 bg-amber-400/[0.045]", iconClass: "bg-amber-400/10 text-amber-300", dot: "bg-amber-400/30" },
    solution: { icon: Lightbulb, card: "border-accent/20 bg-accent/[0.045]", iconClass: "bg-accent/10 text-accent", dot: "bg-accent/30" },
    feature: { icon: Sparkles, card: "border-white/10 bg-white/[0.03]", iconClass: "bg-white/10 text-fg", dot: "bg-white/20" },
    contribution: { icon: Check, card: "border-violet/20 bg-bg-2/70", iconClass: "bg-violet/10 text-violet", dot: "bg-violet/30" },
  }[variant];
  const Icon = config.icon;
  // A single item uses the whole row instead of leaving an empty grid column.
  return (
    <ul lang={lang} className={`mt-7 grid gap-4 ${items.length > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}>
      {items.map((item, i) => (
        <li key={`${i}-${item}`} className={`project-point group relative flex min-w-0 items-start gap-4 overflow-hidden rounded-2xl border p-5 transition-[transform,border-color,background-color,box-shadow] duration-500 ease-out motion-safe:hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_18px_44px_rgba(0,0,0,0.18)] focus-within:border-accent/40 sm:p-6 ${config.card}`}>
          <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:rotate-[-5deg] motion-safe:group-hover:scale-110 ${config.iconClass}`}><Icon size={19} strokeWidth={1.7} /></span>
          <p className="min-w-0 whitespace-pre-line break-words pt-1 text-[0.95rem] leading-[1.75] text-fg/85">{item}</p>
          <span aria-hidden className={`absolute bottom-0 left-0 h-0.5 w-16 origin-left transition-transform duration-500 ease-out motion-safe:group-hover:scale-x-[3] ${config.dot}`} />
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetail({ project, prev, next, locale, t, categoryLabel, newTab }: ProjectDetailProps) {
  const gallery = project.gallery ?? [];
  const projectsHref = localizePath(locale, "/projects");
  const contactHref = localizePath(locale, "/contact");
  const lang = (field: Parameters<typeof fallbackLang>[1]) => fallbackLang(project, field);
  const showFallbackNotice = locale !== defaultLocale && (project.untranslated?.length ?? 0) > 0 && t.fallbackNotice;
  const metadata = [
    { label: t.role, value: project.role, fieldLang: lang("role") },
    { label: t.sector, value: project.sector, fieldLang: lang("sector") },
    { label: t.year, value: project.year, fieldLang: undefined },
  ].filter((item) => Boolean(item.value?.trim()));
  const related = [prev, next].filter((item): item is Project => Boolean(item)).filter((item, index, all) => all.findIndex((candidate) => candidate.slug === item.slug) === index);

  return (
    <article className="overflow-hidden">
      <header className="container-x pb-10 pt-28 sm:pb-14 sm:pt-36">
        <Reveal immediate>
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            <Link href={projectsHref} className="group inline-flex items-center gap-2 transition-colors hover:text-accent">
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />{t.allProjects}
            </Link>
            <span className="text-fg/50">{categoryLabel}</span>
          </div>
        </Reveal>

        <div className="w-full">
          <div className="w-full">
            <Reveal immediate delay={0.04}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.07] px-3.5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
                <span className="size-1.5 rounded-full bg-accent" />{categoryLabel}
              </div>
            </Reveal>
            <Reveal immediate delay={0.1}>
              <h1 className="w-full break-words font-display text-[clamp(3rem,1.6rem+5vw,7.25rem)] font-normal leading-[0.98] tracking-[-0.055em] text-fg">{project.title}</h1>
            </Reveal>
          </div>

          {/* Short introduction and project facts share one responsive row. */}
          {(project.summary || metadata.length > 0) && (
            <div className={`mt-10 grid gap-9 border-t border-line pt-8 sm:mt-12 sm:pt-10 ${project.summary && metadata.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_minmax(250px,320px)] lg:gap-14 xl:gap-20" : "grid-cols-1"}`}>
              {project.summary && (
                <Reveal immediate delay={0.15}>
                  <p lang={lang("summary")} className="max-w-3xl text-[clamp(1.1rem,1rem+0.5vw,1.5rem)] leading-[1.75] text-fg/75">
                    {project.summary}
                  </p>
                </Reveal>
              )}
              {metadata.length > 0 && (
                <Reveal immediate delay={0.2}>
                  <dl className="grid gap-5 border-t border-line pt-6 sm:grid-cols-3 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:py-1 lg:pl-7">
                    {metadata.map(({ label, value, fieldLang }) => (
                      <div key={String(label)} className="min-w-0">
                        <dt className="font-mono text-[0.65rem] uppercase tracking-[0.13em] text-muted">{label}</dt>
                        <dd lang={fieldLang} className="mt-1.5 break-words text-sm leading-relaxed text-fg/90 sm:text-base">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              )}
            </div>
          )}
        </div>
        {showFallbackNotice && <p className="mt-6 text-sm text-muted">{t.fallbackNotice}</p>}
      </header>

      <section className="container-x" aria-label={project.title}>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg-2 shadow-[0_30px_90px_rgba(0,0,0,0.18)] sm:rounded-[2rem]">
          <ImageReveal immediate delay={0.18}>
            <ProjectVisual project={project} priority sizes="(min-width: 1536px) 1440px, 100vw" className="aspect-[16/10]" bordered={false} alt={format(project.image ? t.coverAlt : t.placeholderAlt, { title: project.title })} />
          </ImageReveal>
        </div>
      </section>

      <div className="space-y-20 py-20 sm:space-y-28 sm:py-28">
        {project.description && (
          <DetailSection title={t.overview}>
            <p lang={lang("description")} className="w-full whitespace-pre-line text-[clamp(1.2rem,1.04rem+0.65vw,1.75rem)] leading-[1.7] tracking-[-0.02em] text-fg/85">{project.description}</p>
          </DetailSection>
        )}
        {(project.challenge || project.challengePoints.length > 0) && (
          <DetailSection title={t.challenge} variant="challenge">
            {project.challenge && <p lang={lang("challenge")} className="max-w-3xl whitespace-pre-line text-lg leading-[1.8] text-fg/80">{project.challenge}</p>}
            <PointCards items={project.challengePoints} lang={lang("challengePoints")} variant="challenge" />
          </DetailSection>
        )}
        {(project.solution || project.solutionPoints.length > 0) && (
          <DetailSection title={t.solution} variant="solution">
            {project.solution && <p lang={lang("solution")} className="max-w-3xl whitespace-pre-line text-lg leading-[1.8] text-fg/80">{project.solution}</p>}
            <PointCards items={project.solutionPoints} lang={lang("solutionPoints")} variant="solution" />
          </DetailSection>
        )}
        {(project.contribution.length > 0 || project.technologies.length > 0) && (
          <DetailSection title={t.contribution} variant="contribution">
            <PointCards items={project.contribution} lang={lang("contributions")} variant="contribution" />
            {project.technologies.length > 0 && (
              <div className="mt-9 border-t border-line pt-7">
                <h3 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">{t.technologies}</h3>
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((technology) => <li key={technology} className="rounded-full border border-white/15 bg-white/[0.035] px-4 py-2 text-sm text-fg/75">{technology}</li>)}
                </ul>
              </div>
            )}
          </DetailSection>
        )}
        {gallery.length > 0 && (
          <section className="container-x">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-10">
              <SectionHeading>{t.gallery}</SectionHeading>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">{format(t.views, { count: String(gallery.length).padStart(2, "0") })}</span>
            </div>
            <div className="overflow-hidden rounded-xl"><ProjectGallery images={gallery} title={project.title} t={t} /></div>
          </section>
        )}
        {project.features.length > 0 && (
          <DetailSection title={t.features} variant="feature">
            <PointCards items={project.features} lang={lang("features")} variant="feature" />
          </DetailSection>
        )}
        {project.url && (
          <section className="container-x">
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-5 rounded-2xl border border-white/15 bg-white/[0.035] p-6 transition-colors hover:border-accent/50 sm:p-9">
              <div className="min-w-0">
                <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">{t.liveLabel}</p>
                <p className="break-all font-display text-[clamp(1.5rem,1.1rem+1.3vw,2.6rem)] tracking-[-0.03em] text-fg group-hover:text-accent">{hostname(project.url)}</p>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-black"><ExternalLink size={20} /></span>
              <span className="sr-only">{newTab}</span>
            </a>
          </section>
        )}
        <section className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-accent/20 bg-white/[0.035] p-7 sm:p-12 lg:p-16">
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-accent/10 blur-[100px]" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">{t.contactEyebrow}</p>
                  <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,1.3rem+3vw,4.5rem)] leading-[1.05] tracking-[-0.045em]">{t.contactTitle}</h2>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-fg/65">{t.contactText}</p>
                </div>
                <Link href={contactHref} className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5">
                  {t.contactCta}<ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {related.length > 0 && (
        <nav aria-label={t.moreProjects} className="border-t border-line py-16 sm:py-24">
          <div className="container-x">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-[clamp(1.8rem,1.25rem+1.5vw,2.7rem)] tracking-[-0.035em]">{t.otherProjects}</h2>
              <Link href={projectsHref} className="group inline-flex items-center gap-2 text-sm text-muted hover:text-accent">{t.allProjects}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:gap-8">
              {related.map((item) => (
                <Link key={item.slug} href={localizePath(locale, `/projects/${item.slug}`)} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                  <div className="overflow-hidden bg-bg-2"><ProjectVisual project={item} alt="" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/10] transition-transform duration-700 motion-safe:group-hover:scale-[1.025]" bordered={false} /></div>
                  <div className="flex items-start justify-between gap-4 p-5 sm:p-7">
                    <div className="min-w-0"><p lang={fallbackLang(item, "sector")} className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">{item.sector}</p><h3 className="font-display text-2xl tracking-[-0.03em] transition-colors group-hover:text-accent sm:text-3xl">{item.title}</h3></div>
                    <ArrowUpRight size={20} className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </article>
  );
}
