import type { ProjectCategory } from "@/types";

/** Client-safe constants shared between the public site and the admin forms. */

export const categoryLabels: Record<ProjectCategory, string> = {
  web: "Web Development",
  cms: "CMS / Low-Code",
  qa: "QA / Software Testing",
};

export const projectCategories: ProjectCategory[] = ["web", "cms", "qa"];

/** Seeded from the technologies used across the original static projects, for the tag-picker's suggestions. */
export const suggestedTechnologies: string[] = [
  "Next.js",
  "Next.js 15",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "React Hook Form",
  "Zod",
  "Resend API",
  "Google Calendar API",
  "Google reCAPTCHA",
  "reCAPTCHA",
  "GitHub",
  "Vercel",
  "SEO",
  "Google Tag Manager",
  "WordPress",
  "Elementor",
  "Custom CSS",
  "Figma",
  "Rank Math",
  "Rank Math SEO",
  "Responsive Design",
  "WooCommerce",
  "Zoho Sites",
  "HTML",
  "CSS",
  "WhatsApp",
  "Forms",
  "Google Analytics",
  "Google Search Console",
  "Google Maps",
  "Jira",
  "Power BI",
  "Excel",
  "JMeter",
  "Functional Testing",
  "Performance Testing",
  "API Testing",
  "Regression Testing",
].sort((a, b) => a.localeCompare(b));
