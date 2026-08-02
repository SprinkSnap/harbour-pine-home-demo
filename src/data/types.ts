export type ColourFamily =
  | 'pine'
  | 'harbour'
  | 'sand'
  | 'linen'
  | 'clay'
  | 'charcoal'
  | 'sage'
  | 'porcelain';

export type CollectionSlug =
  | 'living'
  | 'kitchen-dining'
  | 'textiles'
  | 'storage'
  | 'workspace'
  | 'gifts';

export interface ProductVariant {
  id: string;
  label: string;
  colour?: ColourFamily;
  available: boolean;
}

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: 'square' | 'editorial' | '4x3';
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  collection: CollectionSlug;
  categories: string[];
  images: ProductImage[];
  imageAlt: string;
  variants: ProductVariant[];
  materials: string[];
  dimensions: string;
  care: string;
  colour: ColourFamily;
  featured: boolean;
  newArrival: boolean;
  available: boolean;
  relatedProductIds: string[];
  seoTitle: string;
  seoDescription: string;
  roomTags: Array<'living-room' | 'dining-area' | 'kitchen' | 'workspace'>;
  productType: string;
}

export interface Collection {
  slug: CollectionSlug;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  image: ProductImage;
  seoTitle: string;
  seoDescription: string;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  productIds: string[];
  illustrativeNote: string;
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  body: string[];
}
