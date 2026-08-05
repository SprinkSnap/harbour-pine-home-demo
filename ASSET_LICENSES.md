# Asset Licenses

All storefront imagery in this repository is original visual work created for the Harbour & Pine Home portfolio demonstration.

## Covered assets

- `public/favicon.svg`
- `public/images/brand/hero.svg`
- `public/images/brand/og.svg`
- `public/images/collections/*.svg`
- `public/images/rooms/*.svg`
- `public/images/products/*.svg` (utility/placeholder SVG art only)
- `public/images/products/*.jpg` (curated lifestyle product photographs for the full catalogue)

## License

© Che Xu Studio. Created for the Harbour & Pine Home demonstration.

These assets may be used:

- in this repository and derived portfolio deployments by Che Xu Studio
- in Che Xu Studio case-study materials that reference this project

These assets may not be scraped, resold or presented as photography of real merchandise.

## Generation

Abstract SVG catalogue art can be regenerated with:

```bash
node scripts/generate-svgs.mjs
```

All catalogue product photographs (`public/images/products/*.jpg`) are curated square lifestyle frames and are intentionally excluded from that generator. Only `placeholder.svg` remains in the SVG product generator.

## Fonts

- [Fraunces](https://fonts.google.com/specimen/Fraunces) — SIL Open Font License
- [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) — SIL Open Font License

Loaded via Google Fonts with `preconnect` and `display=swap`.

## Third-party

No stock photography, scraped product images or hotlinked remote merchandise imagery are used.
