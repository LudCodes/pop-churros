'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Search, User, ShoppingBag } from 'lucide-react';
import { useCart } from './cart-context';

const navItems = [
  { label: 'Início', href: '/loja' },
  { label: 'Destaques', href: '/loja/destaques' },
  { label: 'Promoções', href: '/loja/promocoes' },
];

export function StoreHeader() {
  const { totalCount } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-cream">
      {/* Topbar */}
      <div className="bg-topbar text-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-2 text-[11px] uppercase tracking-wide">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium text-white">Brasília · DF</span>
          <span aria-hidden="true">·</span>
          <span>Reserve online em minutos</span>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-hairline bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link href="/loja" className="shrink-0" aria-label="Tapiraí Festas - início">
            <Image
              src="/produtos/logo-festas.png"
              alt="Tapiraí Festas"
              width={64}
              height={64}
              className="h-14 w-14 rounded-full object-cover"
            />
          </Link>

          <form className="relative flex-1" role="search">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="O que você quer alugar hoje?"
              aria-label="Buscar produtos"
              className="w-full rounded-full border border-hairline bg-cream/60 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:border-ink/30 focus:outline-none"
            />
          </form>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Minha conta"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink transition hover:bg-cream"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link
              href="/loja/carrinho"
              aria-label={`Carrinho com ${totalCount} ${totalCount === 1 ? 'item' : 'itens'}`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink transition hover:bg-cream"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {totalCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[11px] font-semibold text-white">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Nav */}
        <nav className="mx-auto max-w-6xl px-6 pb-3" aria-label="Navegação principal">
          <ul className="flex items-center gap-2 text-sm">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      active
                        ? 'inline-flex rounded-full bg-ink px-4 py-2 font-medium text-white'
                        : 'inline-flex rounded-full px-4 py-2 font-medium text-muted transition hover:text-ink'
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
