import { Download } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/animations/Magnetic";
import { MaskLines } from "@/components/animations/MaskLines";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import type { Dictionary } from "@/lib/i18n";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { cvFor } from "@/lib/site";

interface ContactCTAProps {
  locale: Locale;
  t: Dictionary["cta"];
  cvLabel: string;
}

/** Closing band shared by the inner pages: one clear next step (contact) and the CV. */
export function ContactCTA({ locale, t, cvLabel }: ContactCTAProps) {
  const cv = cvFor(locale);
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_80%_at_50%_100%,black,transparent)]" />
      <div className="container-x relative grid gap-10 py-24 sm:py-32 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-accent/60" />
              {t.eyebrow}
            </p>
          </Reveal>
          <h2 id="cta-title" className="display text-h2">
            <span className="sr-only">{t.headline.join(" ")}</span>
            <span aria-hidden>
              <MaskLines lines={t.headline} lineClassNames={["", "text-accent"]} />
            </span>
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-muted">{t.text}</p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="lg:col-span-4 lg:justify-self-end">
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Link href={localizePath(locale, "/contact")} className="btn btn-primary">
                {t.primary} <ArrowIcon />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={cv.href} download={cv.fileName} type="application/pdf" className="btn btn-ghost">
                <Download size={16} aria-hidden /> {cvLabel}
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
