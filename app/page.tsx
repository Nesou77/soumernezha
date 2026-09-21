import { HeroCanvas } from "@/components/3d/HeroCanvas";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { QALab } from "@/components/sections/QALab";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";

export default function HomePage() {
  return (
    <>
      <HeroCanvas />
      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <ProjectShowcase />
        <QALab />
        <Skills />
        <Timeline />
        <Contact />
      </main>
    </>
  );
}
