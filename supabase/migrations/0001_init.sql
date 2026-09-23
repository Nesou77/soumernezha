-- Portfolio CMS schema: projects table, admin allowlist, RLS, and storage bucket.
-- Run this once against your Supabase project (SQL editor, or `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('web', 'cms', 'qa')),
  sector text not null default '',
  role text not null default '',
  year text,
  summary text not null,
  description text not null default '',
  challenge text not null default '',
  contributions text[] not null default '{}',
  features text[] not null default '{}',
  technologies text[] not null default '{}',
  project_url text,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  hue integer not null default floor(random() * 360),
  featured boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_order_idx
  on public.projects (published, display_order);

create index if not exists projects_category_idx
  on public.projects (category);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- admin_users — allowlist of who may manage content from /admin.
-- A row must be inserted manually (see SUPABASE_SETUP.md) after creating the
-- corresponding Supabase Auth user; there is no public signup.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.admin_users enable row level security;

-- Anyone (including anonymous visitors) can read published projects.
drop policy if exists "public can read published projects" on public.projects;
create policy "public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (published = true);

-- Admins (rows present in admin_users) can read every project, draft or not.
drop policy if exists "admins can read all projects" on public.projects;
create policy "admins can read all projects"
  on public.projects for select
  to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

drop policy if exists "admins can insert projects" on public.projects;
create policy "admins can insert projects"
  on public.projects for insert
  to authenticated
  with check (exists (select 1 from public.admin_users a where a.id = auth.uid()));

drop policy if exists "admins can update projects" on public.projects;
create policy "admins can update projects"
  on public.projects for update
  to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.id = auth.uid()));

drop policy if exists "admins can delete projects" on public.projects;
create policy "admins can delete projects"
  on public.projects for delete
  to authenticated
  using (exists (select 1 from public.admin_users a where a.id = auth.uid()));

-- Admins may see their own allowlist row (needed to check membership from the app).
drop policy if exists "admins can read own membership" on public.admin_users;
create policy "admins can read own membership"
  on public.admin_users for select
  to authenticated
  using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Storage bucket for project media
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read project images" on storage.objects;
create policy "public can read project images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "admins can upload project images" on storage.objects;
create policy "admins can upload project images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-images'
    and exists (select 1 from public.admin_users a where a.id = auth.uid())
  );

drop policy if exists "admins can update project images" on storage.objects;
create policy "admins can update project images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'project-images'
    and exists (select 1 from public.admin_users a where a.id = auth.uid())
  );

drop policy if exists "admins can delete project images" on storage.objects;
create policy "admins can delete project images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-images'
    and exists (select 1 from public.admin_users a where a.id = auth.uid())
  );
