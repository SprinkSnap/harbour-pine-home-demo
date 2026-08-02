export const siteConfig = {
  name: 'Harbour & Pine Home',
  shortName: 'Harbour & Pine',
  tagline: 'Thoughtful pieces for everyday living.',
  locale: 'en-CA',
  currency: 'CAD',
  currencySymbol: '$',
  description:
    'Harbour & Pine Home is a fictional Canadian home and lifestyle storefront demonstration by Che Xu Studio.',
  demoDomain: 'https://harbourandpinehome.chexustudio.com',
  caseStudyUrl: 'https://chexustudio.com/work/harbour-pine-home',
  studioUrl: 'https://chexustudio.com',
  packagesUrl: 'https://chexustudio.com/packages',
  contactEmailDisplay: 'Use the enquiry form to reach Che Xu Studio',
  portfolioNotice:
    'Portfolio concept by Che Xu Studio. Harbour & Pine Home is a fictional e-commerce demonstration.',
  disclosure:
    'Interactive store demonstration—no real orders or payments.',
  sourceDemo: 'harbour-pine-home',
  /** Canonical brand assets for favicon, schema.org logo, and social previews. */
  logoMarkPath: '/images/brand/logo-mark.svg',
  appleTouchIconPath: '/images/brand/apple-touch-icon.svg',
  ogImagePath: '/images/brand/og.svg',
} as const;

export const navPrimary = [
  { href: '/shop/?filter=new', label: 'New and Featured' },
  { href: '/shop/', label: 'Shop' },
  { href: '/collections/', label: 'Collections' },
  { href: '/about/', label: 'Our Story' },
] as const;

export const mobileShopLinks = [
  { href: '/shop/', label: 'Shop All' },
  { href: '/collections/living/', label: 'Living' },
  { href: '/collections/kitchen-dining/', label: 'Kitchen & Dining' },
  { href: '/collections/textiles/', label: 'Textiles' },
  { href: '/collections/storage/', label: 'Storage' },
  { href: '/collections/workspace/', label: 'Workspace' },
  { href: '/collections/gifts/', label: 'Gifts' },
] as const;

export const footerLinks = {
  shop: [
    { href: '/shop/', label: 'Shop All' },
    { href: '/collections/', label: 'Collections' },
    { href: '/search/', label: 'Search' },
    { href: '/wishlist/', label: 'Wishlist' },
  ],
  help: [
    { href: '/shipping/', label: 'Shipping' },
    { href: '/returns/', label: 'Returns' },
    { href: '/contact/', label: 'Contact' },
    { href: '/accessibility/', label: 'Accessibility' },
  ],
  legal: [
    { href: '/privacy/', label: 'Privacy' },
    { href: '/terms/', label: 'Terms' },
  ],
  studio: [
    { href: 'https://chexustudio.com/work/harbour-pine-home', label: 'View Case Study', external: true },
    { href: 'https://chexustudio.com/packages', label: 'View Packages', external: true },
    { href: '/contact/', label: 'Build a Store Like This' },
  ],
} as const;

export const brandValues = [
  {
    title: 'Thoughtful function',
    description: 'Every piece is presented around how it supports daily routines at home.',
  },
  {
    title: 'Clear product information',
    description: 'Materials, dimensions and care details stay visible before add-to-cart.',
  },
  {
    title: 'Calm design',
    description: 'The storefront stays quiet so products remain easy to evaluate.',
  },
  {
    title: 'Easy shopping',
    description: 'Search, filters, variants and cart flows reduce friction without pressure.',
  },
  {
    title: 'Responsive customer experience',
    description: 'Layouts, touch targets and feedback states are built for mobile first.',
  },
] as const;

