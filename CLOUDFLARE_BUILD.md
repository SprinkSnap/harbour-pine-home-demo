# Cloudflare Workers Builds

## Required dashboard setting

**Build command must be exactly:**

```bash
npm run deploy
```

## Why the last build failed

The dashboard build command was:

```bash
npm run build && wrangler deplo
```

That fails for two reasons:

1. `wrangler` is not on the CI PATH (it is a local `node_modules` binary)
2. `deplo` is a truncated typo of `deploy`

## Correct flow

`npm run deploy` runs:

1. `astro build`
2. `npx wrangler deploy`
3. `npx wrangler d1 migrations apply DB --remote`

## SESSION KV

Astro’s Cloudflare adapter expects a `SESSION` KV binding. The first successful provisioning created:

- title: `harbour-pine-home-demo-session`
- id: `af67741f41f74c04a9f2f13a9b073a71`

That id is pinned in `wrangler.jsonc`. Without it, later CI deploys try to create the same title again and fail with Cloudflare API `10014`.

## D1

`harbour-pine-leads` is left without `database_id` so the first successful deploy can auto-provision it. After that succeeds, you may optionally paste the provisioned UUID into `wrangler.jsonc`.
