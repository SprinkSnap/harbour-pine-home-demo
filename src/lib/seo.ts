import { siteConfig } from '../data/site';
import { getDemoRobots, isDemoMode } from './demo-mode';

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

export function absoluteUrl(path: string, siteUrl: string = siteConfig.demoDomain): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withSlash = normalized.endsWith('/') || normalized.includes('.') ? normalized : `${normalized}/`;
  return new URL(withSlash, siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`).toString();
}

export function buildTitle(pageTitle: string): string {
  if (pageTitle.includes(siteConfig.name)) return pageTitle;
  return `${pageTitle} | ${siteConfig.name}`;
}

export function resolveRobots(demoMode = isDemoMode(import.meta.env.DEMO_MODE), forceNoindex = false): string {
  if (forceNoindex || demoMode) return getDemoRobots();
  return 'index, follow';
}

export function websiteJsonLd(siteUrl: string = siteConfig.demoDomain) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteUrl,
    inLanguage: siteConfig.locale,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  siteUrl: string = siteConfig.demoDomain,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl),
    })),
  };
}
