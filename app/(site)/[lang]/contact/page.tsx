import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sections/Contact";
import { getDictionary, isLocale, localizePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

type Props = PageProps<"/[lang]/contact">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { title, description } = getDictionary(lang).pages.contact;
  return pageMetadata(lang, "/contact", title, description);
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: dict.pages.contact.title,
    url: new URL(localizePath(lang, "/contact"), site.url).toString(),
    inLanguage: lang,
    mainEntity: { "@type": "Person", name: site.name, email: `mailto:${site.email}`, sameAs: [site.linkedin] },
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Contact
        locale={lang}
        t={dict.contact}
        workMode={dict.meta.workMode}
        newTab={dict.a11y.newTab}
        as="h1"
        index="01"
        className="pb-[var(--section-y)] pt-32 sm:pt-40"
      />
    </main>
  );
}
