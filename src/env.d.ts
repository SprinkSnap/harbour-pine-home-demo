/// <reference types="astro/client" />
/// <reference path="../worker-configuration.d.ts" />

interface ImportMetaEnv {
  readonly DEMO_MODE?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CASE_STUDY_URL?: string;
  readonly PUBLIC_PACKAGES_URL?: string;
  readonly PUBLIC_STUDIO_URL?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
