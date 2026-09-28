import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { MaskLines } from "@/components/animations/MaskLines";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import type { Dictionary } from "@/lib/i18n";
import { defaultLocale, format, localizePath, type Locale } from "@/lib/i18n/config";
import { fallbackLang } from "@/lib/i18n/projects";
import { cn, hostname } from "@/lib/utils";
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

const pad = (n: number) => String(n).padStart(2, "0");

/** Inline style for `.fit-title`: sized from the longest word so it never overflows. */
function fitTitle(title: string, max?: string): CSSProperties {
  const longest = Math.max(6, ...title.split(/\s+/).map((w) => w.length));
  return { "--title-chars": longest, ...(max ? { "--fit-max": max } : {}) } as CSSProperties;
}

/** Left-rail label + content column: the editorial grid shared by the story sections. */
function Chapter({
  id,
  index,
  label,
  aside,
  children,
  className,
}: {
  id: string;
  index: string;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn("container-x grid gap-8 lg:grid-cols-12 lg:gap-10", className)}>
      <div className="lg:col-span-3">
        <Reveal className="flex items-baseline justify-between gap-4 border-t border-line pt-4 lg:sticky lg:top-28 lg:block lg:border-0 lg:pt-1">
          <div className="flex items-baseline gap-4">
            <span aria-hidden className="font-mono text-xs text-accent">
              {index}
            </span>
            <h2 id={id} className="eyebrow text-fg">
              {label}
            </h2>
          </div>
          {aside && <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted lg:mt-3">{aside}</p>}
        </Reveal>
      </div>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

export function ProjectDetail({ project, prev, next, total, locale, t, categoryLabel, newTab }: ProjectDetailProps) {
  const isQA = project.category === "qa";
  const projectsHref = localizePath(locale, "/#projects");
  const gallery = project.gallery ?? [];
  const lang = (field: Parameters<typeof fallbackLang>[1]) => fallbackLang(project, field);
  const showFallbackNotice = locale !== defaultLocale && (project.untranslated?.length ?? 0) > 0 && t.fallbackNotice;

  // Only the chapters that have content are rendered, and numbered in order.
  const chapters = {
    overview: Boolean(project.description),
    challenge: Boolean(project.challenge),
    contribution: project.contribution.length > 0,
    gallery: gallery.length > 0,
    features: project.features.length > 0,
    stack: project.technologies.length > 0,
  };
  const order = (Object.keys(chapters) as (keyof typeof chapters)[]).filter((k) => chapters[k]);
  const num = (key: keyof typeof chapters) => pad(order.indexOf(key) + 1);

  const meta: { label: string; value: ReactNode; lang?: string }[] = [
    ...(project.role ? [{ label: t.role, value: project.role, lang: lang("role") }] : []),
    ...(project.sector ? [{ label: t.sector, value: project.sector, lang: lang("sector") }] : []),
    ...(project.year ? [{ label: t.year, value: project.year }] : []),
    {
      label: isQA ? t.environment : t.website,
      value: project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-1.5 text-accent"
        >
          {hostname(project.url)} <ArrowIcon size={14} />
          <span className="sr-only">{newTab}</span>
        </a>
      ) : (
        <span className="text-muted">{t.confidential}</span>
      ),
    },
  ];

  return (
    <article className="relative">
      {/* 01 — Hero */}
      <header className="container-x pb-14 pt-28 sm:pb-20 sm:pt-36">
        <Reveal immediate>
          <nav
            aria-label={t.breadcrumb}
            className="mb-12 flex items-center justify-between gap-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted sm:mb-20"
          >
            <ol className="flex min-w-0 items-center gap-3">
              <li>
                <Link href={projectsHref} className="group inline-flex items-center gap-2 py-2 transition-colors hover:text-fg">
                  <ArrowLeft
                    size={14}
                    aria-hidden
                    className="transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:-translate-x-1"
                  />
                  {t.allProjects}
                </Link>
              </li>
              <li aria-hidden className="hidden text-white/20 sm:block">
                /
              </li>
              <li aria-current="page" className="hidden truncate text-fg/70 sm:block">
                {project.title}
              </li>
            </ol>
            <span className="shrink-0 tabular-nums">
              <span className="text-fg">{project.index}</span> / {pad(total)}
            </span>
          </nav>
        </Reveal>

        <Reveal immediate delay={0.1}>
          <p className="eyebrow mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-muted">{t.caseStudy}</span>
            <span aria-hidden className="h-px w-10 bg-accent/60" />
            <span>{categoryLabel}</span>
          </p>
        </Reveal>

        <h1 className="display fit-title -ml-[0.04em]" style={fitTitle(project.title)}>
          <span className="sr-only">{project.title}</span>
          <span aria-hidden>
            <MaskLines immediate delay={0.15} lines={[project.title]} />
          </span>
        </h1>

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal immediate delay={0.35} className="lg:col-span-8">
            <p
              lang={lang("summary")}
              className="max-w-3xl font-display text-[clamp(1.2rem,0.95rem+1vw,1.75rem)] leading-[1.3] tracking-tight text-fg/90"
            >
              {project.summary}
            </p>
          </Reveal>
          {project.url && (
            <Reveal immediate delay={0.45} className="lg:col-span-4 lg:justify-self-end">
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t.visitWebsite} <ArrowIcon />
                <span className="sr-only">{newTab}</span>
              </a>
            </Reveal>
          )}
        </div>

        <Reveal immediate delay={0.55}>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-6 sm:mt-16 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label} className="min-w-0">
                <dt className="eyebrow mb-2 text-muted">{m.label}</dt>
                <dd lang={m.lang} className="break-words font-display text-[0.98rem] leading-snug sm:text-base">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
          {showFallbackNotice && (
            <p className="mt-8 max-w-xl border-l border-accent/50 pl-4 text-sm text-muted">{t.fallbackNotice}</p>
          )}
        </Reveal>
      </header>

      {/* 02 — Cover: wider than the text column, edge to edge on phones */}
      <figure className="mx-auto max-w-[112rem] sm:px-[calc(var(--gutter)/2)]">
        <ImageReveal immediate delay={0.25} parallax>
          <ProjectVisual
            project={project}
            priority
            sizes="(min-width: 1792px) 1792px, 100vw"
            className="aspect-[16/9]"
            bordered={false}
            alt={format(project.image ? t.coverAlt : t.placeholderAlt, { title: project.title })}
          />
        </ImageReveal>
        <figcaption className="container-x mt-4 flex justify-between gap-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
          <span>Fig. 01 — {project.title}</span>
          {project.url && <span className="truncate">{hostname(project.url)}</span>}
        </figcaption>
      </figure>

      <div className="space-y-24 pt-24 sm:space-y-36 sm:pt-36">
        {/* 03 — Overview */}
        {chapters.overview && (
          <Chapter id="overview" index={num("overview")} label={t.overview}>
            <Reveal>
              <p
                lang={lang("description")}
                className="display-mixed max-w-4xl text-[clamp(1.55rem,1.05rem+2vw,3rem)] leading-[1.12] text-fg"
              >
                {project.description}
              </p>
            </Reveal>
          </Chapter>
        )}

        {/* 04 — Challenge: a full-width band, the tension of the story */}
        {chapters.challenge && (
          <section aria-labelledby="challenge" className="relative overflow-hidden border-y border-line bg-bg-2/70 py-20 sm:py-32">
            <span
              aria-hidden
              className="display outline-text pointer-events-none absolute -right-[0.06em] top-1/2 -translate-y-1/2 select-none text-[clamp(9rem,28vw,26rem)] opacity-[0.08]"
            >
              {num("challenge")}
            </span>
            <div className="container-x relative grid gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-3">
                <div className="flex items-baseline gap-4">
                  <span aria-hidden className="font-mono text-xs text-accent">
                    {num("challenge")}
                  </span>
                  <h2 id="challenge" className="eyebrow text-fg">
                    {t.challenge}
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-9">
                <blockquote
                  lang={lang("challenge")}
                  className="display-mixed max-w-5xl border-l border-accent pl-6 text-[clamp(1.45rem,1rem+2.2vw,3.2rem)] leading-[1.14] sm:pl-10"
                >
                  {project.challenge}
                </blockquote>
              </Reveal>
            </div>
          </section>
        )}

        {/* 05 — Contribution: numbered editorial list */}
        {chapters.contribution && (
          <Chapter
            id="contribution"
            index={num("contribution")}
            label={t.contribution}
            aside={pad(project.contribution.length)}
          >
            <ol lang={lang("contributions")} className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
              {project.contribution.map((c, i) => (
                <Reveal
                  as="li"
                  key={`${i}-${c}`}
                  delay={(i % 4) * 0.05}
                  className="group flex items-baseline gap-5 border-b border-line py-4 transition-colors duration-300 hover:text-accent sm:py-5"
                >
                  <span className="w-6 shrink-0 font-mono text-xs text-muted transition-colors group-hover:text-accent">
                    {pad(i + 1)}
                  </span>
                  <span className="font-display text-lg leading-snug tracking-tight transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:translate-x-1.5 sm:text-xl">
                    {c}
                  </span>
                </Reveal>
              ))}
            </ol>
          </Chapter>
        )}

        {/* 06 — Gallery: full width, editorial rhythm */}
        {chapters.gallery && (
          <section aria-labelledby="gallery" className="container-x">
            <Reveal className="mb-10 flex items-baseline justify-between gap-4 border-t border-line pt-4 sm:mb-14">
              <div className="flex items-baseline gap-4">
                <span aria-hidden className="font-mono text-xs text-accent">
                  {num("gallery")}
                </span>
                <h2 id="gallery" className="eyebrow text-fg">
                  {t.gallery}
                </h2>
              </div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                {format(t.views, { count: pad(gallery.length) })}
              </p>
            </Reveal>
            <ProjectGallery images={gallery} title={project.title} t={t} />
          </section>
        )}

        {/* 07 — Features: spec-sheet system */}
        {chapters.features && (
          <Chapter id="features" index={num("features")} label={t.features}>
            <ul lang={lang("features")} className="grid gap-x-10 sm:grid-cols-2">
              {project.features.map((f, i) => (
                <Reveal as="li" key={`${i}-${f}`} delay={(i % 2) * 0.08} className="border-t border-line pb-10 pt-5">
                  <span className="font-mono text-[0.7rem] tracking-[0.18em] text-accent">F/{pad(i + 1)}</span>
                  <p className="mt-4 max-w-md font-display text-[clamp(1.15rem,1rem+0.6vw,1.55rem)] leading-snug tracking-tight">
                    {f}
                  </p>
                </Reveal>
              ))}
            </ul>
          </Chapter>
        )}

        {/* 08 — Stack: names stay identical across languages */}
        {chapters.stack && (
          <Chapter id="stack" index={num("stack")} label={isQA ? t.tools : t.technologies}>
            <Reveal>
              <ul className="grid grid-cols-2 border-t border-line sm:grid-cols-3">
                {project.technologies.map((tech, i) => (
                  <li
                    key={tech}
                    className="flex items-baseline justify-between gap-3 border-b border-line py-3.5 pr-4 font-display text-base tracking-tight sm:text-xl"
                  >
                    <span className="min-w-0 break-words">{tech}</span>
                    <span aria-hidden className="font-mono text-[0.62rem] text-muted">
                      {pad(i + 1)}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Chapter>
        )}

        {project.url && (
          <div className="container-x">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-end justify-between gap-6 border-y border-line py-10 sm:py-14"
            >
              <span className="min-w-0">
                <span className="eyebrow block">{t.liveLabel}</span>
                <span className="display-mixed mt-3 block break-words text-[clamp(1.8rem,1rem+3.6vw,4.6rem)] transition-colors duration-300 group-hover:text-accent">
                  {hostname(project.url)}
                </span>
                <span className="sr-only">{newTab}</span>
              </span>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-black sm:h-20 sm:w-20">
                <ArrowIcon size={26} />
              </span>
            </a>
          </div>
        )}
      </div>

      {/* 09 — Next project */}
      <nav aria-label={t.moreProjects} className="mt-24 sm:mt-36">
        {next && prev ? (
          <>
            <Link
              href={localizePath(locale, `/projects/${next.slug}`)}
              className="group block border-t border-line"
            >
              <div className="container-x py-14 sm:py-24">
                <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                  <span className="flex items-center gap-4 text-accent">
                    {t.nextProject}
                    <span
                      aria-hidden
                      className="h-px w-10 origin-left bg-accent/60 transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-x-[2.2]"
                    />
                  </span>
                  <span className="tabular-nums">
                    {next.index} / {pad(total)}
                  </span>
                </div>

                <div className="mt-8 grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-8">
                    <span
                      className="display fit-title block transition-[color,transform] duration-700 [transition-timing-function:var(--ease-out)] group-hover:translate-x-3 group-hover:text-accent group-focus-visible:text-accent"
                      style={fitTitle(next.title, "clamp(2.6rem, 1rem + 6.4vw, 7.5rem)")}
                    >
                      {next.title}
                    </span>
                    <span className="mt-5 flex items-center gap-4 text-muted">
                      <span lang={fallbackLang(next, "sector")}>{next.sector}</span>
                      <ArrowIcon size={22} />
                    </span>
                  </div>
                  {/* Preview: always visible on touch layouts, revealed on hover on desktop. */}
                  <div className="relative aspect-[16/9] overflow-hidden lg:col-span-4 lg:[clip-path:inset(0_0_100%_0)] lg:transition-[clip-path] lg:duration-700 lg:[transition-timing-function:var(--ease-out)] lg:group-hover:[clip-path:inset(0_0_0_0)] lg:group-focus-visible:[clip-path:inset(0_0_0_0)]">
                    {next.image ? (
                      <Image
                        src={next.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="object-cover object-top transition-transform duration-1000 [transition-timing-function:var(--ease-out)] group-hover:scale-105"
                      />
                    ) : (
                      <ProjectVisual project={next} alt="" className="h-full" bordered={false} />
                    )}
                  </div>
                </div>
              </div>
            </Link>

            <div className="border-t border-line">
              <div className="container-x flex items-center justify-between gap-6 py-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                <Link
                  href={localizePath(locale, `/projects/${prev.slug}`)}
                  className="group inline-flex min-w-0 items-center gap-2 py-2 transition-colors hover:text-fg"
                >
                  <ArrowLeft
                    size={14}
                    aria-hidden
                    className="shrink-0 transition-transform duration-500 group-hover:-translate-x-1"
                  />
                  <span className="shrink-0">{t.previousProject}</span>
                  <span className="hidden truncate text-fg/70 sm:inline">— {prev.title}</span>
                </Link>
                <Link href={projectsHref} className="shrink-0 py-2 transition-colors hover:text-fg">
                  {t.allProjects}
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="container-x border-t border-line py-10">
            <Link href={projectsHref} className="btn btn-ghost">
              <ArrowLeft size={16} aria-hidden /> {t.allProjects}
            </Link>
          </div>
        )}
      </nav>
    </article>
  );
}
