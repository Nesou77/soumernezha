"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageReveal } from "@/components/animations/ImageReveal";
import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type Row = { kind: "wide"; items: [number] } | { kind: "pair"; items: [number, number]; flip: boolean };

/**
 * Editorial rhythm instead of a uniform grid: a wide frame, then an
 * asymmetric staggered pair (7/5, then 5/7), and so on. Two images start
 * directly with a pair; a lone trailing image becomes a wide frame.
 */
function compose(count: number): Row[] {
  const rows: Row[] = [];
  let i = 0;
  let pairs = 0;
  while (i < count) {
    const wantsWide = rows.length % 2 === 0 && count !== 2;
    if (!wantsWide && count - i >= 2) {
      rows.push({ kind: "pair", items: [i, i + 1], flip: pairs++ % 2 === 1 });
      i += 2;
    } else {
      rows.push({ kind: "wide", items: [i] });
      i += 1;
    }
  }
  return rows;
}

const pad = (n: number) => String(n).padStart(2, "0");

interface FrameProps {
  images: string[];
  index: number;
  title: string;
  t: Dictionary["project"];
  figureOffset: number;
  onOpen: (index: number) => void;
  className?: string;
  sizes: string;
}

function Frame({ images, index, title, t, figureOffset, onOpen, className, sizes }: FrameProps) {
  return (
    <figure className={className}>
      <ImageReveal>
        <button
          type="button"
          onClick={() => onOpen(index)}
          aria-label={format(t.openImage, { index: index + 1 })}
          className="group relative block aspect-[16/9] w-full overflow-hidden bg-bg-3"
        >
          <Image
            src={images[index]}
            alt={format(t.galleryAlt, { title, index: index + 1 })}
            fill
            sizes={sizes}
            className="object-cover object-top transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-white/10 transition-colors duration-500 group-hover:border-accent/60"
          />
        </button>
      </ImageReveal>
      <figcaption className="mt-3 flex justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        <span>Fig. {pad(index + 1 + figureOffset)}</span>
        <span aria-hidden>
          {pad(index + 1)} / {pad(images.length)}
        </span>
      </figcaption>
    </figure>
  );
}

interface ProjectGalleryProps {
  images: string[];
  title: string;
  t: Dictionary["project"];
  /** Figure numbering continues after the cover (Fig. 01). */
  figureOffset?: number;
}

export function ProjectGallery({ images, title, t, figureOffset = 1 }: ProjectGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const rows = compose(images.length);
  const shared = { images, title, t, figureOffset, onOpen: setOpen };

  return (
    <>
      <div className="space-y-10 sm:space-y-16 lg:space-y-24">
        {rows.map((row) =>
          row.kind === "wide" ? (
            // Wide frames bleed to the screen edges on phones for a change of pace.
            <Frame
              {...shared}
              key={row.items[0]}
              index={row.items[0]}
              className="-mx-[var(--gutter)] sm:mx-0 [&_figcaption]:px-[var(--gutter)] sm:[&_figcaption]:px-0"
              sizes="(min-width: 1536px) 1400px, 100vw"
            />
          ) : (
            <div key={row.items[0]} className="grid gap-10 md:grid-cols-12 md:gap-6 lg:gap-10">
              <Frame
                {...shared}
              {...shared}
                index={row.items[0]}
                className={cn(row.flip ? "md:col-span-5 md:mt-[14%]" : "md:col-span-7")}
                sizes="(min-width: 768px) 58vw, 100vw"
              />
              <Frame
                {...shared}
              {...shared}
                index={row.items[1]}
                className={cn(row.flip ? "md:col-span-7" : "md:col-span-5 md:mt-[14%]")}
                sizes="(min-width: 768px) 42vw, 100vw"
              />
            </div>
          ),
        )}
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox images={images} title={title} t={t} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

interface LightboxProps {
  images: string[];
  title: string;
  t: Dictionary["project"];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

/**
 * Full-screen viewer. A fixed layer (not a native <dialog>) so it stays below
 * the custom cursor's layer and the cursor keeps working; focus is moved in,
 * trapped, and restored manually. Esc closes, arrow keys navigate.
 */
function Lightbox({ images, title, t, index, onChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const many = images.length > 1;

  const go = useCallback(
    (dir: 1 | -1) => onChange((index + dir + images.length) % images.length),
    [index, images.length, onChange],
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) go(1);
      else if (e.key === "ArrowLeft" && many) go(-1);
      else if (e.key === "Tab" && ref.current) {
        const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>("button"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, many, onClose]);

  const control =
    "grid h-11 w-11 place-items-center rounded-full border border-white/15 text-fg transition-colors hover:border-accent hover:text-accent";

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[95] flex flex-col bg-[#050505]/96 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="container-x flex items-center justify-between py-4 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        <span aria-live="polite">{format(t.imageCounter, { index: pad(index + 1), count: pad(images.length) })}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t.closeImage} className={control}>
          <X size={18} aria-hidden />
        </button>
      </div>

      <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={images[index]}
            className="pointer-events-none absolute inset-x-[var(--gutter)] inset-y-2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={images[index]}
              alt={format(t.galleryAlt, { title, index: index + 1 })}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container-x flex items-center justify-center gap-3 py-5">
        {many && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t.previousImage} className={control}>
              <ArrowLeft size={18} aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.nextImage} className={control}>
              <ArrowRight size={18} aria-hidden />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
