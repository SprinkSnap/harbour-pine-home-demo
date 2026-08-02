import type { ColourFamily, Product } from '../data/types';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';

export interface ProductFilterState {
  q?: string;
  collection?: string;
  category?: string;
  colour?: ColourFamily | string;
  room?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface FilteredProductsResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  activeFilters: Array<{ key: string; label: string; value: string }>;
}

const DEFAULT_PAGE_SIZE = 12;

export function parseFilterParams(params: URLSearchParams): ProductFilterState {
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  const page = params.get('page');
  const available = params.get('available');

  return {
    q: params.get('q') ?? undefined,
    collection: params.get('collection') ?? undefined,
    category: params.get('category') ?? undefined,
    colour: params.get('colour') ?? undefined,
    room: params.get('room') ?? undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    available: available === null ? undefined : available === 'true',
    featured: params.get('filter') === 'featured' || params.get('featured') === 'true',
    newArrival: params.get('filter') === 'new' || params.get('new') === 'true',
    sort: (params.get('sort') as SortOption | null) ?? 'featured',
    page: page ? Math.max(1, Number(page) || 1) : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };
}

export function filterProducts(products: Product[], state: ProductFilterState): FilteredProductsResult {
  const pageSize = state.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = state.page ?? 1;
  const query = state.q?.trim().toLowerCase();

  let result = [...products];

  if (query) {
    result = result.filter((product) => {
      const haystack = [
        product.name,
        product.shortDescription,
        product.description,
        product.collection,
        product.colour,
        ...product.categories,
        ...product.materials,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  if (state.collection) {
    result = result.filter((product) => product.collection === state.collection);
  }

  if (state.category) {
    result = result.filter((product) => product.categories.includes(state.category!));
  }

  if (state.colour) {
    result = result.filter(
      (product) =>
        product.colour === state.colour ||
        product.variants.some((variant) => variant.colour === state.colour),
    );
  }

  if (state.room) {
    result = result.filter((product) => product.roomTags.includes(state.room as Product['roomTags'][number]));
  }

  if (typeof state.minPrice === 'number' && !Number.isNaN(state.minPrice)) {
    result = result.filter((product) => product.price >= state.minPrice!);
  }

  if (typeof state.maxPrice === 'number' && !Number.isNaN(state.maxPrice)) {
    result = result.filter((product) => product.price <= state.maxPrice!);
  }

  if (typeof state.available === 'boolean') {
    result = result.filter((product) => product.available === state.available);
  }

  if (state.featured) {
    result = result.filter((product) => product.featured);
  }

  if (state.newArrival) {
    result = result.filter((product) => product.newArrival);
  }

  result = sortProducts(result, state.sort ?? 'featured');

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const items = result.slice(start, start + pageSize);

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages,
    activeFilters: buildActiveFilters(state),
  };
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'en-CA'));
    case 'newest':
      return sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival) || a.name.localeCompare(b.name));
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }
}

export function buildActiveFilters(state: ProductFilterState): Array<{ key: string; label: string; value: string }> {
  const active: Array<{ key: string; label: string; value: string }> = [];
  if (state.q) active.push({ key: 'q', label: 'Search', value: state.q });
  if (state.collection) active.push({ key: 'collection', label: 'Collection', value: state.collection });
  if (state.category) active.push({ key: 'category', label: 'Category', value: state.category });
  if (state.colour) active.push({ key: 'colour', label: 'Colour', value: String(state.colour) });
  if (state.room) active.push({ key: 'room', label: 'Room', value: state.room });
  if (typeof state.minPrice === 'number') active.push({ key: 'minPrice', label: 'Min price', value: String(state.minPrice) });
  if (typeof state.maxPrice === 'number') active.push({ key: 'maxPrice', label: 'Max price', value: String(state.maxPrice) });
  if (typeof state.available === 'boolean') {
    active.push({ key: 'available', label: 'Availability', value: state.available ? 'In demo stock' : 'Unavailable' });
  }
  if (state.featured) active.push({ key: 'featured', label: 'Featured', value: 'Yes' });
  if (state.newArrival) active.push({ key: 'newArrival', label: 'New', value: 'Yes' });
  return active;
}

export function uniqueCategories(products: Product[]): string[] {
  return [...new Set(products.flatMap((product) => product.categories))].sort();
}

export function uniqueColours(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.colour))].sort();
}

export function recommendProducts(
  products: Product[],
  answers: { room?: string; productType?: string; colour?: string; budget?: string },
  limit = 4,
): Product[] {
  const budgetMax =
    answers.budget === 'under-40' ? 40 : answers.budget === '40-70' ? 70 : answers.budget === '70-plus' ? Infinity : undefined;

  const scored = products.map((product) => {
    let score = 0;
    if (answers.room && product.roomTags.includes(answers.room as Product['roomTags'][number])) score += 3;
    if (answers.productType && product.productType === answers.productType) score += 3;
    if (answers.colour && (product.colour === answers.colour || product.variants.some((v) => v.colour === answers.colour))) {
      score += 2;
    }
    if (typeof budgetMax === 'number' && product.price <= budgetMax) score += 2;
    if (product.featured) score += 1;
    return { product, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, limit)
    .map((entry) => entry.product);
}
