import { notFound } from "next/navigation";
import { HeroCanvas } from "@/components/3d/HeroCanvas";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { QALab } from "@/components/sections/QALab";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";
import { getPublishedProjects } from "@/lib/data/projects";
import { getDictionary, isLocale } from "@/lib/i18n";

export const revalidate = 60;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const projects = await getPublishedProjects(lang);
  const qaProjects = projects.filter((p) => p.category === "qa").slice(0, 3);

  return (
    <>
      <HeroCanvas />
      <main id="main" className="relative z-10">
        <Hero t={dict.hero} meta={dict.meta} newTab={dict.a11y.newTab} />
        <About t={dict.about} />
        <ProjectShowcase
          projects={projects}
          locale={lang}
          t={dict.projects}
          projectT={dict.project}
          categories={dict.categories}
        />
        <QALab qaProjects={qaProjects} t={dict.qa} locale={lang} />
        <Skills t={dict.skills} />
        <Timeline t={dict.experience} />
        <Contact t={dict.contact} location={dict.meta.location} newTab={dict.a11y.newTab} />
      </main>
    </>
  );
}
