# PT Ahli Maju

Company profile website in Bahasa Indonesia. Astro 7 static output, Tailwind CSS 4 through the official Vite plugin, strict TypeScript 6, and selectively generated shadcn/ui controls. Manrope and DM Sans are self-hosted with `font-display: swap`. Native DOM scripts provide navigation and filtering; there are no hydrated React islands or animation libraries.

## Development

Node >=22.12.0, pnpm 12.6.0. The lockfile is committed. `pnpm-workspace.yaml` uses `nodeLinker: hoisted` for reliable Windows/Vite package resolution.

```sh
pnpm install --frozen-lockfile
pnpm dev --background
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
```

## Validation and preview

```sh
pnpm format:check
pnpm check
pnpm lint
pnpm build
pnpm test
pnpm preview --host 127.0.0.1
```

`pnpm test` runs Playwright with installed Google Chrome by default and serves the production output. Use `PLAYWRIGHT_CHANNEL=msedge` for installed Edge. To use bundled Chromium, install it with `pnpm exec playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`. Tests cover desktop 1440px, tablet 768px and mobile 375px, all routes, axe WCAG AA, keyboard navigation, menu focus, filters, empty/reset states, form validation without delivery, no-JavaScript behavior, reduced motion and cookie storage failure. Run build before tests.

## Architecture

- `src/layouts/SiteLayout.astro`: shell, SEO, canonicals, JSON-LD, header/menu, footer.
- `src/styles/global.css`: semantic sandstone/red/maroon tokens, responsive editorial grid and reduced-motion behavior.
- `src/styles/experience.css`: immersive dark homepage, transparent/sticky header, rounded chapters and native page transitions.
- `src/styles/interior.css`: distinct layouts for company, operations, ESG, careers, collections, article/project details, contact, policies and 404. Shared oversized typography, dark surfaces, pill controls and responsive entrance transitions.
- `src/pages/index.astro`: headline rotation with pause/resume, keyboard-operated perspective selection and expanding lifecycle panels. Motion stops when the hero leaves the viewport, the tab is hidden, or reduced motion is requested. All perspective content remains readable without JavaScript.
- `src/components/ui/`: CLI-generated shadcn controls kept recognizable. React controls are rendered statically by Astro; browser validation uses a small native script.
- `src/components/sections/`: photographic/editorial page introductions, sticky chapter navigation and contact CTA. Article details also include a heading-based table of contents.
- `src/components/CollectionGrid.astro`: progressively enhanced news search and project category filters.
- `src/components/Media.astro`: replaceable stock image slots through Astro Picture with local AVIF/WebP generation.
- `src/content.config.ts`, `src/content/`: validated news/project collections. Drafts never receive public routes.
- `src/data/site.ts`, `src/lib/content.ts`: structured non-editorial data, common queries/date/reading-time logic.
- `docs/CONTENT-HANDOFF.md`: replacement inventory, photo sources/licenses, safe form integration and deployment boundary.

Routes: `/`, `/tentang-kami`, `/operasi`, `/keberlanjutan`, `/proyek`, `/proyek/[slug]`, `/berita`, `/berita/[slug]`, `/karier`, `/kontak`, `/privasi`, `/cookie`, and custom `/404`.

## Before launch

Read [the content and integration handoff](docs/CONTENT-HANDOFF.md). Company contact data, approved policies, legal text, operational facts, portraits, reports, actual projects and hiring links have not been provided. Their slots are clearly labeled, with no invented certifications, clients, locations or achievements. The contact form only checks format; it never sends or stores messages. Analytics is not installed.

Set `PUBLIC_SITE_URL` to the approved domain in the build environment when the content is approved. Until then, `example.invalid` yields `noindex,nofollow` and robots disallow. The output directory is `dist/`; no hosting account or deployment is configured. Secrets belong only in server-side hosting configuration. `.env.example` contains the public domain setting only.

Documentation consulted: [Astro installation](https://docs.astro.build/en/install-and-setup/), [Content Collections](https://docs.astro.build/en/guides/content-collections/), [Tailwind's Astro guide](https://tailwindcss.com/docs/installation/framework-guides/astro), [shadcn Astro installation](https://ui.shadcn.com/docs/installation/astro), [Lucide Astro](https://lucide.dev/guide/astro), and the official docs for integrations/tooling. TypeScript 6 is selected because the stable Astro checker and TypeScript ESLint do not support TypeScript 7 yet.
