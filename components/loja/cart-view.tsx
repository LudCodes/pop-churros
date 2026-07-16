'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/catalog-data';
import { useCart } from './cart-context';

const times = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);

export function CartView() {
  const router = useRouter();
  const { items, subtotal, eventInfo, updateEventInfo, setQuantity, removeItem, clearCart } = useCart();

  const fieldClass =
    'w-full rounded-[10px] border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink/30 focus:outline-none';
  const labelClass = 'mb-1.5 block text-sm text-ink';

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold text-ink">Seu carrinho</h1>
      <p className="mt-1 text-sm text-muted">Revise os itens antes de continuar</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-card border border-hairline bg-white p-10 text-center">
          <p className="text-ink">Seu carrinho está vazio.</p>
          <Link
            href="/loja"
            className="mt-4 inline-flex rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Rental period */}
            <div className="rounded-card border border-hairline bg-white p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Período da locação
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cart-pickup-date" className={labelClass}>Data da retirada</label>
                  <input
                    id="cart-pickup-date"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={eventInfo.pickupDate}
                    onChange={(e) => updateEventInfo({ pickupDate: e.target.value })}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="cart-pickup-time" className={labelClass}>Hora da retirada</label>
                  <div className="relative">
                    <select
                      id="cart-pickup-time"
                      value={eventInfo.pickupTime}
                      onChange={(e) => updateEventInfo({ pickupTime: e.target.value })}
                      className={`${fieldClass} appearance-none pr-9`}
                    >
                      <option value="">–</option>
                      {times.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <label htmlFor="cart-return-date" className={labelClass}>Data da devolução</label>
                  <input
                    id="cart-return-date"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={eventInfo.returnDate}
                    onChange={(e) => updateEventInfo({ returnDate: e.target.value })}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="cart-return-time" className={labelClass}>Hora da devolução</label>
                  <div className="relative">
                    <select
                      id="cart-return-time"
                      value={eventInfo.returnTime}
                      onChange={(e) => updateEventInfo({ returnTime: e.target.value })}
                      className={`${fieldClass} appearance-none pr-9`}
                    >
                      <option value="">–</option>
                      {times.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* User data */}
            <div className="rounded-card border border-hairline bg-white p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Seus dados
              </h2>
              <label htmlFor="cart-email" className={labelClass}>E-mail</label>
              <input
                id="cart-email"
                type="email"
                placeholder="Informe seu e-mail"
                value={eventInfo.email}
                onChange={(e) => updateEventInfo({ email: e.target.value })}
                className={fieldClass}
              />
            </div>

            {/* Cart items */}
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="overflow-hidden rounded-card border border-hairline bg-white">
                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={product.image} alt={product.name} fill sizes="96px" className="object-cover" />
                    {product.isKit && (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Kit
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    {product.isKit && product.kitComponents && (
                      <p className="text-xs text-muted">Kit · {product.kitComponents.length} itens</p>
                    )}
                    <h3 className="text-sm font-bold uppercase leading-snug text-ink">{product.name}</h3>
                    <div className="mt-3 flex items-center gap-4">
                      <input
                        type="number"
                        min={1}
                        aria-label={`Quantidade de ${product.name}`}
                        value={quantity}
                        onChange={(e) => setQuantity(product.id, Number.parseInt(e.target.value, 10) || 1)}
                        className="w-24 rounded-full border border-hairline px-4 py-2 text-sm text-ink focus:border-ink/30 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-brand-red"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" /> Remover
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-ink">{formatCurrency(product.price * quantity)}</p>
                    <p className="text-sm text-muted">{formatCurrency(product.price)} / un</p>
                  </div>
                </div>

                {product.isKit && product.kitComponents && (
                  <div className="border-t border-hairline bg-cream/60 p-4">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                      <Package className="h-4 w-4" aria-hidden="true" /> Itens inclusos neste kit
                    </p>
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {product.kitComponents.map((component) => (
                        <li key={component.name} className="flex items-center gap-2">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white">
                            <Image src={component.image} alt="" fill sizes="36px" className="object-cover" />
                          </div>
                          <span className="flex-1 text-xs uppercase leading-tight text-ink">{component.name}</span>
                          {component.quantity > 1 && (
                            <span className="shrink-0 rounded-full border border-hairline bg-white px-2 py-0.5 text-xs font-medium text-ink">
                              {component.quantity}×
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right column - summary */}
          <aside>
            <div className="sticky top-40 rounded-card border border-hairline bg-white p-6">
              <h2 className="text-lg font-bold text-ink">Resumo do pedido</h2>

              <div className="mt-5 flex items-center justify-between border-b border-hairline pb-4 text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-ink">{formatCurrency(subtotal)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-bold text-ink">Total</span>
                <span className="text-xl font-bold text-ink">{formatCurrency(subtotal)}</span>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
              >
                Solicitar orçamento
              </button>
              <button
                type="button"
                onClick={() => router.push('/loja')}
                className="mt-3 w-full rounded-full border border-hairline py-3 text-sm font-medium text-ink transition hover:bg-cream"
              >
                Continuar comprando
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full text-center text-sm text-muted underline-offset-2 transition hover:text-ink hover:underline"
              >
                Cancelar carrinho
              </button>

              <p className="mt-5 text-center text-xs leading-relaxed text-muted">
                Itens de locação são cobrados conforme o período selecionado; itens de venda, à vista. A confirmação final é feita após checagem de disponibilidade.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
