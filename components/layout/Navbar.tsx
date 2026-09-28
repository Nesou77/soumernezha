"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { Dictionary } from "@/lib/i18n";
import { localizePath, stripLocale, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
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

interface NavbarProps {
  locale: Locale;
  items: NavItem[];
  a11y: Dictionary["a11y"];
  availability: Dictionary["availability"];
}

export function Navbar({ locale, items, a11y, availability }: NavbarProps) {
  const path = stripLocale(usePathname());
  const home = path === "/";
  const inProject = path.startsWith("/projects/");
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(items.map((n) => n.id));
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 80));

  // Lock scroll & close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // On the homepage, plain #anchors scroll smoothly; elsewhere, go back to the localized homepage section.
  const href = (h: string) => (home ? h : localizePath(locale, `/${h}`));

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
            "pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0f14]/70 backdrop-blur-xl transition-[padding] duration-500",
            compact ? "py-1.5 pl-2 pr-2" : "py-2.5 pl-3 pr-3 sm:pl-4 sm:pr-4",
          )}
        >
          <Link href={href("#home")} aria-label={a11y.home} className="grid h-9 w-9 place-items-center rounded-full">
            <Logo className="h-8 w-8" />
          </Link>

          <ul className="mx-1 hidden items-center gap-0.5 lg:flex">
            {items.map((item) => {
              // On a case study, "Projects" stays highlighted so visitors know where they are.
              const isActive = home ? active === item.id : inProject && item.id === "projects";
              return (
                <li key={item.id}>
                  <Link
                    href={href(item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-sm transition-colors",
                      isActive ? "text-black" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
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

          <div className={cn("mx-1 hidden pr-1 sm:block lg:pl-4", !compact && "lg:border-l lg:border-white/10")}>
            <Status compact={compact} label={availability.label} />
          </div>

          <LanguageSwitcher
            locale={locale}
            label={a11y.language}
            className="ml-auto border-l border-white/10 pl-2 lg:ml-0 lg:pr-1"
          />

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? a11y.closeMenu : a11y.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[75] flex flex-col justify-between bg-[#050505]/97 px-[var(--gutter)] pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.05, duration: 0.6 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <Link
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    className="display-mixed flex items-baseline gap-4 py-1.5 text-[clamp(2rem,9vw,3.4rem)]"
                  >
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-col gap-4">
              <Status compact={false} label={availability.label} />
              <a href={`mailto:${site.email}`} className="text-muted">
                {site.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

