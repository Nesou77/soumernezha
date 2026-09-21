"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { navItems } from "@/data/nav";
import { useActiveSection } from "@/hooks/useActiveSection";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const ids = navItems.map((n) => n.id);

function Status({ compact }: { compact: boolean }) {
  if (!site.availability.available) return null;
  return (
    <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
      <span aria-hidden className="h-2 w-2 rounded-full bg-accent" style={{ animation: "pulse-dot 2.4s infinite" }} />
      <span className={cn(compact && "sr-only")}>{site.availability.label}</span>
    </span>
  );
}

export function Navbar() {
  const home = usePathname() === "/";
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
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

  const href = (h: string) => (home ? h : `/${h}`);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[120] rounded bg-accent px-4 py-2 font-medium text-black"
      >
        Skip to content
      </a>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.nav
          aria-label="Main"
          layout
          className={cn(
            "pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0f14]/70 backdrop-blur-xl transition-[padding] duration-500",
            compact ? "py-1.5 pl-2 pr-2" : "py-2.5 pl-3 pr-3 sm:pl-4 sm:pr-4",
          )}
        >
          <Link href={href("#home")} aria-label="Nezha Soumer, home" className="grid h-9 w-9 place-items-center rounded-full">
            <Logo className="h-8 w-8" />
          </Link>

          <ul className="mx-1 hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive = home && active === item.id;
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
            <Status compact={compact} />
          </div>

          <button
            type="button"
            className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
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
              {navItems.map((item, i) => (
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
              <Status compact={false} />
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

