"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { validateImageFile } from "@/lib/validation/project";

interface GalleryUploaderProps {
  name: string;
  initialUrls: string[];
}

/**
 * Gallery image picker. Existing images can be removed and reordered (via
 * the hidden `galleryKeep` field); newly selected files submit through the
 * native, multi-select file input and are appended server-side.
 */
export function GalleryUploader({ name, initialUrls }: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keepUrls, setKeepUrls] = useState<string[]>(initialUrls);
  const [newPreviews, setNewPreviews] = useState<{ url: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  function move(index: number, dir: -1 | 1) {
    setKeepUrls((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setKeepUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const err = validateImageFile(file);
      if (err) {
        setError(err);
        if (inputRef.current) inputRef.current.value = "";
        setNewPreviews([]);
        return;
      }
    }
    setError(null);
    setNewPreviews(files.map((f) => ({ url: URL.createObjectURL(f), name: f.name })));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white/80">Gallery</label>

      {keepUrls.length > 0 && (
        <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {keepUrls.map((url, i) => (
            <li key={url} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/15 bg-white/5">
              <Image src={url} alt="" fill sizes="200px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/60 p-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                  className="rounded p-1 text-white/80 hover:text-white disabled:opacity-30"
                >
                  <ArrowLeft size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove image"
                  className="rounded p-1 text-red-300 hover:text-red-200"
                >
                  <X size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === keepUrls.length - 1}
                  aria-label="Move later"
                  className="rounded p-1 text-white/80 hover:text-white disabled:opacity-30"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input type="hidden" name="galleryKeep" value={JSON.stringify(keepUrls)} />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/80 hover:border-white/40 hover:text-white"
      >
        Add gallery images
      </button>
      <p className="mt-1.5 text-[0.7rem] text-white/40">
        JPEG, PNG, WEBP or GIF — up to 5MB each. Selecting again replaces the pending selection below.
      </p>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleChange}
        className="sr-only"
      />

      {newPreviews.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {newPreviews.map((p) => (
            <li key={p.url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-accent/40 bg-white/5">
              <Image src={p.url} alt="" fill sizes="200px" className="object-cover" />
              <span className="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-[0.6rem] font-semibold text-[#031513]">
                New
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
