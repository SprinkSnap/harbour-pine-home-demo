# Harbour & Pine Home

Fictional Canadian home and lifestyle e-commerce demonstration by **Che Xu Studio**.

- Public demo intent: `https://harbourandpinehome.chexustudio.com`
- Case study: `https://chexustudio.com/work/`
- Workers: `harbour-pine-home-demo` / `harbour-pine-home-demo-staging`
- Locale: `en-CA` · Currency: CAD
- `DEMO_MODE=true` by default (`noindex, nofollow`)

Harbour & Pine Home does **not** accept real orders or process live payments. Genuine business enquiries go to Che Xu Studio through `/api/portfolio-lead/`.

## Architecture

- **Astro 7** static storefront + Cloudflare Workers adapter
- **React islands** for cart, wishlist, filters, checkout demo, enquiry drawer, AI assistant
- **Tailwind CSS 4** design tokens
- **Typed catalogue** in `src/data/`
- **D1** for consented Che Xu Studio leads only
- **Turnstile + rate limiting + origin checks** on lead/chat APIs
- **Vitest** unit tests + **Playwright** e2e/a11y

```
src/
  data/           # products, collections, bundles, journal, site copy
  lib/            # money, filters, cart, seo, security, lead schema
  components/     # Astro + React islands
  layouts/        # BaseLayout
  pages/          # routes + api endpoints
migrations/       # D1 SQL
public/images/    # purpose-built SVG product/brand assets
```

## Local setup

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

Optional local D1:

```bash
npm run db:local
```

## Environment variables

See `.dev.vars.example`.

| Variable | Purpose |
| --- | --- |
| `DEMO_MODE` | `true` enables noindex, fictional disclosures, suppresses fake product schema |
| `PUBLIC_SITE_URL` | Canonical site origin |
| `PUBLIC_CASE_STUDY_URL` | Case study link |
| `PUBLIC_PACKAGES_URL` | Che Xu Studio packages link |
| `PUBLIC_STUDIO_URL` | Studio homepage |
| `ALLOWED_ORIGINS` | Comma-separated origins for API writes |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Turnstile secret (server only) |
| `STRIPE_SECRET_KEY` | Optional Stripe test mode only |
| `STRIPE_WEBHOOK_SECRET` | Optional Stripe webhook secret |

## DEMO_MODE

When `DEMO_MODE=true` (default):

- `noindex, nofollow`
- fictional-project disclosures
- no fabricated Product/Offer/merchant schema
- demo cart/checkout only (local persistence)
- genuine enquiries routed to Che Xu Studio

When `DEMO_MODE=false`:

- require verified merchant, product, stock, policy and checkout configuration before indexing
- enable accurate structured data only after validation
- remove fictional disclosures

## Cloudflare setup

1. Create Workers project names:
   - production: `harbour-pine-home-demo`
   - staging: `harbour-pine-home-demo-staging`
2. First deploy auto-provisions D1 `harbour-pine-leads` (no placeholder `database_id` required)
3. `npm run deploy` applies D1 migrations remotely after deploy
4. Configure Turnstile keys as secrets/vars
5. Bind custom domain `harbourandpinehome.chexustudio.com` only with owner authorization
6. Optional: bind Workers AI for the assistant endpoint

## D1 migrations

SQL lives in `migrations/`. The Wrangler config intentionally omits `database_id` so Cloudflare can **auto-provision** the `harbour-pine-leads` D1 database on first deploy (the previous placeholder UUID caused deploy failures).

Local:

```bash
npm run db:local
```

Remote (authorized environments only):

```bash
npm run db:remote
```

`npm run deploy` applies remote migrations after `wrangler deploy`. If CI write-back does not persist the provisioned UUID into `wrangler.jsonc`, remote commands resolve the database by `database_name`.

## Turnstile

- Client renders widget when `PUBLIC_TURNSTILE_SITE_KEY` is set
- Server verifies tokens in `/api/portfolio-lead/`
- Local development accepts `dev-bypass` when secret is unset

## Rate limiting

In-memory limiter protects lead and chat endpoints in the Worker isolate. For multi-isolate production hardening, add Cloudflare Rate Limiting rules in the dashboard.

## Image workflow

- Purpose-built SVG assets in `public/images/`
- Regeneratable via `node scripts/generate-svgs.mjs`
- Explicit width/height, reserved aspect ratios, lazy-loading below the fold
- See `ASSET_LICENSES.md`

Cloudflare Images can be introduced later by swapping image URLs; the markup already uses responsive-friendly dimensions.

## Stripe test mode

Not enabled by default. If configured later:

- test keys only
- server-side Checkout Sessions
- server-side product/price allowlists
- webhook signature verification
- never trust client prices
- never create live charges

## Workers AI

`/api/chat/` uses deterministic catalogue answers first. If an `AI` binding exists, it may call Workers AI with strict demo guardrails. Transcripts are not stored by default.

## Editing products and collections

1. Update `src/data/products.ts` and `src/data/collections.ts`
2. Keep `relatedProductIds` valid
3. Add/replace images under `public/images/`
4. Run unit tests and rebuild

## Testing

```bash
npm run test
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:a11y
```

## Build and deployment

```bash
npm run build
npm run cf:dry-run
```

### Cloudflare Workers Builds settings

In the Cloudflare dashboard for this Worker, set:

| Setting | Value |
| --- | --- |
| **Build command** | `npm run deploy` |
| **Deploy command** | leave empty / unused |
| **Root directory** | `/` (repo root) |

Do **not** use a raw shell command like `npm run build && wrangler deploy`.

- Wrangler is a local npm dependency, so PATH lookups for bare `wrangler` fail in CI
- The repo script uses `npx wrangler` and also applies D1 migrations

```bash
npm run deploy          # production worker: harbour-pine-home-demo
npm run deploy:staging  # staging worker: harbour-pine-home-demo-staging
```

Do **not** deploy from a local machine without explicit authorization. CI deploy requires Cloudflare account credentials configured in the Workers project.

## Custom domain

Owner actions only:

1. Attach `harbourandpinehome.chexustudio.com` to the production Worker
2. Verify TLS
3. Confirm `PUBLIC_SITE_URL` and `ALLOWED_ORIGINS`
4. Keep `DEMO_MODE=true` while the project remains fictional

## Case-study publishing

Finished copy lives in `CASE_STUDY_COPY.md` for publishing to `https://chexustudio.com/work/`.

## Converting the demo for a verified real merchant

1. Set `DEMO_MODE=false` only after verification
2. Replace fictional catalogue with approved product data and identifiers
3. Connect inventory, fulfilment and checkout integrations
4. Replace sample policies with counsel-approved terms
5. Remove fictional disclosures and portfolio bar
6. Enable indexing and accurate structured data
7. Retest accessibility, performance, payments and SEO

## Owner review required

- Final Turnstile keys
- D1 database id
- Staging/production Worker secrets
- Domain DNS
- Case-study screenshots/performance numbers after deploy
- Optional Stripe test credentials
- Optional Workers AI binding
