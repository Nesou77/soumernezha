# Nezha Soumer — Portfolio

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · React Three Fiber · Framer Motion.

## Run locally

```bash
npm install
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
| Projects (incl. QA case studies) | `data/projects.ts` |
| Skills / QA suite / experience | `data/skills.ts`, `data/qa.ts`, `data/experience.ts` |
| Project screenshots | drop files in `public/images/projects/`, then set `image` (and optional `gallery`) on the project in `data/projects.ts`, e.g. `image: "/images/projects/fly-taghazout.jpg"`. Until then a generated placeholder is shown. |
| Profile photo | `public/images/profile/` (not used by a section yet; render it with `next/image` where you want it, e.g. in `components/sections/About.tsx`) |
| CV | replace `public/cv/Nezha-Soumer-CV.pdf` (currently a placeholder) |
| Colours / type scale | `app/globals.css` |

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel (framework preset: Next.js, no settings needed).
2. Set `NEXT_PUBLIC_SITE_URL` to the production URL (used for canonical URLs, sitemap, Open Graph).

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Absolute site URL for metadata, sitemap, robots |

The contact form uses a `mailto:` link, so no backend or API key is needed. To send server-side
instead, add `app/api/contact/route.ts` that calls Resend (`RESEND_API_KEY`) and POST the form to it.

## Notes

- 3D is loaded with `next/dynamic` (`ssr: false`), stops rendering when off-screen, and is simplified on
  phones (fewer panels/particles, capped pixel ratio). With `prefers-reduced-motion` it renders a static frame.
  Without WebGL a CSS fallback is shown.
- French later: move copy in `data/content.ts` to `content.fr.ts` and select by locale.
