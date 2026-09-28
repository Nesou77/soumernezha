-- Multilingual project content (EN / FR).
--
-- Additive and backward-compatible: existing columns and rows are untouched.
--   * The existing text columns (title, sector, role, summary, description,
--     challenge, contributions, features) keep holding the ENGLISH content,
--     which is the default language and the fallback for every other one.
--   * The new `translations` column holds per-language overrides, e.g.
--       { "fr": { "summary": "…", "contributions": ["…", "…"] } }
--     Any field missing there is displayed in English on the French site.
--
-- Safe to re-run. Run it in the Supabase SQL editor BEFORE deploying the
-- code that writes translations (the public site already tolerates the
-- column being absent, but saving from /admin needs it).

alter table public.projects
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- Only a JSON object is meaningful here (never an array, string or null).
alter table public.projects
  drop constraint if exists projects_translations_is_object;
alter table public.projects
  add constraint projects_translations_is_object
  check (jsonb_typeof(translations) = 'object');

-- No grant or RLS change is needed: the existing table-level grants and row
-- policies (public read of published rows, admin-only writes) already cover
-- the new column.

-- Make the API (PostgREST) pick up the new column immediately.
notify pgrst, 'reload schema';
