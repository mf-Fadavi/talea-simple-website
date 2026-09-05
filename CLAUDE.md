@AGENTS.md

# Talea website (simple-website)

This file is the context for THIS project only. Do not bring in knowledge,
conventions or files from other Talea projects (backend, office-software,
brochure, ResearcherOS, the parent `talea-simple-website-V2` folder). Always
start Claude Code from this folder (`simple-website`), never from a parent
folder: memory and session history are keyed to the launch directory.

Marketing site for Talea. Next.js 16 App Router, TypeScript, static export,
deployed to GitHub Pages from `main` by `.github/workflows/deploy-pages.yml`.
Remote: https://github.com/mf-Fadavi/talea-simple-website

## Project layout

- `app/[lang]/` routes per locale: `page.tsx` (home), `contact/` (+ `quick/`,
  `smart/`), `faq/`, `services/`, `tools/`. Root `layout.tsx` sets `lang`/`dir`.
- `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/` metadata routes.
- `components/sections/*` home-page sections; `components/forms/*` lead forms;
  `components/integrations/*` third-party widgets; `header.tsx`, `footer.tsx`,
  `language-switcher.tsx`, `structured-data.tsx`.
- `lib/i18n/` locales `en` (default), `de`, `fa` (RTL). Dictionaries in
  `lib/i18n/dictionaries/{en,de,fa}.json`; keep all three in sync when adding
  copy. `lib/site.ts` site constants, `lib/services.ts` service catalogue.
- `deploy/` self-hosting notes (caddy, dify, posthog), not part of the build.
- `scripts/write-root-redirect.mjs` runs in `postbuild` with `out/.nojekyll`.

## Conventions

- Static export: no server components that need a runtime, no dynamic API
  routes; every `[lang]` page must be pre-renderable for all three locales.
- `next.config.ts`: `basePath`/`assetPrefix` are applied only when
  `GITHUB_PAGES=true` and no `NEXT_PUBLIC_SITE_URL` (custom domain). Do not
  hardcode `/talea-simple-website` in links; use root-relative paths.
- Read `node_modules/next/dist/docs/` before using a Next API (see AGENTS.md).
- Verify locally (`npm run lint`, `npm run build`) before anything is pushed
  to `main`; the Pages workflow deploys on every push.
- Dev server: another instance may already own port 3000. Check first and use
  `npx next dev -p <free port>` if needed; never kill a process you did not
  start.
