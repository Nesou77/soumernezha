import { HeroCanvas } from "@/components/3d/HeroCanvas";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { QALab } from "@/components/sections/QALab";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";
import { getPublishedProjects } from "@/lib/data/projects";

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const qaProjects = projects.filter((p) => p.category === "qa").slice(0, 3);

  return (
    <>
      <HeroCanvas />
      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <ProjectShowcase projects={projects} />
        <QALab qaProjects={qaProjects} />
        <Skills />
        <Timeline />
        <Contact />
      </main>
    </>
  );
}
