import type { APIRoute } from 'astro';
import { siteConfig } from '../data/site';
import { isDemoMode } from '../lib/demo-mode';
import { buildRobotsTxt } from '../lib/seo';

export const GET: APIRoute = () => {
  const demoMode = isDemoMode(import.meta.env.DEMO_MODE ?? 'true');
  // Prefer the public demo domain so portfolio crawlers see a stable Sitemap URL.
  const siteUrl = siteConfig.demoDomain;
  const body = buildRobotsTxt(demoMode, siteUrl);

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
