'use client';

import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
import { type CatalogProduct, formatCurrency } from '@/lib/catalog-data';
import { useCart } from './cart-context';

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { addItem, isInCart } = useCart();
  const added = isInCart(product.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-hairline bg-white transition hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        <button
          type="button"
          onClick={() => addItem(product)}
          aria-label={added ? `${product.name} adicionado ao carrinho` : `Adicionar ${product.name} ao carrinho`}
          className={`absolute -top-6 right-4 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition ${
            added ? 'bg-emerald-500' : 'bg-ink hover:bg-ink/90'
          }`}
        >
          {added ? <Check className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
        </button>

        <span className="text-xs font-medium text-muted">{product.type}</span>
        <h3 className="mt-1 line-clamp-3 text-sm font-bold uppercase leading-snug text-ink">
          {product.name}
        </h3>
        <p className="mt-auto pt-4 text-lg font-bold text-ink">{formatCurrency(product.price)}</p>
      </div>
    </article>
  );
}
