"use client";

import { useEffect, useMemo, useState } from 'react';
import { Plus, ChevronDown, CalendarDays } from 'lucide-react';
import { SiteShell, PageHeader } from '@/app/components/site-shell';

type Category = { id: number; name: string; slug: string; description?: string | null; isFeatured?: boolean; isPromotion?: boolean };
type Product = { id: number; name: string; description?: string | null; image?: string | null; status: string; category: Category; categoryId: number };
type CartItem = { productId: number; name: string; quantity: number; image?: string | null; unitPrice: number };

type DateForm = { pickupDate: string; pickupTime: string; returnDate: string; returnTime: string; whatsapp: string; email: string };

const initialDateForm = { pickupDate: '', pickupTime: '09:00', returnDate: '', returnTime: '18:00', whatsapp: '', email: '' };

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('relevance');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dateForm, setDateForm] = useState<DateForm>(initialDateForm);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('client-cart');
    const savedDates = localStorage.getItem('client-dates');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDates) setDateForm(JSON.parse(savedDates));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('client-cart', JSON.stringify(cart));
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('client-dates', JSON.stringify(dateForm));
  }, [dateForm, isHydrated]);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((data) => setCategories(data));
    fetch('/api/products').then((r) => r.json()).then((data) => setProducts(data));
  }, []);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => product.status === 'ACTIVE' && (selectedCategory === 'all' || String(product.categoryId) === selectedCategory) && product.name.toLowerCase().includes(search.toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'price') return (a.id > b.id ? 1 : -1);
      return 0;
    });
    return sorted;
  }, [products, search, selectedCategory, sort]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    if (cart.length === 0 && !dateForm.pickupDate) {
      setShowDateModal(true);
      return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { productId: product.id, name: product.name, quantity: 1, image: product.image, unitPrice: 0 }];
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1600);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((current) => current.flatMap((item) => item.productId === productId ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));
  };

  const handleSaveDates = () => {
    if (!dateForm.pickupDate || !dateForm.returnDate || !dateForm.whatsapp) {
      return;
    }
    setShowDateModal(false);
  };

  return (
    <SiteShell cartCount={totalItems} searchValue={search} onSearchValueChange={setSearch}>
      <PageHeader title="Todo o catálogo" subtitle={`${visibleProducts.length} itens disponíveis`} breadcrumb={['Início', 'Todo o catálogo']} />

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Categorias</p>
          <div className="mt-4 space-y-2">
            <button onClick={() => setSelectedCategory('all')} className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-sm ${selectedCategory === 'all' ? 'bg-[var(--text)] text-[var(--surface)]' : 'bg-[var(--bg)] text-[var(--text)]'}`}>
              <span>Todas</span>
              <span>{products.filter((product) => product.status === 'ACTIVE').length}</span>
            </button>
            {categories.map((category) => (
              <button key={category.id} onClick={() => setSelectedCategory(String(category.id))} className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-sm ${selectedCategory === String(category.id) ? 'bg-[var(--text)] text-[var(--surface)]' : 'bg-[var(--bg)] text-[var(--text)]'}`}>
                <span>{category.name}</span>
                <span>{products.filter((product) => product.status === 'ACTIVE' && product.categoryId === category.id).length}</span>
              </button>
            ))}
          </div>
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-[var(--muted)]">{visibleProducts.length} produtos encontrados</div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--muted)]">
                <ChevronDown size={15} />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none">
                  <option value="relevance">Mais relevantes</option>
                  <option value="price">Menor preço</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <div className="relative h-44 bg-[var(--bg)]">
                  {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">Imagem em breve</div>}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text)]">Aluguel</span>
                </div>
                <div className="p-4">
                  <h2 className="line-clamp-3 text-lg font-semibold text-[var(--text)]">{product.name}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">{product.category?.name}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-semibold text-[var(--text)]">R$ 0,00</span>
                    <button onClick={() => addToCart(product)} className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--text)] text-[var(--surface)]">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <CalendarDays size={20} />
              <div>
                <h3 className="text-xl font-semibold">Quando é o seu evento?</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">Preços e disponibilidade dependem do período escolhido e o WhatsApp facilita o contato para fechar o pedido.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Data da retirada</span>
                <input type="date" value={dateForm.pickupDate} onChange={(e) => setDateForm({ ...dateForm, pickupDate: e.target.value })} className="w-full border-0 bg-transparent outline-none" />
              </label>
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Hora da retirada</span>
                <select value={dateForm.pickupTime} onChange={(e) => setDateForm({ ...dateForm, pickupTime: e.target.value })} className="w-full border-0 bg-transparent outline-none">
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                </select>
              </label>
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Data da devolução</span>
                <input type="date" value={dateForm.returnDate} onChange={(e) => setDateForm({ ...dateForm, returnDate: e.target.value })} className="w-full border-0 bg-transparent outline-none" />
              </label>
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Hora da devolução</span>
                <select value={dateForm.returnTime} onChange={(e) => setDateForm({ ...dateForm, returnTime: e.target.value })} className="w-full border-0 bg-transparent outline-none">
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block rounded-[var(--radius-md)] border border-[var(--border)] p-3">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">WhatsApp para retorno</span>
              <input value={dateForm.whatsapp} onChange={(e) => setDateForm({ ...dateForm, whatsapp: e.target.value })} placeholder="(61) 99999-9999" className="w-full border-0 bg-transparent outline-none" />
            </label>

            <label className="mt-4 block rounded-[var(--radius-md)] border border-[var(--border)] p-3">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">E-mail</span>
              <input value={dateForm.email} onChange={(e) => setDateForm({ ...dateForm, email: e.target.value })} placeholder="seu@email.com" className="w-full border-0 bg-transparent outline-none" />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button onClick={() => setShowDateModal(false)} className="btn-secondary">Agora não</button>
              <button onClick={handleSaveDates} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && <div className="fixed bottom-5 right-5 rounded-full bg-[var(--text)] px-4 py-3 text-sm font-semibold text-[var(--surface)] shadow-lg">Item adicionado ao carrinho</div>}
    </SiteShell>
  );
}
