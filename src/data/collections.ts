import type { Collection } from './types';

export const collections: Collection[] = [
  {
    slug: 'living',
    name: 'Living',
    shortName: 'Living',
    description: 'Calm accents that soften seating areas and everyday gathering spaces.',
    longDescription:
      'Living pieces designed for comfort and clarity—throws, trays, vessels and soft accents that help a room feel settled without crowding it.',
    image: {
      src: '/images/collections/living.svg',
      alt: 'Soft living room setting with a linen throw, ceramic vase and wooden tray',
      width: 1200,
      height: 900,
      crop: '4x3',
    },
    seoTitle: 'Living Collection | Harbour & Pine Home',
    seoDescription:
      'Explore living room accents including throws, trays, vessels and soft home accessories from Harbour & Pine Home.',
  },
  {
    slug: 'kitchen-dining',
    name: 'Kitchen & Dining',
    shortName: 'Kitchen',
    description: 'Tableware and serving pieces for everyday meals and quiet hosting.',
    longDescription:
      'Practical kitchen and dining objects with an editorial calm—boards, linens, mugs and serving pieces that earn a place on the table.',
    image: {
      src: '/images/collections/kitchen-dining.svg',
      alt: 'Dining table arrangement with ceramic mugs, linen napkin and serving board',
      width: 1200,
      height: 900,
      crop: '4x3',
    },
    seoTitle: 'Kitchen & Dining Collection | Harbour & Pine Home',
    seoDescription:
      'Browse kitchen and dining essentials including tableware, linens and serving pieces for everyday meals.',
  },
  {
    slug: 'textiles',
    name: 'Textiles',
    shortName: 'Textiles',
    description: 'Layered linens and soft finishes for beds, sofas and tables.',
    longDescription:
      'Textiles chosen for hand-feel and colour harmony—throws, cushions, napkins and runners that add warmth without visual noise.',
    image: {
      src: '/images/collections/textiles.svg',
      alt: 'Folded linen textiles in sand, sage and pine tones',
      width: 1200,
      height: 900,
      crop: '4x3',
    },
    seoTitle: 'Textiles Collection | Harbour & Pine Home',
    seoDescription:
      'Discover cushions, throws and table linens designed for calm, everyday Canadian homes.',
  },
  {
    slug: 'storage',
    name: 'Storage',
    shortName: 'Storage',
    description: 'Baskets, hooks and organizers that keep rooms open and usable.',
    longDescription:
      'Storage that supports daily routines—woven baskets, wall hooks and open organizers that keep essentials nearby without clutter.',
    image: {
      src: '/images/collections/storage.svg',
      alt: 'Woven baskets and wall hooks arranged in a calm entryway',
      width: 1200,
      height: 900,
      crop: '4x3',
    },
    seoTitle: 'Storage Collection | Harbour & Pine Home',
    seoDescription:
      'Shop baskets, hooks and organizers for tidy entryways, living rooms and workspaces.',
  },
  {
    slug: 'workspace',
    name: 'Workspace',
    shortName: 'Workspace',
    description: 'Desk tools and organizers that keep focused work feeling grounded.',
    longDescription:
      'Workspace pieces for clearer desks—trays, planters, organizers and small accessories that support concentration without looking sterile.',
    image: {
      src: '/images/collections/workspace.svg',
      alt: 'Minimal desk with organizer tray, ceramic planter and notebook',
      width: 1200,
      height: 900,
      crop: '4x3',
    },
    seoTitle: 'Workspace Collection | Harbour & Pine Home',
    seoDescription:
      'Explore desk organizers, planters and calm workspace accessories for home offices.',
  },
  {
    slug: 'gifts',
    name: 'Gifts',
    shortName: 'Gifts',
    description: 'Considered pieces that feel personal without being precious.',
    longDescription:
      'Gift-friendly objects with clear use and lasting presence—small home pieces that feel intentional for hosts, colleagues and friends.',
    image: {
      src: '/images/collections/gifts.svg',
      alt: 'Gift-ready home accessories including a mug, candle tray and soft textile',
      width: 1200,
      height: 900,
      crop: '4x3',
    },
    seoTitle: 'Gifts Collection | Harbour & Pine Home',
    seoDescription:
      'Find thoughtful home and lifestyle gifts including mugs, trays, textiles and decorative objects.',
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}
