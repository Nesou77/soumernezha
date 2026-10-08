import type { Locale } from "@/lib/i18n/config";

/**
 * Copy for the error boundary (app/(site)/[lang]/error.tsx). Kept apart from
 * en.ts / fr.ts because error boundaries are Client Components: importing the
 * full dictionaries there would ship them to every visitor.
 */
export const errorCopy: Record<Locale, { eyebrow: string; title: string; text: string; retry: string; home: string }> = {
  en: {
    eyebrow: "Unexpected error",
    title: "Something broke.",
    text: "This page could not be displayed. Please try again.",
    retry: "Try again",
    home: "Back home",
  },
  fr: {
    eyebrow: "Erreur inattendue",
    title: "Quelque chose a cassé.",
    text: "Cette page n'a pas pu s'afficher. Veuillez réessayer.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
};
