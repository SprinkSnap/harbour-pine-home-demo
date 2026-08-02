import { defineMiddleware } from 'astro:middleware';
import { getDemoRobots, isDemoMode } from './lib/demo-mode';
import { securityHeaders } from './lib/security';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const headers = securityHeaders(import.meta.env.PROD);
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(headers)) {
    newHeaders.set(key, value);
  }

  if (isDemoMode(import.meta.env.DEMO_MODE ?? 'true')) {
    newHeaders.set('X-Robots-Tag', getDemoRobots());
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
});
