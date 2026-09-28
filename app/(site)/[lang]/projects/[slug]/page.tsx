import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { getAdjacentProjects, getPublishedProjects } from "@/lib/data/projects";
import { defaultLocale, getDictionary, isLocale, localizePath } from "@/lib/i18n";
import { localeAlternates, openGraphLocale } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;

type Props = PageProps<"/[lang]/projects/[slug]">;

/** Slugs are shared by every language; the parent layout provides `lang`. */
export async function generateStaticParams() {
  const projects = await getPublishedProjects(defaultLocale);
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const projects = await getPublishedProjects(lang);
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = project.sector ? `${project.title}: ${project.sector}` : project.title;
  const path = `/projects/${project.slug}`;
  return {
    title,
    description: project.summary,
    alternates: localeAlternates(lang, path),
    openGraph: {
      title,
      description: project.summary,
      url: localizePath(lang, path),
      type: "article",
      images: project.image ? [{ url: project.image, width: 1920, height: 1080 }] : undefined,
      ...openGraphLocale(lang),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const projects = await getPublishedProjects(lang);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const adjacent = getAdjacentProjects(projects, slug);
  const dict = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: new URL(localizePath(lang, `/projects/${project.slug}`), site.url).toString(),
    inLanguage: lang,
    image: project.image,
    genre: dict.categories[project.category],
    keywords: project.technologies.join(", "),
    ...(project.url ? { sameAs: project.url } : {}),
    creator: { "@type": "Person", name: site.name, url: site.url },
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProjectDetail
        project={project}
        prev={adjacent?.prev}
        next={adjacent?.next}
        total={projects.length}
        locale={lang}
        t={dict.project}
        categoryLabel={dict.categories[project.category]}
        newTab={dict.a11y.newTab}
      />
    </main>
  );
}
