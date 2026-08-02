import { useMemo, useState } from 'react';
import type { Product } from '../../data/types';
import { formatCad } from '../../lib/money';
import { recommendProducts } from '../../lib/product-filters';
import { useStore } from './store';

interface Props {
  products: Product[];
}

export default function ProductFinder({ products }: Props) {
  const { addToCart } = useStore();
  const [room, setRoom] = useState('');
  const [productType, setProductType] = useState('');
  const [colour, setColour] = useState('');
  const [budget, setBudget] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const recommendations = useMemo(
    () => recommendProducts(products, { room, productType, colour, budget }, 4),
    [budget, colour, productType, products, room],
  );

  return (
    <section className="surface rounded-[var(--radius-xl)] p-5 md:p-8">
      <p className="eyebrow">Product discovery</p>
      <h2 className="mt-2 font-display text-3xl text-pine-dark">Find the Right Piece for Your Space.</h2>
      <p className="mt-3 max-w-2xl text-charcoal/80">
        Answer a few questions to see matching fictional products. Alternatives remain visible in Shop at any time.
      </p>

      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="field">
          <label htmlFor="finder-room">Which room are you shopping for?</label>
          <select id="finder-room" value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="">Select a room</option>
            <option value="living-room">Living room</option>
            <option value="dining-area">Dining area</option>
            <option value="kitchen">Kitchen</option>
            <option value="workspace">Workspace</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="finder-type">What type of product do you need?</label>
          <select id="finder-type" value={productType} onChange={(e) => setProductType(e.target.value)}>
            <option value="">Select a type</option>
            {[...new Set(products.map((product) => product.productType))].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="finder-colour">What colour family do you prefer?</label>
          <select id="finder-colour" value={colour} onChange={(e) => setColour(e.target.value)}>
            <option value="">Any colour</option>
            {[...new Set(products.map((product) => product.colour))].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="finder-budget">What is your approximate budget?</label>
          <select id="finder-budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">Any budget</option>
            <option value="under-40">Under $40</option>
            <option value="40-70">$40–$70</option>
            <option value="70-plus">$70+</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary">
            Show matching pieces
          </button>
        </div>
      </form>

      {submitted ? (
        <div className="mt-8" aria-live="polite">
          <h3 className="font-display text-2xl text-pine-dark">Suggested matches</h3>
          <p className="mt-2 text-sm text-charcoal/75">
            These are recommendations from the fictional catalogue. You can still browse every product in Shop.
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((product) => (
              <li key={product.id} className="rounded-[var(--radius-lg)] border border-sand p-3">
                <a href={`/products/${product.slug}/`} className="block">
                  <div className="product-media">
                    <img src={product.images[0]?.src} alt={product.imageAlt} width={600} height={600} loading="lazy" />
                  </div>
                  <p className="mt-3 font-semibold text-pine-dark">{product.name}</p>
                  <p className="text-sm text-charcoal/75">{formatCad(product.price)}</p>
                </a>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 w-full"
                  onClick={() => addToCart(product.id, product.variants[0]?.id ?? '', 1)}
                >
                  Add to demo cart
                </button>
              </li>
            ))}
          </ul>
          <a href="/shop/" className="btn btn-ghost mt-4 px-0">
            Browse all products
          </a>
        </div>
      ) : null}
    </section>
  );
}
