import type { Collection, Product } from '../data/types';
import { siteConfig } from '../data/site';
import { getDemoRobots, isDemoMode } from './demo-mode';

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
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

export function brandLogoUrl(siteUrl: string = siteConfig.demoDomain): string {
  return absoluteUrl(siteConfig.logoMarkPath, siteUrl);
}

export function websiteJsonLd(siteUrl: string = siteConfig.demoDomain) {
  const logo = brandLogoUrl(siteUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteUrl,
    inLanguage: siteConfig.locale,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: logo,
        width: 512,
        height: 512,
        caption: siteConfig.name,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationJsonLd(siteUrl: string = siteConfig.demoDomain) {
  const logo = brandLogoUrl(siteUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    alternateName: [siteConfig.shortName, 'Harbour and Pine Home'],
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: 512,
      height: 512,
      caption: `${siteConfig.name} logo`,
    },
    image: logo,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    slogan: siteConfig.tagline,
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

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function productJsonLd(product: Product, siteUrl: string = siteConfig.demoDomain) {
  const image = product.images.map((item) => absoluteUrl(item.src, siteUrl));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription || product.shortDescription,
    image,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${product.slug}/`, siteUrl),
      priceCurrency: siteConfig.currency,
      price: product.price.toFixed(2),
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function collectionJsonLd(
  collection: Collection,
  itemCount: number,
  siteUrl: string = siteConfig.demoDomain,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.seoDescription || collection.description,
    url: absoluteUrl(`/collections/${collection.slug}/`, siteUrl),
    numberOfItems: itemCount,
  };
}

export function buildRobotsTxt(demoMode: boolean, siteUrl: string = siteConfig.demoDomain): string {
  const sitemap = `${siteUrl.replace(/\/$/, '')}/sitemap.xml`;
  if (demoMode) {
    return `User-agent: *\nDisallow: /\n\nSitemap: ${sitemap}\n`;
  }
  return `User-agent: *\nAllow: /\nDisallow: /cart/\nDisallow: /checkout/\nDisallow: /wishlist/\nDisallow: /search/\nDisallow: /api/\n\nSitemap: ${sitemap}\n`;
}
