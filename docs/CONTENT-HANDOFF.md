# Content and launch handoff

This is a complete static implementation and a reviewable company-profile draft. Publishing the company information requires approved source material. Example projects and articles are explicitly labeled; these are not company accomplishments. Replace draft principles and profile copy with approved language before public launch.

## Material required

| Area            | Required source                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| Company profile | Approved company description, founding date, milestones, vision, mission, governance policies                     |
| Brand           | Approved logo; current wordmark and favicon are replaceable typographic concepts                                  |
| Contact         | Official email, phone, office address, coordinates, office hours, responsible contact person                      |
| Leadership      | Approved names, titles, biographies, portraits, and publication permission                                        |
| Operations      | Verified commodities, permitted locations, operating scope, licenses if publishable, asset list                   |
| Projects        | Approved project names, client publication permission, location, dates, scope, outcome evidence, gallery captions |
| ESG             | Reporting period, indicator scope/methodology, verified values, data owner, review status, real PDF reports       |
| Careers         | Real vacancies, locations, application URLs, HR contact and privacy requirements                                  |
| Privacy/cookies | Counsel-approved text covering actual hosting, form processor, analytics, retention, visitor rights and contact   |
| Production      | Approved canonical HTTPS domain and chosen hosting provider                                                       |

## Photography

Two real stock photographs are used only as industry references. Every figure has an explicit visible reference caption and truthful alt text. Neither is presented as PT Ahli Maju's operation.

- `src/assets/quarry.jpg`: Enrique, [Excavator in Mine / Pexels 15138925](https://www.pexels.com/photo/excavator-in-mine-15138925/). Downloaded at 1920px.
- `src/assets/operations.jpg`: Piotr Arnoldes, [Excavator near industrial machines in quarry / Pexels 6109677](https://www.pexels.com/photo/excavator-near-industrial-machines-in-quarry-6109677/). Downloaded at 1400px.
- Source license: [Pexels License](https://www.pexels.com/license/). Do not imply photographer, depicted company, or location endorsement.

Replace these centrally in `Media.astro`. Obtain company-approved images with photographer rights and permission from depicted people. Request landscape source images at least 1920px wide, accurate location/date captions, and confirmation of what may be published. Do not use generated imagery as operational evidence. Astro produces local AVIF/WebP variants, intrinsic dimensions, responsive widths and lazy loading below the fold.

## Content editing

News and projects live in `src/content/news` and `src/content/projects`. Validation is in `src/content.config.ts`; fetching and draft exclusion are centralized in `src/lib/content.ts`. Set `draft: true` to remove an entry from listing, detail generation and sitemap. Example date fields are for demonstrating the layout, not company news publication history. News reading time is computed from the body. Project facts are intentionally blank until the schema is extended with approved data.

`src/data/site.ts` contains navigation, non-editorial principles, metric definitions and vacancies. Do not activate placeholder contact links. Put approved reports into `public/reports/` and replace disabled report buttons with anchors using `download`, clear PDF names, sizes and dates.

## Safe form integration boundary

The current form has no receiving endpoint. Its control says “Cek pesan · belum dapat dikirim”. Validation success means only that the format passes; it explicitly states that nothing was sent. No contact fields are stored in localStorage. The hidden honeypot is a scaffold, not a security guarantee.

Before enabling actual delivery:

1. Select an approved form processor or server endpoint and configure credentials only in server/hosting secrets. Add documented environment variable names to `.env.example`; never place a private key in `PUBLIC_*`.
2. Validate the allowed topic, normalized name/email and message lengths again at the server trust boundary. Enforce content type and total request size. Reject honeypot submissions server-side.
3. Rate-limit by privacy-conscious request identifiers, add abuse monitoring and safe timeouts. For authenticated or cookie-based endpoints use CSRF tokens; verify origin where applicable.
4. Escape input in notifications. Prevent header injection, avoid rendering submitted HTML, and document processor retention/access rules.
5. Show loading while pending, success only after confirmed acceptance by the service, and accessible recoverable failure UI while preserving entered text. Never log message contents or sensitive personal data unnecessarily.
6. Add integration tests for rejection, rate limits, timeout, network failure and real success. Approve privacy wording and consent requirements before collecting data.

## Analytics and hosting

There is no analytics SDK, provider ID, tracking cookie, map embed or remote font request. Cookie settings store a versioned, expiring preference in localStorage with graceful storage-denial handling. An unchecked/expired preference means no analytics. Future scripts may load only after explicit current consent; revocation must stop tracking and clear provider identifiers where supported. Store the provider ID only after the provider and policy are approved; no analytics environment variable is needed today.

Set `PUBLIC_SITE_URL` to the approved absolute HTTPS domain in the build environment. The fallback `https://example.invalid` deliberately adds `noindex,nofollow` and disallows crawling in robots. Canonicals, social URLs, JSON-LD and sitemap derive from that setting. Do not deploy the draft as an official company profile without replacing placeholders.

Serve `dist/` on the chosen static host with HTTPS, a custom 404, appropriate cache headers for hashed assets and security headers (at least `X-Content-Type-Options: nosniff`, suitable Referrer-Policy, frame restrictions and a CSP reviewed against the actual built output). There is no server-side submission code to secure yet. Hosting request logs need to be reflected in the final privacy policy.
