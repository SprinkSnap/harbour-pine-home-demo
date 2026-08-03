# Harbour & Pine — Recommended Mobile Screenshots

Captured at **390×844** (device scale 2) against the local demo storefront.

These match the case-study recommendations in `CASE_STUDY_COPY.md` plus supporting mobile frames.

Portfolio chrome is dismissed and the assistant FAB is hidden so the storefront composition reads clearly for publishing. The fictional-project disclosure remains visible.

| # | File | Subject | Why it matters |
| --- | --- | --- | --- |
| 1 | `01-homepage-hero.png` | Homepage hero | Brand-first first viewport with Harbour & Pine identity, headline, CTA group, and full-bleed hero imagery. |
| 2 | `02-mobile-navigation.png` | Mobile navigation | Full-height accessible menu with shop links and clear close affordance. |
| 3 | `03-collection-browse.png` | Collection browse | Living collection with product cards, filters entry point, and calm mobile spacing. |
| 4 | `04-collection-filters.png` | Collection filters | Bottom-sheet filter & sort controls for search, category, colour, price, availability, and sort. |
| 5 | `05-product-variants.png` | Product page variants | Product detail with image, price, colour variants, materials cues, and sticky add-to-demo-cart CTA. |
| 6 | `06-cart-drawer.png` | Demo cart drawer | Persistent demo cart with line items, totals, and continue-to-checkout path — clearly marked as demo-only. |
| 7 | `07-checkout-complete.png` | Checkout completion + studio CTA | Demo checkout complete state with Che Xu Studio primary CTA — the conversion handoff from fiction to real enquiry. |
| 8 | `08-search-results.png` | Search results | Shareable search URL with result summary and product discovery on a small screen. |

## Regenerate

```bash
npm run build
npx wrangler dev --ip 127.0.0.1 --port 4321
# in another terminal:
npm run screenshots:mobile
```

Or with an already-running server:

```bash
BASE_URL=http://127.0.0.1:4321 npm run screenshots:mobile
```
