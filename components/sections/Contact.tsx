"use client";

import { AlertCircle, Check, CheckCircle2, Copy, Download, Link2, Loader2, Mail } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Magnetic } from "@/components/animations/Magnetic";
import { Reveal } from "@/components/animations/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCopy } from "@/hooks/useCopy";
import { sendContactMessage, type ContactField } from "@/lib/actions/contact";
import type { Dictionary } from "@/lib/i18n";
import { format, type Locale } from "@/lib/i18n/config";
import { cvFor, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const field =
  "w-full border-b bg-transparent px-0 py-3 text-fg placeholder:text-muted/60 transition-colors focus:outline-none";

type Status = "idle" | "sending" | "sent" | "fallback" | "error";
type Values = { name: string; email: string; company: string; message: string; website: string };
type Errors = Partial<Record<ContactField, string>>;

const fieldOrder: ContactField[] = ["name", "email", "message"];

function validate(v: Values, t: Dictionary["contact"]["errors"]): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = t.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = t.email;
  if (v.message.trim().length < 10) errors.message = t.message;
  return errors;
}

function read(form: HTMLFormElement): Values {
  const data = new FormData(form);
  const get = (k: string) => String(data.get(k) ?? "");
  return { name: get("name"), email: get("email"), company: get("company"), message: get("message"), website: get("website") };
}

interface ContactProps {
  locale: Locale;
  t: Dictionary["contact"];
  workMode: string;
  newTab: string;
  as?: "h1" | "h2";
  index?: string;
  className?: string;
}

/**
 * Contact page body. The form is validated in the browser (accessible inline
 * errors), then sent by a server action. If server-side sending is not
 * configured, it opens the visitor's email app with the message pre-filled.
 */
