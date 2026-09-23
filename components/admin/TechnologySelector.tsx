"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { suggestedTechnologies } from "@/lib/project-constants";

interface TechnologySelectorProps {
  name: string;
  initialValues?: string[];
}

export function TechnologySelector({ name, initialValues }: TechnologySelectorProps) {
  const [values, setValues] = useState<string[]>(initialValues ?? []);
  const [draft, setDraft] = useState("");

  function addValue(raw: string) {
    const value = raw.trim();
    if (!value) return;
    setValues((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setDraft("");
  }

  function removeValue(value: string) {
    setValues((prev) => prev.filter((v) => v !== value));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addValue(draft);
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      removeValue(values[values.length - 1]);
    }
  }

  return (
    <div>
      <label htmlFor="technologies-input" className="mb-1.5 block text-sm font-medium text-white/80">
        Technologies <span className="text-red-300">*</span>
      </label>

      <div className="flex flex-wrap gap-1.5 rounded-lg border border-white/15 bg-white/5 p-2 focus-within:border-accent">
        {values.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs text-accent"
          >
            {tech}
            <button type="button" onClick={() => removeValue(tech)} aria-label={`Remove ${tech}`}>
              <X size={12} />
            </button>
            <input type="hidden" name={name} value={tech} />
          </span>
        ))}
        <input
          id="technologies-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addValue(draft)}
          list="technology-suggestions"
          placeholder={values.length === 0 ? "Type a technology and press Enter" : "Add another…"}
          className="min-w-[10rem] flex-1 bg-transparent px-1.5 py-1 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
      </div>
      <datalist id="technology-suggestions">
        {suggestedTechnologies.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>
      <p className="mt-1.5 text-[0.7rem] text-white/40">Press Enter or comma to add. Start typing for suggestions.</p>
    </div>
  );
}
