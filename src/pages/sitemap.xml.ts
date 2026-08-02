import type { APIRoute } from 'astro';
import { collections } from '../data/collections';
import { journalPosts } from '../data/journal';
import { products } from '../data/products';
import { siteConfig } from '../data/site';

/** Indexable content routes only — exclude cart, checkout, wishlist, and search utilities. */
const staticRoutes = [
  '/',
  '/shop/',
  '/collections/',
  '/about/',
  '/journal/',
  '/shipping/',
  '/returns/',
  '/contact/',
  '/accessibility/',
  '/privacy/',
  '/terms/',
];

export const GET: APIRoute = () => {
  const site = siteConfig.demoDomain;
  const urls = [
    ...staticRoutes,
    ...collections.map((collection) => `/collections/${collection.slug}/`),
    ...products.map((product) => `/products/${product.slug}/`),
    ...journalPosts.map((post) => `/journal/${post.slug}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${site}${path}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
