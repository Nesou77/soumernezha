# Nezha Soumer — Portfolio

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · React Three Fiber · Framer Motion · Supabase.

Projects are managed from a private back office at `/admin` (Supabase Auth +
Postgres + Storage) instead of being hand-coded — see
[SUPABASE_SETUP.md](SUPABASE_SETUP.md) for the one-time setup (create the
project, run the migration, create your admin account, import the original
projects).

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in Supabase values, see SUPABASE_SETUP.md
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm start
```

## Where to edit things

| What | Where |
| --- | --- |
| Name, email, LinkedIn, availability badge, CV path | `lib/site.ts` |
| Section copy (English) | `data/content.ts` |
| **Projects (title, images, technologies, publish state...)** | `/admin` — no code changes needed. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md). |
| Skills / QA suite / experience | `data/skills.ts`, `data/qa.ts`, `data/experience.ts` |
| Profile photo | `public/images/profile/` (not used by a section yet; render it with `next/image` where you want it, e.g. in `components/sections/About.tsx`) |
| CV | replace `public/cv/Nezha-Soumer-CV.pdf` (currently a placeholder) |
| Colours / type scale | `app/globals.css` |

`data/projects.ts` is kept only as the source for `npm run seed` (the one-time
import into Supabase) and is no longer read by the live site.

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel (framework preset: Next.js, no settings needed).
2. Set the environment variables below in the Vercel project settings.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Absolute site URL for metadata, sitemap, robots |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon/public key (RLS-restricted, safe for the browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | only for `npm run seed` | Server-only key used solely by the seed script |

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for where to find these.

The contact form uses a `mailto:` link, so no backend or API key is needed. To send server-side
instead, add `app/api/contact/route.ts` that calls Resend (`RESEND_API_KEY`) and POST the form to it.

## Notes

- 3D is loaded with `next/dynamic` (`ssr: false`), stops rendering when off-screen, and is simplified on
  phones (fewer panels/particles, capped pixel ratio). With `prefers-reduced-motion` it renders a static frame.
  Without WebGL a CSS fallback is shown.
- French later: move copy in `data/content.ts` to `content.fr.ts` and select by locale.
