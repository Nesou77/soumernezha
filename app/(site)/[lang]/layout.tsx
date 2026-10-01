import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { getDictionary, isLocale, locales, localizePath } from "@/lib/i18n";
import { localeAlternates, openGraphLocale } from "@/lib/i18n/metadata";
import { scrollRestoreScript } from "@/lib/i18n/scroll-anchor";
import { site } from "@/lib/site";
import "../../globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--f-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--f-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return { metadataBase: new URL(site.url) };
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: meta.title, template: `%s | ${site.name}` },
    description: meta.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    keywords: meta.keywords,
    alternates: localeAlternates(lang, "/"),
    openGraph: {
      type: "website",
      url: localizePath(lang, "/"),
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      ...openGraphLocale(lang),
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      url: site.url,
      jobTitle: dict.meta.role,
      email: `mailto:${site.email}`,
      sameAs: [site.linkedin],
      knowsAbout: [
        "Web Development",
        "Front-End Development",
        "Next.js",
        "React",
        "TypeScript",
        "WordPress",
        "Elementor",
        "WooCommerce",
        "Responsive Design",
        "Figma-to-Web",
        "CMS Integration",
        "SEO",
        "Quality Assurance",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${site.name} — Portfolio`,
      url: new URL(localizePath(lang, "/"), site.url).toString(),
      description: dict.meta.description,
      inLanguage: lang,
    },
  ];

  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Loader words={dict.loader} label={dict.a11y.loading} />
        <ScrollProgress />
        <CustomCursor />
        <Navbar
          locale={lang}
          items={dict.nav}
          a11y={dict.a11y}
          availability={dict.availability}
        />
        {children}
        <Footer t={dict.footer} />
        {/* After all content: restores the reading position after a language switch. */}
        <script dangerouslySetInnerHTML={{ __html: scrollRestoreScript }} />
      </body>
    </html>
  );
}
