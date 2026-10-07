import type { TranslatedLocale } from "@/lib/i18n/config";

/**
 * Localized overrides for one non-default locale. Every field is optional:
 * anything missing falls back to the default-locale (English) column.
 */
export type ProjectTranslation = {
  title?: string;
  sector?: string;
  role?: string;
  summary?: string;
  description?: string;
  challenge?: string;
  challengePoints?: string[];
  contributions?: string[];
  solution?: string;
  solutionPoints?: string[];
  features?: string[];
};

/** Shape of the `projects.translations` jsonb column, e.g. `{ "fr": { "summary": "…" } }`. */
export type ProjectTranslations = { [L in TranslatedLocale]?: ProjectTranslation };

/** Raw shape of a row in the Supabase `projects` table. */
export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  sector: string;
  role: string;
  year: string | null;
  summary: string;
  description: string;
  challenge: string;
  challenge_points: string[];
  contributions: string[];
  solution: string;
  solution_points: string[];
  features: string[];
  technologies: string[];
  project_url: string | null;
  cover_image_url: string | null;
  gallery_urls: string[];
  hue: number;
  featured: boolean;
  published: boolean;
  display_order: number;
  translations: ProjectTranslations;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "updated_at" | "translations"> & {
  translations?: ProjectTranslations;
};
export type ProjectUpdate = Partial<ProjectInsert>;

export type AdminUserRow = {
  id: string;
  email: string;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: Omit<AdminUserRow, "created_at">;
        Update: Partial<Omit<AdminUserRow, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
