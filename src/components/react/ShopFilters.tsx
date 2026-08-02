import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../../data/types';
import { trackEvent } from '../../lib/analytics';
import { uniqueCategories, uniqueColours, type SortOption } from '../../lib/product-filters';

interface Props {
  products: Product[];
  initialQuery?: string;
  lockedCollection?: string;
  resultCount: number;
}

export default function ShopFilters({ products, initialQuery = '', lockedCollection, resultCount }: Props) {
  const categories = useMemo(() => uniqueCategories(products), [products]);
  const colours = useMemo(() => uniqueColours(products), [products]);
  const [params, setParams] = useState(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''));

  useEffect(() => {
    if (initialQuery && !params.get('q')) {
      const next = new URLSearchParams(params);
      next.set('q', initialQuery);
      setParams(next);
    }
  }, [initialQuery, params]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    if (lockedCollection) next.set('collection', lockedCollection);
    setParams(next);
    const url = `${window.location.pathname}?${next.toString()}`;
    window.history.pushState({}, '', url.endsWith('?') ? window.location.pathname : url);
    trackEvent('filter_used', { key, hasValue: Boolean(value) });
    window.location.assign(url.endsWith('?') ? window.location.pathname : url);
  }

  function clearAll() {
    const next = new URLSearchParams();
    if (lockedCollection) next.set('collection', lockedCollection);
    const url = next.toString() ? `${window.location.pathname}?${next}` : window.location.pathname;
    trackEvent('filter_used', { key: 'clear', hasValue: false });
    window.location.assign(url);
  }

  const currentSort = (params.get('sort') as SortOption | null) ?? 'featured';

  return (
    <form
      className="surface rounded-[var(--radius-lg)] p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const next = new URLSearchParams();
        for (const [key, value] of data.entries()) {
          if (String(value)) next.set(key, String(value));
        }
        if (lockedCollection) next.set('collection', lockedCollection);
        const url = next.toString() ? `${window.location.pathname}?${next}` : window.location.pathname;
        trackEvent('filter_used', { key: 'submit', hasValue: true });
        if (next.get('q')) trackEvent('search_used', { hasQuery: true });
        window.location.assign(url);
      }}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-pine-dark">Filter & sort</h2>
          <p className="text-sm text-charcoal/75" aria-live="polite">
            {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="field">
          <label htmlFor="filter-q">Search</label>
          <input id="filter-q" name="q" defaultValue={params.get('q') ?? initialQuery} placeholder="Try tray, linen, desk…" />
        </div>
        {!lockedCollection ? (
          <div className="field">
            <label htmlFor="filter-collection">Collection</label>
            <select id="filter-collection" name="collection" defaultValue={params.get('collection') ?? ''}>
              <option value="">All collections</option>
              {[...new Set(products.map((product) => product.collection))].map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <input type="hidden" name="collection" value={lockedCollection} />
        )}
        <div className="field">
          <label htmlFor="filter-category">Category</label>
          <select id="filter-category" name="category" defaultValue={params.get('category') ?? ''}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-colour">Colour family</label>
          <select id="filter-colour" name="colour" defaultValue={params.get('colour') ?? ''}>
            <option value="">All colours</option>
            {colours.map((colour) => (
              <option key={colour} value={colour}>
                {colour}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="field">
            <label htmlFor="filter-min">Min price</label>
            <input id="filter-min" name="minPrice" type="number" min={0} defaultValue={params.get('minPrice') ?? ''} />
          </div>
          <div className="field">
            <label htmlFor="filter-max">Max price</label>
            <input id="filter-max" name="maxPrice" type="number" min={0} defaultValue={params.get('maxPrice') ?? ''} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="filter-available">Availability</label>
          <select id="filter-available" name="available" defaultValue={params.get('available') ?? ''}>
            <option value="">Any</option>
            <option value="true">Available in demo</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-sort">Sort</label>
          <select
            id="filter-sort"
            name="sort"
            defaultValue={currentSort}
            onChange={(event) => update('sort', event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Apply filters
        </button>
      </div>
    </form>
  );
}
