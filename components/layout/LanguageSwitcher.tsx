"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeNames,
  localizePath,
  locales,
  stripLocale,
  type Locale,
} from "@/lib/i18n/config";
import { captureScrollAnchor } from "@/lib/i18n/scroll-anchor";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: Locale;
  /** Accessible name of the group ("Language" / "Langue"). */
  label: string;
  className?: string;
}

/**
 * `EN / FR` switch. Each option is a real link to the same page in the other
 * language (crawlable, works with keyboard and middle-click). On click the
 * choice is stored in a cookie, which the proxy uses to send returning
 * visitors to their language. It is a full navigation (the root layout
 * changes with the locale), and the reading position is carried over so the
 * visitor stays on the same section: only the language changes.
 */
export function LanguageSwitcher({ locale, label, className }: LanguageSwitcherProps) {
  const path = stripLocale(usePathname());

  return (
    <div role="group" aria-label={label} className={cn("flex items-center font-mono text-[0.7rem] tracking-[0.14em]", className)}>
      {locales.map((l, i) => {
        const active = l === locale;
        const href = localizePath(l, path);
        return (
          <Fragment key={l}>
            {i > 0 && (
              <span aria-hidden className="text-white/20">
                /
              </span>
            )}
            <a
              href={href}
              hrefLang={l}
              lang={l}
              aria-label={localeNames[l]}
              aria-current={active ? "true" : undefined}
              onClick={(e) => {
                if (active) {
                  e.preventDefault();
                  return;
                }
                document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
                captureScrollAnchor(href);
              }}
              className={cn(
                "relative grid min-h-9 min-w-8 place-items-center px-1.5 uppercase transition-colors",
                active ? "text-accent" : "text-muted hover:text-fg",
              )}
            >
              {l}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-1.5 bottom-1.5 h-px origin-left bg-accent transition-transform duration-500",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          </Fragment>
        );
      })}
    </div>
  );
}
