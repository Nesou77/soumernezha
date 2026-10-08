import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectsExplorer, ProjectsExplorerFallback } from "@/components/projects/ProjectsExplorer";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedProjects } from "@/lib/data/projects";
import { getDictionary, isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;

type Props = PageProps<"/[lang]/projects">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { title, description } = getDictionary(lang).pages.projects;
  return pageMetadata(lang, "/projects", title, description);
}

export default async function ProjectsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const projects = await getPublishedProjects(lang);
  const explorerProps = { projects, locale: lang, t: dict.projects, categories: dict.categories };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dict.pages.projects.title,
    description: dict.pages.projects.description,
    url: new URL(localizePath(lang, "/projects"), site.url).toString(),
    inLanguage: lang,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: new URL(localizePath(lang, `/projects/${p.slug}`), site.url).toString(),
        name: p.title,
      })),
    },
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section aria-labelledby="projects-title" className="container-x pb-[var(--section-y)] pt-32 sm:pt-40">
        <SectionHeading
          id="projects-title"
          as="h1"
          eyebrow={dict.projects.eyebrow}
          lines={[dict.projects.headline]}
          intro={dict.projects.intro}
        />
        <div className="mt-14 sm:mt-20">
          <Suspense fallback={<ProjectsExplorerFallback {...explorerProps} />}>
            <ProjectsExplorer {...explorerProps} />
          </Suspense>
        </div>
      </section>
      <ContactCTA locale={lang} t={dict.cta} cvLabel={dict.cv.download} />
    </main>
  );
}
