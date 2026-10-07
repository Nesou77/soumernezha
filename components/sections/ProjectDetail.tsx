import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-normal uppercase tracking-[0.16em] text-fg/75">{children}</h2>;
}

function BulletList({ items, lang }: { items: string[]; lang?: string }) {
  if (items.length === 0) return null;
  return (
    <ul lang={lang} className="mt-7 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.98rem] leading-relaxed text-fg/75">
          <span aria-hidden className="mt-[0.68em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetail({
  project,
  prev,
  next,
  total,
  locale,
  t,
  categoryLabel,
  newTab,
}: ProjectDetailProps) {
  const gallery = project.gallery ?? [];
  const projectsHref = localizePath(locale, "/#projects");
  const contactHref = localizePath(locale, "/#contact");
  const lang = (field: Parameters<typeof fallbackLang>[1]) => fallbackLang(project, field);
  const showFallbackNotice =
    locale !== defaultLocale && (project.untranslated?.length ?? 0) > 0 && t.fallbackNotice;

  return (
    <article>
      <header className="container-x pb-12 pt-28 sm:pb-16 sm:pt-36">
        <Reveal immediate>
          <div className="mb-14 flex items-center justify-between gap-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            <Link href={projectsHref} className="group inline-flex items-center gap-2 transition-colors hover:text-fg">
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
              {t.allProjects}
            </Link>
            <span>{project.index} / {String(total).padStart(2, "0")}</span>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal immediate delay={0.05}>
              <p className="mb-5 flex items-center gap-3 font-mono text-[0.67rem] uppercase tracking-[0.15em] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {categoryLabel}
              </p>
            </Reveal>

            <Reveal immediate delay={0.1}>
              <h1 className="max-w-5xl font-display text-[clamp(2.8rem,1.5rem+4.5vw,6.2rem)] font-normal leading-[0.98] tracking-[-0.045em]">
                {project.title}
              </h1>
            </Reveal>

            <Reveal immediate delay={0.18}>
              <p lang={lang("summary")} className="mt-8 max-w-2xl text-[clamp(1.05rem,0.95rem+0.45vw,1.32rem)] font-normal leading-[1.7] text-fg/65">
                {project.summary}
              </p>
            </Reveal>
          </div>

          <Reveal immediate delay={0.2} className="lg:col-span-4 lg:self-end">
            <dl className="border-t border-line">
              {[
                [t.role, project.role, lang("role")],
                [t.sector, project.sector, lang("sector")],
                [t.year, project.year ?? "—", undefined],
              ].map(([label, value, fieldLang]) => (
                <div key={String(label)} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-4">
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.13em] text-muted">{label}</dt>
                  <dd lang={fieldLang} className="text-sm leading-relaxed text-fg/80">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {showFallbackNotice && <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">{t.fallbackNotice}</p>}
      </header>

      <section className="mx-auto max-w-[112rem]">
        <ImageReveal immediate delay={0.2} parallax>
          <ProjectVisual
            project={project}
            priority
            sizes="(min-width: 1792px) 1792px, 100vw"
            className="aspect-[16/9]"
            bordered={false}
            alt={format(project.image ? t.coverAlt : t.placeholderAlt, { title: project.title })}
          />
        </ImageReveal>
      </section>

      <div className="space-y-24 py-24 sm:space-y-32 sm:py-32">
        {project.description && (
          <section className="container-x">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3"><SectionTitle>{t.overview}</SectionTitle></div>
              <Reveal className="lg:col-span-7">
                <p lang={lang("description")} className="text-[clamp(1.2rem,1rem+0.75vw,1.7rem)] font-normal leading-[1.7] tracking-[-0.015em] text-fg/82">
                  {project.description}
                </p>
              </Reveal>
            </div>
          </section>
        )}

        {(project.challenge || project.challengePoints.length > 0) && (
          <section className="container-x">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3"><SectionTitle>{t.challenge}</SectionTitle></div>
              <Reveal className="lg:col-span-7">
                {project.challenge && (
                  <p lang={lang("challenge")} className="text-[1.05rem] leading-[1.75] text-fg/80">
                    {project.challenge}
                  </p>
                )}
                <BulletList items={project.challengePoints} lang={lang("challengePoints")} />
              </Reveal>
            </div>
          </section>
        )}

        {(project.contribution.length > 0 || project.technologies.length > 0) && (
          <section className="container-x">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3"><SectionTitle>{t.contribution}</SectionTitle></div>
              <Reveal className="lg:col-span-7">
                <BulletList items={project.contribution} lang={lang("contributions")} />
                {project.technologies.length > 0 && (
                  <div className="mt-10 border-t border-line pt-5">
                    <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">{t.technologies}</p>
                    <ul className="flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <li key={technology} className="rounded-full border border-white/10 px-3.5 py-1.5 text-sm text-fg/70">
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
            </div>
          </section>
        )}

        {(project.solution || project.solutionPoints.length > 0) && (
          <section className="container-x">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3"><SectionTitle>{t.solution}</SectionTitle></div>
              <Reveal className="lg:col-span-7">
                {project.solution && (
                  <p lang={lang("solution")} className="text-[1.05rem] leading-[1.75] text-fg/80">
                    {project.solution}
                  </p>
                )}
                <BulletList items={project.solutionPoints} lang={lang("solutionPoints")} />
              </Reveal>
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="container-x">
            <div className="mb-8 flex items-center justify-between gap-4">
              <SectionTitle>{t.gallery}</SectionTitle>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">{format(t.views, { count: String(gallery.length).padStart(2, "0") })}</span>
            </div>
            <ProjectGallery images={gallery} title={project.title} t={t} />
          </section>
        )}

        {project.features.length > 0 && (
          <section className="container-x">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-3"><SectionTitle>{t.features}</SectionTitle></div>
              <Reveal className="lg:col-span-9">
                <ul lang={lang("features")} className="grid border-t border-line sm:grid-cols-2">
                  {project.features.map((feature, index) => (
                    <li key={feature} className={`border-b border-line py-6 ${index % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"}`}>
                      <p className="max-w-md text-base leading-relaxed text-fg/75">{feature}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        )}

        {project.url && (
          <section className="container-x">
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-8 border-y border-line py-9">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">{t.liveLabel}</p>
                <p className="mt-2 text-[clamp(1.4rem,1rem+1.5vw,2.6rem)] font-normal tracking-[-0.025em] text-fg/85 transition-colors group-hover:text-accent">
                  {hostname(project.url)}
                </p>
              </div>
              <ArrowUpRight size={22} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              <span className="sr-only">{newTab}</span>
            </a>
          </section>
        )}

        <section className="container-x">
          <Reveal>
            <div className="grid gap-8 border border-white/10 bg-white/[0.02] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">{t.contactEyebrow}</p>
                <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,1.2rem+2.5vw,4rem)] font-normal leading-[1.05] tracking-[-0.035em]">
                  {t.contactTitle}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-fg/60">{t.contactText}</p>
              </div>
              <Link href={contactHref} className="group inline-flex items-center gap-3 text-sm text-fg transition-colors hover:text-accent">
                <span className="border-b border-white/25 pb-1 group-hover:border-accent">{t.contactCta}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </section>
      </div>

      {(prev || next) && (
        <nav aria-label={t.moreProjects} className="border-t border-line py-16 sm:py-20">
          <div className="container-x">
            <div className="mb-8 flex items-center justify-between">
              <SectionTitle>{t.otherProjects}</SectionTitle>
              <Link href={projectsHref} className="text-sm text-muted transition-colors hover:text-fg">{t.allProjects}</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {[prev, next]
                .filter((item): item is Project => Boolean(item))
                .filter((item, index, array) => array.findIndex((candidate) => candidate.slug === item.slug) === index)
                .map((item) => (
                  <Link key={item.slug} href={localizePath(locale, `/projects/${item.slug}`)} className="group block">
                    <div className="overflow-hidden bg-bg-2">
                      {item.image ? (
                        <div className="relative aspect-[16/10]">
                          <Image src={item.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]" />
                        </div>
                      ) : (
                        <ProjectVisual project={item} alt="" className="aspect-[16/10]" bordered={false} />
                      )}
                    </div>
                    <div className="flex items-end justify-between gap-6 pt-4">
                      <div>
                        <h3 className="font-display text-2xl font-normal tracking-[-0.025em] transition-colors group-hover:text-accent">{item.title}</h3>
                        <p lang={fallbackLang(item, "sector")} className="mt-1 text-sm text-muted">{item.sector}</p>
                      </div>
                      <ArrowUpRight size={17} className="shrink-0" />
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
