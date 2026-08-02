/* Generated-style Cloudflare Env typing for local development.
 * Regenerate with: npm run generate-types
 */

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface Env {
  DEMO_MODE?: string;
  PUBLIC_SITE_URL?: string;
  PUBLIC_CASE_STUDY_URL?: string;
  PUBLIC_PACKAGES_URL?: string;
  PUBLIC_STUDIO_URL?: string;
  PUBLIC_TURNSTILE_SITE_KEY?: string;
  ALLOWED_ORIGINS?: string;
  TURNSTILE_SECRET_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  AI?: Ai;
  DB?: D1Database;
  ASSETS?: { fetch: typeof fetch };
  SESSION?: unknown;
}

declare namespace Cloudflare {
  interface Env {}
}

declare module 'cloudflare:workers' {
  export const env: Env;
}
