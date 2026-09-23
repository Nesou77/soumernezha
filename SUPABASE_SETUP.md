# Supabase setup — Portfolio CMS

The public site reads projects from Supabase (Postgres + Storage), and `/admin`
is a small back office (Supabase Auth) to create, edit, publish and delete
projects without touching code. This guide gets that running from scratch.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick an organization, name (e.g. `nezha-portfolio`), a database password
   (save it somewhere safe), and a region close to your visitors.
3. Wait for provisioning (~2 minutes).

## 2. Run the database migration

1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   and click **Run**.

This creates:

- the `projects` table (with the `web`/`cms`/`qa` category check, unique
  `slug`, and array columns for technologies/features/contributions/gallery),
- the `admin_users` allowlist table,
- Row Level Security policies (public read of published projects only; admin
  read/write of everything),
- the `project-images` Storage bucket, public for reading, admin-only for
  writing.

Re-running the file is safe (it uses `create ... if not exists` / `drop policy
if exists`), so you can paste it again after pulling a future update to this
file.

## 3. Configure Authentication

There is **no public sign-up** — `/admin` is a private area for you only.

1. In the dashboard, go to **Authentication → Providers** and make sure
   **Email** is enabled (it is by default).
2. Go to **Authentication → Settings** and turn **off** "Allow new users to
   sign up" if you want to be extra sure no one can self-register (the app
   never exposes a sign-up form either way).

## 4. Create your first admin account

1. **Authentication → Users → Add user → Create new user.** Enter your email
   and a password (or send a magic invite, your choice). Confirm the email
   if prompted.
2. Copy the new user's **UID** from the users list.
3. Back in **SQL Editor**, run (replace the placeholders):

   ```sql
   insert into public.admin_users (id, email)
   values ('paste-the-user-uid-here', 'you@example.com');
   ```

You can repeat step 3 for additional admins later. Removing a row from
`admin_users` immediately revokes back-office access for that account (their
existing session is signed out on their next request).

## 5. Environment variables

1. In the dashboard, go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. Copy `.env.example` to `.env.local` and fill in:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. Also copy the **service_role** key (same page, "Reveal" it) into
   `SUPABASE_SERVICE_ROLE_KEY`. This key is **server-only** and is used
   exclusively by the seed script (step 6) to bypass RLS for the one-time
   import. It is never read by the Next.js app itself and must never be
   exposed to the browser or committed to git (`.env.local` is already
   git-ignored).

## 6. Import the existing projects

The 11 projects that used to live in `data/projects.ts` can be imported in one
command (safe to re-run — it upserts by slug):

```bash
npm install
npm run seed
```

This inserts them all as `published: true`, in their original order, with
`featured` preserved from the original data. Cover/gallery images are left
empty (the original site had none — it used the generated placeholder visual),
so open each project in `/admin` afterwards and upload real screenshots if you
have them.

## 7. Run locally

```bash
npm run dev        # http://localhost:3000
```

Visit `/admin/login` and sign in with the account you created in step 4.

## 8. Deploy

1. Push the repo to GitHub and import it in Vercel (or your host of choice).
2. Set these environment variables in the hosting provider's dashboard:
   - `NEXT_PUBLIC_SITE_URL` — your production URL.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` — only needed if you'll run `npm run seed`
     from that environment; otherwise you can omit it in production.
3. Deploy. `/admin` is already excluded from `robots.txt` and marked
   `noindex`.

## How content becomes live

- Editing a project in `/admin` and saving immediately revalidates the
  homepage, the sitemap, and that project's `/projects/[slug]` page — no
  redeploy needed.
- A project only appears publicly once its **Published** toggle is on.
- `Featured` projects appear in the homepage's highlighted section; the QA
  lab automatically shows up to 3 published projects in the `qa` category.

## Notes on Storage

Uploaded images live in the `project-images` bucket, in a folder per project
slug. The bucket is public-read (so `next/image` can serve them directly) but
only accounts listed in `admin_users` can upload, replace or delete files —
enforced by Storage RLS policies, not just by hiding the UI.
