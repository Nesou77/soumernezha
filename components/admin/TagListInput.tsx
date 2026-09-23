"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface TagListInputProps {
  name: string;
  label: string;
  placeholder?: string;
  initialValues?: string[];
}

/** Dynamically add/remove plain-text rows (features, contributions...). Each
 * row is a real named input so it submits as part of the surrounding form. */
export function TagListInput({ name, label, placeholder, initialValues }: TagListInputProps) {
  const [values, setValues] = useState<string[]>(initialValues && initialValues.length > 0 ? initialValues : [""]);

  function updateAt(index: number, value: string) {
    setValues((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function removeAt(index: number) {
    setValues((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [""]));
  }

  function add() {
    setValues((prev) => [...prev, ""]);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white/80">{label}</label>
      <div className="space-y-2">
        {values.map((value, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              name={name}
              value={value}
              placeholder={placeholder}
              onChange={(e) => updateAt(i, e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Remove"
              className="shrink-0 rounded p-1.5 text-white/40 hover:text-red-300"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
      >
        <Plus size={14} /> Add {label.toLowerCase().replace(/s$/, "")}
      </button>
    </div>
  );
}
