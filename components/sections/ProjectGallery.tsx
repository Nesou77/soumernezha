"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { format } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  t: Dictionary["project"];
}

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectGallery({ images, title, t }: ProjectGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  if (images.length === 0) return null;

  const many = images.length > 1;
  const go = (direction: 1 | -1) => {
    setActive((current) => (current + direction + images.length) % images.length);
  };

  return (
    <>
      <div className="grid gap-4 lg:h-[min(72dvh,720px)] lg:grid-cols-[minmax(0,1fr)_9rem]">
        <div className="relative min-h-[48dvh] overflow-hidden border border-white/10 bg-bg-3 lg:min-h-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={images[active]}
              type="button"
              onClick={() => setOpen(active)}
              aria-label={format(t.openImage, { index: active + 1 })}
              className="absolute inset-0 block h-full w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={images[active]}
                alt={format(t.galleryAlt, { title, index: active + 1 })}
                fill
                sizes="(min-width: 1024px) 82vw, 100vw"
                className="object-contain"
              />
            </motion.button>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-10 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/70">
            <span>{pad(active + 1)} / {pad(images.length)}</span>
            <span>{t.gallery}</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={format(t.openImage, { index: index + 1 })}
              className={cn(
                "relative aspect-[16/10] w-28 shrink-0 overflow-hidden border bg-bg-3 transition-colors lg:w-full",
                active === index ? "border-accent" : "border-white/10 hover:border-white/30",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="144px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      </div>

      {many && (
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            {format(t.imageCounter, { index: pad(active + 1), count: pad(images.length) })}
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label={t.previousImage} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-fg transition-colors hover:border-accent hover:text-accent">
              <ArrowLeft size={16} aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.nextImage} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-fg transition-colors hover:border-accent hover:text-accent">
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {open !== null && (
          <Lightbox
            images={images}
            title={title}
            t={t}
            index={open}
            onChange={(index) => {
              setOpen(index);
              setActive(index);
            }}
            onClose={() => setOpen(null)}
          />
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

function Lightbox({ images, title, t, index, onChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const many = images.length > 1;

  const go = useCallback(
    (direction: 1 | -1) => onChange((index + direction + images.length) % images.length),
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight" && many) go(1);
      else if (event.key === "ArrowLeft" && many) go(-1);
      else if (event.key === "Tab" && ref.current) {
        const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>("button"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, many, onClose]);

  const control = "grid h-11 w-11 place-items-center rounded-full border border-white/15 text-fg transition-colors hover:border-accent hover:text-accent";

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
      transition={{ duration: 0.25 }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="container-x flex items-center justify-between py-4 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        <span aria-live="polite">{format(t.imageCounter, { index: pad(index + 1), count: pad(images.length) })}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t.closeImage} className={control}>
          <X size={18} aria-hidden />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={images[index]}
            className="pointer-events-none absolute inset-x-[var(--gutter)] inset-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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

      {many && (
        <div className="container-x flex items-center justify-center gap-3 py-5">
          <button type="button" onClick={() => go(-1)} aria-label={t.previousImage} className={control}>
            <ArrowLeft size={18} aria-hidden />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.nextImage} className={control}>
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      )}
    </motion.div>
  );
}