export function Contact({ locale, t: c, workMode, newTab, as = "h2", index = "01", className = "section-y" }: ContactProps) {
  const { copied, copy } = useCopy();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const cv = cvFor(locale);
  const immediate = as === "h1";

  // Move focus to the confirmation so screen-reader and keyboard users land on it.
  useEffect(() => {
    if (status === "sent" || status === "fallback") resultRef.current?.focus();
  }, [status]);

  const revalidate = () => {
    if (!attempted || !formRef.current) return;
    setErrors(validate(read(formRef.current), c.errors));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = read(form);
    const found = validate(values, c.errors);
    setAttempted(true);
    setErrors(found);
    const firstInvalid = fieldOrder.find((f) => found[f]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    const result = await sendContactMessage(values).catch(() => ({ status: "error" as const }));

    if (result.status === "sent") {
      form.reset();
      setAttempted(false);
      setStatus("sent");
    } else if (result.status === "invalid") {
      setErrors(Object.fromEntries(result.fields.map((f) => [f, c.errors[f]])));
      setStatus("idle");
    } else if (result.status === "unconfigured") {
      const subject = `${format(c.subject, { name: values.name.trim() })}${values.company.trim() ? ` (${values.company.trim()})` : ""}`;
      const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("fallback");
    } else {
      setStatus("error");
    }
  };

  const describedBy = (f: ContactField) => (errors[f] ? `c-${f}-error` : undefined);
  const fieldClass = (f: ContactField) =>
    cn(field, errors[f] ? "border-red-400/80 focus:border-red-400" : "border-white/20 focus:border-accent");
  const errorText = (f: ContactField) =>
    errors[f] ? (
      <p id={`c-${f}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-red-300">
        <AlertCircle size={14} aria-hidden /> {errors[f]}
      </p>
    ) : null;
  const errorCount = Object.keys(errors).length;

  return (
    <section id="contact" aria-labelledby="contact-title" className={cn("relative", className)}>
      <div className="container-x">
        <SectionHeading id="contact-title" index={index} eyebrow={c.eyebrow} lines={c.headline} intro={c.intro} as={as} />

        <div className="mt-14 grid gap-16 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal immediate={immediate} delay={immediate ? 0.35 : 0}>
              <h2 className="eyebrow mb-5 text-muted">{c.directTitle}</h2>
              <p className="font-display text-2xl">{site.name}</p>
              <p className="text-muted">{workMode}</p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-6 inline-flex items-center gap-3 break-all font-display text-[clamp(1.3rem,0.8rem+1.8vw,2.2rem)] tracking-tight"
              >
                <Mail size={22} aria-hidden className="shrink-0 text-accent" />
                {site.email}
              </a>
            </Reveal>

            <Reveal immediate={immediate} delay={immediate ? 0.45 : 0.1} className="mt-8">
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <button type="button" onClick={() => copy(site.email)} className="btn btn-primary">
                    {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                    {copied ? c.copied : c.copyEmail}
                  </button>
                </Magnetic>
                <Magnetic>
                  <a href={cv.href} download={cv.fileName} type="application/pdf" className="btn btn-ghost">
                    <Download size={16} aria-hidden /> {c.cv}
                  </a>
                </Magnetic>
              </div>
              <p role="status" aria-live="polite" className="sr-only">
                {copied ? c.copiedStatus : ""}
              </p>

              <h2 className="eyebrow mb-4 mt-12 text-muted">{c.linksTitle}</h2>
              <ul className="border-t border-line">
                <li className="border-b border-line">
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                  >
                    <span className="inline-flex items-center gap-3 font-display text-lg">
                      <Link2 size={18} aria-hidden /> LinkedIn
                    </span>
                    <ArrowIcon size={18} />
                    <span className="sr-only">{newTab}</span>
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal immediate={immediate} delay={immediate ? 0.4 : 0.1} className="lg:col-span-7">
            <div className="border border-line bg-bg-3/60 p-6 backdrop-blur-sm sm:p-10">
              {status === "sent" || status === "fallback" ? (
                <div ref={resultRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-5 py-6 focus:outline-none">
                  <CheckCircle2 size={36} aria-hidden className="text-accent" />
                  <p className="display-mixed text-3xl">{status === "sent" ? c.successTitle : c.fallbackTitle}</p>
                  <p className="max-w-md text-muted">
                    {status === "sent" ? c.successText : format(c.fallbackText, { email: site.email })}
                  </p>
                  <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost">
                    {c.another}
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-7" aria-labelledby="contact-form-title">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 id="contact-form-title" className="display-mixed text-2xl">
                      {c.formTitle}
                    </h2>
                    <p className="text-xs text-muted">{c.required}</p>
                  </div>

                  {errorCount > 1 && (
                    <p role="alert" className="flex items-center gap-2 text-sm text-red-300">
                      <AlertCircle size={15} aria-hidden /> {c.errors.summary}
                    </p>
                  )}

                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className="eyebrow text-muted">
                        {c.name} <span aria-hidden>*</span>
                      </label>
                      <input
                        id="c-name"
                        name="name"
                        required
                        autoComplete="name"
                        maxLength={120}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={describedBy("name")}
                        onBlur={revalidate}
                        onChange={revalidate}
                        className={fieldClass("name")}
                        placeholder={c.namePlaceholder}
                      />
                      {errorText("name")}
                    </div>
                    <div>
                      <label htmlFor="c-email" className="eyebrow text-muted">
                        {c.email} <span aria-hidden>*</span>
                      </label>
                      <input
                        id="c-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        maxLength={200}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={describedBy("email")}
                        onBlur={revalidate}
                        onChange={revalidate}
                        className={fieldClass("email")}
                        placeholder={c.emailPlaceholder}
                      />
                      {errorText("email")}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-company" className="eyebrow text-muted">
                      {c.company} <span className="normal-case tracking-normal">{c.optional}</span>
                    </label>
                    <input
                      id="c-company"
                      name="company"
                      autoComplete="organization"
                      maxLength={160}
                      className={cn(field, "border-white/20 focus:border-accent")}
                      placeholder={c.companyPlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-message" className="eyebrow text-muted">
                      {c.message} <span aria-hidden>*</span>
                    </label>
                    <textarea
                      id="c-message"
                      name="message"
                      required
                      rows={5}
                      maxLength={5000}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={describedBy("message")}
                      onBlur={revalidate}
                      onChange={revalidate}
                      className={cn(fieldClass("message"), "resize-y")}
                      placeholder={c.messagePlaceholder}
                    />
                    {errorText("message")}
                  </div>

                  {/* Honeypot: invisible to people and assistive tech. */}
                  <div aria-hidden className="sr-only">
                    <label htmlFor="c-website">{c.honeypot}</label>
                    <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button type="submit" disabled={status === "sending"} className="btn btn-primary w-fit disabled:cursor-wait disabled:opacity-70">
                      {status === "sending" ? (
                        <>
                          <Loader2 size={16} aria-hidden className="animate-spin" /> {c.sending}
                        </>
                      ) : (
                        <>
                          {c.send} <ArrowIcon />
                        </>
                      )}
                    </button>
                    <p role="status" aria-live="polite" className="text-sm text-red-300">
                      {status === "error" ? format(c.errorText, { email: site.email }) : ""}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
