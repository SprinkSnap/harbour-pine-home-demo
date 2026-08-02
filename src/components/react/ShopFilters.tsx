import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import type { Product } from '../../data/types';
import { trackEvent } from '../../lib/analytics';
import { uniqueCategories, uniqueColours, type SortOption } from '../../lib/product-filters';

interface Props {
  products: Product[];
  initialQuery?: string;
  lockedCollection?: string;
  resultCount: number;
}

function FilterFields({
  products,
  params,
  initialQuery,
  lockedCollection,
  currentSort,
  update,
  idPrefix,
}: {
  products: Product[];
  params: URLSearchParams;
  initialQuery: string;
  lockedCollection?: string;
  currentSort: SortOption;
  update: (key: string, value: string) => void;
  idPrefix: string;
}) {
  const categories = useMemo(() => uniqueCategories(products), [products]);
  const colours = useMemo(() => uniqueColours(products), [products]);

  return (
    <div className="mt-4 grid gap-3">
      <div className="field">
        <label htmlFor={`${idPrefix}-q`}>Search</label>
        <input
          id={`${idPrefix}-q`}
          name="q"
          defaultValue={params.get('q') ?? initialQuery}
          placeholder="Try tray, linen, desk…"
        />
      </div>
      {!lockedCollection ? (
        <div className="field">
          <label htmlFor={`${idPrefix}-collection`}>Collection</label>
          <select id={`${idPrefix}-collection`} name="collection" defaultValue={params.get('collection') ?? ''}>
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
        <label htmlFor={`${idPrefix}-category`}>Category</label>
        <select id={`${idPrefix}-category`} name="category" defaultValue={params.get('category') ?? ''}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-colour`}>Colour family</label>
        <select id={`${idPrefix}-colour`} name="colour" defaultValue={params.get('colour') ?? ''}>
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
          <label htmlFor={`${idPrefix}-min`}>Min price</label>
          <input
            id={`${idPrefix}-min`}
            name="minPrice"
            type="number"
            min={0}
            defaultValue={params.get('minPrice') ?? ''}
          />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-max`}>Max price</label>
          <input
            id={`${idPrefix}-max`}
            name="maxPrice"
            type="number"
            min={0}
            defaultValue={params.get('maxPrice') ?? ''}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-available`}>Availability</label>
        <select id={`${idPrefix}-available`} name="available" defaultValue={params.get('available') ?? ''}>
          <option value="">Any</option>
          <option value="true">Available in demo</option>
          <option value="false">Unavailable</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-sort`}>Sort</label>
        <select
          id={`${idPrefix}-sort`}
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
  );
}

export default function ShopFilters({ products, initialQuery = '', lockedCollection, resultCount }: Props) {
  const [params, setParams] = useState(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''));
  const [sheetOpen, setSheetOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (initialQuery && !params.get('q')) {
      const next = new URLSearchParams(params);
      next.set('q', initialQuery);
      setParams(next);
    }
  }, [initialQuery, params]);

  useEffect(() => {
    document.body.classList.toggle('is-filters-open', sheetOpen);
    return () => document.body.classList.remove('is-filters-open');
  }, [sheetOpen]);

  useEffect(() => {
    if (!sheetOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sheetOpen]);

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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
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
  }

  const currentSort = (params.get('sort') as SortOption | null) ?? 'featured';
  const activeCount = [...params.keys()].filter(
    (key) => key !== 'page' && !(lockedCollection && key === 'collection'),
  ).length;

  return (
    <>
      <div className="lg:hidden">
        <button type="button" className="btn btn-secondary w-full" onClick={() => setSheetOpen(true)}>
          Filters & sort{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
        <p className="mt-2 text-sm text-charcoal/75" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'product' : 'products'}
        </p>
      </div>

      <form className="surface hidden rounded-[var(--radius-lg)] p-4 lg:block" onSubmit={onSubmit}>
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
        <FilterFields
          products={products}
          params={params}
          initialQuery={initialQuery}
          lockedCollection={lockedCollection}
          currentSort={currentSort}
          update={update}
          idPrefix="desk-filter"
        />
      </form>

      {sheetOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-pine-dark/40"
            aria-label="Close filters"
            onClick={() => setSheetOpen(false)}
          />
          <form
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[var(--radius-xl)] bg-porcelain p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-lift)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onSubmit={onSubmit}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 id={titleId} className="font-display text-xl text-pine-dark">
                Filters & sort
              </h2>
              <button ref={closeRef} type="button" className="btn btn-ghost" onClick={() => setSheetOpen(false)}>
                Close
              </button>
            </div>
            <div className="flex items-end justify-between gap-3">
              <p className="text-sm text-charcoal/75" aria-live="polite">
                {resultCount} {resultCount === 1 ? 'product' : 'products'}
              </p>
              <button type="button" className="btn btn-ghost" onClick={clearAll}>
                Clear all
              </button>
            </div>
            <FilterFields
              products={products}
              params={params}
              initialQuery={initialQuery}
              lockedCollection={lockedCollection}
              currentSort={currentSort}
              update={update}
              idPrefix="sheet-filter"
            />
          </form>
        </div>
      ) : null}
    </>
  );
}
