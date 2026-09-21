/**
 * Single source of truth for personal / site-wide configuration.
 * Edit this file to change contact details, availability or the CV path.
 */
export const site = {
  name: "Nezha Soumer",
  title: "Nezha Soumer | Junior Web Developer & QA Tester",
  role: "Junior Web Developer & QA Tester",
  description:
    "Junior Web Developer and QA Tester based in Marrakech, specializing in Next.js, React, WordPress, responsive web development, CMS integration, software testing and SEO.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nezhasoumer.com",
  location: "Marrakech, Morocco",
  email: "nezhasoumer@gmail.com",
  linkedin: "https://linkedin.com/in/nezha-soumer-145380280",
  /** Put the PDF at public/cv/Nezha-Soumer-CV.pdf (or change this path). */
  cv: "/cv/Nezha-Soumer-CV.pdf",
  /** Toggle the availability indicator in the navigation. */
  availability: {
    available: true,
    label: "Available for opportunities",
    shortLabel: "Available",
  },
  locale: "en",
} as const;
