export type ProjectCategory = "web" | "cms" | "qa";

export interface Project {
  /** Database id. Absent for the (legacy) static seed entries. */
  id?: string;
  slug: string;
  index: string;
  title: string;
  category: ProjectCategory;
  sector: string;
  role: string;
  year?: string;
  /** One-line pitch used in lists and metadata. */
  summary: string;
  /** Short paragraph for the case-study header. */
  description: string;
  challenge: string;
  contribution: string[];
  features: string[];
  technologies: string[];
  url?: string;
  /** Cover image URL (Supabase Storage). Falls back to a generated visual. */
  image?: string;
  /** Extra screenshots shown on the case-study page. */
  gallery?: string[];
  /** Hue (0-360) used by the generated placeholder visual. */
  hue: number;
  featured?: boolean;
  /** Whether the project is publicly visible. Always true for publicly-fetched projects. */
  published?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export interface SkillItem {
  name: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  phase: "develop" | "test" | "deploy";
  blurb: string;
  skills: SkillItem[];
}

export interface TimelineEntry {
  company: string;
  role: string;
  period: string;
  location?: string;
  summary?: string;
  tags?: string[];
  highlight?: boolean;
}

export interface EducationEntry {
  title: string;
  school: string;
  period: string;
}

export interface QATest {
  name: string;
  detail: string;
}

