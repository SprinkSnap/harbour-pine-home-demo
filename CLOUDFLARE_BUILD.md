# Cloudflare Workers Builds

## Required dashboard settings

In **Workers & Pages → `harbour-pine-home-demo` → Settings → Builds**:

| Setting | Value |
| --- | --- |
| **Repository** | `SprinkSnap/harbour-pine-home-demo` |
| **Production branch** | `main` |
| **Root directory** | `/` |
| **Build command** | `npm run deploy` |
| **Deploy command** | leave **empty** |

Do **not** use `npm run build && wrangler deploy` or `wrangler deplo`.

- Wrangler is a local npm dependency (`npx wrangler`), not a global CI binary
- `npm run deploy` already builds, deploys, and applies D1 migrations

## Trigger a new production build

### Option A — Retry / manual deploy (fastest)

1. Cloudflare dashboard → **Workers & Pages** → **`harbour-pine-home-demo`**
2. Open the **Deployments** tab
3. Scroll to **View build history** (or **Builds**)
4. Choose one:
   - **Retry** the latest `main` build, or
   - **Create deployment** / **Deploy** → branch **`main`** → confirm
5. Open the build log and wait until it finishes **Success**
6. Confirm the new version is the **Active** deployment (not only a preview version)

### Option B — Push to `main`

If Builds is connected and automatic deployments are enabled, any push/merge to `main` starts a build. Merging a PR is enough; no extra dashboard click is required **only when** the Git integration is healthy.

### Option C — GitHub Action (optional)

This repo can deploy via `.github/workflows/deploy.yml` when these GitHub Actions secrets exist:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Then: **Actions → Deploy Cloudflare Worker → Run workflow**.

## Verify the Cedar Cove Throw image after deploy

These must succeed:

```text
https://harbourandpinehome.chexustudio.com/images/products/cedar-cove-throw.jpg
```

- Expect **HTTP 200** and `content-type: image/jpeg`
- Hard-refresh the product page (or open the JPG URL directly)

If the JPG is **404** and the old SVG still loads, production is still on a pre-merge Worker build.

## “Nothing is updating” checklist

1. **Builds connected?**  
   Worker → **Settings → Builds** shows the GitHub repo. If not, click **Connect** and select `SprinkSnap/harbour-pine-home-demo`.
2. **Build command exact?**  
   Must be `npm run deploy`. Deploy command must be empty.
3. **Build failing?**  
   Open the latest build log. Common failures:
   - bare `wrangler` not found → use `npm run deploy`
   - truncated `wrangler deplo` typo
   - SESSION KV API `10014` → keep the pinned KV id in `wrangler.jsonc`
4. **Build succeeded but site unchanged?**  
   Under **Deployments / Version History**, promote/activate the new version. A successful build that only runs `wrangler versions upload` will **not** update the live site.
5. **Cache?**  
   Product images use `max-age=0, must-revalidate`, but a missing JPG (404) means the Worker assets bundle itself is old — retrying the browser will not help until a real deploy finishes.

## Correct deploy flow

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
