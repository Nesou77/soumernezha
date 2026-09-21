import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MaskLines } from "@/components/animations/MaskLines";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { categoryLabels, getAdjacentProjects } from "@/data/projects";
import { hostname } from "@/lib/utils";
import type { Project } from "@/types";

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="eyebrow mb-1 text-muted">{label}</dt>
      <dd className="font-display text-base">{children}</dd>
    </div>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const { prev, next } = getAdjacentProjects(project.slug);
  const isQA = project.category === "qa";

  return (
    <article className="relative">
      <header className="container-x pb-16 pt-36 sm:pt-44">
        <Reveal>
          <Link
            href="/#projects"
            className="link-underline mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-fg"
          >
            <ArrowLeft size={14} aria-hidden /> All projects
          </Link>
        </Reveal>
        <p className="eyebrow mb-5 flex items-center gap-4">
          <span className="text-muted">{project.index}</span>
          <span aria-hidden className="h-px w-10 bg-accent/60" />
          {categoryLabels[project.category]}
        </p>
        <h1 className="display text-h1 break-words">
          <span className="sr-only">{project.title}</span>
          <span aria-hidden>
            <MaskLines immediate lines={[project.title]} />
          </span>
        </h1>
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-2xl text-xl text-fg/90">{project.description}</p>
        </Reveal>

        <Reveal delay={0.4}>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 md:grid-cols-4">
            <Meta label="Industry">{project.sector}</Meta>
            <Meta label="Role">{project.role}</Meta>
            <Meta label="Type">{categoryLabels[project.category]}</Meta>
            <Meta label={isQA ? "Environment" : "Website"}>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-1.5 text-accent"
                >
                  {hostname(project.url)} <ArrowIcon size={14} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <span className="text-muted">Private / confidential</span>
              )}
            </Meta>
          </dl>
        </Reveal>
      </header>

      <div className="container-x">
        <Reveal y={60}>
          <ProjectVisual project={project} priority sizes="(min-width: 1536px) 1400px, 100vw" className="aspect-[16/9]" />
        </Reveal>
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <Reveal key={src} delay={i * 0.08}>
                <ProjectVisual project={{ ...project, image: src }} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <section aria-labelledby="challenge" className="container-x section-y grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <h2 id="challenge" className="eyebrow">Challenge</h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-9">
          <p className="display-mixed text-[clamp(1.5rem,1rem+2vw,2.8rem)]">{project.challenge}</p>
        </Reveal>
      </section>

      <section aria-labelledby="contribution" className="container-x grid gap-10 border-t border-line pt-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <h2 id="contribution" className="eyebrow">My contribution</h2>
        </Reveal>
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-9">
          {project.contribution.map((c, i) => (
            <Reveal as="li" key={c} delay={(i % 6) * 0.04} className="flex gap-4 border-b border-line py-4">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span>{c}</span>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="functionality" className="container-x section-y grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <h2 id="functionality" className="eyebrow">Key functionality</h2>
        </Reveal>
        <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-9">
          {project.features.map((f, i) => (
            <Reveal as="li" key={f} delay={i * 0.06} className="border-l border-accent/50 pl-5 text-lg leading-snug">
              {f}
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="stack" className="container-x grid gap-10 border-t border-line pb-24 pt-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <h2 id="stack" className="eyebrow">{isQA ? "Tools & methods" : "Technologies"}</h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-9">
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li key={t} className="border border-white/15 px-3.5 py-1.5 font-mono text-xs">
                {t}
              </li>
            ))}
          </ul>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-10"
            >
              Visit {hostname(project.url)} <ArrowIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </Reveal>
      </section>

      <nav aria-label="More projects" className="border-t border-line">
        <div className="container-x grid md:grid-cols-2">
          {[
            { p: prev, dir: "Previous" },
            { p: next, dir: "Next" },
          ].map(({ p, dir }) => (
            <Link
              key={dir}
              href={`/projects/${p.slug}`}
              className={`group block py-12 md:py-16 ${dir === "Next" ? "md:border-l md:border-line md:pl-10 md:text-right" : "md:pr-10"}`}
            >
              <span className="eyebrow text-muted">{dir} project</span>
              <span className="display-mixed mt-3 block text-[clamp(1.8rem,1rem+3vw,3.6rem)] transition-colors group-hover:text-accent">
                {p.title}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </article>
  );
}
