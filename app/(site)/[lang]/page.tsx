import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroCanvas } from "@/components/3d/HeroCanvas";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Hero } from "@/components/sections/Hero";
import { KeySkills } from "@/components/sections/KeySkills";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { getPublishedProjects } from "@/lib/data/projects";
import { getDictionary, isLocale, localizePath } from "@/lib/i18n";
import { pickFeatured } from "@/lib/project-filters";

export const revalidate = 60;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const projects = await getPublishedProjects(lang);
  const featured = pickFeatured(projects, 3);

  return (
    <>
      <HeroCanvas />
      <main id="main" className="relative z-10">
        <Hero locale={lang} t={dict.hero} meta={dict.meta} newTab={dict.a11y.newTab} nextId="expertise" />
        <KeySkills locale={lang} t={dict.home.skills} about={dict.about} index="01" />
        <ProjectShowcase
          projects={featured}
          locale={lang}
          t={dict.projects}
          projectT={dict.project}
          categories={dict.categories}
          showFilters={false}
          heading={dict.home.featured}
          index="02"
          footer={
            projects.length > 0 && (
              <Link href={localizePath(lang, "/projects")} className="btn btn-ghost">
                {dict.home.featured.viewAll} <ArrowIcon />
              </Link>
            )
          }
        />
        <ContactCTA locale={lang} t={dict.cta} cvLabel={dict.cv.download} />
      </main>
    </>
  );
}
