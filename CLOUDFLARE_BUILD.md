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
