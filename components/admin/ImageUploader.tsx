"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { validateImageFile } from "@/lib/validation/project";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  name: string;
  label: string;
  currentUrl?: string;
  required?: boolean;
  error?: string;
}

/** Single-image picker (used for the project cover). Keeps the file in a
 * native <input type="file"> so it submits with the surrounding <form>. */
export function ImageUploader({ name, label, currentUrl, required, error: externalError }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayUrl = preview ?? currentUrl;
  const error = localError ?? externalError;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setLocalError(validationError);
      e.target.value = "";
      return;
    }
    setLocalError(null);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white/80">
        {label} {required && <span className="text-red-300">*</span>}
      </label>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-white/5">
          {displayUrl ? (
            <Image src={displayUrl} alt="" fill sizes="144px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[0.65rem] text-white/30">No image</div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/80 hover:border-white/40 hover:text-white"
          >
            {displayUrl ? "Replace image" : "Choose image"}
          </button>
          <p className="mt-1.5 text-[0.7rem] text-white/40">JPEG, PNG, WEBP or GIF — up to 5MB.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="sr-only"
      />
      <input type="hidden" name="coverImageCurrent" value={currentUrl ?? ""} />

      {error && <p className={cn("mt-2 text-sm text-red-300")}>{error}</p>}
    </div>
  );
}
