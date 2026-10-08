import { Download, FileText } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { locales, type Locale } from "@/lib/i18n/config";
import { cvFor } from "@/lib/site";
import { cn } from "@/lib/utils";

interface CvCardProps {
  locale: Locale;
  t: Dictionary["cv"];
  newTab: string;
  className?: string;
}

/**
 * CV in the visitor's language: open it in the browser's PDF viewer or
 * download it, plus a discreet link to the other language's version.
 */
export function CvCard({ locale, t, newTab, className }: CvCardProps) {
  const cv = cvFor(locale);
  const other = locales.find((l) => l !== locale);
  const otherCv = other ? cvFor(other) : null;

  return (
    <article className={cn("flex flex-col gap-6 border border-line bg-bg-3/60 p-7 backdrop-blur-sm sm:p-8", className)}>
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow">{t.eyebrow}</p>
        <FileText size={22} aria-hidden className="text-muted" />
      </div>
      <div>
        <h2 className="display-mixed text-3xl">{t.title}</h2>
        <p className="mt-3 text-muted">{t.text}</p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">{t.format}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={cv.href} download={cv.fileName} hrefLang={locale} type="application/pdf" className="btn btn-primary">
          <Download size={16} aria-hidden /> {t.download}
        </a>
        <a href={cv.href} target="_blank" rel="noopener" hrefLang={locale} type="application/pdf" className="btn btn-ghost">
          {t.view}
          <span className="sr-only"> {newTab}</span>
        </a>
      </div>
      {otherCv && other && (
        <a
          href={otherCv.href}
          download={otherCv.fileName}
          hrefLang={other}
          lang={other}
          type="application/pdf"
          className="link-underline w-fit text-sm text-muted hover:text-fg"
        >
          {t.other} (PDF)
        </a>
      )}
    </article>
  );
}
