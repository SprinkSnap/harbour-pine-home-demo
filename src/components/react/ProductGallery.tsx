import { useId, useState } from 'react';
import type { ProductImage } from '../../data/types';

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const labelId = useId();
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="product-media relative aspect-square overflow-hidden">
        {current ? (
          <img
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        ) : null}
        <button
          type="button"
          className="btn btn-secondary absolute bottom-3 right-3 min-h-10 bg-porcelain/95"
          onClick={() => setZoomed(true)}
        >
          Zoom image
        </button>
      </div>
      {images.length > 1 ? (
        <ul className="mt-3 flex gap-2" aria-label={`${productName} image thumbnails`}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className={`overflow-hidden rounded-md border ${index === active ? 'border-pine' : 'border-sand'}`}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                onClick={() => setActive(index)}
              >
                <img src={image.src} alt="" width={72} height={72} className="h-16 w-16 object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {zoomed && current ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-pine-dark/70 p-4" role="dialog" aria-modal="true" aria-labelledby={labelId}>
          <div className="max-h-full max-w-4xl overflow-auto rounded-[var(--radius-lg)] bg-porcelain p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id={labelId} className="font-display text-xl text-pine-dark">
                {productName} image
              </h2>
              <button type="button" className="btn btn-secondary" onClick={() => setZoomed(false)} autoFocus>
                Close zoom
              </button>
            </div>
            <img src={current.src} alt={current.alt} width={current.width} height={current.height} className="w-full" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
