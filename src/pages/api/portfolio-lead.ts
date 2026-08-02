import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { nanoid } from 'nanoid';
import { siteConfig } from '../../data/site';
import { ALLOWED_LEAD_FIELDS, portfolioLeadSchema, redactLeadForLogs } from '../../lib/lead-schema';
import {
  MAX_JSON_BYTES,
  isAllowedOrigin,
  leadRateLimiter,
  parseAllowedOrigins,
  verifyTurnstile,
} from '../../lib/security';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const origin = request.headers.get('origin');
    if (!isAllowedOrigin(origin, allowedOrigins)) {
      return jsonError(403, 'Request not allowed.');
    }

    if (request.headers.get('content-type')?.includes('application/json') !== true) {
      return jsonError(415, 'Unsupported content type.');
    }

    const raw = await request.text();
    if (raw.length > MAX_JSON_BYTES) {
      return jsonError(413, 'Request too large.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return jsonError(400, 'Invalid request.');
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return jsonError(400, 'Invalid request.');
    }

    const payload = parsed as Record<string, unknown>;
    for (const key of Object.keys(payload)) {
      if (!ALLOWED_LEAD_FIELDS.includes(key as (typeof ALLOWED_LEAD_FIELDS)[number])) {
        return jsonError(400, 'Invalid request.');
      }
    }

    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const rate = leadRateLimiter.check(ip);
    if (!rate.allowed) {
      return jsonError(429, 'Please try again shortly.');
    }

    const result = portfolioLeadSchema.safeParse(payload);
    if (!result.success) {
      return jsonError(400, 'Invalid request.');
    }

    const data = result.data;
    if (data.website) {
      return jsonOk();
    }

    const turnstileOk = await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY ?? '', ip);
    if (!turnstileOk) {
      return jsonError(400, 'Verification failed.');
    }

    const db = env.DB;
    if (!db) {
      console.info('portfolio-lead accepted (no DB binding)', redactLeadForLogs(data));
      return jsonOk();
    }

    const id = nanoid();
    const createdAt = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO portfolio_leads (
          id, name, email, business_name, business_type, existing_website,
          product_count, primary_goal, needed_features, launch_timing,
          message, consent, source_demo, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        data.name,
        data.email,
        data.businessName || null,
        data.businessType,
        data.existingWebsite || null,
        data.productCount,
        data.primaryGoal,
        JSON.stringify(data.neededFeatures),
        data.launchTiming,
        data.message || null,
        1,
        siteConfig.sourceDemo,
        createdAt,
      )
      .run();

    return jsonOk();
  } catch (error) {
    console.error('portfolio-lead error', error instanceof Error ? error.message : 'unknown');
    return jsonError(500, 'Unable to submit right now.');
  }
};

export const GET: APIRoute = async () => jsonError(405, 'Method not allowed.');

function jsonOk() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function jsonError(status: number, message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
