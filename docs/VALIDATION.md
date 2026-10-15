# Validation

Validated locally on Windows with Node 22.17.1, pnpm 12.6.0 and installed Google Chrome. These are local checks, not a guarantee of production hosting performance or a full accessibility certification.

## Completed gates

- `pnpm exec prettier --write .` and `pnpm format:check`: passed.
- `pnpm check`: 37 files, zero errors, warnings or hints.
- `pnpm lint`: passed.
- `pnpm build`: 17 static pages, sitemap, robots and local AVIF/WebP assets generated.
- All 30 browser scenarios passed across 1440px desktop, 768px tablet and 375px mobile: 29 passed in the full run, and the tablet route audit passed on rerun after correcting the ESG panel layout. Each route audit covers all 17 pages, including every news/project detail and the custom 404. Run build to completion before starting browser tests.
- `node scripts/visual-review.mjs`: final screenshots and local performance observations in ignored `artifacts/`.

The browser suite checks every generated page, one H1, landmarks through axe, canonical metadata, no horizontal document overflow, WCAG A/AA rules including contrast, no page/console errors, no hydrated islands, category filtering, news search, empty/reset states, sticky chapter navigation, article table-of-contents links, form errors and no submission, keyboard skip link, mobile focus wrapping/Escape/return focus, reading/navigation without JavaScript, reduced motion and consent preference storage failure. Draft exclusion is implemented centrally. Tests use an existing local browser.

Visual captures cover the home page and every secondary-page composition at desktop/tablet/mobile widths: company, operations, ESG, projects and project detail, news and article detail, careers, contact, privacy, cookie settings and 404. Photo slots, forms and typography retain their layout. The mobile ESG table scrolls within its own labeled, focusable region. Navigation fallback is inside `noscript` to avoid a layout shift on script-enabled tablet screens.

The same reference now guides all pages through oversized typography, dark curved surfaces, pill controls, sticky navigation and entrance transitions. Layouts follow their content: photographic company/operations/career introductions, an ESG focus dashboard, staggered project cards, featured news, a reading rail beside article content, project facts and galleries, a contrasting contact form, compact policy/settings layouts and a dedicated 404. Related article cards retain their full titles and descriptions. Motion respects reduced-motion preferences.

The redesigned homepage follows the supplied [Shopify Indonesia](https://www.shopify.com/id) layout reference: full-screen photography, overlaid navigation, dark rounded chapters, oversized typography, perspective crossfades, expanding lifecycle panels and an oversized closing CTA. Company branding and content remain Ahli Maju. Native Web Animations provide a pausable headline with 450ms exit/entrance transitions. Perspective selection supports arrow keys, Home and End, hides inactive links from focus, and retains all content without JavaScript. Reduced motion disables automatic rotation and entrance effects. Cross-document view transitions progressively enhance supported browsers; ordinary links work elsewhere.

## Local performance basics

Navigation alignment follow-up: build and lint passed, and 12 focused browser scenarios passed across desktop, tablet and mobile. These include all 17-page audits, navbar geometry before/after navigation and scrolling, chapter links and keyboard menu behavior. Additional checks at 1920px, 1200px and 1080px confirmed identical header, logo and menu bounds. The header now shares a 78px height and container width across pages; a dedicated view-transition layer keeps it stationary while page content animates, and a stable scrollbar gutter prevents width changes on short pages.

| Viewport | Document overflow | Observed CLS | Hydrated islands |
| -------- | ----------------- | ------------ | ---------------- |
| 1440px   | None              | 0.0007       | 0                |
| 768px    | None              | 0.0010       | 0                |
| 375px    | None              | 0.0012       | 0                |

Numbers are from one local browser observation per viewport, without production network throttling. See `artifacts/performance-basics.json` for resource and image observations. Fonts are local with swap; the hero is prioritized; other images are lazy with intrinsic dimensions and responsive source sizes. React's integration may emit a renderer asset into `dist`, but pages do not hydrate or request the React runtime. No analytics, remote fonts, map embeds or animation libraries are loaded.

## Required before official launch

Approved public domain, company facts, contact details, legal documents, brand/portrait/operation photo permissions, actual projects, ESG values/PDFs and real recruitment channels remain pending. The form backend and analytics provider are intentionally unconfigured. See [CONTENT-HANDOFF.md](CONTENT-HANDOFF.md) for the precise integration boundary and replacement inventory. Without the approved domain, robots disallows crawling and pages carry noindex.
