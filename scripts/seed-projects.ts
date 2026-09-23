/**
 * One-off / re-runnable import of the legacy static projects (data/projects.ts)
 * into Supabase. Run with: npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only,
 * bypasses RLS — never expose it to the browser) in .env.local.
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { projects } from "../data/projects";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local. See SUPABASE_SETUP.md.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

async function main() {
  console.log(`Seeding ${projects.length} projects into Supabase...`);

  for (const [i, p] of projects.entries()) {
    const row = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      sector: p.sector,
      role: p.role,
      year: p.year ?? null,
      summary: p.summary,
      description: p.description,
      challenge: p.challenge,
      contributions: p.contribution,
      features: p.features,
      technologies: p.technologies,
      project_url: p.url ?? null,
      cover_image_url: p.image ?? null,
      gallery_urls: p.gallery ?? [],
      hue: p.hue,
      featured: p.featured ?? false,
      published: true,
      display_order: i,
    };

    const { error } = await supabase.from("projects").upsert(row, { onConflict: "slug" });
    if (error) {
      console.error(`  ✗ ${p.slug}: ${error.message}`);
    } else {
      console.log(`  ✓ ${p.slug}`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
