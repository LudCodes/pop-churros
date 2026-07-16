'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { categories, products } from '@/lib/catalog-data';
import { ProductCard } from './product-card';

export function CatalogView() {
  const [activeCategory, setActiveCategory] = useState('all');

  const visibleProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.categoryId === activeCategory);

  const total = categories.find((c) => c.id === 'all')?.count ?? visibleProducts.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Trilha de navegação" className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-muted">
          <li>
            <Link href="/loja" className="hover:text-ink">Início</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-semibold text-ink">Todo o catálogo</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside>
          <div className="rounded-card border border-hairline bg-white p-4">
            <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Categorias
            </h2>
            <ul className="space-y-1">
              {categories.map((category) => {
                const active = activeCategory === category.id;
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                        active ? 'bg-ink font-medium text-white' : 'text-ink hover:bg-cream'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={active ? 'text-white/70' : 'text-muted'}>{category.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Listing */}
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink">Todo o catálogo</h1>
              <p className="mt-1 text-sm text-muted">{total.toLocaleString('pt-BR')} itens</p>
            </div>
            <div className="relative">
              <select
                aria-label="Ordenar por"
                className="appearance-none rounded-full border border-hairline bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-ink focus:border-ink/30 focus:outline-none"
              >
                <option>Mais relevantes</option>
                <option>Menor preço</option>
                <option>Maior preço</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
