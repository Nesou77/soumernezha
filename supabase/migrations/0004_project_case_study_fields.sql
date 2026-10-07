alter table public.projects
  add column if not exists challenge_points text[] not null default '{}',
  add column if not exists solution text not null default '',
  add column if not exists solution_points text[] not null default '{}';

notify pgrst, 'reload schema';
