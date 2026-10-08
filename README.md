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

## Pages

Every page exists in English (no prefix) and French (`/fr`), with canonical + hreflang tags and sitemap entries.

| Page | URL | File |
| --- | --- | --- |
| Home: hero, key skills, 3 featured projects, contact CTA | `/` | `app/(site)/[lang]/page.tsx` |
| Projects: gallery with category & technology filters (kept in the URL, e.g. `?category=web&tech=Next.js`) | `/projects` | `app/(site)/[lang]/projects/page.tsx` |
| Case study | `/projects/[slug]` | `app/(site)/[lang]/projects/[slug]/page.tsx` |
| About: bio, CV, QA Lab, skills, experience & education | `/about` | `app/(site)/[lang]/about/page.tsx` |
| Contact: form + direct links | `/contact` | `app/(site)/[lang]/contact/page.tsx` |

Featured projects on the home page are the ones marked **Featured** in `/admin` (topped up in display order to 3).

## Where to edit things

| What | Where |
| --- | --- |
| Name, email, LinkedIn, availability badge, CV paths | `lib/site.ts` |
| All site copy, menus and page metadata (EN / FR) | `data/locales/en.ts`, `data/locales/fr.ts` (same shape, enforced by TypeScript) |
| Error page copy | `data/locales/error.ts` |
| **Projects (title, images, technologies, publish state, French translation...)** | `/admin`, no code changes needed. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md). |
| Colours / type scale | `app/globals.css` |

## CV files

One PDF per language; the site links to the one matching the visitor's language (and offers the other one on the About page):

| Language | File |
| --- | --- |
| English | `public/cv/Nezha-Soumer-EN.pdf` |
| French | `public/cv/Nezha-Soumer-FR.pdf` |

**Both are currently placeholders** (a one-page PDF saying so), so download links never break. To publish the real CVs, replace the files keeping the same names and redeploy. To use other names, change `site.cv` in `lib/site.ts`. The old `/cv/Nezha-Soumer-CV.pdf` URL redirects to the English CV.

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

### Contact form

The form validates in the browser, then calls a server action (`lib/actions/contact.ts`):

- with `RESEND_API_KEY` set, the message is sent by email through Resend (`CONTACT_TO_EMAIL`, default the address in `lib/site.ts`; `CONTACT_FROM_EMAIL`, a sender on a domain verified in Resend);
- without it, the visitor's email app opens with the message pre-filled (previous behaviour).

## Notes

- 3D is loaded with `next/dynamic` (`ssr: false`), stops rendering when off-screen, and is simplified on
  phones (fewer panels/particles, capped pixel ratio). With `prefers-reduced-motion` it renders a static frame.
  Without WebGL a CSS fallback is shown.
