import { en, type Dictionary } from "@/data/locales/en";
import { fr } from "@/data/locales/fr";
import type { Locale } from "./config";

export * from "./config";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, fr };

/**
 * Synchronous on purpose: both dictionaries are small, and callers are Server
 * Components that pass only the slice they need down to Client Components,
 * so the full dictionary is never shipped to the browser.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
