# Harbour & Pine — Recommended Desktop Screenshots

Captured at **1440×900** (device scale 2) against the local demo storefront.

These match the case-study recommendations in `CASE_STUDY_COPY.md` plus supporting desktop frames.

Portfolio chrome is dismissed and the assistant FAB is hidden so the storefront composition reads clearly for publishing. The fictional-project disclosure remains visible.

| # | File | Subject | Why it matters |
| --- | --- | --- | --- |
| 1 | `01-homepage-hero.png` | Homepage hero | Brand-first first viewport with Harbour & Pine identity, headline, CTA group, and full-bleed hero imagery at desktop width. |
| 2 | `02-shop-browse.png` | Shop browse | Desktop catalogue with sidebar filters and multi-column product discovery. |
| 3 | `03-collection-filters.png` | Collection filters | Living collection with persistent desktop filter sidebar, result count, and product grid. |
| 4 | `04-product-variants.png` | Product page variants | Two-column product detail with gallery, price, colour variants, and add-to-demo-cart CTA. |
| 5 | `05-cart-drawer.png` | Demo cart drawer | Right-side demo cart with line items, totals, and continue-to-checkout — clearly marked as demo-only. |
| 6 | `06-checkout-complete.png` | Checkout completion + studio CTA | Demo checkout complete state with Che Xu Studio primary CTA — the conversion handoff from fiction to real enquiry. |
| 7 | `07-search-results.png` | Search results | Shareable search URL with sidebar filters and multi-column product results. |

## Regenerate

```bash
npm run build
npx wrangler dev --ip 127.0.0.1 --port 4321
# in another terminal:
npm run screenshots:desktop
```

Or with an already-running server:

```bash
BASE_URL=http://127.0.0.1:4321 npm run screenshots:desktop
```
