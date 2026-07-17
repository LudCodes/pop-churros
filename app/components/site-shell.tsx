"use client";

import Link from 'next/link';
import { ShoppingBag, Search, UserRound, MapPin, ChevronRight } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';

export function SiteShell({
  children,
  cartCount = 0,
  searchValue,
  onSearchValueChange,
  searchPlaceholder = 'O que você quer alugar hoje?'
}: {
  children: ReactNode;
  cartCount?: number;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
}) {
  const [internalSearch, setInternalSearch] = useState('');
  const navItems = useMemo(() => [
    { label: 'Início', href: '/' },
    { label: 'Destaques', href: '/catalogo' },
    { label: 'Promoções', href: '/catalogo' },
  ], []);

  const currentValue = searchValue ?? internalSearch;
  const handleSearchChange = (value: string) => {
    if (onSearchValueChange) onSearchValueChange(value);
    else setInternalSearch(value);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="bg-[var(--text)] text-[var(--surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.28em] sm:px-6">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>Brasília • DF</span>
          </div>
          <div className="hidden sm:block">Reserve online em minutos</div>
        </div>
      </div>

      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)]">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--text)]">Pop Churros</p>
              <p className="text-xs text-[var(--muted)]">Promoções e Eventos</p>
            </div>
          </Link>

          <div className="flex flex-1 items-center gap-3 lg:max-w-xl">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
              <Search size={16} />
              <input value={currentValue} onChange={(event) => handleSearchChange(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-[var(--muted)]" placeholder={searchPlaceholder} />
            </label>
            <Link href="/cliente" className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]">
              <UserRound size={18} />
            </Link>
            <Link href="/carrinho" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--text)] px-1 text-[10px] font-semibold text-[var(--surface)]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)] sm:px-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[var(--text)]">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb?: string[] }) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      {breadcrumb && (
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
          {breadcrumb.map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              {item}
              {index < breadcrumb.length - 1 && <ChevronRight size={14} />}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
