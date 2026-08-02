# Launch Checklist — Harbour & Pine Home Demo

## Before any deploy

- [ ] `DEMO_MODE=true` confirmed for the fictional portfolio
- [ ] No real credentials committed
- [ ] `.dev.vars` excluded from git
- [ ] D1 auto-provisioned on first deploy (or real `database_id` written back into `wrangler.jsonc`)
- [ ] Remote D1 migrations applied (`npm run db:remote` / deploy script)
- [ ] Turnstile site/secret keys configured
- [ ] `ALLOWED_ORIGINS` matches staging/production hosts
- [ ] `PUBLIC_SITE_URL` matches the intended host
- [ ] Asset licenses reviewed (`ASSET_LICENSES.md`)
- [ ] Case-study copy reviewed (`CASE_STUDY_COPY.md`)

## Quality gates

- [ ] `npm run test` passes
- [ ] `npm run check` passes
- [ ] `npm run build` passes
- [ ] `npm run cf:dry-run` passes
- [ ] Playwright storefront smoke passes
- [ ] Accessibility smoke passes on key routes
- [ ] Manual keyboard pass: nav, filters, variants, drawers, checkout
- [ ] Mobile pass at 360 / 390 / 768
- [ ] Desktop pass at 1024 / 1440
- [ ] Confirm no fake reviews, scarcity, awards, street address or phone number
- [ ] Confirm checkout values are not transmitted
- [ ] Confirm lead form is the only genuine capture path

## Staging

- [ ] Deploy to `harbour-pine-home-demo-staging` only with authorization
- [ ] Apply D1 migrations remotely
- [ ] Submit a test lead with Turnstile
- [ ] Verify rate-limit and invalid-origin failures
- [ ] Verify `noindex, nofollow`
- [ ] Capture Lighthouse + page-weight notes

## Production

- [ ] Explicit deploy authorization received
- [ ] Custom domain attached
- [ ] HSTS/CSP headers verified
- [ ] robots.txt disallow confirmed while fictional
- [ ] Portfolio bar + disclosure visible
- [ ] Case study published on chexustudio.com
- [ ] Monitoring/observability enabled

## Do not launch if

- [ ] Live Stripe keys are present
- [ ] Fictional structured product offers would be indexed
- [ ] Sample policies could be mistaken for legal counsel
- [ ] Secrets appear in client bundles