export const roomPaths = [
  {
    slug: 'living-room',
    title: 'Living room',
    description: 'Throws, trays and soft accents for settled seating areas.',
    href: '/shop/?room=living-room',
    image: '/images/rooms/living-room.svg',
  },
  {
    slug: 'dining-area',
    title: 'Dining area',
    description: 'Boards, linens and vessels for everyday tables.',
    href: '/shop/?room=dining-area',
    image: '/images/rooms/dining-area.svg',
  },
  {
    slug: 'kitchen',
    title: 'Kitchen',
    description: 'Mugs, towels and practical pieces near the counter.',
    href: '/shop/?room=kitchen',
    image: '/images/rooms/kitchen.svg',
  },
  {
    slug: 'workspace',
    title: 'Workspace',
    description: 'Desk trays, planters and organizers for clearer focus.',
    href: '/shop/?room=workspace',
    image: '/images/rooms/workspace.svg',
  },
] as const;

export const conversionShowcase = [
  'Mobile-first shopping',
  'Product discovery',
  'Fast filters and search',
  'Clear variants',
  'Optimized product pages',
  'Accessible cart',
  'Frictionless checkout',
  'Product SEO',
  'Responsive images',
  'Conversion analytics',
] as const;

export const faqs = [
  {
    question: 'Is Harbour & Pine Home a real store?',
    answer:
      'No. Harbour & Pine Home is a fictional e-commerce demonstration created by Che Xu Studio to show storefront design, SEO and conversion systems.',
  },
  {
    question: 'Can Che Xu Studio customize this design?',
    answer:
      'Yes. Colour systems, typography, product architecture and conversion flows can be adapted to a verified merchant brand and catalogue.',
  },
  {
    question: 'Can the store connect to Stripe?',
    answer:
      'Yes. Stripe Checkout can be connected in test mode during development and in live mode only after merchant verification and explicit configuration.',
  },
  {
    question: 'Can it connect to an existing inventory or fulfilment platform?',
    answer:
      'Yes. Che Xu Studio can integrate approved inventory, fulfilment and order-management platforms based on the merchant’s stack.',
  },
  {
    question: 'Can product information be managed without a developer?',
    answer:
      'Yes. A real build can use a structured CMS or commerce backend so teams can update products, collections and policies safely.',
  },
  {
    question: 'Can the site support hundreds or thousands of products?',
    answer:
      'Yes. The architecture is designed for static generation, efficient filtering and scalable product data once a verified catalogue is connected.',
  },
  {
    question: 'Can Che Xu Studio optimize product photography?',
    answer:
      'Yes. Che Xu Studio can plan crops, responsive delivery, alt text and image performance for product discovery and SEO.',
  },
  {
    question: 'Can the store support product variants?',
    answer:
      'Yes. Colour, size and material variants are demonstrated here and can be connected to real inventory rules for a live merchant.',
  },
  {
    question: 'Can Che Xu Studio implement product SEO?',
    answer:
      'Yes. Titles, descriptions, canonicals, breadcrumbs, sitemaps and structured data can be implemented for verified products and policies.',
  },
  {
    question: 'Can the design support international currencies later?',
    answer:
      'Yes. The money and catalogue layers can expand to additional locales and currencies after business requirements are confirmed.',
  },
] as const;

export const businessTypes = [
  'Home & lifestyle brand',
  'Specialty retailer',
  'Maker / small batch brand',
  'Multi-category merchant',
  'Other',
] as const;

export const productCountOptions = [
  '1–25',
  '26–100',
  '101–500',
  '500+',
  'Not sure yet',
] as const;

export const primaryGoals = [
  'Launch a new online store',
  'Improve conversion on an existing store',
  'Rebuild a dated storefront',
  'Strengthen product SEO and discovery',
  'Prepare for scaling catalogue growth',
] as const;

export const storeFeatures = [
  'Mobile responsive conversion & SEO',
  'Product variants',
  'Search and filtering',
  'Subscriptions',
  'Wholesale / B2B',
  'Multi-currency',
  'CMS-managed content',
  'Custom checkout logic',
  'Analytics and CRO',
] as const;

/** Featured option shown first with a Recommended badge in the enquiry form. */
export const recommendedStoreFeature = storeFeatures[0];

export const launchTimingOptions = [
  'ASAP',
  '1–2 months',
  '3–6 months',
  'Exploring options',
] as const;
