import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { About } from "@/components/sections/About";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Timeline } from "@/components/sections/Timeline";
import { CvCard } from "@/components/ui/CvCard";
import { getDictionary, isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

export const revalidate = 60;

type Props = PageProps<"/[lang]/about">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { title, description } = getDictionary(lang).pages.about;
  return pageMetadata(lang, "/about", title, description);
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: dict.pages.about.title,
    url: new URL(localizePath(lang, "/about"), site.url).toString(),
    inLanguage: lang,
    mainEntity: { "@type": "Person", name: site.name, jobTitle: dict.meta.role, url: site.url, sameAs: [site.linkedin] },
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <About
        t={dict.about}
        as="h1"
        className="pb-[var(--section-y)] pt-28 sm:pt-32"
        aside={<CvCard locale={lang} t={dict.cv} newTab={dict.a11y.newTab} />}
      />
      <Timeline t={dict.experience} />
      <ContactCTA locale={lang} t={dict.cta} cvLabel={dict.cv.download} />
    </main>
  );
}
