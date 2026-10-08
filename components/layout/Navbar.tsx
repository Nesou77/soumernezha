"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Link2, Mail, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import type { Dictionary } from "@/lib/i18n";
import { localizePath, stripLocale, type Locale } from "@/lib/i18n/config";
import { cvFor, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

function Status({ compact, label }: { compact: boolean; label: string }) {
  if (!site.available) return null;
  return (
    <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
      <span aria-hidden className="h-2 w-2 rounded-full bg-accent" style={{ animation: "pulse-dot 2.4s infinite" }} />
      <span className={cn(compact && "sr-only")}>{label}</span>
    </span>
  );
}

/** A nav item is current on its own page and on the pages below it (/projects/x → Projects). */
function isCurrent(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

interface NavbarProps {
  locale: Locale;
  items: NavItem[];
  a11y: Dictionary["a11y"];
  availability: Dictionary["availability"];
  cvLabel: string;
}

export function Navbar({ locale, items, a11y, availability, cvLabel }: NavbarProps) {
  const path = stripLocale(usePathname());
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 80));
  const cv = cvFor(locale);

  // While the mobile menu is open: lock scroll, move focus into it, close on Escape.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => menuRef.current?.querySelector<HTMLElement>("a")?.focus(), 250);
    return () => {
      clearTimeout(focusTimer);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[120] rounded bg-accent px-4 py-2 font-medium text-black"
      >
        {a11y.skipToContent}
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.nav
          aria-label={a11y.mainNav}
          layout
          className={cn(
            "pointer-events-auto flex w-full max-w-fit items-center gap-2 rounded-full border border-white/10 bg-[#0b0f14]/75 backdrop-blur-xl transition-[padding] duration-500",
            compact ? "py-1.5 pl-2 pr-2" : "py-2.5 pl-3 pr-3 sm:pl-4 sm:pr-4",
          )}
        >
          <Link
            href={localizePath(locale, "/")}
            aria-label={a11y.home}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
            onClick={() => setOpen(false)}
          >
            <Logo className="h-8 w-8" />
          </Link>

          <ul className="mx-1 hidden items-center gap-0.5 md:flex">
            {items.map((item) => {
              const current = isCurrent(path, item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={localizePath(locale, item.href)}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-sm transition-colors",
                      current ? "text-black" : "text-muted hover:text-fg",
                    )}
                  >
                    {current && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={cn("mx-1 hidden pr-1 lg:block lg:pl-4", !compact && "lg:border-l lg:border-white/10")}>
            <Status compact={compact} label={availability.label} />
          </div>

          <LanguageSwitcher
            locale={locale}
            label={a11y.language}
            className="ml-auto border-l border-white/10 pl-2 md:ml-0 md:pr-1"
          />

          <button
            ref={toggleRef}
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? a11y.closeMenu : a11y.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            className="fixed inset-0 z-[75] flex flex-col justify-between overflow-y-auto bg-[#050505]/97 px-[var(--gutter)] pb-10 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div>
              <ul className="flex flex-col gap-1">
                {items.map((item, i) => {
                  const current = isCurrent(path, item.href);
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.04, duration: 0.4 } }}
                    >
                      <Link
                        href={localizePath(locale, item.href)}
                        aria-current={current ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "display-mixed flex items-baseline gap-4 py-2 text-[clamp(2.2rem,10vw,3.4rem)] transition-colors",
                          current ? "text-accent" : "text-fg",
                        )}
                      >
                        <span aria-hidden className="font-mono text-xs text-accent">
                          0{i + 1}
                        </span>
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-10 flex flex-col gap-5">
              <Status compact={false} label={availability.label} />
              <div className="flex flex-wrap gap-3">
                <a href={cv.href} download={cv.fileName} type="application/pdf" className="btn btn-primary">
                  <Download size={16} aria-hidden /> {cvLabel}
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <Link2 size={16} aria-hidden /> LinkedIn
                  <span className="sr-only"> {a11y.newTab}</span>
                </a>
              </div>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 break-all text-muted hover:text-fg">
                <Mail size={15} aria-hidden /> {site.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
