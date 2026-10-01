/**
 * Single source of truth for language-independent site configuration.
 * Edit this file to change contact details, availability or the CV path.
 * Translated copy (role, description, work mode…) lives in data/locales/*.ts.
 */
export const site = {
  name: "Nezha Soumer",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nezhasoumer.com",
  email: "nezhasoumer@gmail.com",
  linkedin: "https://linkedin.com/in/nezha-soumer-145380280",
  /** Put the PDF at public/cv/Nezha-Soumer-CV.pdf (or change this path). */
  cv: "/cv/Nezha-Soumer-CV.pdf",
  /** Toggle the availability indicator in the navigation (labels are in data/locales). */
  available: true,
} as const;
