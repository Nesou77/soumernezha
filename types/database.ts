/**
 * Raw shape of a row in the Supabase `projects` table.
 *
 * Deliberately a `type` (object literal), not an `interface`: only object
 * literal types get TypeScript's implicit string index signature, which the
 * Supabase client's generic `Database` constraints (`Record<string, unknown>`)
 * require structurally. An `interface` here would make every `.from(...)`
 * call collapse to `never`.
 */
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
  contributions: string[];
  features: string[];
  technologies: string[];
  project_url: string | null;
  cover_image_url: string | null;
  gallery_urls: string[];
  hue: number;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "updated_at">;
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
