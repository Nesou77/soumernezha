"use client";

import { Check, Copy, Download, Link2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Magnetic } from "@/components/animations/Magnetic";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCopy } from "@/hooks/useCopy";
import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/config";
import { site } from "@/lib/site";

const field =
  "w-full border-b border-white/20 bg-transparent px-0 py-3 text-fg placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

/**
 * No backend required: the form composes a mailto: link.
 * To send from the server instead, add an API route (e.g. with Resend) and
 * POST the form data there. See README.
 */
interface ContactProps {
  t: Dictionary["contact"];
  location: string;
  newTab: string;
}

export function Contact({ t: c, location, newTab }: ContactProps) {
  const { copied, copy } = useCopy();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `${format(c.subject, { name: get("name") })}${get("company") ? ` (${get("company")})` : ""}`;
    const body = `${get("message")}\n\n— ${get("name")}\n${get("email")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading id="contact-title" index="06" eyebrow={c.eyebrow} lines={c.headline} intro={c.intro} />

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-display text-2xl">{site.name}</p>
              <p className="text-muted">{location}</p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-8 block break-all font-display text-[clamp(1.4rem,0.8rem+2.6vw,2.8rem)] tracking-tight"
              >
                {site.email}
              </a>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <button type="button" onClick={() => copy(site.email)} className="btn btn-primary">
                    {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                    {copied ? c.copied : c.copyEmail}
                  </button>
                </Magnetic>
                <Magnetic>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <Link2 size={16} aria-hidden /> LinkedIn <ArrowIcon size={16} />
                    <span className="sr-only">{newTab}</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href={site.cv} download className="btn btn-ghost">
                    <Download size={16} aria-hidden /> {c.cv}
                  </a>
                </Magnetic>
              </div>
              <p role="status" aria-live="polite" className="sr-only">
                {copied ? c.copiedStatus : ""}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-6">
            <form onSubmit={onSubmit} className="space-y-6" aria-label={c.form}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="eyebrow text-muted">{c.name}</label>
                  <input id="c-name" name="name" required autoComplete="name" className={field} placeholder={c.namePlaceholder} />
                </div>
                <div>
                  <label htmlFor="c-email" className="eyebrow text-muted">{c.email}</label>
                  <input id="c-email" name="email" type="email" required autoComplete="email" className={field} placeholder={c.emailPlaceholder} />
                </div>
              </div>
              <div>
                <label htmlFor="c-company" className="eyebrow text-muted">{c.company} <span className="normal-case tracking-normal">{c.optional}</span></label>
                <input id="c-company" name="company" autoComplete="organization" className={field} placeholder={c.companyPlaceholder} />
              </div>
              <div>
                <label htmlFor="c-message" className="eyebrow text-muted">{c.message}</label>
                <textarea id="c-message" name="message" required rows={4} className={`${field} resize-none`} placeholder={c.messagePlaceholder} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <button type="submit" className="btn btn-primary">
                    {c.send} <ArrowIcon />
                  </button>
                </Magnetic>
                <p role="status" aria-live="polite" className="text-sm text-muted">
                  {sent ? c.sent : c.hint}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
