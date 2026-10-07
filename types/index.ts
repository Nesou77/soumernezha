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

  /** Short description used in project cards, metadata and the case-study hero. */
  summary: string;

  /** Detailed project description shown near the beginning of the case study. */
  description: string;

  /** Challenge introduction + scannable challenge points. */
  challenge: string;
  challengePoints: string[];

  /** What was personally delivered on the project. */
  contribution: string[];

  /** Solution introduction + scannable solution points. */
  solution: string;
  solutionPoints: string[];

  /** Main product / project capabilities. */
  features: string[];

  /** Shared technical stack. Technology names are not translated. */
  technologies: string[];

  url?: string;
  /** Cover image URL (Supabase Storage). Falls back to a generated visual. */
  image?: string;
  /** Extra screenshots shown in the case-study gallery. */
  gallery?: string[];
  /** Hue (0-360) used by the generated placeholder visual. */
  hue: number;
  featured?: boolean;
  /** Whether the project is publicly visible. Always true for publicly-fetched projects. */
  published?: boolean;

  /**
   * Text fields shown in the default language because the requested locale
   * has no translation yet.
   */
  untranslated?: TranslatableField[];
}

/** Project fields that can differ per language (named after the localized content keys). */
export type TranslatableField =
  | "title"
  | "sector"
  | "role"
  | "summary"
  | "description"
  | "challenge"
  | "challengePoints"
  | "contributions"
  | "solution"
  | "solutionPoints"
  | "features";

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
