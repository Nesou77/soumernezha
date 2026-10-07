import { z } from "zod";
import { projectCategories } from "@/lib/project-constants";

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const listSchema = z.array(z.string().trim().min(1)).default([]);

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(120)
    .regex(slugPattern, "Slug must be lowercase letters, numbers and hyphens only (e.g. luxury-hotel-website)."),
  category: z.enum(projectCategories as [string, ...string[]], { message: "Choose a category." }),
  sector: z.string().trim().max(140).default(""),
  role: z.string().trim().max(140).default(""),
  year: z.string().trim().max(20).optional().or(z.literal("")),
  summary: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters.")
    .max(280, "Keep the short description under 280 characters."),
  description: z.string().trim().max(5000).default(""),
  challenge: z.string().trim().max(1600).default(""),
  challengePoints: listSchema,
  contributions: listSchema,
  solution: z.string().trim().max(1600).default(""),
  solutionPoints: listSchema,
  features: listSchema,
  technologies: z.array(z.string().trim().min(1)).min(1, "Add at least one technology."),
  projectUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^https?:\/\//i.test(v), { message: "Project URL must start with http:// or https://" }),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

/** Content for a non-default locale. Empty values fall back to English. */
export const projectTranslationSchema = z.object({
  title: z.string().trim().max(120).default(""),
  sector: z.string().trim().max(140).default(""),
  role: z.string().trim().max(140).default(""),
  summary: z.string().trim().max(280).default(""),
  description: z.string().trim().max(5000).default(""),
  challenge: z.string().trim().max(1600).default(""),
  challengePoints: listSchema,
  contributions: listSchema,
  solution: z.string().trim().max(1600).default(""),
  solutionPoints: listSchema,
  features: listSchema,
});

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Only JPEG, PNG, WEBP or GIF images are allowed.";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be 5MB or smaller.";
  return null;
}
